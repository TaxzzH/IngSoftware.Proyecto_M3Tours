import React, { useState } from 'react';
import {
  Mountain, Plus, Edit2, Trash2, LogOut, Star, Clock, Users,
  DollarSign, TrendingUp, Map, X, BarChart2, Eye, EyeOff,
  UserCheck, ChevronDown, ChevronUp, CheckCircle, AlertCircle,
} from 'lucide-react';
import { AppUser, ManagedTour, SaleRecord, MOCK_PARTICIPANTS, Participant } from '../data/auth';

interface Props {
  currentUser: AppUser;
  tours: ManagedTour[];
  sales: SaleRecord[];
  onAddTour: (t: ManagedTour) => void;
  onUpdateTour: (t: ManagedTour) => void;
  onDeleteTour: (id: number) => void;
  onLogout: () => void;
}

type Tab = 'tours' | 'sales' | 'inscritos';

function fmt(n: number) { return `$${n.toLocaleString('es-CL')}`; }
function fmtDate(d: string) { return new Date(d + 'T12:00:00').toLocaleDateString('es-CL', { day: '2-digit', month: 'short', year: 'numeric' }); }

const EMPTY_TOUR = (ownerId: string): ManagedTour => ({
  id: Date.now(),
  name: '', region: 'Los Lagos', category: 'Naturaleza', difficulty: 'Fácil',
  price: 0, groupPrice: 0, duration: '1 día', maxGroup: 12, rating: 5.0, reviews: 0,
  shortDescription: '', heroImage: '', gallery: [], description: '', highlights: [],
  includes: [], excludes: [], meetingPoint: '', availableDates: [],
  ownerId, active: true,
});

const fi = 'w-full border border-border rounded-lg px-3 py-2.5 text-sm text-[#1a1a14] bg-white outline-none focus:ring-2 focus:ring-[#1b5e3e] transition-all';

