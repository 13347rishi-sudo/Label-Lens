import { useState, useRef, useEffect, useCallback } from 'react';
import {
  Camera,
  UploadSimple,
  MagnifyingGlass,
  CircleNotch,
  Aperture,
  DeviceMobileCamera,
  WarningCircle
} from '@phosphor-icons/react';
import { BrowserMultiFormatReader } from '@zxing/browser';
import { playBarcodeBeep, playSuccessChime, playAlertBuzzer } from '../lib/sound';
import { lookupProductLive } from '../lib/database';
import {
  isNativeBarcodeDetectorSupported,
  getNativeBarcodeDetector,
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
}

export function ScannerHUD({
  onProductResolved,
  selectedModel,
  language = 'en'
}: ScannerHUDProps) {
  const [hudTab, setHudTab] = useState<'camera' | 'upload' | 'barcode'>('camera');
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraMode, setCameraMode] = useState<'barcode' | 'vision'>('barcode');
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
      try {
        // @ts-expect-error Reset browser reader stream
        zxingReaderRef.current.reset?.();
      } catch {
        // Ignore
      }
      zxingReaderRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((trk) => trk.stop());
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
    }, 700);
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
          setFriendlyError(`Non-food item recognized (${product.product_name}). Please scan food packaging.`);
        } else {
          playSuccessChime();
          setScanStatus(`Found: ${product.product_name}`);
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
      setScanStatus('Ready to scan');

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
        const detector = getNativeBarcodeDetector();
        const interval = window.setInterval(async () => {
          const video = videoRef.current;
          if (!video || video.readyState < 2 || !video.videoWidth || !detector) return;

          try {
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
            // Fallback handled by zxing
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
        setScanStatus(`Barcode: ${detectedText}`);
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
        setScanStatus(`Found: ${aiProduct.product_name}`);
        onProductResolved(aiProduct);
        setIsScanning(false);
        return;
      }
    } catch (aiErr) {
      console.warn('Vision fallback error:', aiErr);
    }

    setIsScanning(false);
    playAlertBuzzer();
    setFriendlyError(t.errors.blurry);
  };

  // Capture frame from video and analyze
  const captureAndAnalyze = async (forceVision = false) => {
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

        if (!forceVision) {
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
          setScanStatus(`Found: ${aiProduct.product_name}`);
          onProductResolved(aiProduct);
          setIsScanning(false);
          return;
        } else {
          setFriendlyError('Vision model not found on local machine. Using offline catalog.');
        }
      }
    } catch (err) {
      console.warn('Capture error:', err);
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
    <div className="w-full bg-white border border-[#E2DDD4] rounded-2xl p-5 sm:p-7 shadow-xs">
      
      {/* Hidden File Input for Mobile/Tablet Camera */}
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

      {/* Underlined Tab Row */}
      <div className="flex items-center justify-between border-b border-[#E2DDD4] pb-2 mb-5">
        <div className="flex items-center gap-6 text-sm">
          <button
            onClick={() => { setHudTab('camera'); if (!cameraActive) startCamera(); }}
            className={`transition-all font-medium pb-2 -mb-2 border-b-2 ${
              hudTab === 'camera'
                ? 'border-[#161616] text-[#161616] font-bold'
                : 'border-transparent text-[#6E6A63] hover:text-[#161616]'
            }`}
          >
            {language === 'en' ? 'Camera' : 'कैमरा'}
          </button>

          <button
            onClick={() => { setHudTab('upload'); stopCamera(); }}
            className={`transition-all font-medium pb-2 -mb-2 border-b-2 ${
              hudTab === 'upload'
                ? 'border-[#161616] text-[#161616] font-bold'
                : 'border-transparent text-[#6E6A63] hover:text-[#161616]'
            }`}
          >
            {language === 'en' ? 'Upload Photo' : 'फोटो अपलोड'}
          </button>

          <button
            onClick={() => { setHudTab('barcode'); stopCamera(); }}
            className={`transition-all font-medium pb-2 -mb-2 border-b-2 ${
              hudTab === 'barcode'
                ? 'border-[#161616] text-[#161616] font-bold'
                : 'border-transparent text-[#6E6A63] hover:text-[#161616]'
            }`}
          >
            {language === 'en' ? 'Type Barcode' : 'बारकोड दर्ज करें'}
          </button>
        </div>

        {/* Small Offline Status Dot */}
        <div className="flex items-center gap-1.5 text-xs text-[#6E6A63] font-mono">
          <span className="w-1.5 h-1.5 rounded-full bg-[#038141]" />
          <span>115+ offline</span>
        </div>
      </div>

      {/* Main Viewport */}
      {hudTab === 'camera' ? (
        <div className="space-y-4">
          
          {/* Camera Frame (Full Bleed Clean Border) */}
          <div className={`relative w-full aspect-[16/10] sm:aspect-[16/9] rounded-xl bg-[#F6F3EC] overflow-hidden flex items-center justify-center border transition-all duration-300 ${
            justScanned ? 'border-[#038141] ring-2 ring-[#038141]/20' : 'border-[#E2DDD4]'
          }`}>
            
            <video
              ref={videoRef}
              playsInline
              muted
              className={`w-full h-full object-cover transition-opacity duration-200 ${
                cameraActive ? 'opacity-100' : 'opacity-0'
              }`}
            />

            {/* Inactive State: Clean, Big Shutter Call-To-Action */}
            {!cameraActive && (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center space-y-4 bg-[#F6F3EC]">
                <div className="w-16 h-16 rounded-full bg-white border border-[#E2DDD4] flex items-center justify-center text-[#161616] shadow-xs">
                  <Camera size={28} />
                </div>

                <div className="space-y-1">
                  <h3 className="text-xl sm:text-2xl font-bold text-[#161616] tracking-tight">
                    {t.scanPacketBtn}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#6E6A63] max-w-sm">
                    {t.scanOrTap}
                  </p>
                </div>

                {/* Big Shutter Buttons (At least 56px tall for 1.5m exhibition kiosk) */}
                <div className="flex flex-col sm:flex-row items-center gap-3 w-full max-w-md pt-2">
                  <button
                    type="button"
                    onClick={startCamera}
                    className="w-full sm:flex-1 h-14 rounded-xl bg-[#161616] hover:bg-black text-[#F6F3EC] font-bold text-sm sm:text-base flex items-center justify-center gap-2 transition-all active:scale-98 shadow-xs"
                  >
                    <Camera size={20} />
                    <span>{language === 'en' ? 'Open Camera' : 'कैमरा खोलें'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => nativeCameraInputRef.current?.click()}
                    className="w-full sm:flex-1 h-14 rounded-xl bg-white hover:bg-[#EFECE4] border border-[#E2DDD4] text-[#161616] font-bold text-sm sm:text-base flex items-center justify-center gap-2 transition-all active:scale-98 shadow-xs"
                  >
                    <DeviceMobileCamera size={20} />
                    <span>{language === 'en' ? 'Take Photo' : 'फोटो खींचें'}</span>
                  </button>
                </div>
              </div>
            )}

            {/* Active Camera Corner Reticles (Thin Crisp Brackets, No Glow) */}
            {cameraActive && (
              <div className="absolute inset-8 pointer-events-none">
                <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-[#161616]" />
                <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-[#161616]" />
                <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-[#161616]" />
                <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-[#161616]" />
              </div>
            )}

            {/* Loading Stepper Overlay */}
            {isScanning && (
              <div className="absolute inset-0 bg-[#F6F3EC]/90 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center z-30 space-y-3">
                <CircleNotch size={32} className="animate-spin text-[#161616]" />
                <div className="text-base font-bold text-[#161616]">
                  {stepLabels[scanStep]}
                </div>
                <div className="text-xs text-[#6E6A63] font-mono">
                  {language === 'en' ? 'Processing on local device...' : 'डिवाइस पर प्रोसेस हो रहा है...'}
                </div>
              </div>
            )}

          </div>

          {/* Active Camera Shutter & Mode Bar */}
          {cameraActive && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
              
              {/* Two-Segment Control: Scan Barcode vs Read Label */}
              <div className="inline-flex p-1 rounded-xl bg-[#EFECE4] border border-[#E2DDD4]">
                <button
                  type="button"
                  onClick={() => setCameraMode('barcode')}
                  className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                    cameraMode === 'barcode'
                      ? 'bg-[#161616] text-[#F6F3EC] shadow-xs'
                      : 'text-[#6E6A63] hover:text-[#161616]'
                  }`}
                >
                  {language === 'en' ? 'Scan Barcode' : 'बारकोड स्कैन'}
                </button>

                <button
                  type="button"
                  onClick={() => setCameraMode('vision')}
                  className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                    cameraMode === 'vision'
                      ? 'bg-[#161616] text-[#F6F3EC] shadow-xs'
                      : 'text-[#6E6A63] hover:text-[#161616]'
                  }`}
                >
                  {language === 'en' ? 'Read Label (AI Vision)' : 'लेबल पढ़ें (विजन)'}
                </button>
              </div>

              {/* Big Shutter Button */}
              <button
                type="button"
                onClick={() => captureAndAnalyze(cameraMode === 'vision')}
                disabled={isScanning}
                className="w-full sm:w-auto h-12 px-6 rounded-xl bg-[#161616] hover:bg-black text-[#F6F3EC] font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-98 disabled:opacity-50 shadow-xs"
              >
                <Aperture size={18} />
                <span>
                  {cameraMode === 'vision'
                    ? (language === 'en' ? 'Read Packaging Label' : 'लेबल विश्लेषण करें')
                    : (language === 'en' ? 'Capture Barcode' : 'बारकोड कैप्चर करें')}
                </span>
              </button>

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
          className={`w-full aspect-[16/10] sm:aspect-[16/9] rounded-xl border-2 border-dashed flex flex-col items-center justify-center p-6 text-center transition-all ${
            dragOver ? 'border-[#161616] bg-[#EFECE4]' : 'border-[#E2DDD4] bg-[#F6F3EC] hover:bg-[#EFECE4]'
          }`}
        >
          <UploadSimple size={36} className="text-[#6E6A63] mb-2" />
          <p className="text-base font-bold text-[#161616]">
            {language === 'en' ? 'Drop food packet image here' : 'पैकेट की फोटो यहाँ डालें'}
          </p>
          <p className="text-xs text-[#6E6A63] mt-1 max-w-xs">
            {language === 'en' ? 'Upload a photo of the barcode or nutrition table.' : 'बारकोड या सामग्री तालिका की फोटो चुनें।'}
          </p>

          <div className="flex items-center gap-3 mt-4">
            <button
              type="button"
              onClick={() => nativeCameraInputRef.current?.click()}
              className="px-5 py-2.5 rounded-xl bg-[#161616] hover:bg-black text-[#F6F3EC] text-xs font-bold flex items-center gap-2 shadow-xs"
            >
              <DeviceMobileCamera size={16} />
              <span>{language === 'en' ? 'Take Photo' : 'फोटो खींचें'}</span>
            </button>

            <label className="px-5 py-2.5 rounded-xl bg-white hover:bg-[#EFECE4] border border-[#E2DDD4] text-xs font-semibold text-[#161616] cursor-pointer shadow-xs flex items-center">
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
        <div className="w-full aspect-[16/10] sm:aspect-[16/9] rounded-xl bg-[#F6F3EC] border border-[#E2DDD4] p-6 flex flex-col items-center justify-center text-center space-y-3">
          <p className="text-base font-bold text-[#161616]">
            {language === 'en' ? 'Search Food or Enter Barcode' : 'खाद्य पदार्थ खोजें या बारकोड डालें'}
          </p>
          <p className="text-xs text-[#6E6A63] max-w-sm">
            {language === 'en' ? 'Type a product name (e.g. Maggi, Coke, Frooti) or barcode.' : 'उत्पाद का नाम या बारकोड नंबर दर्ज करें।'}
          </p>
          
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (manualCode.trim()) handleBarcodeScanned(manualCode);
            }}
            className="w-full max-w-sm flex gap-2 pt-1"
          >
            <input
              type="text"
              placeholder="e.g. Maggi, Coke, 8901058852318"
              value={manualCode}
              onChange={(e) => setManualCode(e.target.value)}
              className="flex-1 px-3.5 py-2.5 rounded-xl bg-white border border-[#E2DDD4] text-xs sm:text-sm text-[#161616] placeholder-[#969188] focus:outline-none focus:border-[#161616]"
            />
            <button
              type="submit"
              disabled={isScanning || !manualCode.trim()}
              className="px-4 py-2.5 rounded-xl bg-[#161616] hover:bg-black text-[#F6F3EC] font-bold text-xs flex items-center justify-center shadow-xs"
            >
              {isScanning ? <CircleNotch size={16} className="animate-spin" /> : <MagnifyingGlass size={16} />}
            </button>
          </form>

          {/* Quick shortcuts */}
          <div className="flex flex-wrap justify-center gap-2 pt-2 text-xs text-[#6E6A63]">
            <span>Quick:</span>
            <button type="button" onClick={() => handleBarcodeScanned('8901058852318')} className="underline hover:text-[#161616]">Maggi</button>
            <span>·</span>
            <button type="button" onClick={() => handleBarcodeScanned('5449000000996')} className="underline hover:text-[#161616]">Coca-Cola</button>
            <span>·</span>
            <button type="button" onClick={() => handleBarcodeScanned('8901725131234')} className="underline hover:text-[#161616]">Frooti</button>
            <span>·</span>
            <button type="button" onClick={() => handleBarcodeScanned('8901262010015')} className="underline hover:text-[#161616]">Amul Butter</button>
            <span>·</span>
            <button type="button" onClick={() => handleBarcodeScanned('8901719101038')} className="underline hover:text-[#161616]">Parle-G</button>
          </div>
        </div>
      )}

      {/* Status Notice */}
      {scanStatus && !friendlyError && !isScanning && (
        <div className="mt-3 p-2.5 rounded-lg bg-[#EFECE4] text-xs font-mono text-[#161616] flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#038141]" />
          <span>{scanStatus}</span>
        </div>
      )}

      {/* Friendly Error Banner */}
      {friendlyError && (
        <div className="mt-4 p-3 rounded-xl bg-[#FFFBEB] border border-[#FDE68A] text-xs text-[#92400E] flex items-start gap-2">
          <WarningCircle size={16} className="text-[#D97706] shrink-0 mt-0.5" />
          <span>{friendlyError}</span>
        </div>
      )}

      {/* Trust Strip */}
      <div className="mt-4 pt-3 border-t border-[#E2DDD4] flex items-center justify-between text-xs text-[#6E6A63]">
        <span className="flex items-center gap-1.5 font-mono text-[11px]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#038141]" />
          <span>{t.trustStrip}</span>
        </span>

        <button
          type="button"
          onClick={() => setAllowOnlineFallback(!allowOnlineFallback)}
          className="text-[11px] font-mono text-[#6E6A63] hover:text-[#161616] underline"
        >
          {allowOnlineFallback ? 'Online Fallback ON' : 'Wi-Fi Fallback OFF'}
        </button>
      </div>

    </div>
  );
}
