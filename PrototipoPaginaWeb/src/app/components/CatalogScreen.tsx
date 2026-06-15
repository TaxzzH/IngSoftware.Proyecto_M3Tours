import React, { useState, useMemo } from 'react';
import { Mountain, Search, Star, MapPin, Clock, Users, ChevronRight, SlidersHorizontal, X, ArrowLeft } from 'lucide-react';
import { tours, Tour } from '../data/tours';

interface Props {
  initialSearch: string;
  onSelectTour: (tour: Tour) => void;
  onBack: () => void;
}

const CATEGORIES = ['Naturaleza', 'Aventura', 'Bienestar', 'Cultural', 'Trekking'];
const DIFFICULTIES = ['Fácil', 'Moderado', 'Difícil'];
const SORT_OPTIONS = [
  { value: 'featured', label: 'Destacados' },
  { value: 'price-asc', label: 'Precio: menor a mayor' },
  { value: 'price-desc', label: 'Precio: mayor a menor' },
  { value: 'rating', label: 'Mejor valorados' },
];

function formatPrice(n: number) {
  return `$${n.toLocaleString('es-CL')}`;
}

export function CatalogScreen({ initialSearch, onSelectTour, onBack }: Props) {
  const [search, setSearch] = useState(initialSearch);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedDifficulties, setSelectedDifficulties] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState(100000);
  const [sortBy, setSortBy] = useState('featured');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const toggleItem = (list: string[], setList: (v: string[]) => void, item: string) => {
    setList(list.includes(item) ? list.filter((x) => x !== item) : [...list, item]);
  };

  const filtered = useMemo(() => {
    let result = tours.filter((t) => {
      const q = search.toLowerCase();
      const matchSearch =
        !search ||
        t.name.toLowerCase().includes(q) ||
        t.region.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q) ||
        t.shortDescription.toLowerCase().includes(q);
      const matchCategory = selectedCategories.length === 0 || selectedCategories.includes(t.category);
      const matchDifficulty = selectedDifficulties.length === 0 || selectedDifficulties.includes(t.difficulty);
      const matchPrice = t.price <= maxPrice;
      return matchSearch && matchCategory && matchDifficulty && matchPrice;
    });

    if (sortBy === 'price-asc') result = [...result].sort((a, b) => a.price - b.price);
    else if (sortBy === 'price-desc') result = [...result].sort((a, b) => b.price - a.price);
    else if (sortBy === 'rating') result = [...result].sort((a, b) => b.rating - a.rating);

    return result;
  }, [search, selectedCategories, selectedDifficulties, maxPrice, sortBy]);

  const clearAll = () => {
    setSearch('');
    setSelectedCategories([]);
    setSelectedDifficulties([]);
    setMaxPrice(100000);
  };

  const hasFilters = selectedCategories.length > 0 || selectedDifficulties.length > 0 || maxPrice < 100000;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div style={{ background: '#1b5e3e' }} className="pt-6 pb-8 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-white/70 hover:text-white transition-colors text-sm"
            >
              <ArrowLeft className="w-4 h-4" /> Inicio
            </button>
            <div className="w-px h-4 bg-white/20" />
            <div className="flex items-center gap-2">
              <Mountain className="w-4 h-4 text-white/70" />
              <span style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 700, color: 'white', fontSize: '1.1rem', letterSpacing: '0.08em' }}>3MTOURS</span>
            </div>
          </div>
          <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 'clamp(1.8rem,4vw,2.8rem)', color: 'white', fontWeight: 700 }}>
            Catálogo de Tours
          </h1>
          <p className="text-white/70 mt-1">Región de Los Lagos · {filtered.length} experiencias disponibles</p>

          {/* Search + Sort bar */}
          <div className="flex gap-3 mt-6">
            <div className="flex-1 flex items-center gap-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-3">
              <Search className="w-4 h-4 text-white/50 shrink-0" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Busca por destino, actividad…"
                className="flex-1 bg-transparent text-white placeholder-white/40 outline-none text-sm"
              />
              {search && (
                <button onClick={() => setSearch('')} className="text-white/40 hover:text-white">
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white/10 border border-white/20 text-white rounded-xl px-4 py-3 text-sm outline-none cursor-pointer"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value} className="text-[#1a1a14]">{o.label}</option>
              ))}
            </select>
            <button
              onClick={() => setMobileFiltersOpen(true)}
              className="md:hidden flex items-center gap-2 bg-white/10 border border-white/20 text-white rounded-xl px-4 py-3 text-sm"
            >
              <SlidersHorizontal className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-6 py-8 flex gap-8">
        {/* Sidebar */}
        <aside className="hidden md:block w-64 shrink-0">
          <div className="bg-card rounded-xl border border-border p-5 sticky top-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-[#1a1a14] font-semibold flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-[#1b5e3e]" /> Filtros
              </h3>
              {hasFilters && (
                <button onClick={clearAll} className="text-xs text-[#c8531a] hover:underline">Limpiar</button>
              )}
            </div>

            {/* Category */}
            <FilterSection title="Categoría">
              {CATEGORIES.map((c) => (
                <CheckItem
                  key={c}
                  label={c}
                  checked={selectedCategories.includes(c)}
                  onChange={() => toggleItem(selectedCategories, setSelectedCategories, c)}
                  count={tours.filter((t) => t.category === c).length}
                />
              ))}
            </FilterSection>

            {/* Difficulty */}
            <FilterSection title="Dificultad">
              {DIFFICULTIES.map((d) => (
                <CheckItem
                  key={d}
                  label={d}
                  checked={selectedDifficulties.includes(d)}
                  onChange={() => toggleItem(selectedDifficulties, setSelectedDifficulties, d)}
                  count={tours.filter((t) => t.difficulty === d).length}
                  badge={d}
                />
              ))}
            </FilterSection>

            {/* Price */}
            <FilterSection title="Precio máximo" last>
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-[#6b6558]">
                  <span>$10.000</span>
                  <span className="text-[#1b5e3e] font-semibold">{formatPrice(maxPrice)}</span>
                </div>
                <input
                  type="range"
                  min={10000}
                  max={100000}
                  step={5000}
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-[#1b5e3e]"
                />
              </div>
            </FilterSection>
          </div>
        </aside>

        {/* Tour grid */}
        <div className="flex-1">
          {filtered.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-[#6b6558] mb-3">No se encontraron tours con estos filtros</p>
              <button onClick={clearAll} className="text-[#1b5e3e] text-sm hover:underline">Limpiar filtros</button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((tour) => (
                <CatalogCard key={tour.id} tour={tour} onClick={() => onSelectTour(tour)} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile filter drawer */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileFiltersOpen(false)} />
          <div className="absolute bottom-0 left-0 right-0 bg-card rounded-t-2xl p-6 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-semibold text-[#1a1a14]">Filtros</h3>
              <button onClick={() => setMobileFiltersOpen(false)}><X className="w-5 h-5" /></button>
            </div>
            <FilterSection title="Categoría">
              {CATEGORIES.map((c) => (
                <CheckItem key={c} label={c} checked={selectedCategories.includes(c)} onChange={() => toggleItem(selectedCategories, setSelectedCategories, c)} count={tours.filter((t) => t.category === c).length} />
              ))}
            </FilterSection>
            <FilterSection title="Dificultad">
              {DIFFICULTIES.map((d) => (
                <CheckItem key={d} label={d} checked={selectedDifficulties.includes(d)} onChange={() => toggleItem(selectedDifficulties, setSelectedDifficulties, d)} count={tours.filter((t) => t.difficulty === d).length} badge={d} />
              ))}
            </FilterSection>
            <button
              onClick={() => setMobileFiltersOpen(false)}
              className="w-full py-3 rounded-xl text-white mt-4"
              style={{ background: '#1b5e3e' }}
            >
              Ver {filtered.length} tours
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function FilterSection({ title, children, last }: { title: string; children: React.ReactNode; last?: boolean }) {
  return (
    <div className={`${last ? '' : 'border-b border-border pb-4 mb-4'}`}>
      <p className="text-xs tracking-widest uppercase text-[#6b6558] mb-3">{title}</p>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function CheckItem({ label, checked, onChange, count, badge }: { label: string; checked: boolean; onChange: () => void; count: number; badge?: string }) {
  const badgeColor = {
    Fácil: 'bg-emerald-100 text-emerald-700',
    Moderado: 'bg-amber-100 text-amber-700',
    Difícil: 'bg-red-100 text-red-700',
  }[badge ?? ''] ?? '';

  return (
    <label className="flex items-center gap-3 cursor-pointer group">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="w-4 h-4 rounded accent-[#1b5e3e]"
      />
      <span className="flex-1 text-sm text-[#1a1a14] group-hover:text-[#1b5e3e] transition-colors">{label}</span>
      {badge ? (
        <span className={`text-xs px-2 py-0.5 rounded-full ${badgeColor}`}>{count}</span>
      ) : (
        <span className="text-xs text-[#6b6558]">{count}</span>
      )}
    </label>
  );
}

function CatalogCard({ tour, onClick }: { tour: Tour; onClick: () => void }) {
  const difficultyColor = {
    'Fácil': 'bg-emerald-100 text-emerald-800',
    'Moderado': 'bg-amber-100 text-amber-800',
    'Difícil': 'bg-red-100 text-red-800',
  }[tour.difficulty];

  return (
    <button
      onClick={onClick}
      className="group text-left bg-card rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-border flex flex-col"
    >
      <div className="relative overflow-hidden aspect-video bg-[#ece8df]">
        <img
          src={tour.heroImage}
          alt={tour.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3 flex gap-2">
          <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${difficultyColor}`}>{tour.difficulty}</span>
          <span className="text-xs px-2.5 py-1 rounded-full font-medium bg-white/90 text-[#1a1a14]">{tour.category}</span>
        </div>
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-lg px-2.5 py-1 flex items-center gap-1">
          <Star className="w-3.5 h-3.5 fill-[#c8531a] text-[#c8531a]" />
          <span className="text-sm font-semibold text-[#1a1a14]">{tour.rating}</span>
          <span className="text-xs text-[#6b6558]">({tour.reviews})</span>
        </div>
      </div>

      <div className="p-5 flex flex-col flex-1">
        <p className="text-[#6b6558] text-xs flex items-center gap-1 mb-1">
          <MapPin className="w-3 h-3" /> {tour.region}
        </p>
        <h3 className="text-[#1a1a14] font-semibold mb-2" style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '1.05rem' }}>
          {tour.name}
        </h3>
        <p className="text-[#6b6558] text-xs leading-relaxed mb-4 flex-1 line-clamp-2">
          {tour.shortDescription}
        </p>

        <div className="flex items-center gap-4 text-xs text-[#6b6558] mb-4">
          <span className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-[#1b5e3e]" /> {tour.duration}
          </span>
          <span className="flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-[#1b5e3e]" /> Máx. {tour.maxGroup} pax
          </span>
        </div>

        <div className="flex items-center justify-between border-t border-border pt-4">
          <div>
            <p className="text-xs text-[#6b6558]">Desde</p>
            <p className="font-bold text-[#1b5e3e]" style={{ fontSize: '1.1rem' }}>
              {formatPrice(tour.price)}
              <span className="text-xs text-[#6b6558] font-normal"> /pax</span>
            </p>
          </div>
          <div
            className="flex items-center gap-1.5 text-sm text-white px-4 py-2 rounded-lg"
            style={{ background: '#1b5e3e' }}
          >
            Ver tour <ChevronRight className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>
    </button>
  );
}
