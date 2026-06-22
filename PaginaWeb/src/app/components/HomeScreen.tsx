import React, { useState, useRef, useEffect } from 'react';
import { Mountain, Search, Users, Calendar, Star, ChevronRight, Shield, Award, CreditCard, MapPin, Clock, ArrowRight, LogOut, Luggage, ChevronDown, User } from 'lucide-react';
import { tours, Tour } from '../data/tours';
import { AppUser } from '../data/auth';

interface Props {
  currentUser: AppUser;
  onNavigateCatalog: (params?: { destination: string; date: string; travelers: number }) => void;
  onSelectTour: (tour: Tour) => void;
  onLogout: () => void;
  onMyTrips: () => void;
}

const OPERATOR_TOURS = {
  PT: [
    { name: 'Saltos del Petrohué', image: 'https://images.unsplash.com/photo-1712921674876-83cda22594ec?w=80&h=80&fit=crop&auto=format&q=80' },
    { name: 'Lago Todos los Santos', image: 'https://images.unsplash.com/photo-1758409571024-20dcf43d52bf?w=80&h=80&fit=crop&auto=format&q=80' },
    { name: 'Volcán Osorno', image: 'https://images.unsplash.com/photo-1578704399126-38975ba256d7?w=80&h=80&fit=crop&auto=format&q=80' },
  ],
  TM: [
    { name: 'Termas de Puyehue', image: 'https://images.unsplash.com/photo-1759089572780-461b7202761b?w=80&h=80&fit=crop&auto=format&q=80' },
    { name: 'Isla de Chiloé', image: 'https://images.unsplash.com/photo-1780903244920-0d808b6a509d?w=80&h=80&fit=crop&auto=format&q=80' },
    { name: 'Valle de Cochamó', image: 'https://images.unsplash.com/photo-1759322437317-d89deaef8caa?w=80&h=80&fit=crop&auto=format&q=80' },
  ],
  TN: [
    { name: 'Volcán Osorno', image: 'https://images.unsplash.com/photo-1578704399126-38975ba256d7?w=80&h=80&fit=crop&auto=format&q=80' },
    { name: 'Saltos del Petrohué', image: 'https://images.unsplash.com/photo-1712921674876-83cda22594ec?w=80&h=80&fit=crop&auto=format&q=80' },
    { name: 'Lago Todos los Santos', image: 'https://images.unsplash.com/photo-1758409571024-20dcf43d52bf?w=80&h=80&fit=crop&auto=format&q=80' },
  ],
  TK: [
    { name: 'Valle de Cochamó', image: 'https://images.unsplash.com/photo-1759322437317-d89deaef8caa?w=80&h=80&fit=crop&auto=format&q=80' },
    { name: 'Volcán Osorno', image: 'https://images.unsplash.com/photo-1578704399126-38975ba256d7?w=80&h=80&fit=crop&auto=format&q=80' },
    { name: 'Termas de Puyehue', image: 'https://images.unsplash.com/photo-1759089572780-461b7202761b?w=80&h=80&fit=crop&auto=format&q=80' },
  ],
};

const OPERATORS = [
  { name: 'PUERTOTOURS',     initials: 'PT', color: '#1b5e3e', key: 'PT' },
  { name: 'TURISMOPTOMONTT', initials: 'TM', color: '#c8531a', key: 'TM' },
  { name: 'TURISMONTT',      initials: 'TN', color: '#2d5fa6', key: 'TN' },
  { name: 'TREKKINGMONTT',   initials: 'TK', color: '#7c3a8a', key: 'TK' },
] as const;

