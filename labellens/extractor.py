"""
extractor.py - Ollama vision model label reader for LabelLens
Sends food label images to qwen3-vl:8b and returns structured nutrition JSON.
"""
import base64
import json
import time
import io
from typing import Optional

try:
    import ollama
    OLLAMA_AVAILABLE = True
except ImportError:
    OLLAMA_AVAILABLE = False

try:
    from PIL import Image
    PIL_AVAILABLE = True
except ImportError:
    PIL_AVAILABLE = False


# Primary model is qwen3-vl:8b (recommended for vision OCR & structured nutrition JSON)
# Compatible lightweight model is qwen3.5:2b / qwen2.5:2b (for low-spec machines)
PRIMARY_MODEL = "qwen3-vl:8b"
SECONDARY_MODEL = "qwen3.5:2b"
COMPATIBLE_MODELS = [
    "qwen3-vl:8b",     # Primary (8B Vision-Language)
    "qwen3.5:2b",      # Lightweight (2B Compact)
    "qwen2.5:2b",      # 2B Alternative
    "minicpm-v4.5",    # Backup 8B Vision-Language
    "qwen2.5-vl:7b",   # 7B Vision-Language
]
OLLAMA_MODEL = PRIMARY_MODEL
MAX_IMAGE_DIM = 1280

EXTRACT_PROMPT = """You are an expert food packaging and optical label intelligence vision model.
Examine this food product packaging image with extreme precision. Look for 1D Barcodes, 2D QR Codes, GS1 Digital Link symbols, Nutrition Facts panels, and Ingredient declarations.

Return ONLY a valid JSON object with this exact structure:
{
  "product_name": "string or null",
  "brand": "string or null",
  "serving_size": "string or null",
  "barcode_or_qr": "string or null",
  "per_100g": {
    "energy_kcal": number or null,
    "energy_kj": number or null,
    "sugars_g": number or null,
    "saturated_fat_g": number or null,
    "salt_g": number or null,
    "sodium_mg": number or null,
    "fibre_g": number or null,
    "protein_g": number or null,
    "fat_g": number or null,
    "carbs_g": number or null
  },
  "ingredients": ["list", "each", "ingredient", "in", "order", "of", "predominance"],
  "allergens_stated": ["list of allergens explicitly printed on pack"]
}

OCR Extraction Rules:
1. QR Codes & Barcodes: Read any barcode numbers (EAN-13, UPC) or QR code URLs/text printed on the label.
2. Nutrition Values: Extract values per 100g or 100ml. If only per-serving is shown, normalize to 100g.
3. Energy: If only kcal is shown, calculate kJ = kcal * 4.184. If only kJ, calculate kcal = kJ / 4.184.
4. Sodium/Salt: If sodium is stated in mg but not salt, calculate salt_g = sodium_mg * 0.0025.
5. Ingredients: Extract all ingredients in exact descending order of predominance. Separate each component into the array.
6. Allergens: List all stated allergens (often in bold, uppercase, or under 'Contains:' / 'May contain:').
7. Unreadable items: Use null. Never invent or hallucinate missing data.
8. Output Format: Return strictly pure JSON without markdown fences, code blocks, or conversational commentary."""


EMPTY_RESULT = {
    "product_name": None,
    "serving_size": None,
    "per_100g": {
        "energy_kcal": None,
        "energy_kj": None,
        "sugars_g": None,
        "saturated_fat_g": None,
        "salt_g": None,
        "sodium_mg": None,
        "fibre_g": None,
        "protein_g": None,
        "fat_g": None,
        "carbs_g": None,
    },
    "ingredients": [],
    "allergens_stated": [],
}


