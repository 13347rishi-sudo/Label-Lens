import { useState, useRef, useEffect, useCallback } from 'react';
import {
  Camera,
  Barcode,
  UploadSimple,
  MagnifyingGlass,
  CircleNotch,
  Aperture,
  DeviceMobileCamera,
  Globe,
  Sparkle,
  ShieldCheck,
  WarningCircle
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
import { TRANSLATIONS, type Language } from '../lib/i18n';

interface ScannerHUDProps {
  onProductResolved: (product: ProductItem) => void;
  selectedModel: string;
  language?: Language;
  onOpenDemoMode?: () => void;
}

export function ScannerHUD({
  onProductResolved,
  selectedModel,
  language = 'en',
  onOpenDemoMode
}: ScannerHUDProps) {
  const [hudTab, setHudTab] = useState<'camera' | 'upload' | 'barcode'>('camera');
  const [cameraActive, setCameraActive] = useState(false);
  const [manualCode, setManualCode] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scanStep, setScanStep] = useState<number>(0);
  const [scanStatus, setScanStatus] = useState<string | null>(null);
  const [friendlyError, setFriendlyError] = useState<string | null>(null);
  const [justScanned, setJustScanned] = useState(false);
  const [allowOnlineFallback, setAllowOnlineFallback] = useState(false);

  const t = TRANSLATIONS[language];
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const zxingReaderRef = useRef<BrowserMultiFormatReader | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const nativeCameraInputRef = useRef<HTMLInputElement | null>(null);
  const lastScannedRef = useRef<string>('');
  const lastScannedTimeRef = useRef<number>(0);
  const scanLoopIntervalRef = useRef<number | null>(null);

  // Stop camera stream & loops cleanly
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

  // Cycle loading steps smoothly during scan
  useEffect(() => {
    if (!isScanning) {
      setScanStep(0);
      return;
    }
    const stepInterval = setInterval(() => {
      setScanStep((prev) => (prev < 3 ? prev + 1 : 0));
    }, 750);
    return () => clearInterval(stepInterval);
  }, [isScanning]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  // Universal product resolution
  const handleBarcodeScanned = useCallback(async (code: string) => {
    playBarcodeBeep();
    setJustScanned(true);
    setTimeout(() => setJustScanned(false), 900);

    setIsScanning(true);
    setFriendlyError(null);
    setScanStatus(t.steps.reading);

    try {
      const product = await lookupProductLive(code);
      if (product) {
        if (product.is_food === false) {
          playAlertBuzzer();
          setFriendlyError(`Non-food item recognized (${product.product_name}). Please scan edible food packaging.`);
        } else {
          playSuccessChime();
          setScanStatus(`Found: ${product.product_name} (${product.brand})`);
          onProductResolved(product);
        }
      } else {
        playAlertBuzzer();
        setFriendlyError(t.errors.notFound);
      }
    } catch {
      playAlertBuzzer();
      setFriendlyError(t.errors.generic);
    } finally {
      setIsScanning(false);
    }
  }, [onProductResolved, t]);

  // Start camera stream
  const startCamera = async () => {
    setFriendlyError(null);
    setScanStatus('Opening camera...');

    if (!navigator.mediaDevices?.getUserMedia) {
      setFriendlyError(t.errors.cameraBlocked);
      return;
    }

    try {
      const constraints: MediaStreamConstraints = {
        video: { facingMode: { ideal: 'environment' }, width: { ideal: 1280 }, height: { ideal: 720 } }
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      setCameraActive(true);
      setScanStatus('Center barcode inside frame to scan');

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
            // Native detector frame failed, zxing fallback catches
          }
        }, 150);

        scanLoopIntervalRef.current = interval;
      }
    } catch (err: unknown) {
      console.warn('Camera stream error:', err);
      setFriendlyError(t.errors.cameraBlocked);
      setCameraActive(false);
    }
  };

  // Decode from file with Vision fallback
  const processImageFile = async (file: File) => {
    setIsScanning(true);
    setFriendlyError(null);
    playBarcodeBeep();
    setScanStatus(t.steps.reading);

    try {
      const detectedText = await scanImageFileWithAllEngines(file);
      if (detectedText) {
        setScanStatus(`Barcode Detected: ${detectedText}`);
        await handleBarcodeScanned(detectedText);
        return;
      }
    } catch (err) {
      console.warn('Barcode scan error:', err);
    }

    // Vision fallback
    setScanStatus(t.steps.ingredients);
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
    setFriendlyError(t.errors.blurry);
  };

  // Capture frame from video and analyze
  const captureAndAnalyze = async (forceVisionAi = false) => {
    const video = videoRef.current;
    if (!video || !video.videoWidth || !video.videoHeight) {
      setFriendlyError(t.errors.blurry);
      return;
    }

    setIsScanning(true);
    setFriendlyError(null);
    playBarcodeBeep();

    try {
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        if (!forceVisionAi) {
          setScanStatus(t.steps.reading);
          const detectedText = await scanCanvasWithAllEngines(canvas);
          if (detectedText) {
            await handleBarcodeScanned(detectedText);
            return;
          }
        }

        setScanStatus(t.steps.ingredients);
        const isUp = await checkOllamaAvailable();
        if (isUp) {
          const aiProduct = await extractNutritionWithOllama(canvas, selectedModel);
          playSuccessChime();
          setScanStatus(`Found: ${aiProduct.product_name} (${aiProduct.brand})`);
          onProductResolved(aiProduct);
          setIsScanning(false);
          return;
        } else {
          setFriendlyError('Local AI vision engine (Ollama) is not running. Using offline barcode catalog.');
        }
      }
    } catch (err) {
      console.warn('Capture & analyze error:', err);
    }

    setIsScanning(false);
    playAlertBuzzer();
    setFriendlyError(t.errors.blurry);
  };

  const stepLabels = [
    t.steps.reading,
    t.steps.ingredients,
    t.steps.additives,
    t.steps.scoring
  ];

  return (
    <div className="w-full rounded-3xl apple-glass p-5 sm:p-6 relative overflow-hidden flex flex-col justify-between border border-white/[0.08] shadow-2xl">
      
      {/* Hidden Native Phone Camera Input */}
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

      {/* Top Controls: Mode Switcher & Offline Status */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        
        {/* Mode Selector */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-white/[0.04] border border-white/[0.06]">
          <button
            onClick={() => { setHudTab('camera'); if (!cameraActive) startCamera(); }}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all min-h-[40px] ${
              hudTab === 'camera'
                ? 'bg-white text-black shadow-sm font-bold'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Camera size={16} />
            <span>{language === 'en' ? 'Camera' : 'कैमरा'}</span>
          </button>
          <button
            onClick={() => { setHudTab('upload'); stopCamera(); }}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all min-h-[40px] ${
              hudTab === 'upload'
                ? 'bg-white text-black shadow-sm font-bold'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <UploadSimple size={16} />
            <span>{language === 'en' ? 'Upload Photo' : 'फोटो अपलोड'}</span>
          </button>
          <button
            onClick={() => { setHudTab('barcode'); stopCamera(); }}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all min-h-[40px] ${
              hudTab === 'barcode'
                ? 'bg-white text-black shadow-sm font-bold'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Barcode size={16} />
            <span>{language === 'en' ? 'Type Barcode' : 'बारकोड दर्ज करें'}</span>
          </button>
        </div>

        {/* Offline Ready Badge */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>{t.offlineBadge}</span>
        </div>

      </div>

      {/* Main Viewport */}
      {hudTab === 'camera' ? (
        <div className={`relative w-full aspect-[4/3] rounded-2xl bg-black overflow-hidden flex items-center justify-center border transition-all duration-300 ${
          justScanned ? 'border-emerald-400 shadow-[0_0_40px_rgba(52,199,89,0.4)]' : 'border-white/[0.1]'
        }`}>
          <video
            ref={videoRef}
            playsInline
            muted
            className={`w-full h-full object-cover transition-opacity duration-300 ${cameraActive ? 'opacity-100' : 'opacity-0'}`}
          />

          {/* Inactive State: Giant Kiosk Scan CTA Button (Readable from 1 Metre) */}
          {!cameraActive && (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center space-y-4 bg-neutral-950/85 backdrop-blur-md">
              <div className="w-16 h-16 rounded-3xl bg-white/[0.08] border border-white/[0.12] flex items-center justify-center text-white shadow-xl">
                <Camera size={32} />
              </div>

              <div>
                <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  {t.scanPacketBtn}
                </h3>
                <p className="text-xs sm:text-sm text-zinc-300 mt-1 max-w-sm">
                  {t.scanOrTap}
                </p>
              </div>

              {/* Giant 56px Tall Scan Actions */}
              <div className="flex flex-col sm:flex-row items-center gap-3 w-full max-w-md pt-2">
                <button
                  type="button"
                  onClick={startCamera}
                  className="w-full sm:flex-1 h-14 rounded-2xl bg-white hover:bg-zinc-200 text-black font-extrabold text-base sm:text-lg flex items-center justify-center gap-2 transition-all active:scale-95 shadow-xl"
                >
                  <Camera size={22} weight="bold" />
                  <span>{language === 'en' ? 'Open Camera' : 'कैमरा खोलें'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => nativeCameraInputRef.current?.click()}
                  className="w-full sm:flex-1 h-14 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-base sm:text-lg flex items-center justify-center gap-2 transition-all active:scale-95 shadow-xl"
                >
                  <DeviceMobileCamera size={22} weight="bold" />
                  <span>{language === 'en' ? 'Take Photo' : 'फोटो खींचें'}</span>
                </button>
              </div>

              {/* Demo Mode Button in Viewport for instant backup */}
              {onOpenDemoMode && (
                <button
                  type="button"
                  onClick={onOpenDemoMode}
                  className="text-xs font-semibold text-zinc-400 hover:text-white underline pt-1"
                >
                  {language === 'en' ? 'Or tap here for Demo Mode (Test Sample Foods)' : 'या डेमो मोड में खाद्य पदार्थ चुनें'}
                </button>
              )}
            </div>
          )}

          {/* Active Viewfinder Overlays */}
          {cameraActive && (
            <>
              {/* Scanline */}
              <div className="absolute inset-x-8 top-12 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent pointer-events-none animate-scanline shadow-[0_0_14px_rgba(52,199,89,1)]" />

              {/* Reticle Brackets */}
              <div className="absolute inset-8 pointer-events-none">
                <div className={`absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 rounded-tl-xl transition-colors ${
                  justScanned ? 'border-emerald-400' : 'border-white/80'
                }`} />
                <div className={`absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 rounded-tr-xl transition-colors ${
                  justScanned ? 'border-emerald-400' : 'border-white/80'
                }`} />
                <div className={`absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 rounded-bl-xl transition-colors ${
                  justScanned ? 'border-emerald-400' : 'border-white/80'
                }`} />
                <div className={`absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 rounded-br-xl transition-colors ${
                  justScanned ? 'border-emerald-400' : 'border-white/80'
                }`} />
              </div>

              {/* Active Camera Action Controls */}
              <div className="absolute bottom-5 left-0 right-0 flex flex-wrap justify-center items-center gap-3 px-4">
                <button
                  type="button"
                  onClick={() => captureAndAnalyze(false)}
                  disabled={isScanning}
                  className="px-5 py-3 rounded-full bg-white text-black font-extrabold text-sm sm:text-base flex items-center gap-2 shadow-2xl backdrop-blur-md transition-all active:scale-95 disabled:opacity-50 min-h-[48px]"
                >
                  <Aperture size={20} weight="bold" />
                  <span>{language === 'en' ? 'Scan Barcode' : 'बारकोड स्कैन करें'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => captureAndAnalyze(true)}
                  disabled={isScanning}
                  className="px-5 py-3 rounded-full bg-gradient-to-r from-amber-400 to-emerald-400 text-black font-extrabold text-sm sm:text-base flex items-center gap-2 shadow-2xl backdrop-blur-md transition-all active:scale-95 disabled:opacity-50 min-h-[48px]"
                >
                  <Sparkle size={18} weight="fill" />
                  <span>{language === 'en' ? 'Read Label (AI)' : 'लेबल पढ़ें (AI)'}</span>
                </button>
              </div>
            </>
          )}

          {/* Loading Stepper Overlay (Meaningful 4-Stage Progress) */}
          {isScanning && (
            <div className="absolute inset-0 bg-black/85 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center z-30 space-y-4 animate-fadeIn">
              <CircleNotch size={40} className="animate-spin text-emerald-400" />
              <div className="space-y-1">
                <div className="text-lg sm:text-xl font-bold text-white">
                  {stepLabels[scanStep]}
                </div>
                <div className="text-xs text-zinc-400">
                  {language === 'en' ? 'Processing locally on edge hardware...' : 'लैपटॉप पर प्रोसेस हो रहा है...'}
                </div>
              </div>

              {/* Stepper Progress Dots */}
              <div className="flex items-center gap-2 pt-2">
                {[0, 1, 2, 3].map((stepIdx) => (
                  <div
                    key={stepIdx}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      stepIdx === scanStep 
                        ? 'w-8 bg-emerald-400' 
                        : stepIdx < scanStep 
                        ? 'w-2 bg-emerald-700' 
                        : 'w-2 bg-white/20'
                    }`}
                  />
                ))}
              </div>
            </div>
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
          className={`w-full aspect-[4/3] rounded-2xl border-2 border-dashed flex flex-col items-center justify-center p-6 text-center transition-all ${
            dragOver ? 'border-emerald-400 bg-emerald-500/10' : 'border-white/15 bg-white/[0.02] hover:bg-white/[0.04]'
          }`}
        >
          <UploadSimple size={44} className="text-zinc-300 mb-3" />
          <p className="text-base font-bold text-white">{language === 'en' ? 'Drop food packet image here' : 'पैकेट की फोटो यहाँ डालें'}</p>
          <p className="text-xs text-zinc-400 mt-1 max-w-xs">{language === 'en' ? 'Upload a photo of the barcode or nutrition table.' : 'बारकोड या सामग्री तालिका की फोटो चुनें।'}</p>

          <div className="flex items-center gap-3 mt-5">
            <button
              type="button"
              onClick={() => nativeCameraInputRef.current?.click()}
              className="px-5 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-black text-sm font-bold flex items-center gap-2 min-h-[48px]"
            >
              <DeviceMobileCamera size={20} weight="bold" />
              <span>{language === 'en' ? 'Take Photo' : 'फोटो खींचें'}</span>
            </button>

            <label className="px-5 py-3 rounded-2xl bg-white/[0.08] hover:bg-white/[0.12] text-sm font-semibold text-white cursor-pointer min-h-[48px] flex items-center">
              {language === 'en' ? 'Select File' : 'फाइल चुनें'}
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
        <div className="w-full aspect-[4/3] rounded-2xl bg-white/[0.02] border border-white/[0.06] p-6 flex flex-col items-center justify-center text-center space-y-3">
          <Globe size={36} className="text-sky-400" />
          <p className="text-base sm:text-lg font-bold text-white">{language === 'en' ? 'Search Food or Enter Barcode' : 'खाद्य पदार्थ खोजें या बारकोड डालें'}</p>
          <p className="text-xs text-zinc-400 max-w-sm">
            {language === 'en' ? 'Type a product name (e.g. Maggi, Coke, Amul) or a barcode number.' : 'उत्पाद का नाम या बारकोड नंबर दर्ज करें।'}
          </p>
          
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (manualCode.trim()) handleBarcodeScanned(manualCode);
            }}
            className="w-full max-w-sm flex gap-2 pt-2"
          >
            <input
              type="text"
              placeholder="e.g. Maggi, Coke, 8901058852318"
              value={manualCode}
              onChange={(e) => setManualCode(e.target.value)}
              className="flex-1 px-4 py-3 rounded-xl bg-white/[0.06] border border-white/[0.12] text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-white/30"
            />
            <button
              type="submit"
              disabled={isScanning || !manualCode.trim()}
              className="px-5 py-3 rounded-xl bg-white text-black font-bold text-sm min-h-[48px] flex items-center justify-center"
            >
              {isScanning ? <CircleNotch size={18} className="animate-spin" /> : <MagnifyingGlass size={18} weight="bold" />}
            </button>
          </form>

          <div className="flex flex-wrap justify-center gap-2 pt-1 text-xs text-zinc-400">
            <span>Quick:</span>
            <button type="button" onClick={() => handleBarcodeScanned('8901058852318')} className="underline hover:text-white">Maggi</button>
            <span>·</span>
            <button type="button" onClick={() => handleBarcodeScanned('5449000000996')} className="underline hover:text-white">Coca-Cola</button>
            <span>·</span>
            <button type="button" onClick={() => handleBarcodeScanned('8901491101837')} className="underline hover:text-white">Lay's</button>
            <span>·</span>
            <button type="button" onClick={() => handleBarcodeScanned('8901262010047')} className="underline hover:text-white">Amul Butter</button>
          </div>
        </div>
      )}

      {/* Friendly Error Banner */}
      {friendlyError && (
        <div className="mt-3 p-3 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-xs sm:text-sm text-amber-200 flex items-start gap-2.5">
          <WarningCircle size={18} className="text-amber-400 shrink-0 mt-0.5" />
          <span>{friendlyError}</span>
        </div>
      )}

      {/* Status Notice */}
      {scanStatus && !friendlyError && !isScanning && (
        <div className="mt-3 p-3 rounded-2xl bg-white/[0.04] border border-white/[0.08] text-xs sm:text-sm text-zinc-300 flex items-center gap-2">
          <ShieldCheck size={16} className="text-emerald-400 shrink-0" />
          <span>{scanStatus}</span>
        </div>
      )}

      {/* Trust Strip */}
      <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs text-zinc-400">
        <span className="flex items-center gap-1.5 text-zinc-300">
          <ShieldCheck size={16} className="text-emerald-400" />
          <span>{t.trustStrip}</span>
        </span>
        <button
          type="button"
          onClick={() => setAllowOnlineFallback(!allowOnlineFallback)}
          className={`text-[11px] px-2 py-0.5 rounded border transition-colors ${
            allowOnlineFallback 
              ? 'bg-sky-500/20 text-sky-300 border-sky-500/30 font-semibold' 
              : 'text-zinc-500 border-white/[0.06] hover:text-zinc-300'
          }`}
          title="Toggle online Open Food Facts lookup when exhibition Wi-Fi is active"
        >
          {allowOnlineFallback ? 'Online Fallback ON' : 'Wi-Fi Fallback OFF'}
        </button>
      </div>

    </div>
  );
}
