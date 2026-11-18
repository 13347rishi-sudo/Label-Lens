import { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { QrCode, Scan, Copy, Check } from '@phosphor-icons/react';
import type { ProductItem } from '../lib/types';
import { playBarcodeBeep, playSuccessChime } from '../lib/sound';

interface QrCodeInspectorProps {
  product: ProductItem;
  onScanQr: (qrText: string) => void;
}

export function QrCodeInspector({ product, onScanQr }: QrCodeInspectorProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [copied, setCopied] = useState(false);
  const [qrType, setQrType] = useState<'gs1' | 'json'>('gs1');

  const qrValue = qrType === 'gs1' 
    ? (product.qr_code_url || `https://id.gs1.org/01/${product.barcode.padStart(14, '0')}`)
    : (product.qr_payload || JSON.stringify({ gtin: product.barcode, name: product.product_name, brand: product.brand }));

  useEffect(() => {
    if (canvasRef.current && qrValue) {
      QRCode.toCanvas(canvasRef.current, qrValue, {
        width: 140,
        margin: 1,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      }).catch(() => {});
    }
  }, [qrValue]);

  const handleCopy = () => {
    navigator.clipboard.writeText(qrValue);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleSimulateScan = () => {
    playBarcodeBeep();
    setTimeout(() => {
      playSuccessChime();
      onScanQr(qrValue);
    }, 100);
  };

  return (
    <div className="w-full rounded-3xl apple-glass p-6 md:p-8 space-y-6">
      
      {/* Header & Type Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <QrCode size={18} className="text-zinc-400" />
            <h3 className="text-base font-semibold text-white">
              2D Packaging QR & GS1 Digital Link
            </h3>
          </div>
          <p className="text-xs text-zinc-400 mt-0.5">
            Decodes 2D barcode standards being adopted globally for packaging transparency
          </p>
        </div>

        {/* Apple Segmented Switch */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-white/[0.04] border border-white/[0.06]">
          <button
            onClick={() => setQrType('gs1')}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
              qrType === 'gs1'
                ? 'bg-white text-black shadow-sm font-semibold'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            GS1 Digital Link
          </button>
          <button
            onClick={() => setQrType('json')}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
              qrType === 'json'
                ? 'bg-white text-black shadow-sm font-semibold'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            JSON SmartLabel
          </button>
        </div>
      </div>

      {/* Main Interactive Display */}
      <div className="flex flex-col sm:flex-row items-center gap-6 p-5 rounded-2xl bg-white/[0.025] border border-white/[0.06]">
        
        {/* Rendered QR Canvas */}
        <div className="p-3 bg-white rounded-2xl shadow-md shrink-0">
          <canvas ref={canvasRef} className="block" />
        </div>

        {/* Metadata & Actions */}
        <div className="flex-1 space-y-3 text-left w-full">
          <div>
            <div className="text-xs text-zinc-400">Current Payload for {product.product_name}:</div>
            <div className="p-2.5 rounded-xl bg-black/40 border border-white/[0.08] font-mono text-xs text-zinc-300 break-all select-all mt-1">
              {qrValue}
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={handleSimulateScan}
              className="px-4 py-2 rounded-xl bg-white text-black font-semibold text-xs flex items-center gap-1.5 shadow-sm hover:bg-zinc-200 transition-all active:scale-95"
            >
              <Scan size={14} />
              <span>Simulate QR Scan</span>
            </button>

            <button
              onClick={handleCopy}
              className="px-3 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-xs text-zinc-300 flex items-center gap-1.5 border border-white/[0.08] transition-all active:scale-95"
            >
              {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}