def resize_image(image_bytes: bytes, max_dim: int = MAX_IMAGE_DIM) -> bytes:
    """Resize image so longest side <= max_dim, return as JPEG bytes."""
    if not PIL_AVAILABLE:
        return image_bytes
    img = Image.open(io.BytesIO(image_bytes))
    # Convert RGBA or P to RGB for JPEG compatibility
    if img.mode in ("RGBA", "P", "LA"):
        background = Image.new("RGB", img.size, (255, 255, 255))
        if img.mode == "P":
            img = img.convert("RGBA")
        background.paste(img, mask=img.split()[3] if img.mode == "RGBA" else None)
        img = background
    elif img.mode != "RGB":
        img = img.convert("RGB")

    w, h = img.size
    if max(w, h) > max_dim:
        scale = max_dim / max(w, h)
        new_w = int(w * scale)
        new_h = int(h * scale)
        img = img.resize((new_w, new_h), Image.LANCZOS)

    buf = io.BytesIO()
    img.save(buf, format="JPEG", quality=90)
    return buf.getvalue()


def _parse_json_response(text: str) -> Optional[dict]:
    """Extract and parse JSON from model response text."""
    text = text.strip()
    # Try direct parse first
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        pass

    # Strip markdown code fences if present
    if "```" in text:
        # Find content between first ``` and last ```
        start = text.find("```")
        end = text.rfind("```")
        if start != end:
            inner = text[start + 3:end]
            # Remove language tag if any (e.g. ```json)
            if inner.startswith("json"):
                inner = inner[4:]
            try:
                return json.loads(inner.strip())
            except json.JSONDecodeError:
                pass

    # Try to find first { and last }
    brace_start = text.find("{")
    brace_end = text.rfind("}")
    if brace_start != -1 and brace_end != -1 and brace_end > brace_start:
        try:
            return json.loads(text[brace_start:brace_end + 1])
        except json.JSONDecodeError:
            pass

    return None


def _validate_and_fill(parsed: dict) -> dict:
    """Ensure the parsed dict has all required keys with correct types."""
    result = {
        "product_name": parsed.get("product_name"),
        "brand": parsed.get("brand"),
        "barcode_or_qr": parsed.get("barcode_or_qr"),
        "serving_size": parsed.get("serving_size"),
        "per_100g": {},
        "ingredients": parsed.get("ingredients", []),
        "allergens_stated": parsed.get("allergens_stated", []),
    }

    per_100g_keys = [
        "energy_kcal", "energy_kj", "sugars_g", "saturated_fat_g",
        "salt_g", "sodium_mg", "fibre_g", "protein_g", "fat_g", "carbs_g"
    ]

    raw_per = parsed.get("per_100g", {}) or {}
    for key in per_100g_keys:
        val = raw_per.get(key)
        if val is not None:
            try:
                val = float(val)
            except (TypeError, ValueError):
                val = None
        result["per_100g"][key] = val

    # Derive missing energy values
    p = result["per_100g"]
    if p["energy_kj"] is None and p["energy_kcal"] is not None:
        p["energy_kj"] = round(p["energy_kcal"] * 4.184, 1)
    if p["energy_kcal"] is None and p["energy_kj"] is not None:
        p["energy_kcal"] = round(p["energy_kj"] / 4.184, 1)

    # Derive salt from sodium if missing
    if p["salt_g"] is None and p["sodium_mg"] is not None:
        p["salt_g"] = round(p["sodium_mg"] * 0.0025, 3)
    if p["sodium_mg"] is None and p["salt_g"] is not None:
        p["sodium_mg"] = round(p["salt_g"] * 400, 1)

    # Ensure lists
    if not isinstance(result["ingredients"], list):
        result["ingredients"] = []
    if not isinstance(result["allergens_stated"], list):
        result["allergens_stated"] = []

    return result


