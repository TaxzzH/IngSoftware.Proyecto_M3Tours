import React, { useState } from 'react';
import {
  Mountain, LayoutDashboard, Map, Users, BarChart2, LogOut,
  Plus, Edit2, Trash2, Shield, ShieldOff, TrendingUp, DollarSign,
  ChevronDown, X, CheckCircle, XCircle, Clock, Search, Star,
} from 'lucide-react';
import { AppUser, ManagedTour, SaleRecord } from '../data/auth';

interface Props {
  currentUser: AppUser;
  tours: ManagedTour[];
  users: AppUser[];
  sales: SaleRecord[];
  onAddTour: (t: ManagedTour) => void;
  onUpdateTour: (t: ManagedTour) => void;
  onDeleteTour: (id: number) => void;
  onUpdateUser: (u: AppUser) => void;
  onLogout: () => void;
}

type Tab = 'panel' | 'tours' | 'users' | 'sales';

const NAV = [
  { key: 'panel', label: 'Panel', icon: LayoutDashboard },
  { key: 'tours', label: 'Tours', icon: Map },
  { key: 'users', label: 'Usuarios', icon: Users },
  { key: 'sales', label: 'Ventas', icon: BarChart2 },
] as const;

function fmt(n: number) { return `$${n.toLocaleString('es-CL')}`; }
function fmtDate(d: string) { return new Date(d + 'T12:00:00').toLocaleDateString('es-CL', { day: '2-digit', month: 'short', year: 'numeric' }); }

const EMPTY_TOUR: Omit<ManagedTour, 'id' | 'ownerId'> = {
  name: '', region: 'Los Lagos', category: 'Naturaleza', difficulty: 'Fácil',
  price: 0, groupPrice: 0, duration: '1 día', maxGroup: 12, rating: 5.0, reviews: 0,
  shortDescription: '', heroImage: '', gallery: [], description: '', highlights: [],
  includes: [], excludes: [], meetingPoint: '', availableDates: [], active: true,
};

