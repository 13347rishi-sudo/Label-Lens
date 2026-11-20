import { BrowserMultiFormatReader } from '@zxing/browser';
import { BarcodeFormat, DecodeHintType } from '@zxing/library';

// Shared ZXing reader with TRY_HARDER enabled and targeted retail barcode formats
let cachedZxingReader: BrowserMultiFormatReader | null = null;

export function getOptimizedZxingReader(): BrowserMultiFormatReader {
  if (!cachedZxingReader) {
    const hints = new Map<DecodeHintType, unknown>();
    hints.set(DecodeHintType.TRY_HARDER, true);
    hints.set(DecodeHintType.POSSIBLE_FORMATS, [
      BarcodeFormat.QR_CODE,
      BarcodeFormat.EAN_13,
      BarcodeFormat.EAN_8,
      BarcodeFormat.UPC_A,
      BarcodeFormat.UPC_E,
      BarcodeFormat.CODE_128,
      BarcodeFormat.CODE_39,
      BarcodeFormat.DATA_MATRIX
    ]);
    cachedZxingReader = new BrowserMultiFormatReader(hints);
  }
  return cachedZxingReader;
}

export function isNativeBarcodeDetectorSupported(): boolean {
  return typeof window !== 'undefined' && 'BarcodeDetector' in window;
}

// Cached Native BarcodeDetector singleton instance
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let cachedNativeDetector: any = null;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getNativeBarcodeDetector(): any {
  if (!isNativeBarcodeDetectorSupported()) return null;
  if (!cachedNativeDetector) {
    try {
      // @ts-expect-error Native window.BarcodeDetector
      cachedNativeDetector = new window.BarcodeDetector({
        formats: [
          'qr_code',
          'ean_13',
          'ean_8',
          'upc_a',
          'upc_e',
          'code_128',
          'code_39',
          'data_matrix'
        ]
      });
    } catch {
      cachedNativeDetector = null;
    }
  }
  return cachedNativeDetector;
}

/**
 * Native Hardware BarcodeDetector API (fastest, most accurate on Android Chrome, Edge, and Chromium).
 */
async function detectWithNativeAPI(source: ImageBitmapSource): Promise<string | undefined> {
  const detector = getNativeBarcodeDetector();
  if (!detector) return undefined;

  try {
    const results = await detector.detect(source);
    if (results && results.length > 0 && results[0].rawValue) {
      return String(results[0].rawValue).trim();
    }
  } catch {
    // Fallback to ZXing
  }
  return undefined;
}

/**
 * Multi-pass barcode and QR scanner.
 * Uses native Hardware BarcodeDetector first, then multi-resolution & contrast-enhanced ZXing passes.
 */
export async function scanCanvasWithAllEngines(canvas: HTMLCanvasElement): Promise<string | undefined> {
  // Pass 1: Native hardware BarcodeDetector
  const nativeResult = await detectWithNativeAPI(canvas);
  if (nativeResult) return nativeResult;

  const zxing = getOptimizedZxingReader();

  // Pass 2: Full canvas ZXing decode
  try {
    const res = await zxing.decodeFromCanvas(canvas);
    if (res && res.getText()) {
      return res.getText().trim();
    }
  } catch {
    // Continue to center crop
  }

  const w = canvas.width;
  const h = canvas.height;

  // Pass 3: Center-cropped reticle region (middle 70% width & height)
  // Barcodes in the center reticle often have edge clutter removed
  if (w > 200 && h > 200) {
    try {
      const cropCanvas = document.createElement('canvas');
      const cropW = Math.round(w * 0.75);
      const cropH = Math.round(h * 0.75);
      const cropX = Math.round((w - cropW) / 2);
      const cropY = Math.round((h - cropH) / 2);

      cropCanvas.width = cropW;
      cropCanvas.height = cropH;
      const cropCtx = cropCanvas.getContext('2d', { willReadFrequently: true });
      if (cropCtx) {
        cropCtx.drawImage(canvas, cropX, cropY, cropW, cropH, 0, 0, cropW, cropH);

        const cropNative = await detectWithNativeAPI(cropCanvas);
        if (cropNative) return cropNative;

        const cropRes = await zxing.decodeFromCanvas(cropCanvas);
        if (cropRes && cropRes.getText()) {
          return cropRes.getText().trim();
        }
      }
    } catch {
      // Continue to contrast pass
    }
  }

  // Pass 4: High-contrast binarization pass (for glossy plastic snack wrappers & dim lighting)
  try {
    const contrastCanvas = document.createElement('canvas');
    contrastCanvas.width = Math.min(w, 1200);
    contrastCanvas.height = Math.min(h, 1200);
    const cCtx = contrastCanvas.getContext('2d', { willReadFrequently: true });
    if (cCtx) {
      cCtx.drawImage(canvas, 0, 0, contrastCanvas.width, contrastCanvas.height);
      const imgData = cCtx.getImageData(0, 0, contrastCanvas.width, contrastCanvas.height);
      const d = imgData.data;

      for (let i = 0; i < d.length; i += 4) {
        const gray = 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2];
        // Contrast S-curve boost
        const val = gray < 125 ? Math.max(0, gray * 0.6) : Math.min(255, 120 + (gray - 120) * 1.6);
        d[i] = val;
        d[i + 1] = val;
        d[i + 2] = val;
      }
      cCtx.putImageData(imgData, 0, 0);

      const contrastNative = await detectWithNativeAPI(contrastCanvas);
      if (contrastNative) return contrastNative;

      const contrastRes = await zxing.decodeFromCanvas(contrastCanvas);
      if (contrastRes && contrastRes.getText()) {
        return contrastRes.getText().trim();
      }
    }
  } catch {
    // Continue to 90deg rotation pass
  }

  // Pass 5: 90-degree rotated pass (for vertical barcodes on bottles, cans, and candy bars)
  try {
    const rotCanvas = document.createElement('canvas');
    rotCanvas.width = canvas.height;
    rotCanvas.height = canvas.width;
    const rotCtx = rotCanvas.getContext('2d', { willReadFrequently: true });
    if (rotCtx) {
      rotCtx.translate(rotCanvas.width / 2, rotCanvas.height / 2);
      rotCtx.rotate((90 * Math.PI) / 180);
      rotCtx.drawImage(canvas, -canvas.width / 2, -canvas.height / 2);

      const rotNative = await detectWithNativeAPI(rotCanvas);
      if (rotNative) return rotNative;

      const rotRes = await zxing.decodeFromCanvas(rotCanvas);
      if (rotRes && rotRes.getText()) {
        return rotRes.getText().trim();
      }
    }
  } catch {
    // All passes exhausted
  }

  return undefined;
}

/**
 * Scans an uploaded or camera-captured image file with multi-stage preprocessing.
 */
export async function scanImageFileWithAllEngines(file: File): Promise<string | undefined> {
  const objectUrl = URL.createObjectURL(file);

  try {
    const img = new Image();
    img.src = objectUrl;
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = () => reject(new Error('Image failed to load'));
    });

    // Draw to scaled canvas (max 1600px dimension prevents memory exhaustion on 48MP smartphone photos)
    const canvas = document.createElement('canvas');
    const maxDim = 1600;
    let w = img.naturalWidth || img.width;
    let h = img.naturalHeight || img.height;
    if (w > maxDim || h > maxDim) {
      const scale = Math.min(maxDim / w, maxDim / h);
      w = Math.round(w * scale);
      h = Math.round(h * scale);
    }
    canvas.width = w;
    canvas.height = h;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return undefined;

    ctx.drawImage(img, 0, 0, w, h);
    return await scanCanvasWithAllEngines(canvas);
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}
