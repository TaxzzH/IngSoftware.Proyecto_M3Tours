import React, { useState } from 'react';
import { ArrowLeft, Mountain, Tag, CheckCircle, AlertCircle, User, Phone, MapPin, Clock, Users } from 'lucide-react';
import { BookingData } from '../App';
import { DISCOUNT_CODES } from '../data/tours';

interface Props {
  bookingData: BookingData;
  onUpdateBooking: (data: BookingData) => void;
  onPay: () => void;
  onBack: () => void;
}

function formatPrice(n: number) {
  return `$${n.toLocaleString('es-CL')}`;
}

function formatDate(d: string) {
  const date = new Date(d + 'T12:00:00');
  return date.toLocaleDateString('es-CL', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
}

export function BookingScreen({ bookingData, onUpdateBooking, onPay, onBack }: Props) {
  const [form, setForm] = useState({
    passengerName: bookingData.passengerName,
    passengerLastName: bookingData.passengerLastName,
    passengerRut: bookingData.passengerRut,
    passengerEmail: bookingData.passengerEmail,
    passengerPhone: bookingData.passengerPhone,
    emergencyName: bookingData.emergencyName,
    emergencyPhone: bookingData.emergencyPhone,
    specialNeeds: bookingData.specialNeeds,
  });
  const [discountInput, setDiscountInput] = useState(bookingData.discountCode);
  const [discountStatus, setDiscountStatus] = useState<'idle' | 'valid' | 'invalid'>(bookingData.discountCode ? 'valid' : 'idle');
  const [discountPercent, setDiscountPercent] = useState(bookingData.discountPercent);
  const [errors, setErrors] = useState<Partial<typeof form>>({});

  const discountAmount = Math.round(bookingData.subtotal * discountPercent / 100);
  const total = bookingData.subtotal - discountAmount;

  const applyDiscount = () => {
    const code = discountInput.trim().toUpperCase();
    if (DISCOUNT_CODES[code]) {
      setDiscountPercent(DISCOUNT_CODES[code]);
      setDiscountStatus('valid');
    } else {
      setDiscountPercent(0);
      setDiscountStatus('invalid');
    }
  };

  const setField = (key: keyof typeof form, value: string) => {
    setForm((f) => ({ ...f, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const validate = () => {
    const newErrors: Partial<typeof form> = {};
    if (!form.passengerName.trim()) newErrors.passengerName = 'Requerido';
    if (!form.passengerLastName.trim()) newErrors.passengerLastName = 'Requerido';
    if (!form.passengerRut.trim()) newErrors.passengerRut = 'Requerido';
    if (!form.passengerEmail.trim() || !form.passengerEmail.includes('@')) newErrors.passengerEmail = 'Email inválido';
    if (!form.passengerPhone.trim()) newErrors.passengerPhone = 'Requerido';
    if (!form.emergencyName.trim()) newErrors.emergencyName = 'Requerido';
    if (!form.emergencyPhone.trim()) newErrors.emergencyPhone = 'Requerido';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    onUpdateBooking({
      ...bookingData,
      ...form,
      discountCode: discountStatus === 'valid' ? discountInput.trim().toUpperCase() : '',
      discountPercent,
      discountAmount,
      total,
    });
    onPay();
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-border px-6 py-4 flex items-center justify-between">
        <button onClick={onBack} className="flex items-center gap-2 text-[#6b6558] hover:text-[#1a1a14] transition-colors text-sm">
          <ArrowLeft className="w-4 h-4" /> Detalle del tour
        </button>
        <div className="flex items-center gap-2">
          <Mountain className="w-4 h-4 text-[#1b5e3e]" />
          <span style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 700, color: '#1b5e3e', fontSize: '1rem', letterSpacing: '0.08em' }}>
            3MTOURS
          </span>
        </div>
      </nav>

      {/* Progress */}
      <div style={{ background: '#1b5e3e' }} className="px-6 py-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-4">
            {[
              { step: 1, label: 'Selección de tour', done: true },
              { step: 2, label: 'Datos del pasajero', done: false, active: true },
              { step: 3, label: 'Pago', done: false },
            ].map((s, i) => (
              <React.Fragment key={s.step}>
                <div className="flex items-center gap-2">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold ${s.active ? 'bg-white text-[#1b5e3e]' : s.done ? 'bg-[#4ade80] text-[#1b5e3e]' : 'bg-white/20 text-white/50'}`}>
                    {s.done ? '✓' : s.step}
                  </div>
                  <span className={`text-sm ${s.active ? 'text-white font-semibold' : s.done ? 'text-white/80' : 'text-white/40'}`}>{s.label}</span>
                </div>
                {i < 2 && <div className={`flex-1 h-px ${s.done ? 'bg-[#4ade80]' : 'bg-white/20'}`} />}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8 flex flex-col lg:flex-row gap-8">
        {/* Form */}
        <div className="flex-1 space-y-6">
          {/* Passenger data */}
          <FormSection
            icon={<User className="w-4 h-4" />}
            title="Datos del pasajero principal"
            description="Ingresa los datos del pasajero que realizará la reserva"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Nombre" error={errors.passengerName}>
                <input
                  value={form.passengerName}
                  onChange={(e) => setField('passengerName', e.target.value)}
                  placeholder="Ej: María"
                  className={inputClass(!!errors.passengerName)}
                />
              </Field>
              <Field label="Apellido" error={errors.passengerLastName}>
                <input
                  value={form.passengerLastName}
                  onChange={(e) => setField('passengerLastName', e.target.value)}
                  placeholder="Ej: González"
                  className={inputClass(!!errors.passengerLastName)}
                />
              </Field>
              <Field label="RUT" error={errors.passengerRut}>
                <input
                  value={form.passengerRut}
                  onChange={(e) => setField('passengerRut', e.target.value)}
                  placeholder="Ej: 12.345.678-9"
                  className={inputClass(!!errors.passengerRut)}
                />
              </Field>
              <Field label="Correo electrónico" error={errors.passengerEmail}>
                <input
                  type="email"
                  value={form.passengerEmail}
                  onChange={(e) => setField('passengerEmail', e.target.value)}
                  placeholder="tu@correo.cl"
                  className={inputClass(!!errors.passengerEmail)}
                />
              </Field>
              <Field label="Teléfono" error={errors.passengerPhone} className="md:col-span-2">
                <input
                  value={form.passengerPhone}
                  onChange={(e) => setField('passengerPhone', e.target.value)}
                  placeholder="+56 9 1234 5678"
                  className={inputClass(!!errors.passengerPhone)}
                />
              </Field>
            </div>
          </FormSection>

          {/* Emergency contact */}
          <FormSection
            icon={<Phone className="w-4 h-4" />}
            title="Contacto de emergencia"
            description="Esta persona será contactada en caso de emergencia durante el tour"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Nombre completo" error={errors.emergencyName}>
                <input
                  value={form.emergencyName}
                  onChange={(e) => setField('emergencyName', e.target.value)}
                  placeholder="Nombre del contacto"
                  className={inputClass(!!errors.emergencyName)}
                />
              </Field>
              <Field label="Teléfono" error={errors.emergencyPhone}>
                <input
                  value={form.emergencyPhone}
                  onChange={(e) => setField('emergencyPhone', e.target.value)}
                  placeholder="+56 9 1234 5678"
                  className={inputClass(!!errors.emergencyPhone)}
                />
              </Field>
            </div>
          </FormSection>

          {/* Special needs */}
          <FormSection
            icon={<MapPin className="w-4 h-4" />}
            title="Necesidades especiales"
            description="Alergias, condiciones médicas, requerimientos dietéticos u otras necesidades"
          >
            <textarea
              value={form.specialNeeds}
              onChange={(e) => setField('specialNeeds', e.target.value)}
              placeholder="Ej: soy celíaco, tengo alergia al mariscos, requiero silla de ruedas…"
              rows={3}
              className="w-full border border-border rounded-lg px-4 py-3 text-sm text-[#1a1a14] placeholder-[#c5c0b5] outline-none focus:ring-2 focus:ring-[#1b5e3e] transition-all resize-none bg-white"
            />
          </FormSection>

          {/* Discount code */}
          <FormSection
            icon={<Tag className="w-4 h-4" />}
            title="Código de descuento"
            description="Si tienes un código promocional, ingrésalo aquí"
          >
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <input
                  value={discountInput}
                  onChange={(e) => { setDiscountInput(e.target.value.toUpperCase()); setDiscountStatus('idle'); }}
                  placeholder="Ej: TOMAS15"
                  className={`w-full border rounded-lg px-4 py-3 text-sm outline-none transition-all ${discountStatus === 'valid' ? 'border-emerald-500 bg-emerald-50' : discountStatus === 'invalid' ? 'border-red-400 bg-red-50' : 'border-border bg-white focus:ring-2 focus:ring-[#1b5e3e]'}`}
                />
                {discountStatus === 'valid' && (
                  <CheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500" />
                )}
                {discountStatus === 'invalid' && (
                  <AlertCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-red-500" />
                )}
              </div>
              <button
                onClick={applyDiscount}
                className="px-5 py-3 rounded-lg text-sm font-semibold transition-all hover:opacity-90"
                style={{ background: '#1b5e3e', color: 'white' }}
              >
                Aplicar
              </button>
            </div>
            {discountStatus === 'valid' && (
              <p className="text-emerald-600 text-sm mt-1.5 flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5" /> Código válido — {discountPercent}% de descuento aplicado
              </p>
            )}
            {discountStatus === 'invalid' && (
              <p className="text-red-500 text-sm mt-1.5 flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5" /> Código inválido o expirado
              </p>
            )}
          </FormSection>
        </div>

        {/* Summary sidebar */}
        <div className="lg:w-72 shrink-0">
          <div className="sticky top-24 bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
            {/* Tour photo */}
            <div className="aspect-video bg-[#ece8df]">
              <img src={bookingData.tour.heroImage} alt={bookingData.tour.name} className="w-full h-full object-cover" />
            </div>

            <div className="p-5 space-y-4">
              <div>
                <p className="text-[#6b6558] text-xs mb-0.5">{bookingData.tour.region}</p>
                <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '1.05rem', color: '#1a1a14', fontWeight: 700 }}>
                  {bookingData.tour.name}
                </h3>
              </div>

              <div className="space-y-1.5 text-xs text-[#6b6558]">
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-[#1b5e3e]" />
                  <span>{formatDate(bookingData.date)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-3.5 h-3.5 text-[#1b5e3e]" />
                  <span>{bookingData.passengers} pasajero{bookingData.passengers > 1 ? 's' : ''} · tarifa {bookingData.rateType === 'individual' ? 'individual' : 'grupal'}</span>
                </div>
              </div>

              <div className="border-t border-border pt-4 space-y-2 text-sm">
                <div className="flex justify-between text-[#6b6558]">
                  <span>Subtotal</span>
                  <span>{formatPrice(bookingData.subtotal)}</span>
                </div>
                {discountStatus === 'valid' && discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-600">
                    <span>Descuento ({discountPercent}%)</span>
                    <span>−{formatPrice(discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-[#1a1a14] border-t border-border pt-2">
                  <span>Total</span>
                  <span style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '1.15rem', color: '#1b5e3e' }}>
                    {formatPrice(total)}
                  </span>
                </div>
              </div>

              <button
                onClick={handleSubmit}
                className="w-full py-3.5 rounded-xl text-white font-semibold transition-all hover:opacity-90 active:scale-[0.98]"
                style={{ background: '#1b5e3e', boxShadow: '0 4px 16px rgba(27,94,62,0.3)' }}
              >
                Ir a pagar →
              </button>

              <p className="text-xs text-center text-[#6b6558]">Pago 100% seguro con Webpay</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function inputClass(hasError: boolean) {
  return `w-full border rounded-lg px-4 py-3 text-sm text-[#1a1a14] placeholder-[#c5c0b5] outline-none transition-all bg-white ${hasError ? 'border-red-400 focus:ring-2 focus:ring-red-300' : 'border-border focus:ring-2 focus:ring-[#1b5e3e]'}`;
}

function FormSection({ icon, title, description, children }: { icon: React.ReactNode; title: string; description: string; children: React.ReactNode }) {
  return (
    <div className="bg-card rounded-xl border border-border p-5">
      <div className="flex items-center gap-2 mb-1 text-[#1b5e3e]">
        {icon}
        <h3 className="font-semibold text-[#1a1a14]">{title}</h3>
      </div>
      <p className="text-xs text-[#6b6558] mb-4">{description}</p>
      {children}
    </div>
  );
}

function Field({ label, error, children, className }: { label: string; error?: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={className}>
      <label className="block text-sm text-[#1a1a14] mb-1.5">
        {label} <span className="text-[#c8531a]">*</span>
      </label>
      {children}
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}
