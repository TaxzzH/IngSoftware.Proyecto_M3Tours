import React, { useState } from 'react';
import { Mountain, Eye, EyeOff, ArrowLeft, CheckCircle, AlertCircle, User } from 'lucide-react';
import { AppUser } from '../data/auth';

interface Props {
  onRegister: (user: Omit<AppUser, 'id' | 'createdAt'>) => void;
  onBack: () => void;
}

function fi(hasError: boolean) {
  return `w-full border rounded-lg px-4 py-3 text-white placeholder-white/25 outline-none transition-all ${hasError ? 'border-red-400/60 bg-red-500/10 focus:ring-2 focus:ring-red-400/40' : 'border-white/18 focus:ring-2 focus:ring-[#1b5e3e]'}`;
}

export function RegisterScreen({ onRegister, onBack }: Props) {
  const [form, setForm] = useState({
    nombre: '', apellido: '', rut: '', email: '',
    telefono: '', password: '', confirm: '',
  });
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState<Partial<typeof form & { terms: string }>>({});
  const [terms, setTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const set = (k: keyof typeof form, v: string) => {
    setForm((f) => ({ ...f, [k]: v }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: undefined }));
  };

  const validate = () => {
    const e: typeof errors = {};
    if (!form.nombre.trim()) e.nombre = 'Requerido';
    if (!form.apellido.trim()) e.apellido = 'Requerido';
    if (!form.rut.trim()) e.rut = 'Requerido';
    if (!form.email.includes('@')) e.email = 'Correo inválido';
    if (!form.telefono.trim()) e.telefono = 'Requerido';
    if (form.password.length < 6) e.password = 'Mínimo 6 caracteres';
    if (form.password !== form.confirm) e.confirm = 'Las contraseñas no coinciden';
    if (!terms) e.terms = 'Debes aceptar los términos';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setTimeout(() => {
        onRegister({
          email: form.email,
          password: form.password,
          name: `${form.nombre} ${form.apellido}`,
          role: 'user',
          blocked: false,
        });
      }, 1200);
    }, 900);
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden py-8">
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1759322437317-d89deaef8caa?w=1920&h=1080&fit=crop&auto=format&q=85"
          alt="Patagonia"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/45 to-black/70" />
        <div className="absolute inset-0 bg-[#1b5e3e]/15" />
      </div>

      <div className="relative z-10 w-full max-w-md px-6">
        {/* Back button */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-6 text-sm"
        >
          <ArrowLeft className="w-4 h-4" /> Volver al inicio de sesión
        </button>

        {/* Logo */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-9 h-9 rounded-full bg-[#1b5e3e] flex items-center justify-center">
            <Mountain className="w-4 h-4 text-white" />
          </div>
          <span className="text-white tracking-[0.12em] uppercase"
            style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '1.3rem', fontWeight: 700 }}>
            3MTOURS
          </span>
        </div>

        {/* Card */}
        <div className="rounded-2xl p-7 shadow-2xl"
          style={{ background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.15)' }}>

          {success ? (
            <div className="text-center py-6">
              <div className="w-16 h-16 rounded-full bg-[#1b5e3e]/40 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-[#4ade80]" />
              </div>
              <h2 className="text-white font-bold text-lg mb-2" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                ¡Cuenta creada!
              </h2>
              <p className="text-white/60 text-sm">Iniciando sesión automáticamente…</p>
            </div>
          ) : (
            <>
              <h2 className="text-white mb-1"
                style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '1.3rem', fontWeight: 600 }}>
                Crear cuenta
              </h2>
              <p className="text-white/50 text-sm mb-6">Únete a la comunidad 3MTOURS</p>

              <form onSubmit={handleSubmit} className="space-y-3">
                {/* Name row */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-white/70 text-xs mb-1.5">Nombre <span className="text-red-400">*</span></label>
                    <input
                      value={form.nombre} onChange={(e) => set('nombre', e.target.value)}
                      placeholder="María" className={fi(!!errors.nombre)}
                      style={{ background: 'rgba(255,255,255,0.1)' }}
                    />
                    {errors.nombre && <p className="text-red-400 text-xs mt-1">{errors.nombre}</p>}
                  </div>
                  <div>
                    <label className="block text-white/70 text-xs mb-1.5">Apellido <span className="text-red-400">*</span></label>
                    <input
                      value={form.apellido} onChange={(e) => set('apellido', e.target.value)}
                      placeholder="González" className={fi(!!errors.apellido)}
                      style={{ background: 'rgba(255,255,255,0.1)' }}
                    />
                    {errors.apellido && <p className="text-red-400 text-xs mt-1">{errors.apellido}</p>}
                  </div>
                </div>

                {/* RUT */}
                <div>
                  <label className="block text-white/70 text-xs mb-1.5">RUT <span className="text-red-400">*</span></label>
                  <input
                    value={form.rut} onChange={(e) => set('rut', e.target.value)}
                    placeholder="12.345.678-9" className={fi(!!errors.rut)}
                    style={{ background: 'rgba(255,255,255,0.1)' }}
                  />
                  {errors.rut && <p className="text-red-400 text-xs mt-1">{errors.rut}</p>}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-white/70 text-xs mb-1.5">Correo electrónico <span className="text-red-400">*</span></label>
                  <input
                    type="email" value={form.email} onChange={(e) => set('email', e.target.value)}
                    placeholder="tu@correo.cl" className={fi(!!errors.email)}
                    style={{ background: 'rgba(255,255,255,0.1)' }}
                  />
                  {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-white/70 text-xs mb-1.5">Teléfono <span className="text-red-400">*</span></label>
                  <input
                    value={form.telefono} onChange={(e) => set('telefono', e.target.value)}
                    placeholder="+56 9 1234 5678" className={fi(!!errors.telefono)}
                    style={{ background: 'rgba(255,255,255,0.1)' }}
                  />
                  {errors.telefono && <p className="text-red-400 text-xs mt-1">{errors.telefono}</p>}
                </div>

                {/* Passwords */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-white/70 text-xs mb-1.5">Contraseña <span className="text-red-400">*</span></label>
                    <div className="relative">
                      <input
                        type={showPass ? 'text' : 'password'} value={form.password}
                        onChange={(e) => set('password', e.target.value)}
                        placeholder="••••••" className={`${fi(!!errors.password)} pr-9`}
                        style={{ background: 'rgba(255,255,255,0.1)' }}
                      />
                      <button type="button" onClick={() => setShowPass(!showPass)}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/35 hover:text-white/70">
                        {showPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                    {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
                  </div>
                  <div>
                    <label className="block text-white/70 text-xs mb-1.5">Confirmar <span className="text-red-400">*</span></label>
                    <div className="relative">
                      <input
                        type={showConfirm ? 'text' : 'password'} value={form.confirm}
                        onChange={(e) => set('confirm', e.target.value)}
                        placeholder="••••••" className={`${fi(!!errors.confirm)} pr-9`}
                        style={{ background: 'rgba(255,255,255,0.1)' }}
                      />
                      <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/35 hover:text-white/70">
                        {showConfirm ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                    {errors.confirm && <p className="text-red-400 text-xs mt-1">{errors.confirm}</p>}
                  </div>
                </div>

                {/* Terms */}
                <div>
                  <label className="flex items-start gap-2.5 cursor-pointer">
                    <input type="checkbox" checked={terms} onChange={(e) => { setTerms(e.target.checked); setErrors((er) => ({ ...er, terms: undefined })); }}
                      className="mt-0.5 w-4 h-4 rounded accent-[#1b5e3e]" />
                    <span className="text-white/60 text-xs leading-relaxed">
                      Acepto los{' '}
                      <span className="text-[#4ade80] hover:underline cursor-pointer">Términos de servicio</span>
                      {' '}y la{' '}
                      <span className="text-[#4ade80] hover:underline cursor-pointer">Política de privacidad</span>
                    </span>
                  </label>
                  {errors.terms && (
                    <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {errors.terms}
                    </p>
                  )}
                </div>

                <button
                  type="submit" disabled={loading}
                  className="w-full py-3.5 rounded-xl text-white font-semibold transition-all active:scale-[0.98] disabled:opacity-60 mt-1 flex items-center justify-center gap-2"
                  style={{ background: '#1b5e3e', boxShadow: '0 4px 20px rgba(27,94,62,0.4)' }}
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Creando cuenta…
                    </>
                  ) : (
                    <><User className="w-4 h-4" /> Crear cuenta</>
                  )}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
