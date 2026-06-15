import React, { useState } from 'react';
import { ArrowLeft, Lock, CreditCard, AlertCircle } from 'lucide-react';
import { BookingData } from '../App';

interface Props {
  bookingData: BookingData;
  onComplete: (success: boolean) => void;
  onBack: () => void;
}

function formatPrice(n: number) {
  return `$${n.toLocaleString('es-CL')}`;
}

function detectCardType(num: string): 'visa' | 'mastercard' | null {
  const clean = num.replace(/\s/g, '');
  if (clean.startsWith('4')) return 'visa';
  if (clean.startsWith('5')) return 'mastercard';
  return null;
}

function formatCardNumber(value: string) {
  return value.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();
}

function formatExpiry(value: string) {
  const clean = value.replace(/\D/g, '').slice(0, 4);
  if (clean.length >= 3) return `${clean.slice(0, 2)}/${clean.slice(2)}`;
  return clean;
}

export function PaymentScreen({ bookingData, onComplete, onBack }: Props) {
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [processing, setProcessing] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [flipCard, setFlipCard] = useState(false);

  const cardType = detectCardType(cardNumber);

  const validate = () => {
    const e: Record<string, string> = {};
    if (cardNumber.replace(/\s/g, '').length < 16) e.cardNumber = 'Número de tarjeta inválido';
    if (!cardName.trim()) e.cardName = 'Ingresa el nombre del titular';
    const [mm, yy] = expiry.split('/');
    if (!mm || !yy || parseInt(mm) > 12 || parseInt(mm) < 1) e.expiry = 'Fecha inválida';
    if (cvv.length < 3) e.cvv = 'CVV inválido';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handlePay = () => {
    if (!validate()) return;
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      const success = Math.random() < 0.8;
      onComplete(success);
    }, 2800);
  };

  return (
    <div className="min-h-screen bg-[#f5f1ea]">
      {/* Webpay header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <button onClick={onBack} disabled={processing} className="flex items-center gap-2 text-gray-500 hover:text-gray-800 transition-colors text-sm disabled:opacity-40">
          <ArrowLeft className="w-4 h-4" /> Volver
        </button>
        {/* Transbank branding */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-1.5">
            <div className="flex">
              <div className="w-5 h-5 rounded-full" style={{ background: '#e30613' }} />
              <div className="w-5 h-5 rounded-full -ml-2" style={{ background: '#f79e1b', opacity: 0.85 }} />
            </div>
            <span className="text-xs font-bold text-gray-600">Webpay Plus</span>
          </div>
          <div className="bg-[#003087] rounded px-3 py-1">
            <span className="text-white text-xs font-bold tracking-wider">TRANSBANK</span>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-gray-400">
          <Lock className="w-3.5 h-3.5 text-green-500" />
          <span>Conexión segura SSL</span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-10 flex flex-col lg:flex-row gap-8">
        {/* Card form */}
        <div className="flex-1">
          <h2
            style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '1.6rem', color: '#1a1a14', fontWeight: 700 }}
            className="mb-6"
          >
            Datos de pago
          </h2>

          {/* Visual card */}
          <div className="mb-8 flex justify-center">
            <div
              className="relative w-full max-w-sm h-48 rounded-2xl cursor-pointer transition-transform duration-300"
              onClick={() => setFlipCard(!flipCard)}
              style={{ perspective: '1000px' }}
            >
              <div
                className="absolute inset-0 rounded-2xl p-6 flex flex-col justify-between text-white transition-all duration-500"
                style={{
                  background: cardType === 'visa'
                    ? 'linear-gradient(135deg, #1a1f71 0%, #0055a4 100%)'
                    : cardType === 'mastercard'
                      ? 'linear-gradient(135deg, #1a1a1a 0%, #eb001b 100%)'
                      : 'linear-gradient(135deg, #1b5e3e 0%, #2d7a55 100%)',
                  boxShadow: '0 20px 60px rgba(0,0,0,0.25)',
                  backfaceVisibility: 'hidden',
                  opacity: flipCard ? 0 : 1,
                  transform: flipCard ? 'rotateY(180deg)' : 'rotateY(0deg)',
                }}
              >
                {/* Card brand */}
                <div className="flex justify-between items-start">
                  <div className="w-12 h-9 rounded" style={{ background: 'rgba(255,255,255,0.2)' }} />
                  {cardType === 'visa' && (
                    <span className="italic text-white font-bold tracking-wider text-xl">VISA</span>
                  )}
                  {cardType === 'mastercard' && (
                    <div className="flex">
                      <div className="w-8 h-8 rounded-full" style={{ background: '#eb001b' }} />
                      <div className="w-8 h-8 rounded-full -ml-4" style={{ background: '#f79e1b', opacity: 0.85 }} />
                    </div>
                  )}
                  {!cardType && (
                    <CreditCard className="w-8 h-8 text-white/50" />
                  )}
                </div>
                <div>
                  <p className="tracking-[0.3em] text-lg mb-3 font-mono">
                    {cardNumber || '•••• •••• •••• ••••'}
                  </p>
                  <div className="flex justify-between">
                    <div>
                      <p className="text-white/50 text-xs">TITULAR</p>
                      <p className="text-sm uppercase tracking-wider">{cardName || 'NOMBRE TITULAR'}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-white/50 text-xs">VENCE</p>
                      <p className="text-sm">{expiry || 'MM/AA'}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Back of card */}
              <div
                className="absolute inset-0 rounded-2xl text-white"
                style={{
                  background: 'linear-gradient(135deg, #1a1a14, #3a3a30)',
                  boxShadow: '0 20px 60px rgba(0,0,0,0.25)',
                  backfaceVisibility: 'hidden',
                  opacity: flipCard ? 1 : 0,
                  transform: flipCard ? 'rotateY(0deg)' : 'rotateY(-180deg)',
                }}
              >
                <div className="w-full h-12 mt-8" style={{ background: 'rgba(0,0,0,0.4)' }} />
                <div className="px-6 mt-4">
                  <div className="bg-white/10 rounded px-3 py-2 flex items-center justify-end gap-2">
                    <span className="text-white/50 text-xs">CVV</span>
                    <span className="font-mono text-white">{cvv || '•••'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
            {/* Card number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Número de tarjeta</label>
              <div className="relative">
                <input
                  value={cardNumber}
                  onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                  placeholder="1234 5678 9012 3456"
                  className={`w-full border rounded-lg px-4 py-3 pr-12 text-sm font-mono outline-none transition-all ${errors.cardNumber ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:ring-2 focus:ring-[#1b5e3e]'}`}
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  {cardType === 'visa' && <span className="italic text-[#1a1f71] font-bold text-sm">VISA</span>}
                  {cardType === 'mastercard' && (
                    <div className="flex">
                      <div className="w-5 h-5 rounded-full" style={{ background: '#eb001b' }} />
                      <div className="w-5 h-5 rounded-full -ml-2.5" style={{ background: '#f79e1b' }} />
                    </div>
                  )}
                  {!cardType && <CreditCard className="w-4 h-4 text-gray-300" />}
                </div>
              </div>
              {errors.cardNumber && <p className="text-red-500 text-xs mt-1">{errors.cardNumber}</p>}
            </div>

            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Nombre del titular</label>
              <input
                value={cardName}
                onChange={(e) => setCardName(e.target.value.toUpperCase())}
                placeholder="COMO APARECE EN LA TARJETA"
                className={`w-full border rounded-lg px-4 py-3 text-sm tracking-wider outline-none transition-all ${errors.cardName ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:ring-2 focus:ring-[#1b5e3e]'}`}
              />
              {errors.cardName && <p className="text-red-500 text-xs mt-1">{errors.cardName}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Expiry */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Fecha de vencimiento</label>
                <input
                  value={expiry}
                  onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                  placeholder="MM/AA"
                  className={`w-full border rounded-lg px-4 py-3 text-sm font-mono outline-none transition-all ${errors.expiry ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:ring-2 focus:ring-[#1b5e3e]'}`}
                />
                {errors.expiry && <p className="text-red-500 text-xs mt-1">{errors.expiry}</p>}
              </div>

              {/* CVV */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">CVV</label>
                <input
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                  onFocus={() => setFlipCard(true)}
                  onBlur={() => setFlipCard(false)}
                  placeholder="•••"
                  className={`w-full border rounded-lg px-4 py-3 text-sm font-mono outline-none transition-all ${errors.cvv ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:ring-2 focus:ring-[#1b5e3e]'}`}
                />
                {errors.cvv && <p className="text-red-500 text-xs mt-1">{errors.cvv}</p>}
              </div>
            </div>
          </div>
        </div>

        {/* Order summary */}
        <div className="lg:w-72 shrink-0">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden sticky top-8">
            <div style={{ background: '#1b5e3e' }} className="px-5 py-4">
              <p className="text-white/70 text-xs mb-1">Resumen de pago</p>
              <p
                className="text-white"
                style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '1.5rem', fontWeight: 700 }}
              >
                {formatPrice(bookingData.total)}
              </p>
            </div>

            <div className="p-5 space-y-3 text-sm">
              <div className="space-y-2 text-gray-600">
                <div className="flex justify-between">
                  <span>Tour</span>
                  <span className="text-right text-gray-800 max-w-[140px] text-right">{bookingData.tour.name}</span>
                </div>
                <div className="flex justify-between">
                  <span>Pasajeros</span>
                  <span>{bookingData.passengers}</span>
                </div>
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{formatPrice(bookingData.subtotal)}</span>
                </div>
                {bookingData.discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-600">
                    <span>Descuento</span>
                    <span>−{formatPrice(bookingData.discountAmount)}</span>
                  </div>
                )}
              </div>

              <div className="border-t border-gray-100 pt-3 flex justify-between font-bold text-gray-900">
                <span>Total a pagar</span>
                <span style={{ color: '#1b5e3e' }}>{formatPrice(bookingData.total)}</span>
              </div>

              <button
                onClick={handlePay}
                disabled={processing}
                className="w-full py-4 rounded-xl text-white font-bold transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-70 mt-2"
                style={{ background: processing ? '#2d7a55' : '#e30613', boxShadow: '0 4px 16px rgba(227,6,19,0.3)' }}
              >
                {processing ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Procesando pago…
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <Lock className="w-4 h-4" />
                    Pagar {formatPrice(bookingData.total)}
                  </span>
                )}
              </button>

              {/* Security info */}
              <div className="pt-3 border-t border-gray-100 space-y-2">
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <Lock className="w-3 h-3 text-green-500" />
                  <span>Encriptación SSL de 256 bits</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <AlertCircle className="w-3 h-3 text-blue-400" />
                  <span>Pago procesado por Transbank</span>
                </div>
              </div>

              {/* Card logos */}
              <div className="flex items-center gap-2 pt-1">
                <div className="border border-gray-200 rounded px-2 py-1">
                  <span className="italic text-[#1a1f71] font-bold text-xs">VISA</span>
                </div>
                <div className="border border-gray-200 rounded px-2 py-1 flex">
                  <div className="w-4 h-4 rounded-full" style={{ background: '#eb001b' }} />
                  <div className="w-4 h-4 rounded-full -ml-2" style={{ background: '#f79e1b' }} />
                </div>
                <div className="border border-gray-200 rounded px-2 py-1">
                  <span className="text-[10px] font-bold text-[#003087]">Transbank</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