def check_ollama_status(selected_model: Optional[str] = None) -> dict:
    """Check if Ollama is running, query installed models, and verify availability."""
    target_model = selected_model or PRIMARY_MODEL
    if not OLLAMA_AVAILABLE:
        return {
            "running": False,
            "model_available": False,
            "primary_available": False,
            "secondary_available": False,
            "model_name": target_model,
            "primary_model": PRIMARY_MODEL,
            "secondary_model": SECONDARY_MODEL,
            "available_models": [],
            "error": "ollama package not installed"
        }
    try:
        models = ollama.list()
        model_names = [m.model for m in models.models]
        model_available = any(target_model in name for name in model_names)
        primary_available = any(PRIMARY_MODEL in name for name in model_names)
        secondary_available = any(SECONDARY_MODEL in name or "qwen2.5:2b" in name for name in model_names)
        return {
            "running": True,
            "model_available": model_available,
            "primary_available": primary_available,
            "secondary_available": secondary_available,
            "model_name": target_model,
            "primary_model": PRIMARY_MODEL,
            "secondary_model": SECONDARY_MODEL,
            "available_models": model_names,
            "error": None,
        }
    except Exception as e:
        return {
            "running": False,
            "model_available": False,
            "primary_available": False,
            "secondary_available": False,
            "model_name": target_model,
            "primary_model": PRIMARY_MODEL,
            "secondary_model": SECONDARY_MODEL,
            "available_models": [],
            "error": str(e),
        }


def extract_label(image_bytes: bytes, model: Optional[str] = None) -> dict:
    """
    Send image to Ollama vision model (primary: qwen3-vl:8b, compatible: qwen3.5:2b / qwen2.5:2b)
    and extract structured nutrition label data.
    Returns dict with keys: parsed (dict), raw_text (str), elapsed_seconds (float), error (str|None)
    """
    target_model = model or PRIMARY_MODEL
    if not OLLAMA_AVAILABLE:
        return {
            "parsed": EMPTY_RESULT.copy(),
            "raw_text": "",
            "elapsed_seconds": 0.0,
            "error": "ollama package not installed. Run: pip install ollama",
        }

    start = time.time()

    # Resize image
    try:
        resized = resize_image(image_bytes)
    except Exception:
        resized = image_bytes

    img_b64 = base64.b64encode(resized).decode()

    def _call_model(prompt_text: str) -> str:
        # Check if model supports vision. If it's a 2B text model that throws on images,
        # fallback gracefully or provide clear diagnostic.
        try:
            response = ollama.chat(
                model=target_model,
                messages=[
                    {
                        "role": "user",
                        "content": prompt_text,
                        "images": [img_b64],
                    }
                ],
                options={"temperature": 0},
            )
            return response.message.content
        except Exception as chat_err:
            err_msg = str(chat_err).lower()
            if "does not support images" in err_msg or "multimodal" in err_msg:
                # Text-only model fallback: advise switching to primary qwen3-vl:8b
                raise RuntimeError(
                    f"Model '{target_model}' does not support direct image inputs. "
                    f"Please switch to primary vision model '{PRIMARY_MODEL}' or 'minicpm-v4.5'."
                )
            raise chat_err

    raw_text = ""
    parsed = None
    error = None

    try:
        # First attempt
        raw_text = _call_model(EXTRACT_PROMPT)
        parsed = _parse_json_response(raw_text)

        if parsed is None:
            # Retry with stricter prompt
            retry_prompt = (
                "Return ONLY a JSON object for the food label in the image. "
                "No other text. Start your response with { and end with }. "
                "Use null for unknown values. Required keys: product_name, serving_size, "
                "per_100g (with energy_kcal, energy_kj, sugars_g, saturated_fat_g, salt_g, "
                "sodium_mg, fibre_g, protein_g, fat_g, carbs_g), ingredients (array), allergens_stated (array)."
            )
            raw_text_2 = _call_model(retry_prompt)
            parsed = _parse_json_response(raw_text_2)
            raw_text = raw_text_2 if raw_text_2 else raw_text

        if parsed is None:
            error = "Could not parse JSON from model response after 2 attempts"
            parsed = EMPTY_RESULT.copy()
        else:
            parsed = _validate_and_fill(parsed)

    except Exception as e:
        error = f"Ollama error: {str(e)}"
        parsed = EMPTY_RESULT.copy()

    elapsed = time.time() - start

    return {
        "parsed": parsed,
        "raw_text": raw_text,
        "elapsed_seconds": round(elapsed, 2),
        "error": error,
    }