const REGIONS = [
  { name: 'Puerto Varas', image: 'https://images.unsplash.com/photo-1578704399126-38975ba256d7?w=600&h=400&fit=crop&auto=format&q=80', count: 12 },
  { name: 'Chiloé', image: 'https://images.unsplash.com/photo-1490782300182-697b80ad4293?w=600&h=400&fit=crop&auto=format&q=80', count: 8 },
  { name: 'Puyehue', image: 'https://images.unsplash.com/photo-1759089572780-461b7202761b?w=600&h=400&fit=crop&auto=format&q=80', count: 6 },
  { name: 'Cochamó', image: 'https://images.unsplash.com/photo-1759322437317-d89deaef8caa?w=600&h=400&fit=crop&auto=format&q=80', count: 4 },
];

const FEATURED = tours.slice(0, 4);

function formatPrice(n: number) {
  return `$${n.toLocaleString('es-CL')}`;
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      <Star className="w-3.5 h-3.5 fill-[#c8531a] text-[#c8531a]" />
      <span className="text-sm font-semibold text-[#1a1a14]">{rating}</span>
    </div>
  );
}

export function HomeScreen({ currentUser, onNavigateCatalog, onSelectTour, onLogout, onMyTrips }: Props) {
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState('');
  const [travelers, setTravelers] = useState(2);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = () => {
    onNavigateCatalog({ destination, date, travelers });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-4" style={{ background: 'rgba(245,241,234,0.95)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(27,94,62,0.1)' }}>
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-[#1b5e3e] flex items-center justify-center">
            <Mountain className="w-4 h-4 text-white" />
          </div>
          <span style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '1.2rem', fontWeight: 700, color: '#1b5e3e', letterSpacing: '0.1em' }}>
            3MTOURS
          </span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm text-[#1a1a14]/70">
          <button className="hover:text-[#1b5e3e] transition-colors">Destinos</button>
          <button onClick={() => onNavigateCatalog()} className="hover:text-[#1b5e3e] transition-colors">Tours</button>
          <button className="hover:text-[#1b5e3e] transition-colors">Nosotros</button>
          <button className="hover:text-[#1b5e3e] transition-colors">Contacto</button>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigateCatalog()}
            className="hidden md:block px-4 py-2 rounded-lg text-sm text-white transition-all hover:opacity-90"
            style={{ background: '#1b5e3e' }}
          >
            Ver tours
          </button>
          {/* Profile dropdown */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-[#ece8df] transition-all"
            >
              <div className="w-7 h-7 rounded-full bg-[#1b5e3e]/20 border border-[#1b5e3e]/30 flex items-center justify-center text-[#1b5e3e] font-bold text-xs">
                {currentUser.name.charAt(0)}
              </div>
              <span className="hidden md:block text-sm text-[#1a1a14] font-medium">{currentUser.name.split(' ')[0]}</span>
              <ChevronDown className={`w-3.5 h-3.5 text-[#6b6558] transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
            </button>
            {profileOpen && (
              <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-xl border border-border shadow-xl py-1.5 z-50">
                <div className="px-4 py-2.5 border-b border-border">
                  <p className="text-sm font-semibold text-[#1a1a14] truncate">{currentUser.name}</p>
                  <p className="text-xs text-[#6b6558] truncate">{currentUser.email}</p>
                </div>
                <button
                  onClick={() => { setProfileOpen(false); onMyTrips(); }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[#1a1a14] hover:bg-[#f5f1ea] transition-colors text-left"
                >
                  <Luggage className="w-4 h-4 text-[#1b5e3e]" /> Mis Viajes
                </button>
                <button
                  onClick={() => { setProfileOpen(false); }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[#1a1a14] hover:bg-[#f5f1ea] transition-colors text-left"
                >
                  <User className="w-4 h-4 text-[#6b6558]" /> Mi perfil
                </button>
                <div className="border-t border-border mt-1 pt-1">
                  <button
                    onClick={() => { setProfileOpen(false); onLogout(); }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors text-left"
                  >
                    <LogOut className="w-4 h-4" /> Cerrar sesión
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative h-screen min-h-[600px] flex items-center justify-center">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1758409571145-b1f545707b14?w=1920&h=1080&fit=crop&auto=format&q=85"
            alt="Región de Los Lagos, Chile"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/60" />
        </div>

        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 mb-6">
            <Award className="w-3.5 h-3.5 text-[#4ade80]" />
            <span className="text-white text-sm">Guías certificados SERNATUR · Región de Los Lagos</span>
          </div>
          <h1
            className="text-white mb-4 drop-shadow-lg"
            style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', fontWeight: 700, lineHeight: 1.1 }}
          >
            Descubre la Patagonia<br />que pocos conocen
          </h1>
          <p className="text-white/80 mb-10 max-w-xl mx-auto" style={{ fontSize: '1.1rem' }}>
            Tours exclusivos por los Saltos del Petrohué, Volcán Osorno, Chiloé y los rincones secretos de la Región de Los Lagos.
          </p>

          {/* Search Bar */}
          <div className="bg-white rounded-2xl shadow-2xl p-2 flex flex-col md:flex-row gap-2 max-w-3xl mx-auto">
            <div className="flex-1 flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[#f5f1ea] transition-colors cursor-text">
              <MapPin className="w-4 h-4 text-[#1b5e3e] shrink-0" />
              <div className="flex-1 text-left">
                <p className="text-xs text-[#6b6558] mb-0.5">Destino</p>
                <input
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder="¿A dónde quieres ir?"
                  className="w-full text-sm text-[#1a1a14] bg-transparent outline-none placeholder-[#c5c0b5]"
                />
              </div>
            </div>
            <div className="w-px bg-[#ece8df] hidden md:block" />
            <div className="flex-1 flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[#f5f1ea] transition-colors cursor-text">
              <Calendar className="w-4 h-4 text-[#1b5e3e] shrink-0" />
              <div className="flex-1 text-left">
                <p className="text-xs text-[#6b6558] mb-0.5">Fecha</p>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full text-sm text-[#1a1a14] bg-transparent outline-none"
                  min="2026-06-15"
                />
              </div>
            </div>
            <div className="w-px bg-[#ece8df] hidden md:block" />
            <div className="flex-1 flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[#f5f1ea] transition-colors">
              <Users className="w-4 h-4 text-[#1b5e3e] shrink-0" />
              <div className="flex-1 text-left">
                <p className="text-xs text-[#6b6558] mb-0.5">Viajeros</p>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setTravelers(Math.max(1, travelers - 1))}
                    className="w-6 h-6 rounded-full border border-[#1b5e3e] text-[#1b5e3e] flex items-center justify-center hover:bg-[#1b5e3e] hover:text-white transition-all text-sm"
                  >−</button>
                  <span className="text-sm text-[#1a1a14] w-4 text-center">{travelers}</span>
                  <button
                    onClick={() => setTravelers(Math.min(20, travelers + 1))}
                    className="w-6 h-6 rounded-full border border-[#1b5e3e] text-[#1b5e3e] flex items-center justify-center hover:bg-[#1b5e3e] hover:text-white transition-all text-sm"
                  >+</button>
                </div>
              </div>
            </div>
            <button
              onClick={handleSearch}
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-white font-semibold transition-all hover:opacity-90 active:scale-[0.98]"
              style={{ background: '#1b5e3e', minWidth: '120px' }}
            >
              <Search className="w-4 h-4" />
              Buscar
            </button>
          </div>

          {/* Quick stats */}
          <div className="flex items-center justify-center gap-8 mt-8 text-white/70 text-sm">
            <span>✦ +500 aventureros satisfechos</span>
            <span>✦ 6 destinos exclusivos</span>
            <span>✦ Guías SERNATUR certificados</span>
          </div>
        </div>
      </section>

      {/* Featured Tours */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-[#c8531a] text-sm tracking-widest uppercase mb-2">Experiencias únicas</p>
            <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '2rem', color: '#1a1a14', fontWeight: 700 }}>
              Tours Destacados
            </h2>
          </div>
          <button
            onClick={() => onNavigateCatalog()}
            className="hidden md:flex items-center gap-1.5 text-[#1b5e3e] text-sm hover:gap-2.5 transition-all"
          >
            Ver todos los tours <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURED.map((tour) => (
            <TourCard key={tour.id} tour={tour} onClick={() => onSelectTour(tour)} />
          ))}
        </div>
      </section>

      {/* Operadores Destacados */}
      <section className="py-16 px-6 max-w-7xl mx-auto">
        <p
          className="mb-5"
          style={{ fontWeight: 700, textTransform: 'uppercase', fontSize: '16px', color: '#1a1a14', letterSpacing: '0.04em' }}
        >
          TOURS OPERADORES DESTACADOS
        </p>
        <div
          className="flex gap-3 overflow-x-auto pb-2"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {OPERATORS.map((op) => (
            <OperatorCard
              key={op.name}
              name={op.name}
              initials={op.initials}
              color={op.color}
              miniTours={OPERATOR_TOURS[op.key]}
            />
          ))}
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-16 px-6" style={{ background: '#1b5e3e' }}>
        <div className="max-w-5xl mx-auto">
          <p className="text-center text-white/60 text-sm tracking-widest uppercase mb-10">Reserva con confianza</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <TrustBadge
              icon={<CreditCard className="w-8 h-8" />}
              title="Pago seguro Webpay"
              description="Transacciones protegidas con tecnología Transbank. Aceptamos Visa y Mastercard."
            />
            <TrustBadge
              icon={<Award className="w-8 h-8" />}
              title="Guías SERNATUR"
              description="Todos nuestros guías están certificados por el Servicio Nacional de Turismo de Chile."
            />
            <TrustBadge
              icon={<Shield className="w-8 h-8" />}
              title="Cancelación flexible"
              description="Cancela hasta 48 horas antes sin costo. Tu aventura, tus tiempos."
            />
          </div>

          {/* Webpay logos */}
          <div className="flex items-center justify-center gap-8 mt-12 pt-8 border-t border-white/20">
            <div className="flex items-center gap-2">
              <div className="bg-white rounded px-3 py-1.5 flex items-center gap-1.5">
                <div className="w-10 h-5 rounded" style={{ background: 'linear-gradient(135deg, #1a1f71, #00579f)' }} />
                <span className="text-[10px] font-bold text-[#1a1f71]">VISA</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="bg-white rounded px-3 py-1.5 flex items-center gap-1.5">
                <div className="w-5 h-5 rounded-full" style={{ background: '#eb001b' }} />
                <div className="w-5 h-5 rounded-full -ml-2.5" style={{ background: '#f79e1b', opacity: 0.9 }} />
              </div>
            </div>
            <div className="bg-white rounded px-4 py-1.5">
              <div className="flex items-center gap-1">
                <div className="w-4 h-4 rounded" style={{ background: '#e30613' }} />
                <span className="text-[11px] font-bold text-[#e30613]">Webpay</span>
                <span className="text-[9px] text-[#1a1a14]/60">Plus</span>
              </div>
            </div>
            <div className="bg-white rounded px-3 py-1.5">
              <span className="text-[10px] font-bold text-[#003087]">TRANSBANK</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-8 bg-[#1a1a14] text-white/60 text-sm">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Mountain className="w-4 h-4 text-[#4ade80]" />
            <span style={{ fontFamily: "'Playfair Display', Georgia, serif", color: 'white', fontWeight: 600 }}>3MTOURS</span>
            <span>· Región de Los Lagos, Chile</span>
          </div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">Términos</a>
            <a href="#" className="hover:text-white transition-colors">Privacidad</a>
            <a href="#" className="hover:text-white transition-colors">Contacto</a>
          </div>
          <p>© 2026 3MTOURS · Todos los derechos reservados</p>
        </div>
      </footer>
    </div>
  );
}

function TourCard({ tour, onClick }: { tour: Tour; onClick: () => void }) {
  const difficultyColor = {
    'Fácil': 'bg-emerald-100 text-emerald-800',
    'Moderado': 'bg-amber-100 text-amber-800',
    'Difícil': 'bg-red-100 text-red-800',
  }[tour.difficulty];

  return (
    <button
      onClick={onClick}
      className="group text-left bg-card rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-border"
    >
      <div className="relative overflow-hidden aspect-[4/3] bg-[#ece8df]">
        <img
          src={tour.heroImage}
          alt={tour.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3">
          <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${difficultyColor}`}>
            {tour.difficulty}
          </span>
        </div>
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-lg px-2 py-1">
          <StarRating rating={tour.rating} />
        </div>
      </div>
      <div className="p-4">
        <p className="text-[#6b6558] text-xs mb-1 flex items-center gap-1">
          <MapPin className="w-3 h-3" /> {tour.region}
        </p>
        <h3 className="text-[#1a1a14] font-semibold mb-1" style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '1rem' }}>
          {tour.name}
        </h3>
        <p className="text-[#6b6558] text-xs leading-relaxed mb-3 line-clamp-2">{tour.shortDescription}</p>
        <div className="flex items-center gap-3 text-xs text-[#6b6558] mb-3">
          <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {tour.duration}</span>
          <span className="flex items-center gap-1"><Users className="w-3 h-3" /> Máx. {tour.maxGroup}</span>
        </div>
        <div className="flex items-center justify-between border-t border-border pt-3">
          <div>
            <p className="text-xs text-[#6b6558]">Desde</p>
            <p className="font-bold text-[#1b5e3e]">{formatPrice(tour.price)}<span className="text-xs text-[#6b6558] font-normal"> /pax</span></p>
          </div>
          <div className="flex items-center gap-1 text-xs text-[#1b5e3e] font-medium group-hover:gap-2 transition-all">
            Ver tour <ChevronRight className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>
    </button>
  );
}

