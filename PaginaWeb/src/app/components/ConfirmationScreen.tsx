import React from 'react';
import { CheckCircle, XCircle, Download, Printer, Mountain, MapPin, Calendar, Users, Tag, Home, RefreshCw } from 'lucide-react';
import { BookingData } from '../App';

interface Props {
  bookingData: BookingData;
  paymentSuccess: boolean;
  onHome: () => void;
  onRetry: () => void;
}

function formatPrice(n: number) {
  return `$${n.toLocaleString('es-CL')}`;
}

function formatDate(d: string) {
  const date = new Date(d + 'T12:00:00');
  return date.toLocaleDateString('es-CL', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
}

function QRCode({ value }: { value: string }) {
  // Decorative QR placeholder
  const cells = Array.from({ length: 25 }, (_, i) => {
    const row = Math.floor(i / 5);
    const col = i % 5;
    const corner = (row < 2 && col < 2) || (row < 2 && col > 2) || (row > 2 && col < 2);
    const filled = corner || (value.charCodeAt(i % value.length) + i) % 3 !== 0;
    return filled;
  });

  return (
    <div className="inline-grid gap-0.5 p-3 bg-white rounded-xl border border-gray-100" style={{ gridTemplateColumns: 'repeat(7, 1fr)' }}>
      {Array.from({ length: 49 }, (_, i) => {
        const row = Math.floor(i / 7);
        const col = i % 7;
        const topLeft = row < 3 && col < 3;
        const topRight = row < 3 && col > 3;
        const bottomLeft = row > 3 && col < 3;
        const corner = topLeft || topRight || bottomLeft;
        const filled = corner || (value.charCodeAt(i % value.length) + i * 7) % 3 === 0;
        return (
          <div
            key={i}
            className="w-4 h-4 rounded-sm"
            style={{ background: filled ? '#1b5e3e' : 'transparent' }}
          />
        );
      })}
    </div>
  );
}

export function ConfirmationScreen({ bookingData, paymentSuccess, onHome, onRetry }: Props) {
  if (!paymentSuccess) {
    return (
      <div className="min-h-screen bg-[#f5f1ea] flex items-center justify-center px-6">
        <div className="max-w-md w-full text-center">
          <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-6">
            <XCircle className="w-10 h-10 text-red-500" />
          </div>
          <h1
            style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '2rem', color: '#1a1a14', fontWeight: 700 }}
            className="mb-3"
          >
            Pago rechazado
          </h1>
          <p className="text-[#6b6558] mb-2">Tu pago no pudo ser procesado.</p>
          <p className="text-[#6b6558] text-sm mb-8">
            Verifica que los datos de tu tarjeta sean correctos e intenta nuevamente, o contacta a tu banco.
          </p>
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-8 text-left">
            <p className="text-sm text-red-700 font-medium mb-1">Código de error: TBK-7006</p>
            <p className="text-xs text-red-500">Transacción rechazada por el emisor de la tarjeta</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={onRetry}
              className="flex-1 py-3 rounded-xl text-white font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-all"
              style={{ background: '#1b5e3e' }}
            >
              <RefreshCw className="w-4 h-4" /> Intentar nuevamente
            </button>
            <button
              onClick={onHome}
              className="px-6 py-3 rounded-xl border border-border text-[#1a1a14] font-medium hover:bg-muted transition-all"
            >
              Inicio
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f1ea]">
      {/* Success header */}
      <div style={{ background: '#1b5e3e' }} className="py-12 px-6 text-center">
        <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-10 h-10 text-white" />
        </div>
        <h1
          style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 'clamp(1.8rem,4vw,2.5rem)', color: 'white', fontWeight: 700 }}
          className="mb-2"
        >
          ¡Reserva Confirmada!
        </h1>
        <p className="text-white/80">Tu aventura en la Patagonia está asegurada</p>
        <div className="mt-4 inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5">
          <span className="text-white text-sm">N° de reserva:</span>
          <span className="text-white font-bold tracking-wider">{bookingData.bookingNumber}</span>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-10">
        {/* Voucher */}
        <div id="voucher" className="bg-white rounded-2xl overflow-hidden shadow-xl border border-gray-100 mb-6">
          {/* Voucher header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-dashed border-gray-200">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#1b5e3e] flex items-center justify-center">
                <Mountain className="w-4 h-4 text-white" />
              </div>
              <span style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 700, color: '#1b5e3e', fontSize: '1.1rem', letterSpacing: '0.08em' }}>
                3MTOURS
              </span>
            </div>
            <div className="text-right">
              <p className="text-xs text-[#6b6558]">Voucher digital</p>
              <p className="text-xs font-bold text-[#1b5e3e]">{bookingData.bookingNumber}</p>
            </div>
          </div>

          {/* Tour image + name */}
          <div className="relative">
            <div className="aspect-[21/6] bg-[#ece8df] overflow-hidden">
              <img
                src={bookingData.tour.heroImage}
                alt={bookingData.tour.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent" />
            </div>
            <div className="absolute inset-0 flex items-center px-6">
              <div>
                <p className="text-white/70 text-sm">{bookingData.tour.region}</p>
                <h2
                  className="text-white"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '1.8rem', fontWeight: 700, textShadow: '0 2px 8px rgba(0,0,0,0.4)' }}
                >
                  {bookingData.tour.name}
                </h2>
              </div>
            </div>
          </div>

          {/* Details grid + QR */}
          <div className="p-6 flex gap-6">
            <div className="flex-1 grid grid-cols-2 gap-4">
              <VoucherDetail
                icon={<Calendar className="w-4 h-4 text-[#1b5e3e]" />}
                label="Fecha del tour"
                value={formatDate(bookingData.date)}
              />
              <VoucherDetail
                icon={<Users className="w-4 h-4 text-[#1b5e3e]" />}
                label="Pasajeros"
                value={`${bookingData.passengers} persona${bookingData.passengers > 1 ? 's' : ''}`}
              />
              <VoucherDetail
                icon={<MapPin className="w-4 h-4 text-[#1b5e3e]" />}
                label="Punto de encuentro"
                value={bookingData.tour.meetingPoint}
              />
              <VoucherDetail
                icon={<Tag className="w-4 h-4 text-[#1b5e3e]" />}
                label="Tarifa"
                value={`${bookingData.rateType === 'individual' ? 'Individual' : 'Grupal'} · ${formatPrice(bookingData.rateType === 'individual' ? bookingData.tour.price : bookingData.tour.groupPrice)}/pax`}
              />
            </div>

            {/* QR */}
            <div className="shrink-0 flex flex-col items-center gap-2">
              <QRCode value={bookingData.bookingNumber} />
              <p className="text-xs text-[#6b6558] text-center">Muestra este QR<br />al guía en el tour</p>
            </div>
          </div>

          {/* Passenger */}
          <div className="px-6 pb-4 border-t border-dashed border-gray-100 pt-4">
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-xs text-[#6b6558] mb-0.5">Pasajero principal</p>
                <p className="text-[#1a1a14] font-medium">{bookingData.passengerName} {bookingData.passengerLastName}</p>
              </div>
              <div>
                <p className="text-xs text-[#6b6558] mb-0.5">RUT</p>
                <p className="text-[#1a1a14]">{bookingData.passengerRut}</p>
              </div>
              <div>
                <p className="text-xs text-[#6b6558] mb-0.5">Correo</p>
                <p className="text-[#1a1a14]">{bookingData.passengerEmail}</p>
              </div>
            </div>
          </div>

          {/* Payment summary */}
          <div className="bg-[#f5f1ea] px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4 text-sm text-[#6b6558]">
              {bookingData.discountCode && (
                <span className="flex items-center gap-1.5 bg-emerald-100 text-emerald-700 px-2.5 py-1 rounded-full text-xs font-medium">
                  <Tag className="w-3 h-3" /> {bookingData.discountCode} −{bookingData.discountPercent}%
                </span>
              )}
              <span>Pago con Webpay Plus</span>
            </div>
            <div className="text-right">
              <p className="text-xs text-[#6b6558]">Total pagado</p>
              <p style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '1.4rem', fontWeight: 700, color: '#1b5e3e' }}>
                {formatPrice(bookingData.total)}
              </p>
            </div>
          </div>

          {/* SERNATUR badge */}
          <div className="px-6 py-3 border-t border-gray-100 flex items-center justify-between text-xs text-[#6b6558]">
            <span>Guía certificado SERNATUR · Región de Los Lagos, Chile</span>
            <div className="flex items-center gap-2">
              <div className="border border-gray-200 rounded px-2 py-0.5">
                <span className="italic font-bold text-[#1a1f71] text-[10px]">VISA</span>
              </div>
              <div className="border border-gray-200 rounded px-2 py-0.5 flex">
                <div className="w-3 h-3 rounded-full" style={{ background: '#eb001b' }} />
                <div className="w-3 h-3 rounded-full -ml-1.5" style={{ background: '#f79e1b' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => window.print()}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-border text-[#1a1a14] font-medium hover:bg-card transition-all"
          >
            <Printer className="w-4 h-4" /> Imprimir voucher
          </button>
          <button
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-[#1b5e3e] text-[#1b5e3e] font-medium hover:bg-[#edf4ef] transition-all"
          >
            <Download className="w-4 h-4" /> Descargar PDF
          </button>
          <button
            onClick={onHome}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-white font-semibold hover:opacity-90 transition-all"
            style={{ background: '#1b5e3e' }}
          >
            <Home className="w-4 h-4" /> Volver al inicio
          </button>
        </div>

        {/* Info footer */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-700">
          <p className="font-semibold mb-1">📧 Voucher enviado a tu correo</p>
          <p className="text-blue-600 text-xs">
            Recibirás una confirmación en <strong>{bookingData.passengerEmail}</strong> con todos los detalles del tour,
            instrucciones de llegada y el contacto de tu guía SERNATUR asignado.
          </p>
        </div>
      </div>
    </div>
  );
}

function VoucherDetail({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div>
      <div className="flex items-center gap-1.5 text-xs text-[#6b6558] mb-1">
        {icon} {label}
      </div>
      <p className="text-sm text-[#1a1a14] font-medium leading-snug">{value}</p>
    </div>
  );
}
