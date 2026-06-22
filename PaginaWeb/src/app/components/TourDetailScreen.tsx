import React, { useState } from 'react';
import { ArrowLeft, Star, MapPin, Clock, Users, CheckCircle, XCircle, Mountain, Calendar, ChevronDown, Home } from 'lucide-react';
import { Tour } from '../data/tours';
import { BookingData } from '../App';

interface Props {
  tour: Tour;
  onBook: (data: BookingData) => void;
  onBack: () => void;
  onHome: () => void;
}

function formatPrice(n: number) {
  return `$${n.toLocaleString('es-CL')}`;
}

function formatDate(d: string) {
  const date = new Date(d + 'T12:00:00');
  return date.toLocaleDateString('es-CL', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
}

export function TourDetailScreen({ tour, onBook, onBack, onHome }: Props) {
  const [activePhoto, setActivePhoto] = useState(0);
  const [activeTab, setActiveTab] = useState<'descripcion' | 'destacados' | 'incluye'>('descripcion');
  const [selectedDate, setSelectedDate] = useState(tour.availableDates[0]?.date ?? '');
  const [rateType, setRateType] = useState<'individual' | 'group'>('individual');
  const [passengers, setPassengers] = useState(1);

  const pricePerPax = rateType === 'individual' ? tour.price : tour.groupPrice;
  const subtotal = pricePerPax * passengers;
  const selectedDateInfo = tour.availableDates.find((d) => d.date === selectedDate);

  const handleBook = () => {
    const bookingNumber = `3MT-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}-${Math.floor(1000 + Math.random() * 9000)}`;
    onBook({
      tour,
      date: selectedDate,
      passengers,
      rateType,
      subtotal,
      discountCode: '',
      discountPercent: 0,
      discountAmount: 0,
      total: subtotal,
      passengerName: '',
      passengerLastName: '',
      passengerRut: '',
      passengerEmail: '',
      passengerPhone: '',
      emergencyName: '',
      emergencyPhone: '',
      specialNeeds: '',
      bookingNumber,
    });
  };

  const difficultyColor = {
    'Fácil': 'bg-emerald-100 text-emerald-800',
    'Moderado': 'bg-amber-100 text-amber-800',
    'Difícil': 'bg-red-100 text-red-800',
  }[tour.difficulty];

  return (
    <div className="min-h-screen bg-background">
      {/* Top nav */}
      <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-border px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="flex items-center gap-2 text-[#6b6558] hover:text-[#1a1a14] transition-colors text-sm">
            <ArrowLeft className="w-4 h-4" /> Tours
          </button>
          <div className="w-px h-4 bg-border" />
          <button onClick={onHome} className="flex items-center gap-2 text-[#6b6558] hover:text-[#1a1a14] transition-colors text-sm">
            <Home className="w-4 h-4" /> Inicio
          </button>
        </div>
        <div className="flex items-center gap-2">
          <Mountain className="w-4 h-4 text-[#1b5e3e]" />
          <span style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 700, color: '#1b5e3e', fontSize: '1rem', letterSpacing: '0.08em' }}>
            3MTOURS
          </span>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex gap-10">
          {/* Left: Tour content */}
          <div className="flex-1 min-w-0">
            {/* Gallery */}
            <div className="mb-6">
              <div className="rounded-2xl overflow-hidden aspect-video bg-[#ece8df] mb-3">
                <img
                  src={tour.gallery[activePhoto]}
                  alt={tour.name}
                  className="w-full h-full object-cover transition-opacity duration-300"
                />
              </div>
              <div className="flex gap-3">
                {tour.gallery.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActivePhoto(i)}
                    className={`rounded-lg overflow-hidden flex-1 aspect-video bg-[#ece8df] transition-all ${i === activePhoto ? 'ring-2 ring-[#1b5e3e] opacity-100' : 'opacity-60 hover:opacity-80'}`}
                  >
                    <img src={img} alt={`${tour.name} ${i + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Tour header */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${difficultyColor}`}>{tour.difficulty}</span>
                <span className="text-xs px-2.5 py-1 rounded-full bg-[#edf4ef] text-[#1b5e3e] font-medium">{tour.category}</span>
              </div>
              <h1
                style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 'clamp(1.8rem,4vw,2.5rem)', color: '#1a1a14', fontWeight: 700, lineHeight: 1.2 }}
                className="mb-3"
              >
                {tour.name}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-sm text-[#6b6558]">
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-[#1b5e3e]" /> {tour.region}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-[#1b5e3e]" /> {tour.duration}
                </span>
                <span className="flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-[#1b5e3e]" /> Máx. {tour.maxGroup} personas
                </span>
                <span className="flex items-center gap-1.5">
                  <Star className="w-4 h-4 fill-[#c8531a] text-[#c8531a]" />
                  <strong className="text-[#1a1a14]">{tour.rating}</strong>
                  <span>({tour.reviews} reseñas)</span>
                </span>
              </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-border mb-6">
              <div className="flex gap-0">
                {(['descripcion', 'destacados', 'incluye'] as const).map((tab) => {
                  const labels = { descripcion: 'Descripción', destacados: 'Puntos destacados', incluye: 'Incluye / No incluye' };
                  return (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-5 py-3 text-sm border-b-2 transition-all ${activeTab === tab ? 'border-[#1b5e3e] text-[#1b5e3e] font-semibold' : 'border-transparent text-[#6b6558] hover:text-[#1a1a14]'}`}
                    >
                      {labels[tab]}
                    </button>
                  );
                })}
              </div>
            </div>

            {activeTab === 'descripcion' && (
              <div>
                <p className="text-[#1a1a14] leading-relaxed text-[0.95rem]">{tour.description}</p>
                <div className="mt-6 p-4 rounded-xl bg-[#edf4ef] border border-[#1b5e3e]/20">
                  <p className="text-sm text-[#1b5e3e] font-semibold mb-1">📍 Punto de encuentro</p>
                  <p className="text-sm text-[#1a1a14]">{tour.meetingPoint}</p>
                </div>
              </div>
            )}

            {activeTab === 'destacados' && (
              <ul className="space-y-3">
                {tour.highlights.map((h, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-[#1b5e3e] flex items-center justify-center shrink-0 mt-0.5">
                      <span className="text-white text-xs font-bold">{i + 1}</span>
                    </div>
                    <span className="text-[#1a1a14] text-sm leading-relaxed">{h}</span>
                  </li>
                ))}
              </ul>
            )}

            {activeTab === 'incluye' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-[#1b5e3e] font-semibold mb-3 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" /> Incluye
                  </h4>
                  <ul className="space-y-2">
                    {tour.includes.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-[#1a1a14]">
                        <CheckCircle className="w-4 h-4 text-[#1b5e3e] shrink-0 mt-0.5" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-[#c8531a] font-semibold mb-3 flex items-center gap-2">
                    <XCircle className="w-4 h-4" /> No incluye
                  </h4>
                  <ul className="space-y-2">
                    {tour.excludes.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-[#6b6558]">
                        <XCircle className="w-4 h-4 text-[#c8531a]/60 shrink-0 mt-0.5" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>

          {/* Right: Sticky booking panel */}
          <div className="w-80 shrink-0 hidden lg:block">
            <div className="sticky top-24 bg-card rounded-2xl border border-border shadow-xl overflow-hidden">
              {/* Price header */}
              <div style={{ background: '#1b5e3e' }} className="p-5">
                <p className="text-white/70 text-xs mb-1">Precio por persona</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-white" style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '2rem', fontWeight: 700 }}>
                    {formatPrice(pricePerPax)}
                  </span>
                  {rateType === 'group' && (
                    <span className="text-white/50 line-through text-sm">{formatPrice(tour.price)}</span>
                  )}
                </div>
                {rateType === 'group' && (
                  <div className="inline-flex items-center gap-1 bg-[#c8531a] text-white text-xs px-2 py-0.5 rounded-full mt-1">
                    Precio grupo — ahorra {Math.round((1 - tour.groupPrice / tour.price) * 100)}%
                  </div>
                )}
              </div>

              <div className="p-5 space-y-4">
                {/* Rate type */}
                <div>
                  <label className="text-xs text-[#6b6558] uppercase tracking-wider block mb-2">Tipo de tarifa</label>
                  <div className="flex rounded-lg border border-border overflow-hidden">
                    <button
                      onClick={() => setRateType('individual')}
                      className={`flex-1 py-2 text-sm transition-all ${rateType === 'individual' ? 'bg-[#1b5e3e] text-white' : 'text-[#6b6558] hover:bg-muted'}`}
                    >
                      Individual
                    </button>
                    <button
                      onClick={() => setRateType('group')}
                      className={`flex-1 py-2 text-sm transition-all ${rateType === 'group' ? 'bg-[#1b5e3e] text-white' : 'text-[#6b6558] hover:bg-muted'}`}
                    >
                      Grupo (≥4)
                    </button>
                  </div>
                </div>

                {/* Date */}
                <div>
                  <label className="text-xs text-[#6b6558] uppercase tracking-wider block mb-2">
                    <Calendar className="w-3 h-3 inline mr-1" />Fecha disponible
                  </label>
                  <div className="relative">
                    <select
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="w-full border border-border rounded-lg px-3 py-2.5 text-sm text-[#1a1a14] appearance-none cursor-pointer outline-none focus:ring-2 focus:ring-[#1b5e3e] bg-white"
                    >
                      {tour.availableDates.map((d) => (
                        <option key={d.date} value={d.date}>
                          {formatDate(d.date)} — {d.spots} cupos
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6b6558] pointer-events-none" />
                  </div>
                  {selectedDateInfo && (
                    <p className={`text-xs mt-1 ${selectedDateInfo.spots <= 4 ? 'text-[#c8531a] font-semibold' : 'text-[#6b6558]'}`}>
                      {selectedDateInfo.spots <= 4 ? `⚠ Solo quedan ${selectedDateInfo.spots} cupos` : `✓ ${selectedDateInfo.spots} cupos disponibles`}
                    </p>
                  )}
                </div>

                {/* Passengers */}
                <div>
                  <label className="text-xs text-[#6b6558] uppercase tracking-wider block mb-2">Número de pasajeros</label>
                  <div className="flex items-center gap-4 border border-border rounded-lg px-4 py-2.5">
                    <button
                      onClick={() => setPassengers(Math.max(rateType === 'group' ? 4 : 1, passengers - 1))}
                      className="w-7 h-7 rounded-full border border-[#1b5e3e] text-[#1b5e3e] flex items-center justify-center hover:bg-[#1b5e3e] hover:text-white transition-all"
                    >−</button>
                    <span className="flex-1 text-center text-[#1a1a14] font-semibold">{passengers}</span>
                    <button
                      onClick={() => setPassengers(Math.min(selectedDateInfo?.spots ?? tour.maxGroup, passengers + 1))}
                      className="w-7 h-7 rounded-full border border-[#1b5e3e] text-[#1b5e3e] flex items-center justify-center hover:bg-[#1b5e3e] hover:text-white transition-all"
                    >+</button>
                  </div>
                  {rateType === 'group' && passengers < 4 && (
                    <p className="text-xs text-[#c8531a] mt-1">La tarifa grupal requiere mínimo 4 pasajeros</p>
                  )}
                </div>

                {/* Total */}
                <div className="bg-[#f5f1ea] rounded-xl p-4 space-y-2">
                  <div className="flex justify-between text-sm text-[#6b6558]">
                    <span>{formatPrice(pricePerPax)} × {passengers} pax</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-[#6b6558]">
                    <span>IVA incluido</span>
                    <span className="text-[#1b5e3e]">✓</span>
                  </div>
                  <div className="border-t border-border pt-2 flex justify-between font-bold text-[#1a1a14]">
                    <span>Total</span>
                    <span style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '1.2rem', color: '#1b5e3e' }}>
                      {formatPrice(subtotal)}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleBook}
                  disabled={!selectedDate || (rateType === 'group' && passengers < 4)}
                  className="w-full py-3.5 rounded-xl text-white font-semibold transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ background: '#1b5e3e', boxShadow: '0 4px 16px rgba(27,94,62,0.3)' }}
                >
                  Reservar Ahora
                </button>

                <p className="text-xs text-center text-[#6b6558]">
                  Cancelación gratuita hasta 48 hrs antes
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile booking button */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-border p-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-[#6b6558]">Desde</p>
            <p className="font-bold text-[#1b5e3e]" style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '1.3rem' }}>
              {formatPrice(tour.price)} <span className="text-xs text-[#6b6558] font-normal">/pax</span>
            </p>
          </div>
          <button
            onClick={handleBook}
            className="px-6 py-3 rounded-xl text-white font-semibold"
            style={{ background: '#1b5e3e' }}
          >
            Reservar ahora
          </button>
        </div>
      </div>
    </div>
  );
}