function OperatorCard({
  name, initials, color, miniTours,
}: {
  name: string;
  initials: string;
  color: string;
  miniTours: { name: string; image: string }[];
}) {
  return (
    <div
      className="flex flex-col bg-white rounded-2xl border border-[#ece8df] hover:shadow-md transition-all cursor-pointer shrink-0 overflow-hidden"
      style={{ width: '152px' }}
    >
      {/* Header: avatar + name */}
      <div className="flex flex-col items-center gap-2 px-4 pt-4 pb-3">
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center shrink-0"
          style={{ background: color + '1a', border: `2px solid ${color}35` }}
        >
          <span style={{ color, fontWeight: 700, fontSize: '13px', letterSpacing: '0.02em' }}>
            {initials}
          </span>
        </div>
        <p
          style={{
            fontSize: '9.5px',
            fontWeight: 700,
            color: '#1a1a14',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            whiteSpace: 'nowrap',
          }}
        >
          {name}
        </p>
      </div>

      {/* Divider */}
      <div style={{ height: '1px', background: '#ece8df', margin: '0 12px' }} />

      {/* Tour miniatures */}
      <div className="flex flex-col gap-0 px-3 py-3">
        {miniTours.map((t, i) => (
          <div
            key={i}
            className="flex items-center gap-2 py-1.5"
            style={{ borderBottom: i < miniTours.length - 1 ? '1px solid #f0ece3' : 'none' }}
          >
            <div
              className="shrink-0 rounded-md overflow-hidden"
              style={{ width: '28px', height: '28px', background: '#ece8df' }}
            >
              <img
                src={t.image}
                alt={t.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
            </div>
            <p
              className="leading-tight"
              style={{
                fontSize: '8.5px',
                color: '#3a3a30',
                fontWeight: 500,
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {t.name}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function TrustBadge({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="text-center">
      <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center mx-auto mb-4 text-white">
        {icon}
      </div>
      <h3 className="text-white font-semibold mb-2">{title}</h3>
      <p className="text-white/60 text-sm leading-relaxed">{description}</p>
    </div>
  );
}