export function OperatorDashboard({ currentUser, tours, sales, onAddTour, onUpdateTour, onDeleteTour, onLogout }: Props) {
  const [tab, setTab] = useState<Tab>('tours');
  const [tourForm, setTourForm] = useState<ManagedTour | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);

  const myRevenue = sales.filter((s) => s.status === 'Confirmada').reduce((sum, s) => sum + s.amount, 0);
  const confirmedSales = sales.filter((s) => s.status === 'Confirmada').length;

  const openAdd = () => { setTourForm(EMPTY_TOUR(currentUser.id)); setIsEditing(false); };
  const openEdit = (t: ManagedTour) => { setTourForm({ ...t }); setIsEditing(true); };

  const saveTour = () => {
    if (!tourForm) return;
    isEditing ? onUpdateTour(tourForm) : onAddTour(tourForm);
    setTourForm(null);
  };

  const set = (key: keyof ManagedTour, val: unknown) => {
    if (tourForm) setTourForm({ ...tourForm, [key]: val });
  };

  const statusColor: Record<string, string> = {
    Confirmada: 'bg-emerald-100 text-emerald-700',
    Pendiente: 'bg-amber-100 text-amber-700',
    Rechazada: 'bg-red-100 text-red-700',
    Cancelada: 'bg-gray-100 text-gray-500',
  };

  return (
    <div className="min-h-screen bg-[#f5f1ea]">
      {/* Top navbar */}
      <nav className="bg-white border-b border-border px-6 py-4 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#1b5e3e] flex items-center justify-center">
            <Mountain className="w-4 h-4 text-white" />
          </div>
          <div>
            <span style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 700, color: '#1b5e3e', fontSize: '1rem', letterSpacing: '0.08em' }}>
              3MTOURS
            </span>
            <span className="ml-2 text-xs bg-[#c8531a]/10 text-[#c8531a] px-2 py-0.5 rounded-full font-medium">Tour Operador</span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 bg-[#f5f1ea] rounded-xl p-1">
          {([
            { key: 'tours', label: 'Mis Tours', icon: Map },
            { key: 'inscritos', label: 'Inscritos', icon: UserCheck },
            { key: 'sales', label: 'Ventas', icon: BarChart2 },
          ] as const).map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${tab === key ? 'bg-white text-[#1a1a14] shadow-sm' : 'text-[#6b6558] hover:text-[#1a1a14]'}`}
            >
              <Icon className="w-3.5 h-3.5" /> {label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-[#1a1a14]">{currentUser.name}</p>
            <p className="text-xs text-[#6b6558]">{currentUser.email}</p>
          </div>
          <button onClick={onLogout} className="flex items-center gap-1.5 text-sm text-[#6b6558] hover:text-[#1a1a14] transition-colors px-3 py-2 rounded-lg hover:bg-[#f5f1ea]">
            <LogOut className="w-4 h-4" /> Salir
          </button>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* ── MIS TOURS ── */}
        {tab === 'tours' && (
          <>
            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <MiniStat icon={<Map className="w-4 h-4" />} label="Mis tours" value={String(tours.length)} color="#1b5e3e" />
              <MiniStat icon={<Eye className="w-4 h-4" />} label="Activos" value={String(tours.filter((t) => t.active).length)} color="#2d5fa6" />
              <MiniStat icon={<TrendingUp className="w-4 h-4" />} label="Ventas confirmadas" value={String(confirmedSales)} color="#c8531a" />
              <MiniStat icon={<DollarSign className="w-4 h-4" />} label="Ingresos" value={fmt(myRevenue)} color="#7c3a8a" small />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '1.6rem', fontWeight: 700, color: '#1a1a14' }}>
                  Mis Tours
                </h1>
                <p className="text-[#6b6558] text-sm">{tours.length} tours bajo tu gestión</p>
              </div>
              <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm font-semibold hover:opacity-90 transition-all"
                style={{ background: '#1b5e3e' }}>
                <Plus className="w-4 h-4" /> Nuevo tour
              </button>
            </div>

            {tours.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl border border-border">
                <Map className="w-10 h-10 text-[#c5c0b5] mx-auto mb-3" />
                <p className="text-[#6b6558] mb-4">No tienes tours registrados aún</p>
                <button onClick={openAdd} className="px-5 py-2.5 rounded-xl text-white text-sm font-semibold" style={{ background: '#1b5e3e' }}>
                  Crear primer tour
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {tours.map((t) => (
                  <OperatorTourCard
                    key={t.id}
                    tour={t}
                    onEdit={() => openEdit(t)}
                    onDelete={() => setConfirmDelete(t.id)}
                    onToggle={() => onUpdateTour({ ...t, active: !t.active })}
                  />
                ))}
              </div>
            )}
          </>
        )}

        {/* ── VENTAS ── */}
        {tab === 'sales' && (
          <>
            <div className="mb-6">
              <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '1.6rem', fontWeight: 700, color: '#1a1a14' }}>
                Mis Ventas
              </h1>
              <p className="text-[#6b6558] text-sm">{sales.length} reservas · {fmt(myRevenue)} en ingresos confirmados</p>
            </div>

            {sales.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl border border-border">
                <BarChart2 className="w-10 h-10 text-[#c5c0b5] mx-auto mb-3" />
                <p className="text-[#6b6558]">Aún no hay ventas registradas</p>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-[#f5f1ea]">
                        {['ID Reserva', 'Tour', 'Pasajero', 'Fecha', 'Pax', 'Monto', 'Estado'].map((h) => (
                          <th key={h} className="text-left px-5 py-3 text-xs text-[#6b6558] font-semibold uppercase tracking-wider whitespace-nowrap">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {sales.map((s, i) => (
                        <tr key={s.id} className={i % 2 === 0 ? 'bg-white' : 'bg-[#faf8f4]'}>
                          <td className="px-5 py-3 font-mono text-xs text-[#6b6558]">{s.id}</td>
                          <td className="px-5 py-3 text-[#1a1a14]">{s.tourName}</td>
                          <td className="px-5 py-3 text-[#1a1a14]">{s.passenger}</td>
                          <td className="px-5 py-3 text-[#6b6558] whitespace-nowrap">{fmtDate(s.tourDate)}</td>
                          <td className="px-5 py-3 text-center text-[#6b6558]">{s.passengers}</td>
                          <td className="px-5 py-3 font-semibold text-[#1b5e3e]">{fmt(s.amount)}</td>
                          <td className="px-5 py-3">
                            <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusColor[s.status] ?? ''}`}>{s.status}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}

        {/* ── INSCRITOS ── */}
        {tab === 'inscritos' && (
          <GestionInscritos tours={tours} />
        )}
      </div>

      {/* Tour form modal */}
      {tourForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setTourForm(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-border px-6 py-4 flex items-center justify-between rounded-t-2xl">
              <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 700, fontSize: '1.2rem', color: '#1a1a14' }}>
                {isEditing ? 'Editar tour' : 'Nuevo tour'}
              </h2>
              <button onClick={() => setTourForm(null)} className="p-2 rounded-lg hover:bg-[#f5f1ea] transition-all">
                <X className="w-4 h-4 text-[#6b6558]" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-[#1a1a14] mb-1.5">Nombre del tour <span className="text-[#c8531a]">*</span></label>
                  <input value={tourForm.name} onChange={(e) => set('name', e.target.value)} placeholder="Nombre del tour" className={fi} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#1a1a14] mb-1.5">Categoría</label>
                  <select value={tourForm.category} onChange={(e) => set('category', e.target.value)} className={fi}>
                    {['Naturaleza', 'Aventura', 'Bienestar', 'Cultural', 'Trekking'].map((c) => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#1a1a14] mb-1.5">Dificultad</label>
                  <select value={tourForm.difficulty} onChange={(e) => set('difficulty', e.target.value as ManagedTour['difficulty'])} className={fi}>
                    {['Fácil', 'Moderado', 'Difícil'].map((d) => <option key={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#1a1a14] mb-1.5">Precio individual (CLP)</label>
                  <input type="number" value={tourForm.price} onChange={(e) => set('price', Number(e.target.value))} className={fi} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#1a1a14] mb-1.5">Precio grupal (CLP)</label>
                  <input type="number" value={tourForm.groupPrice} onChange={(e) => set('groupPrice', Number(e.target.value))} className={fi} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#1a1a14] mb-1.5">Duración</label>
                  <input value={tourForm.duration} onChange={(e) => set('duration', e.target.value)} placeholder="Ej: 1 día" className={fi} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#1a1a14] mb-1.5">Cupos máximos</label>
                  <input type="number" value={tourForm.maxGroup} onChange={(e) => set('maxGroup', Number(e.target.value))} className={fi} />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-[#1a1a14] mb-1.5">URL imagen principal</label>
                  <input value={tourForm.heroImage} onChange={(e) => set('heroImage', e.target.value)} placeholder="https://images.unsplash.com/…" className={fi} />
                  {tourForm.heroImage && <img src={tourForm.heroImage} alt="preview" className="mt-2 h-24 w-full object-cover rounded-lg" />}
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-[#1a1a14] mb-1.5">Descripción corta</label>
                  <input value={tourForm.shortDescription} onChange={(e) => set('shortDescription', e.target.value)} placeholder="Resumen atractivo del tour…" className={fi} />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-[#1a1a14] mb-1.5">Descripción completa</label>
                  <textarea value={tourForm.description} onChange={(e) => set('description', e.target.value)} rows={3} placeholder="Descripción detallada…" className={`${fi} resize-none`} />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-[#1a1a14] mb-1.5">Punto de encuentro</label>
                  <input value={tourForm.meetingPoint} onChange={(e) => set('meetingPoint', e.target.value)} placeholder="Ej: Muelle de Petrohué — 09:00 hrs" className={fi} />
                </div>
              </div>
              <div className="flex items-center justify-between pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={tourForm.active} onChange={(e) => set('active', e.target.checked)} className="w-4 h-4 accent-[#1b5e3e]" />
                  <span className="text-sm text-[#1a1a14]">Tour activo y visible</span>
                </label>
                <div className="flex gap-3">
                  <button onClick={() => setTourForm(null)} className="px-4 py-2 rounded-lg border border-border text-[#6b6558] text-sm hover:bg-muted transition-all">Cancelar</button>
                  <button onClick={saveTour} disabled={!tourForm.name} className="px-5 py-2 rounded-lg text-white text-sm font-semibold hover:opacity-90 disabled:opacity-50 transition-all" style={{ background: '#1b5e3e' }}>
                    {isEditing ? 'Guardar cambios' : 'Crear tour'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirm */}
      {confirmDelete !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setConfirmDelete(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-5 h-5 text-red-500" />
            </div>
            <h3 className="text-center font-semibold text-[#1a1a14] mb-1">¿Eliminar este tour?</h3>
            <p className="text-center text-sm text-[#6b6558] mb-5">Se eliminará permanentemente de tu catálogo.</p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmDelete(null)} className="flex-1 py-2.5 rounded-xl border border-border text-[#6b6558] text-sm hover:bg-muted transition-all">Cancelar</button>
              <button onClick={() => { onDeleteTour(confirmDelete); setConfirmDelete(null); }} className="flex-1 py-2.5 rounded-xl bg-red-500 text-white text-sm hover:bg-red-600 transition-all">Eliminar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function OperatorTourCard({ tour, onEdit, onDelete, onToggle }: { tour: ManagedTour; onEdit: () => void; onDelete: () => void; onToggle: () => void }) {
  const diffColor = { 'Fácil': 'bg-emerald-100 text-emerald-700', 'Moderado': 'bg-amber-100 text-amber-700', 'Difícil': 'bg-red-100 text-red-700' }[tour.difficulty];

  return (
    <div className={`bg-white rounded-2xl border overflow-hidden shadow-sm transition-all ${tour.active ? 'border-border' : 'border-gray-200 opacity-70'}`}>
      <div className="relative aspect-video bg-[#ece8df]">
        {tour.heroImage
          ? <img src={tour.heroImage} alt={tour.name} className="w-full h-full object-cover" />
          : <div className="w-full h-full flex items-center justify-center text-[#c5c0b5]"><Map className="w-8 h-8" /></div>
        }
        <div className="absolute top-2 left-2 flex gap-1.5">
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${diffColor}`}>{tour.difficulty}</span>
        </div>
        <button onClick={onToggle} className={`absolute top-2 right-2 p-1.5 rounded-lg text-xs font-medium flex items-center gap-1 ${tour.active ? 'bg-white/90 text-emerald-700' : 'bg-white/90 text-gray-500'}`}>
          {tour.active ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
          {tour.active ? 'Activo' : 'Inactivo'}
        </button>
      </div>

      <div className="p-4">
        <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 600, fontSize: '1rem', color: '#1a1a14' }} className="mb-1 line-clamp-1">
          {tour.name || 'Sin nombre'}
        </h3>
        <p className="text-xs text-[#6b6558] mb-3 line-clamp-2">{tour.shortDescription || 'Sin descripción'}</p>
        <div className="flex items-center gap-3 text-xs text-[#6b6558] mb-3">
          <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {tour.duration}</span>
          <span className="flex items-center gap-1"><Users className="w-3 h-3" /> Máx. {tour.maxGroup}</span>
          <span className="flex items-center gap-1"><Star className="w-3 h-3 fill-[#c8531a] text-[#c8531a]" /> {tour.rating}</span>
        </div>
        <div className="flex items-center justify-between border-t border-border pt-3">
          <p className="font-bold text-[#1b5e3e]">{fmt(tour.price)}<span className="text-xs text-[#6b6558] font-normal"> /pax</span></p>
          <div className="flex items-center gap-1.5">
            <button onClick={onEdit} className="p-2 rounded-lg hover:bg-[#edf4ef] text-[#1b5e3e] transition-all" title="Editar">
              <Edit2 className="w-3.5 h-3.5" />
            </button>
            <button onClick={onDelete} className="p-2 rounded-lg hover:bg-red-50 text-red-400 transition-all" title="Eliminar">
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function MiniStat({ icon, label, value, color, small }: { icon: React.ReactNode; label: string; value: string; color: string; small?: boolean }) {
  return (
    <div className="bg-white rounded-xl border border-border p-4 shadow-sm">
      <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-2" style={{ background: color + '15', color }}>
        {icon}
      </div>
      <p className={`font-bold text-[#1a1a14] mb-0.5 ${small ? 'text-base' : 'text-xl'}`}>{value}</p>
      <p className="text-xs text-[#6b6558]">{label}</p>
    </div>
  );
}

/* ─── GESTIÓN DE INSCRITOS ─────────────────────────────────── */

function OccupancyBar({ reserved, total }: { reserved: number; total: number }) {
  const pct = total > 0 ? Math.round((reserved / total) * 100) : 0;
  const color = pct >= 90 ? '#ef4444' : pct >= 70 ? '#f59e0b' : '#1b5e3e';
  return (
    <div className="mt-2">
      <div className="flex justify-between text-xs mb-1.5">
        <span className="text-[#6b6558]">{reserved}/{total} cupos</span>
        <span className="font-semibold" style={{ color }}>{pct}% ocupado</span>
      </div>
      <div className="h-2 rounded-full bg-[#ece8df] overflow-hidden">
        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, background: color }} />
      </div>
    </div>
  );
}

function GestionInscritos({ tours }: { tours: ManagedTour[] }) {
  const [selectedTourId, setSelectedTourId] = useState<number | null>(tours[0]?.id ?? null);
  const [expandedDate, setExpandedDate] = useState<string | null>(null);

  const selectedTour = tours.find((t) => t.id === selectedTourId);
  const participants = MOCK_PARTICIPANTS.filter((p) => p.tourId === selectedTourId);

  const totalParticipants = participants.reduce((s, p) => s + p.passengers, 0);
  const totalRevenue = participants.filter((p) => p.paymentStatus === 'Pagado').reduce((s, p) => s + p.amount, 0);
  const totalSpots = (selectedTour?.maxGroup ?? 0) * (selectedTour?.availableDates.length ?? 0);
  const occupancyPct = totalSpots > 0 ? Math.round((totalParticipants / totalSpots) * 100) : 0;

  const payColor: Record<string, string> = {
    Pagado: 'bg-emerald-100 text-emerald-700',
    Pendiente: 'bg-amber-100 text-amber-700',
    Reembolsado: 'bg-gray-100 text-gray-600',
  };

  if (tours.length === 0) {
    return (
      <div className="text-center py-20">
        <UserCheck className="w-10 h-10 text-[#c5c0b5] mx-auto mb-3" />
        <p className="text-[#6b6558]">No tienes tours publicados aún</p>
      </div>
    );
  }

  return (
    <>
      <div className="mb-6">
        <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '1.6rem', fontWeight: 700, color: '#1a1a14' }}>
          Gestión de Inscritos
        </h1>
        <p className="text-[#6b6558] text-sm">Participantes registrados por tour</p>
      </div>

      {/* Tour selector */}
      <div className="flex gap-2 flex-wrap mb-6">
        {tours.map((t) => {
          const paxCount = MOCK_PARTICIPANTS.filter((p) => p.tourId === t.id).reduce((s, p) => s + p.passengers, 0);
          return (
            <button
              key={t.id}
              onClick={() => setSelectedTourId(t.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border transition-all ${selectedTourId === t.id ? 'bg-[#1b5e3e] text-white border-[#1b5e3e]' : 'bg-white text-[#1a1a14] border-border hover:border-[#1b5e3e]/40'}`}
            >
              {t.name}
              <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${selectedTourId === t.id ? 'bg-white/20 text-white' : 'bg-[#f5f1ea] text-[#6b6558]'}`}>
                {paxCount}
              </span>
            </button>
          );
        })}
      </div>

      {selectedTour && (
        <>
          {/* Metrics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-xl border border-border p-4 shadow-sm">
              <div className="w-8 h-8 rounded-lg bg-[#1b5e3e]/10 flex items-center justify-center mb-2">
                <Users className="w-4 h-4 text-[#1b5e3e]" />
              </div>
              <p className="text-xl font-bold text-[#1a1a14]">{totalParticipants}</p>
              <p className="text-xs text-[#6b6558]">Total inscritos</p>
            </div>
            <div className="bg-white rounded-xl border border-border p-4 shadow-sm">
              <div className="w-8 h-8 rounded-lg bg-[#2d5fa6]/10 flex items-center justify-center mb-2">
                <UserCheck className="w-4 h-4 text-[#2d5fa6]" />
              </div>
              <p className="text-xl font-bold text-[#1a1a14]">{Math.max(0, totalSpots - totalParticipants)}</p>
              <p className="text-xs text-[#6b6558]">Cupos disponibles</p>
            </div>
            <div className="bg-white rounded-xl border border-border p-4 shadow-sm">
              <div className="w-8 h-8 rounded-lg bg-[#c8531a]/10 flex items-center justify-center mb-2">
                <DollarSign className="w-4 h-4 text-[#c8531a]" />
              </div>
              <p className="text-base font-bold text-[#1a1a14]">{fmt(totalRevenue)}</p>
              <p className="text-xs text-[#6b6558]">Ingresos generados</p>
            </div>
            <div className="bg-white rounded-xl border border-border p-4 shadow-sm">
              <div className="w-8 h-8 rounded-lg bg-[#7c3a8a]/10 flex items-center justify-center mb-2">
                <TrendingUp className="w-4 h-4 text-[#7c3a8a]" />
              </div>
              <p className="text-xl font-bold text-[#1a1a14]">{occupancyPct}%</p>
              <p className="text-xs text-[#6b6558]">Nivel de ocupación</p>
            </div>
          </div>

          {/* Dates with occupancy */}
          <div className="bg-white rounded-2xl border border-border shadow-sm mb-6 overflow-hidden">
            <div className="px-5 py-4 border-b border-border">
              <h3 className="font-semibold text-[#1a1a14] flex items-center gap-2">
                <Map className="w-4 h-4 text-[#1b5e3e]" /> {selectedTour.name} — Fechas y cupos
              </h3>
            </div>
            <div className="divide-y divide-border">
              {selectedTour.availableDates.map((d) => {
                const datePax = participants
                  .filter((p) => p.tourDate === d.date)
                  .reduce((s, p) => s + p.passengers, 0);
                const reserved = datePax;
                const available = selectedTour.maxGroup - reserved;
                const isExpanded = expandedDate === d.date;
                const dateParts = participants.filter((p) => p.tourDate === d.date);

                return (
                  <div key={d.date}>
                    <button
                      onClick={() => setExpandedDate(isExpanded ? null : d.date)}
                      className="w-full flex items-center justify-between px-5 py-4 hover:bg-[#faf8f4] transition-colors text-left"
                    >
                      <div className="flex-1">
                        <p className="text-sm font-medium text-[#1a1a14]">
                          {new Date(d.date + 'T12:00:00').toLocaleDateString('es-CL', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                        </p>
                        <OccupancyBar reserved={reserved} total={selectedTour.maxGroup} />
                      </div>
                      <div className="flex items-center gap-4 ml-6 shrink-0">
                        <div className="text-right">
                          <p className="text-xs text-[#6b6558]">Disponibles</p>
                          <p className={`font-bold text-sm ${available === 0 ? 'text-red-500' : available <= 3 ? 'text-amber-600' : 'text-[#1b5e3e]'}`}>
                            {available}
                          </p>
                        </div>
                        {isExpanded ? <ChevronUp className="w-4 h-4 text-[#6b6558]" /> : <ChevronDown className="w-4 h-4 text-[#6b6558]" />}
                      </div>
                    </button>

                    {/* Expanded participant list per date */}
                    {isExpanded && dateParts.length > 0 && (
                      <div className="bg-[#faf8f4] border-t border-border px-5 py-3">
                        <p className="text-xs text-[#6b6558] font-semibold uppercase tracking-wider mb-3">
                          Participantes — {dateParts.reduce((s, p) => s + p.passengers, 0)} pasajeros
                        </p>
                        <div className="space-y-2">
                          {dateParts.map((p) => (
                            <div key={p.id} className="flex items-center gap-3 bg-white rounded-lg px-4 py-2.5 shadow-sm text-sm">
                              <div className="w-7 h-7 rounded-full bg-[#1b5e3e]/10 flex items-center justify-center text-[#1b5e3e] font-bold text-xs shrink-0">
                                {p.fullName.charAt(0)}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-[#1a1a14] truncate">{p.fullName}</p>
                                <p className="text-xs text-[#6b6558] truncate">{p.email}</p>
                              </div>
                              <span className="text-xs text-[#6b6558] shrink-0">{p.phone}</span>
                              <span className="text-xs shrink-0 text-[#6b6558]">{p.passengers} pax</span>
                              <span className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ${payColor[p.paymentStatus]}`}>
                                {p.paymentStatus}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {isExpanded && dateParts.length === 0 && (
                      <div className="bg-[#faf8f4] border-t border-border px-5 py-4 text-center">
                        <p className="text-sm text-[#6b6558]">Sin inscritos para esta fecha</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* All participants table */}
          <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-border">
              <h3 className="font-semibold text-[#1a1a14] flex items-center gap-2">
                <Users className="w-4 h-4 text-[#1b5e3e]" /> Todos los participantes ({participants.length})
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[#f5f1ea]">
                    {['Nombre completo', 'Correo', 'Teléfono', 'Fecha salida', 'Pax', 'Inscripción', 'Pago'].map((h) => (
                      <th key={h} className="text-left px-4 py-3 text-xs text-[#6b6558] font-semibold uppercase tracking-wider whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {participants.map((p, i) => (
                    <tr key={p.id} className={i % 2 === 0 ? 'bg-white' : 'bg-[#faf8f4]'}>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-[#1b5e3e]/10 flex items-center justify-center text-[#1b5e3e] font-bold text-xs shrink-0">
                            {p.fullName.charAt(0)}
                          </div>
                          <span className="font-medium text-[#1a1a14]">{p.fullName}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-[#6b6558]">{p.email}</td>
                      <td className="px-4 py-3 text-[#6b6558] whitespace-nowrap">{p.phone}</td>
                      <td className="px-4 py-3 text-[#6b6558] whitespace-nowrap">
                        {new Date(p.tourDate + 'T12:00:00').toLocaleDateString('es-CL', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </td>
                      <td className="px-4 py-3 text-center font-semibold text-[#1a1a14]">{p.passengers}</td>
                      <td className="px-4 py-3 text-[#6b6558] whitespace-nowrap">
                        {new Date(p.inscriptionDate + 'T12:00:00').toLocaleDateString('es-CL', { day: '2-digit', month: 'short' })}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${payColor[p.paymentStatus]}`}>
                          {p.paymentStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </>
  );
}
