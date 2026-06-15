import React, { useState } from 'react';
import { Mountain, Eye, EyeOff } from 'lucide-react';

interface Props {
  onLogin: () => void;
}

export function LoginScreen({ onLogin }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onLogin();
    }, 900);
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden">
      {/* Hero background */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1758409571024-20dcf43d52bf?w=1920&h=1080&fit=crop&auto=format&q=85"
          alt="Región de los Lagos, Chile"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
        <div className="absolute inset-0 bg-[#1b5e3e]/20" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-md px-6 py-8">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-[#1b5e3e] flex items-center justify-center">
              <Mountain className="w-5 h-5 text-white" />
            </div>
            <span
              className="text-white tracking-[0.15em] uppercase"
              style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '1.6rem', fontWeight: 700 }}
            >
              3MTOURS
            </span>
          </div>
          <p className="text-white/70 text-sm tracking-widest uppercase">Región de Los Lagos · Patagonia</p>
        </div>

        {/* Card */}
        <div
          className="rounded-2xl p-8 shadow-2xl"
          style={{ background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.18)' }}
        >
          <h2
            className="text-white mb-1"
            style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '1.5rem', fontWeight: 600 }}
          >
            Bienvenido de vuelta
          </h2>
          <p className="text-white/60 text-sm mb-8">Inicia sesión para reservar tu próxima aventura</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-white/80 text-sm mb-1.5">Correo electrónico</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@correo.cl"
                className="w-full rounded-lg px-4 py-3 text-white placeholder-white/30 outline-none focus:ring-2 focus:ring-[#1b5e3e] transition-all"
                style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)' }}
              />
            </div>

            <div>
              <label className="block text-white/80 text-sm mb-1.5">Contraseña</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-lg px-4 py-3 pr-12 text-white placeholder-white/30 outline-none focus:ring-2 focus:ring-[#1b5e3e] transition-all"
                  style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/80 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-white/60 cursor-pointer">
                <input type="checkbox" className="rounded" />
                Recordarme
              </label>
              <button type="button" className="text-[#4ade80] hover:text-[#86efac] transition-colors">
                ¿Olvidaste tu contraseña?
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl text-white font-semibold transition-all active:scale-[0.98] disabled:opacity-70 mt-2"
              style={{ background: loading ? '#2d7a55' : '#1b5e3e', boxShadow: '0 4px 20px rgba(27,94,62,0.4)' }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Ingresando...
                </span>
              ) : 'Iniciar Sesión'}
            </button>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10" />
              </div>
              <div className="relative flex justify-center text-xs text-white/40">
                <span className="px-3" style={{ background: 'transparent' }}>o continúa como</span>
              </div>
            </div>

            <button
              type="button"
              onClick={onLogin}
              className="w-full py-3 rounded-xl text-white/80 hover:text-white text-sm transition-all"
              style={{ border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.05)' }}
            >
              Invitado — explorar sin cuenta
            </button>
          </form>
        </div>

        {/* Footer note */}
        <p className="text-center text-white/40 text-xs mt-6">
          ¿No tienes cuenta?{' '}
          <button className="text-[#4ade80] hover:underline" onClick={onLogin}>
            Regístrate gratis
          </button>
        </p>
      </div>

      {/* Bottom attribution */}
      <div className="absolute bottom-4 left-0 right-0 text-center text-white/30 text-xs">
        Lago Todos los Santos · Región de Los Lagos, Chile
      </div>
    </div>
  );
}
