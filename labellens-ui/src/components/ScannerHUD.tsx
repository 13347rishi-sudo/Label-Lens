import { useState, useRef, useEffect, useCallback } from 'react';
import {
  Camera,
  Barcode,
  UploadSimple,
  MagnifyingGlass,
  CameraRotate,
  CircleNotch,
  Aperture,
  DeviceMobileCamera,
  Globe,
  Lightning,
  Sparkle
} from '@phosphor-icons/react';
import { BrowserMultiFormatReader } from '@zxing/browser';
import { playBarcodeBeep, playSuccessChime, playAlertBuzzer } from '../lib/sound';
import { lookupProductLive } from '../lib/database';
import {
  isNativeBarcodeDetectorSupported,
  scanCanvasWithAllEngines,
  scanImageFileWithAllEngines,
  getOptimizedZxingReader
} from '../lib/barcodeScanner';
import { extractNutritionWithOllama, checkOllamaAvailable } from '../lib/ollamaVision';
import type { ProductItem } from '../lib/types';

interface ScannerHUDProps {
  onProductResolved: (product: ProductItem) => void;
  selectedModel: string;
}

export function ScannerHUD({ onProductResolved, selectedModel }: ScannerHUDProps) {
  const [hudTab, setHudTab] = useState<'camera' | 'upload' | 'barcode'>('camera');
  const [cameraActive, setCameraActive] = useState(false);
  const [videoDevices, setVideoDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>('');
  const [manualCode, setManualCode] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scanStatus, setScanStatus] = useState<string | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [justScanned, setJustScanned] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const zxingReaderRef = useRef<BrowserMultiFormatReader | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const nativeCameraInputRef = useRef<HTMLInputElement | null>(null);
  const lastScannedRef = useRef<string>('');
  const lastScannedTimeRef = useRef<number>(0);
  const scanLoopIntervalRef = useRef<number | null>(null);

  // Stop camera stream & background scan loops cleanly
  const stopCamera = useCallback(() => {
    if (scanLoopIntervalRef.current) {
      clearInterval(scanLoopIntervalRef.current);
      scanLoopIntervalRef.current = null;
    }
    if (zxingReaderRef.current) {
      zxingReaderRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
  }, []);

  // Enumerate available video input devices safely on mount
  useEffect(() => {
    let mounted = true;
    const loadDevices = async () => {
      if (!navigator.mediaDevices?.enumerateDevices) return;
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        if (!mounted) return;
        const videoInputs = devices.filter((d) => d.kind === 'videoinput');
        setVideoDevices(videoInputs);
        setSelectedDeviceId((prev) => (prev || (videoInputs[0]?.deviceId ?? '')));
      } catch {
        // Ignore
      }
    };

    loadDevices();
    navigator.mediaDevices?.addEventListener('devicechange', loadDevices);

    return () => {
      mounted = false;
      navigator.mediaDevices?.removeEventListener('devicechange', loadDevices);
    };
  }, []);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  // Universal product resolution: Local Database + Live Open Food Facts API fallback
  const handleBarcodeScanned = useCallback(async (code: string) => {
    playBarcodeBeep();
    setJustScanned(true);
    setTimeout(() => setJustScanned(false), 900);

    setIsScanning(true);
    const preview = code.length > 35 ? `${code.slice(0, 32)}...` : code;
    setScanStatus(`Looking up ${preview}...`);

    try {
      const product = await lookupProductLive(code);
      if (product) {
        playSuccessChime();
        setScanStatus(`Found: ${product.product_name} (${product.brand})`);
        onProductResolved(product);
      } else {
        playAlertBuzzer();
        setScanStatus(`Scanned "${preview}". Product not found in database.`);
      }
    } catch {
      playAlertBuzzer();
      setScanStatus(`Could not look up: ${preview}`);
    } finally {
      setIsScanning(false);
    }
  }, [onProductResolved]);

  // Start camera stream
  const startCamera = async () => {
    setCameraError(null);
    setScanStatus('Opening camera...');

    if (!navigator.mediaDevices?.getUserMedia) {
      setCameraError('Camera requires HTTPS on mobile browsers. Use "Take Photo" below.');
      return;
    }

    try {
      const constraints: MediaStreamConstraints = {
        video: selectedDeviceId
          ? { deviceId: { exact: selectedDeviceId }, width: { ideal: 1280 }, height: { ideal: 720 } }
          : { facingMode: { ideal: 'environment' }, width: { ideal: 1280 }, height: { ideal: 720 } }
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      setCameraActive(true);
      setScanStatus('Center food barcode in frame to scan');

      // 1. Configure optimized ZXing as fallback
      const codeReader = getOptimizedZxingReader();
      zxingReaderRef.current = codeReader;

      if (videoRef.current) {
        codeReader.decodeFromVideoElement(videoRef.current, (result) => {
          if (result) {
            const text = result.getText();
            const now = Date.now();
            if (lastScannedRef.current === text && now - lastScannedTimeRef.current < 3000) {
              return;
            }
            lastScannedRef.current = text;
            lastScannedTimeRef.current = now;
            handleBarcodeScanned(text);
          }
        });
      }

      // 2. High-speed Hardware BarcodeDetector polling loop (if supported)
      if (isNativeBarcodeDetectorSupported()) {
        const offscreenCanvas = document.createElement('canvas');
        const interval = window.setInterval(async () => {
          const video = videoRef.current;
          if (!video || video.readyState < 2 || !video.videoWidth) return;

          try {
            // @ts-expect-error Native BarcodeDetector API
            const detector = new window.BarcodeDetector({
              formats: ['qr_code', 'ean_13', 'ean_8', 'upc_a', 'upc_e', 'code_128', 'code_39', 'data_matrix']
            });

            offscreenCanvas.width = video.videoWidth;
            offscreenCanvas.height = video.videoHeight;
            const ctx = offscreenCanvas.getContext('2d', { willReadFrequently: true });
            if (ctx) {
              ctx.drawImage(video, 0, 0);
              const barcodes = await detector.detect(offscreenCanvas);
              if (barcodes && barcodes.length > 0 && barcodes[0].rawValue) {
                const text = String(barcodes[0].rawValue).trim();
                const now = Date.now();
                if (lastScannedRef.current === text && now - lastScannedTimeRef.current < 3000) {
                  return;
                }
                lastScannedRef.current = text;
                lastScannedTimeRef.current = now;
                handleBarcodeScanned(text);
              }
            }
          } catch {
            // Native detector frame failed, zxing fallback will catch it
          }
        }, 150);

        scanLoopIntervalRef.current = interval;
      }
    } catch (err: unknown) {
      console.warn('Camera stream error:', err);
      setCameraError('Camera stream blocked or requires HTTPS on mobile. Use "Snap with Phone Camera" below to use your native phone camera directly!');
      setCameraActive(false);
    }
  };

  // Decode barcode/QR directly from an image file, with automatic AI Vision fallback
  const processImageFile = async (file: File) => {
    setIsScanning(true);
    playBarcodeBeep();
    setScanStatus(`Scanning image...`);

    try {
      const detectedText = await scanImageFileWithAllEngines(file);
      if (detectedText) {
        setScanStatus(`Found Barcode: ${detectedText}`);
        await handleBarcodeScanned(detectedText);
        return;
      }
    } catch (err) {
      console.warn('Barcode scan error:', err);
    }

    // No barcode found: activate local AI to read the nutrition label table
    setScanStatus(`No barcode found. Reading ingredients label with AI...`);
    try {
      const isUp = await checkOllamaAvailable();
      if (isUp) {
        const aiProduct = await extractNutritionWithOllama(file, selectedModel);
        playSuccessChime();
        setScanStatus(`Found: ${aiProduct.product_name} (${aiProduct.brand})`);
        onProductResolved(aiProduct);
        setIsScanning(false);
        return;
      }
    } catch (aiErr) {
      console.warn('Vision AI fallback error:', aiErr);
    }

    setIsScanning(false);
    playAlertBuzzer();
    setScanStatus(`Could not find a barcode or nutrition table. Try a clearer photo.`);
  };

  // Capture static frame from live video and run barcode scan + AI Vision fallback
  const captureAndAnalyze = async (forceVisionAi = false) => {
    const video = videoRef.current;
    if (!video || !video.videoWidth || !video.videoHeight) {
      setScanStatus('Camera not ready. Please try again.');
      return;
    }

    setIsScanning(true);
    playBarcodeBeep();

    try {
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        if (!forceVisionAi) {
          setScanStatus(`Scanning barcode...`);
          const detectedText = await scanCanvasWithAllEngines(canvas);
          if (detectedText) {
            await handleBarcodeScanned(detectedText);
            return;
          }
        }

        // Run Ollama Vision AI
        setScanStatus(`Reading nutrition table with AI...`);
        const isUp = await checkOllamaAvailable();
        if (isUp) {
          const aiProduct = await extractNutritionWithOllama(canvas, selectedModel);
          playSuccessChime();
          setScanStatus(`Found: ${aiProduct.product_name} (${aiProduct.brand})`);
          onProductResolved(aiProduct);
          setIsScanning(false);
          return;
        } else {
          setScanStatus('AI model is offline. Please start Ollama.');
        }
      }
    } catch (err) {
      console.warn('Capture & analyze error:', err);
    }

    setIsScanning(false);
    playAlertBuzzer();
    setScanStatus('No barcode or food label detected. Hold still and try again.');
  };

  return (
    <div className="w-full rounded-3xl apple-glass p-5 relative overflow-hidden flex flex-col justify-between">
      
      {/* Hidden Native Phone Camera Input (100% Mobile Phone Compatible) */}
      <input
        ref={nativeCameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => {
          if (e.target.files?.[0]) {
            processImageFile(e.target.files[0]);
          }
        }}
      />

      {/* Viewfinder Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">

        {/* Segmented Mode Selector */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-white/[0.04] border border-white/[0.06]">
          <button
            onClick={() => { setHudTab('camera'); if (!cameraActive) startCamera(); }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all min-h-[36px] ${
              hudTab === 'camera'
                ? 'bg-white text-black shadow-sm font-semibold'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Camera size={14} />
            <span>Camera</span>
          </button>
          <button
            onClick={() => { setHudTab('upload'); stopCamera(); }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all min-h-[36px] ${
              hudTab === 'upload'
                ? 'bg-white text-black shadow-sm font-semibold'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <UploadSimple size={14} />
            <span>Upload</span>
          </button>
          <button
            onClick={() => { setHudTab('barcode'); stopCamera(); }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all min-h-[36px] ${
              hudTab === 'barcode'
                ? 'bg-white text-black shadow-sm font-semibold'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Barcode size={14} />
            <span>Barcode & Search</span>
          </button>
        </div>

        {/* Fast Scanner Status Badge */}
        {isNativeBarcodeDetectorSupported() && (
          <div className="hidden sm:flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-lg">
            <Lightning size={12} weight="fill" />
            <span>Fast Scanner Ready</span>
          </div>
        )}

        {/* Camera Selector (for external webcams / rear/front toggle) */}
        {videoDevices.length > 1 && hudTab === 'camera' && (
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/[0.06] text-xs text-zinc-400">
            <CameraRotate size={13} />
            <select
              value={selectedDeviceId}
              onChange={(e) => {
                setSelectedDeviceId(e.target.value);
                if (cameraActive) {
                  stopCamera();
                  setTimeout(startCamera, 100);
                }
              }}
              className="bg-transparent text-white text-xs focus:outline-none cursor-pointer"
            >
              {videoDevices.map((d, idx) => (
                <option key={d.deviceId || idx} value={d.deviceId} className="bg-[#16161E] text-white">
                  {d.label || `Camera ${idx + 1}`}
                </option>
              ))}
            </select>
          </div>
        )}

      </div>

      {/* Main Viewport */}
      {hudTab === 'camera' ? (
        <div className={`relative w-full aspect-[4/3] rounded-2xl bg-black overflow-hidden flex items-center justify-center border transition-all duration-300 ${
          justScanned ? 'border-emerald-400 shadow-[0_0_30px_rgba(52,199,89,0.3)]' : 'border-white/[0.08]'
        }`}>
          <video
            ref={videoRef}
            playsInline
            muted
            className={`w-full h-full object-cover transition-opacity duration-300 ${cameraActive ? 'opacity-100' : 'opacity-0'}`}
          />

          {/* Inactive State: Clean Start Camera CTA + Phone Native Shutter */}
          {!cameraActive && (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-5 text-center space-y-3 bg-neutral-950/80 backdrop-blur-md">
              <div className="w-12 h-12 rounded-2xl bg-white/[0.06] border border-white/[0.1] flex items-center justify-center text-zinc-300">
                <Camera size={24} />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Scan Food Package</p>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Point camera at a barcode or nutrition table
                </p>
              </div>

              {/* Primary Dual Shutter Options for Phone & Desktop */}
              <div className="flex flex-col sm:flex-row items-center gap-2 pt-1 w-full max-w-xs">
                
                {/* Mobile Phone Native Camera Button */}
                <button
                  type="button"
                  onClick={() => nativeCameraInputRef.current?.click()}
                  className="w-full sm:flex-1 py-2.5 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-xs flex items-center justify-center gap-1.5 transition-all active:scale-95 shadow-md min-h-[44px]"
                >
                  <DeviceMobileCamera size={18} weight="bold" />
                  <span>Take Photo</span>
                </button>

                {/* Live Stream Camera */}
                <button
                  type="button"
                  onClick={startCamera}
                  className="w-full sm:flex-1 py-2.5 px-3 rounded-xl bg-white hover:bg-zinc-200 text-black font-semibold text-xs flex items-center justify-center gap-1.5 transition-all active:scale-95 shadow-md min-h-[44px]"
                >
                  <Camera size={16} />
                  <span>Open Camera</span>
                </button>
              </div>

              {cameraError && (
                <div className="p-2.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-[11px] text-amber-200 text-left max-w-xs mt-2">
                  {cameraError}
                </div>
              )}
            </div>
          )}

          {/* Active Viewfinder Overlays */}
          {cameraActive && (
            <>
              {/* Scan Line Beam */}
              <div className="absolute inset-x-8 top-12 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent pointer-events-none animate-scanline shadow-[0_0_12px_rgba(52,199,89,0.9)]" />

              {/* Reticle Brackets */}
              <div className="absolute inset-8 pointer-events-none">
                <div className={`absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 rounded-tl-lg transition-colors ${
                  justScanned ? 'border-emerald-400' : 'border-white/70'
                }`} />
                <div className={`absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 rounded-tr-lg transition-colors ${
                  justScanned ? 'border-emerald-400' : 'border-white/70'
                }`} />
                <div className={`absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 rounded-bl-lg transition-colors ${
                  justScanned ? 'border-emerald-400' : 'border-white/70'
                }`} />
                <div className={`absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 rounded-br-lg transition-colors ${
                  justScanned ? 'border-emerald-400' : 'border-white/70'
                }`} />
              </div>

              {/* Shutter Action Buttons */}
              <div className="absolute bottom-4 left-0 right-0 flex flex-wrap justify-center items-center gap-2 px-3">
                <button
                  type="button"
                  onClick={() => captureAndAnalyze(false)}
                  disabled={isScanning}
                  className="px-3.5 py-2 rounded-full bg-white/95 hover:bg-white text-black font-semibold text-xs flex items-center gap-1.5 shadow-lg backdrop-blur-md transition-all active:scale-95 disabled:opacity-50 min-h-[40px]"
                >
                  {isScanning ? (
                    <>
                      <CircleNotch size={14} className="animate-spin text-black" />
                      <span>Scanning...</span>
                    </>
                  ) : (
                    <>
                      <Aperture size={15} />
                      <span>Scan Barcode</span>
                    </>
                  )}
                </button>

                {/* AI Label Reading Button */}
                <button
                  type="button"
                  onClick={() => captureAndAnalyze(true)}
                  disabled={isScanning}
                  className="px-3.5 py-2 rounded-full bg-gradient-to-r from-amber-500/90 to-emerald-500/90 hover:from-amber-400 hover:to-emerald-400 text-black font-semibold text-xs flex items-center gap-1.5 shadow-lg backdrop-blur-md transition-all active:scale-95 disabled:opacity-50 min-h-[40px]"
                  title="Read nutrition facts table with AI"
                >
                  <Sparkle size={14} weight="fill" />
                  <span>Read Label (AI)</span>
                </button>

                <button
                  type="button"
                  onClick={() => nativeCameraInputRef.current?.click()}
                  className="px-3 py-2 rounded-full bg-black/60 hover:bg-black/80 text-white font-medium text-xs flex items-center gap-1.5 shadow-lg backdrop-blur-md border border-white/20 transition-all active:scale-95 min-h-[40px]"
                >
                  <DeviceMobileCamera size={15} />
                  <span>Photo</span>
                </button>
              </div>
            </>
          )}
        </div>
      ) : hudTab === 'upload' ? (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            if (e.dataTransfer.files[0]) processImageFile(e.dataTransfer.files[0]);
          }}
          className={`w-full aspect-[4/3] rounded-2xl border border-dashed flex flex-col items-center justify-center p-6 text-center transition-all ${
            dragOver ? 'border-white bg-white/[0.08]' : 'border-white/10 bg-white/[0.02] hover:bg-white/[0.04]'
          }`}
        >
          <UploadSimple size={32} className="text-zinc-400 mb-2" />
          <p className="text-xs font-medium text-white">Drop or upload a photo</p>
          <p className="text-[11px] text-zinc-500 mt-1">Upload a clear photo of the barcode or ingredients list.</p>
          
          <div className="flex items-center gap-2 mt-4">
            <button
              type="button"
              onClick={() => nativeCameraInputRef.current?.click()}
              className="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-semibold flex items-center gap-1.5 transition-all active:scale-95 min-h-[44px]"
            >
              <DeviceMobileCamera size={16} weight="bold" />
              <span>Take Photo</span>
            </button>

            <label className="px-3.5 py-2 rounded-xl bg-white/[0.08] hover:bg-white/[0.12] text-xs font-medium text-white cursor-pointer transition-all active:scale-95 flex items-center min-h-[44px]">
              Choose Photo
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files?.[0]) processImageFile(e.target.files[0]);
                }}
              />
            </label>
          </div>
        </div>
      ) : (
        <div className="w-full aspect-[4/3] rounded-2xl bg-white/[0.02] border border-white/[0.06] p-6 flex flex-col items-center justify-center text-center">
          <Globe size={32} className="text-sky-400 mb-2" />
          <p className="text-sm font-bold text-white mb-1">Search Food or Barcode</p>
          <p className="text-xs text-zinc-400 mb-4 max-w-sm">
            Type any product name (e.g. Maggi, Amul Milk) or barcode number.
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (manualCode.trim()) handleBarcodeScanned(manualCode);
            }}
            className="w-full max-w-sm flex gap-2"
          >
            <input
              type="text"
              placeholder="e.g. Maggi, Amul Milk, or 8901058852318"
              value={manualCode}
              onChange={(e) => setManualCode(e.target.value)}
              className="flex-1 px-3.5 py-2.5 rounded-xl bg-white/[0.06] border border-white/[0.1] text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-white/30"
            />
            <button
              type="submit"
              disabled={isScanning || !manualCode.trim()}
              className="px-4 py-2.5 rounded-xl bg-white text-black font-semibold text-xs active:scale-95 disabled:opacity-50 min-h-[44px] flex items-center justify-center"
            >
              {isScanning ? <CircleNotch size={14} className="animate-spin" /> : <MagnifyingGlass size={15} />}
            </button>
          </form>
          <div className="flex flex-wrap justify-center gap-1.5 mt-3 text-[11px] text-zinc-500">
            <span>Try:</span>
            <button
              type="button"
              onClick={() => handleBarcodeScanned('8901058852318')}
              className="underline hover:text-white"
            >
              Maggi
            </button>
            <span>·</span>
            <button
              type="button"
              onClick={() => handleBarcodeScanned('5449000000996')}
              className="underline hover:text-white"
            >
              Coca-Cola
            </button>
            <span>·</span>
            <button
              type="button"
              onClick={() => handleBarcodeScanned('8901491101837')}
              className="underline hover:text-white"
            >
              Lay&apos;s
            </button>
          </div>
        </div>
      )}

      {/* Subtle Status Pill */}
      {scanStatus && (
        <div className="mt-3 px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.06] text-center text-xs text-zinc-300 flex items-center justify-center gap-2">
          {isScanning && <CircleNotch size={14} className="animate-spin text-sky-400" />}
          <span>{scanStatus}</span>
        </div>
      )}

    </div>
  );
}
