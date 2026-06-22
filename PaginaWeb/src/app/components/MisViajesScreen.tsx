import React, { useState, useMemo } from 'react';
import {
  ArrowLeft, Mountain, Calendar, Users, DollarSign,
  MapPin, ChevronRight, Filter, Clock, CheckCircle,
  AlertCircle, XCircle, Star, Eye,
} from 'lucide-react';
import { AppUser, USER_MOCK_BOOKINGS, UserBooking } from '../data/auth';

interface Props {
  currentUser: AppUser;
  onBack: () => void;
}

type StatusFilter = 'Todos' | 'Confirmado' | 'Pendiente' | 'Finalizado' | 'Cancelado';

function fmt(n: number) { return `$${n.toLocaleString('es-CL')}`; }
function fmtDate(d: string) {
  return new Date(d + 'T12:00:00').toLocaleDateString('es-CL', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
}

const STATUS_CONFIG: Record<string, { color: string; bg: string; icon: React.ReactNode; label: string }> = {
  Confirmado: { color: '#1b5e3e', bg: '#edf4ef', icon: <CheckCircle className="w-3.5 h-3.5" />, label: 'Confirmado' },
  Pendiente:  { color: '#a16207', bg: '#fef9c3', icon: <Clock className="w-3.5 h-3.5" />,        label: 'Pendiente' },
  Finalizado: { color: '#374151', bg: '#f3f4f6', icon: <Star className="w-3.5 h-3.5" />,          label: 'Finalizado' },
  Cancelado:  { color: '#b91c1c', bg: '#fee2e2', icon: <XCircle className="w-3.5 h-3.5" />,       label: 'Cancelado' },
};

const STATUS_ORDER: StatusFilter[] = ['Todos', 'Confirmado', 'Pendiente', 'Finalizado', 'Cancelado'];

export function MisViajesScreen({ currentUser, onBack }: Props) {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('Todos');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [selectedBooking, setSelectedBooking] = useState<UserBooking | null>(null);

  const bookings = USER_MOCK_BOOKINGS;

  const filtered = useMemo(() => {
    return bookings.filter((b) => {
      const matchStatus = statusFilter === 'Todos' || b.status === statusFilter;
      const matchFrom = !dateFrom || b.travelDate >= dateFrom;
      const matchTo = !dateTo || b.travelDate <= dateTo;
      return matchStatus && matchFrom && matchTo;
    });
  }, [statusFilter, dateFrom, dateTo]);

  const totalSpent = bookings
    .filter((b) => b.status !== 'Cancelado')
    .reduce((s, b) => s + b.amount, 0);

  const confirmedCount = bookings.filter((b) => b.status === 'Confirmado').length;
  const completedCount = bookings.filter((b) => b.status === 'Finalizado').length;

  return (
    <div className="min-h-screen bg-[#f5f1ea]">
      {/* Header */}
      <div style={{ background: '#1b5e3e' }} className="px-6 pt-6 pb-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-5">
            <button onClick={onBack} className="flex items-center gap-2 text-white/70 hover:text-white transition-colors text-sm">
              <ArrowLeft className="w-4 h-4" /> Inicio
            </button>
            <div className="w-px h-4 bg-white/20" />
            <div className="flex items-center gap-2">
              <Mountain className="w-4 h-4 text-white/70" />
              <span style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 700, color: 'white', fontSize: '1rem', letterSpacing: '0.08em' }}>
                3MTOURS
              </span>
            </div>
          </div>

          {/* User + title */}
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-lg">
              {currentUser.name.charAt(0)}
            </div>
            <div>
              <p className="text-white/70 text-sm">Mi perfil</p>
              <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '1.6rem', color: 'white', fontWeight: 700 }}>
                Mis Viajes
              </h1>
            </div>
          </div>

          {/* Quick stats */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Total reservas', value: String(bookings.length), sub: 'historial completo' },
              { label: 'Próximos viajes', value: String(confirmedCount), sub: 'confirmados' },
              { label: 'Total gastado', value: fmt(totalSpent), sub: 'en tours', small: true },
            ].map((s) => (
              <div key={s.label} className="bg-white/10 rounded-xl p-3 text-center">
                <p className={`text-white font-bold ${s.small ? 'text-sm' : 'text-xl'} leading-tight`}>{s.value}</p>
                <p className="text-white/60 text-xs mt-0.5">{s.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-6">
        {/* Filters */}
        <div className="bg-white rounded-2xl border border-border shadow-sm p-4 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Filter className="w-4 h-4 text-[#1b5e3e]" />
            <span className="text-sm font-semibold text-[#1a1a14]">Filtros</span>
          </div>

          {/* Status tabs */}
          <div className="flex gap-2 flex-wrap mb-4">
            {STATUS_ORDER.map((s) => {
              const count = s === 'Todos' ? bookings.length : bookings.filter((b) => b.status === s).length;
              return (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg font-medium transition-all ${statusFilter === s ? 'bg-[#1b5e3e] text-white' : 'bg-[#f5f1ea] text-[#6b6558] hover:bg-[#ece8df]'}`}
                >
                  {s !== 'Todos' && STATUS_CONFIG[s]?.icon}
                  {s}
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${statusFilter === s ? 'bg-white/20' : 'bg-white text-[#6b6558]'}`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Date range */}
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <label className="text-xs text-[#6b6558] mb-1 block">Fecha viaje desde</label>
              <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)}
                className="w-full border border-border rounded-lg px-3 py-2 text-sm text-[#1a1a14] bg-white outline-none focus:ring-2 focus:ring-[#1b5e3e]" />
            </div>
            <div className="flex-1">
              <label className="text-xs text-[#6b6558] mb-1 block">Hasta</label>
              <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)}
                className="w-full border border-border rounded-lg px-3 py-2 text-sm text-[#1a1a14] bg-white outline-none focus:ring-2 focus:ring-[#1b5e3e]" />
            </div>
            {(dateFrom || dateTo || statusFilter !== 'Todos') && (
              <button
                onClick={() => { setDateFrom(''); setDateTo(''); setStatusFilter('Todos'); }}
                className="mt-5 text-xs text-[#c8531a] hover:underline whitespace-nowrap"
              >
                Limpiar
              </button>
            )}
          </div>
        </div>

        {/* Results count */}
        <p className="text-sm text-[#6b6558] mb-4">
          {filtered.length} reserva{filtered.length !== 1 ? 's' : ''} encontrada{filtered.length !== 1 ? 's' : ''}
        </p>

        {/* Booking cards */}
        {filtered.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-border">
            <AlertCircle className="w-10 h-10 text-[#c5c0b5] mx-auto mb-3" />
            <p className="text-[#6b6558] mb-1">No se encontraron reservas</p>
            <p className="text-xs text-[#c5c0b5]">Prueba ajustando los filtros</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((b) => (
              <BookingCard key={b.id} booking={b} onDetail={() => setSelectedBooking(b)} />
            ))}
          </div>
        )}
      </div>

      {/* Detail modal */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setSelectedBooking(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
            {/* Tour image header */}
            <div className="relative h-36 bg-[#ece8df]">
              <img src={selectedBooking.tourImage} alt={selectedBooking.tourName} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <button onClick={() => setSelectedBooking(null)}
                className="absolute top-3 right-3 w-7 h-7 rounded-full bg-black/30 flex items-center justify-center text-white hover:bg-black/50 transition-all">
                <XCircle className="w-4 h-4" />
              </button>
              <div className="absolute bottom-3 left-4">
                <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", color: 'white', fontWeight: 700, fontSize: '1.1rem' }}>
                  {selectedBooking.tourName}
                </h3>
              </div>
            </div>

            <div className="p-5 space-y-4">
              {/* Status + ID */}
              <div className="flex items-center justify-between">
                <StatusBadge status={selectedBooking.status} />
                <span className="text-xs font-mono text-[#6b6558]">{selectedBooking.id}</span>
              </div>

              {/* Details grid */}
              <div className="grid grid-cols-2 gap-3 text-sm">
                <DetailRow icon={<Calendar className="w-3.5 h-3.5 text-[#1b5e3e]" />} label="Fecha reserva" value={fmtDate(selectedBooking.bookingDate)} />
                <DetailRow icon={<Calendar className="w-3.5 h-3.5 text-[#1b5e3e]" />} label="Fecha viaje" value={fmtDate(selectedBooking.travelDate)} />
                <DetailRow icon={<Users className="w-3.5 h-3.5 text-[#1b5e3e]" />} label="Pasajeros" value={`${selectedBooking.passengers} persona${selectedBooking.passengers > 1 ? 's' : ''}`} />
                <DetailRow icon={<MapPin className="w-3.5 h-3.5 text-[#1b5e3e]" />} label="Región" value={selectedBooking.region} />
                <DetailRow icon={<DollarSign className="w-3.5 h-3.5 text-[#1b5e3e]" />} label="Total pagado" value={fmt(selectedBooking.amount)} />
                <DetailRow icon={<DollarSign className="w-3.5 h-3.5 text-[#1b5e3e]" />} label="Precio/pax" value={fmt(Math.round(selectedBooking.amount / selectedBooking.passengers))} />
              </div>

              {/* CTA */}
              <div className="flex gap-2 pt-1">
                {selectedBooking.status === 'Confirmado' && (
                  <button className="flex-1 py-2.5 rounded-xl text-white text-sm font-semibold text-center" style={{ background: '#1b5e3e' }}>
                    Ver voucher
                  </button>
                )}
                <button
                  onClick={() => setSelectedBooking(null)}
                  className="flex-1 py-2.5 rounded-xl border border-border text-[#6b6558] text-sm hover:bg-muted transition-all"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function BookingCard({ booking, onDetail }: { booking: UserBooking; onDetail: () => void }) {
  return (
    <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden hover:shadow-md transition-all">
      <div className="flex">
        {/* Image */}
        <div className="w-28 h-auto shrink-0 bg-[#ece8df]">
          <img src={booking.tourImage} alt={booking.tourName} className="w-full h-full object-cover" />
        </div>

        {/* Content */}
        <div className="flex-1 p-4">
          <div className="flex items-start justify-between gap-2 mb-1">
            <div>
              <p className="text-xs text-[#6b6558] flex items-center gap-1 mb-0.5">
                <MapPin className="w-3 h-3" /> {booking.region}
              </p>
              <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 600, fontSize: '0.95rem', color: '#1a1a14' }}>
                {booking.tourName}
              </h3>
            </div>
            <StatusBadge status={booking.status} />
          </div>

          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-[#6b6558] my-2">
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3 text-[#1b5e3e]" /> Viaje: {fmtDate(booking.travelDate)}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3 text-[#6b6558]" /> Reserva: {fmtDate(booking.bookingDate)}
            </span>
            <span className="flex items-center gap-1">
              <Users className="w-3 h-3 text-[#1b5e3e]" /> {booking.passengers} pax
            </span>
          </div>

          <div className="flex items-center justify-between border-t border-border pt-2.5">
            <p className="font-bold text-[#1b5e3e]" style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '1rem' }}>
              {fmt(booking.amount)}
            </p>
            <button
              onClick={onDetail}
              className="flex items-center gap-1.5 text-xs text-[#1b5e3e] font-semibold hover:gap-2 transition-all"
            >
              <Eye className="w-3.5 h-3.5" /> Ver detalles
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const cfg = STATUS_CONFIG[status];
  if (!cfg) return null;
  return (
    <span className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-medium whitespace-nowrap"
      style={{ color: cfg.color, background: cfg.bg }}>
      {cfg.icon} {cfg.label}
    </span>
  );
}

function DetailRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] text-[#6b6558] flex items-center gap-1 mb-0.5">{icon} {label}</p>
      <p className="text-[#1a1a14] font-medium text-sm">{value}</p>
    </div>
  );
}