export function AdminDashboard({ currentUser, tours, users, sales, onAddTour, onUpdateTour, onDeleteTour, onUpdateUser, onLogout }: Props) {
  const [tab, setTab] = useState<Tab>('panel');
  const [tourForm, setTourForm] = useState<ManagedTour | null>(null);
  const [tourSearch, setTourSearch] = useState('');
  const [userSearch, setUserSearch] = useState('');
  const [salesFilter, setSalesFilter] = useState('Todas');
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);

  const totalRevenue = sales.filter((s) => s.status === 'Confirmada').reduce((sum, s) => sum + s.amount, 0);
  const activeTours = tours.filter((t) => t.active).length;
  const totalUsers = users.filter((u) => u.role === 'user').length;
  const operators = users.filter((u) => u.role === 'operator').length;

  const filteredTours = tours.filter((t) =>
    !tourSearch || t.name.toLowerCase().includes(tourSearch.toLowerCase())
  );
  const filteredUsers = users.filter((u) =>
    !userSearch || u.name.toLowerCase().includes(userSearch.toLowerCase()) || u.email.toLowerCase().includes(userSearch.toLowerCase())
  );
  const filteredSales = salesFilter === 'Todas' ? sales : sales.filter((s) => s.status === salesFilter);

  const openAdd = () => setTourForm({ ...EMPTY_TOUR, id: Date.now(), ownerId: '1' } as ManagedTour);
  const openEdit = (t: ManagedTour) => setTourForm({ ...t });

  const saveTour = () => {
    if (!tourForm) return;
    const exists = tours.find((t) => t.id === tourForm.id);
    exists ? onUpdateTour(tourForm) : onAddTour(tourForm);
    setTourForm(null);
  };

  const statusColor = { Confirmada: 'bg-emerald-100 text-emerald-700', Pendiente: 'bg-amber-100 text-amber-700', Rechazada: 'bg-red-100 text-red-700', Cancelada: 'bg-gray-100 text-gray-600' };
  const roleLabel = { admin: 'Admin', operator: 'Operador', user: 'Cliente' };
  const roleBadge = { admin: 'bg-[#1b5e3e]/10 text-[#1b5e3e]', operator: 'bg-[#c8531a]/10 text-[#c8531a]', user: 'bg-[#2d5fa6]/10 text-[#2d5fa6]' };

  return (
    <div className="flex min-h-screen bg-[#f5f1ea]">
      {/* Sidebar */}
      <aside className="w-60 shrink-0 flex flex-col" style={{ background: '#1b5e3e' }}>
        {/* Logo */}
        <div className="px-6 py-6 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center">
              <Mountain className="w-4 h-4 text-white" />
            </div>
            <span style={{ fontFamily: "'Playfair Display', Georgia, serif", color: 'white', fontWeight: 700, fontSize: '1.1rem', letterSpacing: '0.08em' }}>
              3MTOURS
            </span>
          </div>
          <p className="text-white/40 text-xs mt-1.5">Panel Administrador</p>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {NAV.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setTab(key as Tab)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${tab === key ? 'bg-white text-[#1b5e3e]' : 'text-white/70 hover:bg-white/10 hover:text-white'}`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </nav>

        {/* User + logout */}
        <div className="px-4 py-5 border-t border-white/10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white text-xs font-bold">
              {currentUser.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-medium truncate">{currentUser.name}</p>
              <p className="text-white/40 text-xs">Administrador</p>
            </div>
          </div>
          <button onClick={onLogout} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-all text-sm">
            <LogOut className="w-4 h-4" /> Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        {/* ── PANEL ── */}
        {tab === 'panel' && (
          <div className="p-8">
            <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '1.8rem', fontWeight: 700, color: '#1a1a14' }} className="mb-1">
              Panel de control
            </h1>
            <p className="text-[#6b6558] text-sm mb-8">Bienvenido, {currentUser.name.split(' ')[0]}</p>

            {/* Stat cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
              <StatCard icon={<Map className="w-5 h-5" />} label="Tours activos" value={String(activeTours)} color="#1b5e3e" />
              <StatCard icon={<Users className="w-5 h-5" />} label="Usuarios" value={String(totalUsers)} color="#2d5fa6" />
              <StatCard icon={<TrendingUp className="w-5 h-5" />} label="Operadores" value={String(operators)} color="#c8531a" />
              <StatCard icon={<DollarSign className="w-5 h-5" />} label="Ingresos totales" value={fmt(totalRevenue)} color="#7c3a8a" small />
            </div>

            {/* Recent sales */}
            <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                <h2 className="font-semibold text-[#1a1a14]">Ventas recientes</h2>
                <button onClick={() => setTab('sales')} className="text-xs text-[#1b5e3e] hover:underline">Ver todas →</button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-[#f5f1ea]">
                      {['ID Reserva', 'Tour', 'Pasajero', 'Monto', 'Estado'].map((h) => (
                        <th key={h} className="text-left px-5 py-3 text-xs text-[#6b6558] font-semibold uppercase tracking-wider">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {sales.slice(0, 5).map((s, i) => (
                      <tr key={s.id} className={i % 2 === 0 ? 'bg-white' : 'bg-[#faf8f4]'}>
                        <td className="px-5 py-3 font-mono text-xs text-[#6b6558]">{s.id}</td>
                        <td className="px-5 py-3 text-[#1a1a14]">{s.tourName}</td>
                        <td className="px-5 py-3 text-[#1a1a14]">{s.passenger}</td>
                        <td className="px-5 py-3 font-semibold text-[#1b5e3e]">{fmt(s.amount)}</td>
                        <td className="px-5 py-3">
                          <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusColor[s.status]}`}>{s.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ── TOURS ── */}
        {tab === 'tours' && (
          <div className="p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '1.8rem', fontWeight: 700, color: '#1a1a14' }}>Gestión de Tours</h1>
                <p className="text-[#6b6558] text-sm">{tours.length} tours registrados</p>
              </div>
              <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm font-semibold hover:opacity-90 transition-all"
                style={{ background: '#1b5e3e' }}>
                <Plus className="w-4 h-4" /> Agregar tour
              </button>
            </div>

            <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-border">
                <div className="flex items-center gap-2 bg-[#f5f1ea] rounded-lg px-3 py-2 max-w-xs">
                  <Search className="w-4 h-4 text-[#6b6558]" />
                  <input value={tourSearch} onChange={(e) => setTourSearch(e.target.value)} placeholder="Buscar tour…" className="bg-transparent text-sm outline-none flex-1 text-[#1a1a14] placeholder-[#c5c0b5]" />
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-[#f5f1ea]">
                      {['Tour', 'Categoría', 'Dificultad', 'Precio', 'Cupos', 'Estado', 'Acciones'].map((h) => (
                        <th key={h} className="text-left px-5 py-3 text-xs text-[#6b6558] font-semibold uppercase tracking-wider">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTours.map((t, i) => (
                      <tr key={t.id} className={i % 2 === 0 ? 'bg-white' : 'bg-[#faf8f4]'}>
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-[#ece8df] overflow-hidden shrink-0">
                              {t.heroImage && <img src={t.heroImage} alt={t.name} className="w-full h-full object-cover" />}
                            </div>
                            <div>
                              <p className="font-medium text-[#1a1a14]">{t.name}</p>
                              <p className="text-xs text-[#6b6558] flex items-center gap-1">
                                <Star className="w-3 h-3 fill-[#c8531a] text-[#c8531a]" />{t.rating}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-3 text-[#6b6558]">{t.category}</td>
                        <td className="px-5 py-3">
                          <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${{ 'Fácil': 'bg-emerald-100 text-emerald-700', 'Moderado': 'bg-amber-100 text-amber-700', 'Difícil': 'bg-red-100 text-red-700' }[t.difficulty]}`}>
                            {t.difficulty}
                          </span>
                        </td>
                        <td className="px-5 py-3 font-semibold text-[#1b5e3e]">{fmt(t.price)}</td>
                        <td className="px-5 py-3 text-[#6b6558]">{t.maxGroup}</td>
                        <td className="px-5 py-3">
                          <button onClick={() => onUpdateTour({ ...t, active: !t.active })} className={`text-xs px-2.5 py-1 rounded-full font-medium ${t.active ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
                            {t.active ? 'Activo' : 'Inactivo'}
                          </button>
                        </td>
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-2">
                            <button onClick={() => openEdit(t)} className="p-1.5 rounded-lg hover:bg-[#edf4ef] text-[#1b5e3e] transition-all" title="Editar">
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button onClick={() => setConfirmDelete(t.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-400 transition-all" title="Eliminar">
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ── USUARIOS ── */}
        {tab === 'users' && (
          <div className="p-8">
            <div className="mb-6">
              <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '1.8rem', fontWeight: 700, color: '#1a1a14' }}>Gestión de Usuarios</h1>
              <p className="text-[#6b6558] text-sm">{users.length} usuarios registrados</p>
            </div>

            <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-border">
                <div className="flex items-center gap-2 bg-[#f5f1ea] rounded-lg px-3 py-2 max-w-xs">
                  <Search className="w-4 h-4 text-[#6b6558]" />
                  <input value={userSearch} onChange={(e) => setUserSearch(e.target.value)} placeholder="Buscar usuario…" className="bg-transparent text-sm outline-none flex-1 text-[#1a1a14] placeholder-[#c5c0b5]" />
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-[#f5f1ea]">
                      {['Usuario', 'Correo', 'Rol', 'Estado', 'Registro', 'Acciones'].map((h) => (
                        <th key={h} className="text-left px-5 py-3 text-xs text-[#6b6558] font-semibold uppercase tracking-wider">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((u, i) => (
                      <tr key={u.id} className={i % 2 === 0 ? 'bg-white' : 'bg-[#faf8f4]'}>
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-[#1b5e3e]/10 flex items-center justify-center text-[#1b5e3e] font-bold text-sm">
                              {u.name.charAt(0)}
                            </div>
                            <p className="font-medium text-[#1a1a14]">{u.name}</p>
                          </div>
                        </td>
                        <td className="px-5 py-3 text-[#6b6558]">{u.email}</td>
                        <td className="px-5 py-3">
                          {u.role === 'admin' ? (
                            <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${roleBadge[u.role]}`}>{roleLabel[u.role]}</span>
                          ) : (
                            <select
                              value={u.role}
                              onChange={(e) => onUpdateUser({ ...u, role: e.target.value as AppUser['role'] })}
                              className={`text-xs px-2.5 py-1 rounded-full font-medium border-0 outline-none cursor-pointer ${roleBadge[u.role]}`}
                              disabled={u.role === 'admin'}
                            >
                              <option value="user">Cliente</option>
                              <option value="operator">Operador</option>
                            </select>
                          )}
                        </td>
                        <td className="px-5 py-3">
                          <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${u.blocked ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'}`}>
                            {u.blocked ? 'Bloqueado' : 'Activo'}
                          </span>
                        </td>
                        <td className="px-5 py-3 text-[#6b6558]">{fmtDate(u.createdAt)}</td>
                        <td className="px-5 py-3">
                          {u.role !== 'admin' && (
                            <button
                              onClick={() => onUpdateUser({ ...u, blocked: !u.blocked })}
                              className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg font-medium transition-all ${u.blocked ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100' : 'bg-red-50 text-red-600 hover:bg-red-100'}`}
                            >
                              {u.blocked ? <><ShieldOff className="w-3 h-3" /> Desbloquear</> : <><Shield className="w-3 h-3" /> Bloquear</>}
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ── VENTAS ── */}
        {tab === 'sales' && (
          <div className="p-8">
            <div className="mb-6">
              <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '1.8rem', fontWeight: 700, color: '#1a1a14' }}>Registro de Ventas</h1>
              <p className="text-[#6b6558] text-sm">{sales.length} transacciones · {fmt(totalRevenue)} ingresados</p>
            </div>

            {/* Summary cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {(['Confirmada', 'Pendiente', 'Rechazada', 'Cancelada'] as const).map((s) => {
                const count = sales.filter((x) => x.status === s).length;
                const total = sales.filter((x) => x.status === s).reduce((sum, x) => sum + x.amount, 0);
                return (
                  <div key={s} className="bg-white rounded-xl border border-border p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColor[s]}`}>{s}</span>
                      <span className="text-lg font-bold text-[#1a1a14]">{count}</span>
                    </div>
                    <p className="text-sm font-semibold text-[#1b5e3e]">{fmt(total)}</p>
                  </div>
                );
              })}
            </div>

            <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-border flex items-center gap-3">
                <span className="text-sm text-[#6b6558]">Filtrar:</span>
                {['Todas', 'Confirmada', 'Pendiente', 'Rechazada', 'Cancelada'].map((f) => (
                  <button key={f} onClick={() => setSalesFilter(f)}
                    className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all ${salesFilter === f ? 'bg-[#1b5e3e] text-white' : 'bg-[#f5f1ea] text-[#6b6558] hover:bg-[#ece8df]'}`}>
                    {f}
                  </button>
                ))}
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-[#f5f1ea]">
                      {['ID Reserva', 'Tour', 'Pasajero', 'Correo', 'Fecha tour', 'Pax', 'Monto', 'Estado', 'Operador'].map((h) => (
                        <th key={h} className="text-left px-4 py-3 text-xs text-[#6b6558] font-semibold uppercase tracking-wider whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSales.map((s, i) => (
                      <tr key={s.id} className={i % 2 === 0 ? 'bg-white' : 'bg-[#faf8f4]'}>
                        <td className="px-4 py-3 font-mono text-xs text-[#6b6558] whitespace-nowrap">{s.id}</td>
                        <td className="px-4 py-3 text-[#1a1a14] whitespace-nowrap">{s.tourName}</td>
                        <td className="px-4 py-3 text-[#1a1a14]">{s.passenger}</td>
                        <td className="px-4 py-3 text-[#6b6558] text-xs">{s.email}</td>
                        <td className="px-4 py-3 text-[#6b6558] whitespace-nowrap">{fmtDate(s.tourDate)}</td>
                        <td className="px-4 py-3 text-center text-[#6b6558]">{s.passengers}</td>
                        <td className="px-4 py-3 font-semibold text-[#1b5e3e] whitespace-nowrap">{fmt(s.amount)}</td>
                        <td className="px-4 py-3">
                          <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusColor[s.status]}`}>{s.status}</span>
                        </td>
                        <td className="px-4 py-3 text-xs text-[#6b6558]">{s.operator}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Tour form modal */}
      {tourForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setTourForm(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-border px-6 py-4 flex items-center justify-between rounded-t-2xl">
              <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 700, fontSize: '1.2rem', color: '#1a1a14' }}>
                {tours.find((t) => t.id === tourForm.id) ? 'Editar tour' : 'Agregar tour'}
              </h2>
              <button onClick={() => setTourForm(null)} className="p-2 rounded-lg hover:bg-[#f5f1ea] transition-all">
                <X className="w-4 h-4 text-[#6b6558]" />
              </button>
            </div>
            <TourForm tour={tourForm} onChange={setTourForm} onSave={saveTour} onCancel={() => setTourForm(null)} />
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
            <h3 className="text-center font-semibold text-[#1a1a14] mb-1">¿Eliminar tour?</h3>
            <p className="text-center text-sm text-[#6b6558] mb-5">Esta acción no se puede deshacer.</p>
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

function StatCard({ icon, label, value, color, small }: { icon: React.ReactNode; label: string; value: string; color: string; small?: boolean }) {
  return (
    <div className="bg-white rounded-2xl border border-border p-5 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: color + '15', color }}>
          {icon}
        </div>
      </div>
      <p className={`font-bold text-[#1a1a14] mb-0.5 ${small ? 'text-lg' : 'text-2xl'}`}>{value}</p>
      <p className="text-xs text-[#6b6558]">{label}</p>
    </div>
  );
}

function TourForm({ tour, onChange, onSave, onCancel }: { tour: ManagedTour; onChange: (t: ManagedTour) => void; onSave: () => void; onCancel: () => void }) {
  const set = (key: keyof ManagedTour, val: unknown) => onChange({ ...tour, [key]: val });

  return (
    <div className="p-6 space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <label className="block text-sm font-medium text-[#1a1a14] mb-1.5">Nombre del tour <span className="text-[#c8531a]">*</span></label>
          <input value={tour.name} onChange={(e) => set('name', e.target.value)} placeholder="Ej: Saltos del Petrohué" className={fi} />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#1a1a14] mb-1.5">Categoría</label>
          <select value={tour.category} onChange={(e) => set('category', e.target.value)} className={fi}>
            {['Naturaleza', 'Aventura', 'Bienestar', 'Cultural', 'Trekking'].map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-[#1a1a14] mb-1.5">Dificultad</label>
          <select value={tour.difficulty} onChange={(e) => set('difficulty', e.target.value as ManagedTour['difficulty'])} className={fi}>
            {['Fácil', 'Moderado', 'Difícil'].map((d) => <option key={d}>{d}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-[#1a1a14] mb-1.5">Precio individual (CLP)</label>
          <input type="number" value={tour.price} onChange={(e) => set('price', Number(e.target.value))} className={fi} />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#1a1a14] mb-1.5">Precio grupal (CLP)</label>
          <input type="number" value={tour.groupPrice} onChange={(e) => set('groupPrice', Number(e.target.value))} className={fi} />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#1a1a14] mb-1.5">Duración</label>
          <input value={tour.duration} onChange={(e) => set('duration', e.target.value)} placeholder="Ej: 1 día" className={fi} />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#1a1a14] mb-1.5">Cupos máximos</label>
          <input type="number" value={tour.maxGroup} onChange={(e) => set('maxGroup', Number(e.target.value))} className={fi} />
        </div>
        <div className="col-span-2">
          <label className="block text-sm font-medium text-[#1a1a14] mb-1.5">URL imagen principal</label>
          <input value={tour.heroImage} onChange={(e) => set('heroImage', e.target.value)} placeholder="https://images.unsplash.com/…" className={fi} />
          {tour.heroImage && <img src={tour.heroImage} alt="preview" className="mt-2 h-24 w-full object-cover rounded-lg" />}
        </div>
        <div className="col-span-2">
          <label className="block text-sm font-medium text-[#1a1a14] mb-1.5">Descripción corta</label>
          <input value={tour.shortDescription} onChange={(e) => set('shortDescription', e.target.value)} placeholder="Resumen del tour…" className={fi} />
        </div>
        <div className="col-span-2">
          <label className="block text-sm font-medium text-[#1a1a14] mb-1.5">Descripción completa</label>
          <textarea value={tour.description} onChange={(e) => set('description', e.target.value)} rows={3} placeholder="Descripción detallada del tour…" className={`${fi} resize-none`} />
        </div>
        <div className="col-span-2">
          <label className="block text-sm font-medium text-[#1a1a14] mb-1.5">Punto de encuentro</label>
          <input value={tour.meetingPoint} onChange={(e) => set('meetingPoint', e.target.value)} placeholder="Ej: Hotel Campanario, Puerto Varas — 08:00 hrs" className={fi} />
        </div>
      </div>

      <div className="flex items-center justify-between pt-2">
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={tour.active} onChange={(e) => set('active', e.target.checked)} className="w-4 h-4 accent-[#1b5e3e]" />
          <span className="text-sm text-[#1a1a14]">Tour activo (visible al público)</span>
        </label>
        <div className="flex gap-3">
          <button onClick={onCancel} className="px-4 py-2 rounded-lg border border-border text-[#6b6558] text-sm hover:bg-muted transition-all">Cancelar</button>
          <button onClick={onSave} className="px-5 py-2 rounded-lg text-white text-sm font-semibold hover:opacity-90 transition-all" style={{ background: '#1b5e3e' }}>
            Guardar tour
          </button>
        </div>
      </div>
    </div>
  );
}

const fi = 'w-full border border-border rounded-lg px-3 py-2.5 text-sm text-[#1a1a14] bg-white outline-none focus:ring-2 focus:ring-[#1b5e3e] transition-all';
