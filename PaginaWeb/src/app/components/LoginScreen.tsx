import React, { useState, useRef, useEffect } from 'react';
import {
  Mountain, Eye, EyeOff, AlertCircle, ShieldCheck, Briefcase, User,
  Mail, Phone, ArrowLeft, X, CheckCircle, KeyRound, RefreshCw, Lock,
} from 'lucide-react';
import { AppUser, INITIAL_USERS } from '../data/auth';

interface Props {
  onLogin: (user: AppUser) => void;
  onRegister: () => void;
}

const ROLE_HINTS = [
  { role: 'Administrador', email: 'admin@admin.cl', password: 'admin123', icon: ShieldCheck, color: '#1b5e3e' },
  { role: 'Tour Operador', email: 'tour@operador.cl', password: 'tour123', icon: Briefcase, color: '#c8531a' },
  { role: 'Cliente', email: 'user@user.cl', password: 'user123', icon: User, color: '#2d5fa6' },
];

/* ─── Forgot-password modal ────────────────────────────────── */

type RecoveryMethod = 'email' | 'sms';
type RecoveryStep = 'method' | 'contact' | 'code' | 'newpass' | 'success';

const SIMULATED_CODE = '123456';

function ForgotPasswordModal({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState<RecoveryStep>('method');
  const [method, setMethod] = useState<RecoveryMethod>('email');
  const [contact, setContact] = useState('');
  const [contactError, setContactError] = useState('');
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [codeError, setCodeError] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [passError, setPassError] = useState('');
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [sending, setSending] = useState(false);
  const [resendCount, setResendCount] = useState(0);
  const [resendCooldown, setResendCooldown] = useState(0);
  const codeRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Countdown for resend
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const t = setTimeout(() => setResendCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [resendCooldown]);

  const steps: RecoveryStep[] = ['method', 'contact', 'code', 'newpass', 'success'];
  const stepIndex = steps.indexOf(step);
  const STEP_LABELS = ['Método', 'Contacto', 'Verificar', 'Nueva clave', ''];

  /* handlers */
  const handleSendCode = () => {
    if (!contact.trim()) { setContactError('Este campo es obligatorio'); return; }
    if (method === 'email' && !contact.includes('@')) { setContactError('Ingresa un correo válido'); return; }
    if (method === 'sms' && contact.replace(/\D/g, '').length < 8) { setContactError('Ingresa un número válido'); return; }
    setContactError('');
    setSending(true);
    setTimeout(() => { setSending(false); setStep('code'); setResendCooldown(60); }, 1200);
  };

  const handleCodeChange = (i: number, val: string) => {
    const digit = val.replace(/\D/g, '').slice(-1);
    const next = [...code];
    next[i] = digit;
    setCode(next);
    setCodeError('');
    if (digit && i < 5) codeRefs.current[i + 1]?.focus();
    if (!digit && i > 0) codeRefs.current[i - 1]?.focus();
  };

  const handleCodePaste = (e: React.ClipboardEvent) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted.length === 6) {
      setCode(pasted.split(''));
      codeRefs.current[5]?.focus();
    }
    e.preventDefault();
  };

  const handleVerifyCode = () => {
    const entered = code.join('');
    if (entered.length < 6) { setCodeError('Ingresa el código completo de 6 dígitos'); return; }
    if (entered !== SIMULATED_CODE) { setCodeError('Código incorrecto. Intenta con: 123456'); return; }
    setCodeError('');
    setStep('newpass');
  };

  const handleResend = () => {
    if (resendCooldown > 0) return;
    setCode(['', '', '', '', '', '']);
    setCodeError('');
    setResendCount((c) => c + 1);
    setResendCooldown(60);
    codeRefs.current[0]?.focus();
  };

  const handleSetPassword = () => {
    if (newPass.length < 6) { setPassError('Mínimo 6 caracteres'); return; }
    if (newPass !== confirmPass) { setPassError('Las contraseñas no coinciden'); return; }
    setPassError('');
    setSending(true);
    setTimeout(() => { setSending(false); setStep('success'); }, 900);
  };

  /* shared input style */
  const inputCls = (err: boolean) =>
    `w-full rounded-xl px-4 py-3 text-white placeholder-white/25 outline-none transition-all ${err ? 'border-red-400/60 bg-red-500/10 focus:ring-2 focus:ring-red-400/40' : 'focus:ring-2 focus:ring-[#1b5e3e]'}`;
  const inputStyle = { background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.18)' };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/55 backdrop-blur-sm" onClick={onClose} />

      {/* Panel */}
      <div
        className="relative w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden"
        style={{ background: 'rgba(10,28,20,0.88)', backdropFilter: 'blur(28px)', border: '1px solid rgba(255,255,255,0.16)' }}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-7 h-7 rounded-full flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all z-10"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Step progress bar (hide on success) */}
        {step !== 'success' && (
          <div className="px-6 pt-6 pb-0">
            <div className="flex items-center gap-1 mb-5">
              {(['method', 'contact', 'code', 'newpass'] as RecoveryStep[]).map((s, i) => (
                <React.Fragment key={s}>
                  <div
                    className="flex items-center justify-center rounded-full text-xs font-bold transition-all"
                    style={{
                      width: 24, height: 24, flexShrink: 0,
                      background: stepIndex > i ? '#1b5e3e' : stepIndex === i ? '#4ade80' : 'rgba(255,255,255,0.1)',
                      color: stepIndex >= i ? 'white' : 'rgba(255,255,255,0.3)',
                    }}
                  >
                    {stepIndex > i ? <CheckCircle className="w-3 h-3" /> : i + 1}
                  </div>
                  <span className="text-[9px] text-white/40 hidden sm:block">{STEP_LABELS[i]}</span>
                  {i < 3 && <div className="flex-1 h-px" style={{ background: stepIndex > i ? '#1b5e3e' : 'rgba(255,255,255,0.12)' }} />}
                </React.Fragment>
              ))}
            </div>
          </div>
        )}

        <div className="px-6 pb-6 pt-3">

          {/* ── STEP 1: Choose method ── */}
          {step === 'method' && (
            <>
              <div className="flex items-center gap-2 mb-1">
                <KeyRound className="w-5 h-5 text-[#4ade80]" />
                <h2 className="text-white font-semibold text-lg" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                  Recuperar contraseña
                </h2>
              </div>
              <p className="text-white/50 text-sm mb-6">¿Cómo deseas recibir el código de recuperación?</p>

              <div className="space-y-3 mb-6">
                <button
                  onClick={() => setMethod('email')}
                  className={`w-full flex items-center gap-4 px-4 py-4 rounded-xl transition-all text-left ${method === 'email' ? 'ring-2 ring-[#4ade80]' : 'hover:bg-white/5'}`}
                  style={{ background: method === 'email' ? 'rgba(74,222,128,0.08)' : 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)' }}
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: method === 'email' ? 'rgba(74,222,128,0.2)' : 'rgba(255,255,255,0.07)' }}
                  >
                    <Mail className="w-5 h-5" style={{ color: method === 'email' ? '#4ade80' : 'rgba(255,255,255,0.5)' }} />
                  </div>
                  <div>
                    <p className="text-white font-medium text-sm">Correo electrónico</p>
                    <p className="text-white/40 text-xs mt-0.5">Recibirás un código en tu correo registrado</p>
                  </div>
                  <div className={`w-4 h-4 rounded-full ml-auto border-2 shrink-0 flex items-center justify-center ${method === 'email' ? 'border-[#4ade80]' : 'border-white/20'}`}>
                    {method === 'email' && <div className="w-2 h-2 rounded-full bg-[#4ade80]" />}
                  </div>
                </button>

                <button
                  onClick={() => setMethod('sms')}
                  className={`w-full flex items-center gap-4 px-4 py-4 rounded-xl transition-all text-left ${method === 'sms' ? 'ring-2 ring-[#4ade80]' : 'hover:bg-white/5'}`}
                  style={{ background: method === 'sms' ? 'rgba(74,222,128,0.08)' : 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)' }}
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: method === 'sms' ? 'rgba(74,222,128,0.2)' : 'rgba(255,255,255,0.07)' }}
                  >
                    <Phone className="w-5 h-5" style={{ color: method === 'sms' ? '#4ade80' : 'rgba(255,255,255,0.5)' }} />
                  </div>
                  <div>
                    <p className="text-white font-medium text-sm">SMS al teléfono</p>
                    <p className="text-white/40 text-xs mt-0.5">Te enviaremos un código por mensaje de texto</p>
                  </div>
                  <div className={`w-4 h-4 rounded-full ml-auto border-2 shrink-0 flex items-center justify-center ${method === 'sms' ? 'border-[#4ade80]' : 'border-white/20'}`}>
                    {method === 'sms' && <div className="w-2 h-2 rounded-full bg-[#4ade80]" />}
                  </div>
                </button>
              </div>

              <button
                onClick={() => setStep('contact')}
                className="w-full py-3 rounded-xl text-white font-semibold transition-all hover:opacity-90 active:scale-[0.98]"
                style={{ background: '#1b5e3e', boxShadow: '0 4px 16px rgba(27,94,62,0.4)' }}
              >
                Continuar
              </button>
            </>
          )}

          {/* ── STEP 2: Enter contact ── */}
          {step === 'contact' && (
            <>
              <button onClick={() => setStep('method')} className="flex items-center gap-1.5 text-white/50 hover:text-white transition-colors text-sm mb-4">
                <ArrowLeft className="w-3.5 h-3.5" /> Volver
              </button>
              <div className="flex items-center gap-2 mb-1">
                {method === 'email' ? <Mail className="w-5 h-5 text-[#4ade80]" /> : <Phone className="w-5 h-5 text-[#4ade80]" />}
                <h2 className="text-white font-semibold text-lg" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                  {method === 'email' ? 'Ingresa tu correo' : 'Ingresa tu teléfono'}
                </h2>
              </div>
              <p className="text-white/50 text-sm mb-6">
                {method === 'email'
                  ? 'Te enviaremos un código de 6 dígitos a tu correo registrado.'
                  : 'Te enviaremos un código de 6 dígitos por SMS.'}
              </p>

              <div className="mb-5">
                <label className="block text-white/70 text-sm mb-2">
                  {method === 'email' ? 'Correo electrónico' : 'Número de teléfono'}
                </label>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2">
                    {method === 'email'
                      ? <Mail className="w-4 h-4 text-white/30" />
                      : <Phone className="w-4 h-4 text-white/30" />}
                  </div>
                  <input
                    type={method === 'email' ? 'email' : 'tel'}
                    value={contact}
                    onChange={(e) => { setContact(e.target.value); setContactError(''); }}
                    placeholder={method === 'email' ? 'tu@correo.cl' : '+56 9 1234 5678'}
                    autoFocus
                    className={`${inputCls(!!contactError)} pl-10`}
                    style={inputStyle}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendCode()}
                  />
                </div>
                {contactError && (
                  <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {contactError}
                  </p>
                )}
              </div>

              <button
                onClick={handleSendCode}
                disabled={sending}
                className="w-full py-3 rounded-xl text-white font-semibold transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-60 flex items-center justify-center gap-2"
                style={{ background: '#1b5e3e', boxShadow: '0 4px 16px rgba(27,94,62,0.4)' }}
              >
                {sending ? (
                  <>
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Enviando…
                  </>
                ) : `Enviar código por ${method === 'email' ? 'correo' : 'SMS'}`}
              </button>
            </>
          )}

          {/* ── STEP 3: Enter code ── */}
          {step === 'code' && (
            <>
              <button onClick={() => setStep('contact')} className="flex items-center gap-1.5 text-white/50 hover:text-white transition-colors text-sm mb-4">
                <ArrowLeft className="w-3.5 h-3.5" /> Volver
              </button>

              <div className="text-center mb-6">
                <div className="w-14 h-14 rounded-2xl mx-auto mb-3 flex items-center justify-center"
                  style={{ background: 'rgba(74,222,128,0.15)', border: '1px solid rgba(74,222,128,0.3)' }}>
                  {method === 'email' ? <Mail className="w-7 h-7 text-[#4ade80]" /> : <Phone className="w-7 h-7 text-[#4ade80]" />}
                </div>
                <h2 className="text-white font-semibold text-lg mb-1" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                  Código de verificación
                </h2>
                <p className="text-white/50 text-sm">
                  Enviamos 6 dígitos a<br />
                  <span className="text-white/80 font-medium">{contact}</span>
                </p>
                <p className="text-[#4ade80] text-xs mt-2">(Demo: usa el código <strong>123456</strong>)</p>
              </div>

              {/* 6-digit code input */}
              <div className="flex gap-2 justify-center mb-2" onPaste={handleCodePaste}>
                {code.map((digit, i) => (
                  <input
                    key={i}
                    ref={(el) => { codeRefs.current[i] = el; }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleCodeChange(i, e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Backspace' && !digit && i > 0) codeRefs.current[i - 1]?.focus();
                    }}
                    className={`w-11 h-13 text-center text-xl font-bold rounded-xl outline-none transition-all ${codeError ? 'border-red-400/60' : digit ? 'border-[#4ade80]/60' : ''}`}
                    style={{
                      height: '52px',
                      background: digit ? 'rgba(74,222,128,0.12)' : 'rgba(255,255,255,0.08)',
                      border: `2px solid ${codeError ? 'rgba(248,113,113,0.5)' : digit ? 'rgba(74,222,128,0.5)' : 'rgba(255,255,255,0.15)'}`,
                      color: 'white',
                      caretColor: '#4ade80',
                    }}
                  />
                ))}
              </div>

              {codeError && (
                <p className="text-red-400 text-xs text-center mb-3 flex items-center justify-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {codeError}
                </p>
              )}

              {/* Resend */}
              <div className="text-center mb-5">
                <button
                  onClick={handleResend}
                  disabled={resendCooldown > 0}
                  className="flex items-center gap-1.5 text-xs mx-auto transition-colors disabled:opacity-40"
                  style={{ color: resendCooldown > 0 ? 'rgba(255,255,255,0.35)' : '#4ade80' }}
                >
                  <RefreshCw className="w-3 h-3" />
                  {resendCooldown > 0 ? `Reenviar en ${resendCooldown}s` : 'Reenviar código'}
                  {resendCount > 0 && resendCooldown === 0 && <span className="text-white/30"> (enviado {resendCount + 1}× )</span>}
                </button>
              </div>

              <button
                onClick={handleVerifyCode}
                disabled={code.join('').length < 6}
                className="w-full py-3 rounded-xl text-white font-semibold transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-40"
                style={{ background: '#1b5e3e', boxShadow: '0 4px 16px rgba(27,94,62,0.4)' }}
              >
                Verificar código
              </button>
            </>
          )}

          {/* ── STEP 4: New password ── */}
          {step === 'newpass' && (
            <>
              <div className="flex items-center gap-2 mb-1">
                <Lock className="w-5 h-5 text-[#4ade80]" />
                <h2 className="text-white font-semibold text-lg" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                  Nueva contraseña
                </h2>
              </div>
              <p className="text-white/50 text-sm mb-6">Elige una contraseña segura para tu cuenta.</p>

              <div className="space-y-4 mb-5">
                <div>
                  <label className="block text-white/70 text-sm mb-2">Nueva contraseña</label>
                  <div className="relative">
                    <input
                      type={showNew ? 'text' : 'password'}
                      value={newPass}
                      onChange={(e) => { setNewPass(e.target.value); setPassError(''); }}
                      placeholder="Mínimo 6 caracteres"
                      className={`${inputCls(!!passError)} pr-11`}
                      style={inputStyle}
                    />
                    <button type="button" onClick={() => setShowNew(!showNew)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/35 hover:text-white/70 transition-colors">
                      {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {/* Strength bar */}
                  {newPass.length > 0 && (
                    <div className="mt-2">
                      <div className="flex gap-1">
                        {[1, 2, 3, 4].map((lvl) => {
                          const strength = Math.min(4, Math.floor(newPass.length / 3) + (newPass.match(/[A-Z]/) ? 1 : 0) + (newPass.match(/[0-9]/) ? 1 : 0));
                          return (
                            <div key={lvl} className="flex-1 h-1 rounded-full transition-all"
                              style={{ background: strength >= lvl ? (strength <= 1 ? '#ef4444' : strength <= 2 ? '#f59e0b' : strength <= 3 ? '#3b82f6' : '#22c55e') : 'rgba(255,255,255,0.1)' }} />
                          );
                        })}
                      </div>
                      <p className="text-xs text-white/35 mt-1">
                        {newPass.length < 4 ? 'Muy corta' : newPass.length < 6 ? 'Débil' : newPass.length < 9 ? 'Aceptable' : 'Fuerte'}
                      </p>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-white/70 text-sm mb-2">Confirmar contraseña</label>
                  <div className="relative">
                    <input
                      type={showConfirm ? 'text' : 'password'}
                      value={confirmPass}
                      onChange={(e) => { setConfirmPass(e.target.value); setPassError(''); }}
                      placeholder="Repite la contraseña"
                      className={`${inputCls(!!passError)} pr-11`}
                      style={inputStyle}
                    />
                    <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/35 hover:text-white/70 transition-colors">
                      {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {confirmPass && confirmPass === newPass && (
                    <p className="text-[#4ade80] text-xs mt-1.5 flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" /> Las contraseñas coinciden
                    </p>
                  )}
                </div>

                {passError && (
                  <p className="text-red-400 text-xs flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {passError}
                  </p>
                )}
              </div>

              <button
                onClick={handleSetPassword}
                disabled={sending}
                className="w-full py-3 rounded-xl text-white font-semibold transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-60 flex items-center justify-center gap-2"
                style={{ background: '#1b5e3e', boxShadow: '0 4px 16px rgba(27,94,62,0.4)' }}
              >
                {sending ? (
                  <>
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Guardando…
                  </>
                ) : 'Guardar nueva contraseña'}
              </button>
            </>
          )}

          {/* ── STEP 5: Success ── */}
          {step === 'success' && (
            <div className="text-center py-4">
              <div className="w-20 h-20 rounded-full mx-auto mb-5 flex items-center justify-center"
                style={{ background: 'rgba(74,222,128,0.15)', border: '2px solid rgba(74,222,128,0.35)' }}>
                <CheckCircle className="w-10 h-10 text-[#4ade80]" />
              </div>
              <h2 className="text-white font-bold text-xl mb-2" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                ¡Contraseña restablecida!
              </h2>
              <p className="text-white/55 text-sm mb-2">
                Tu contraseña ha sido actualizada exitosamente.
              </p>
              <p className="text-white/35 text-xs mb-8">
                Ya puedes iniciar sesión con tu nueva contraseña.
              </p>
              <button
                onClick={onClose}
                className="w-full py-3 rounded-xl text-white font-semibold transition-all hover:opacity-90 active:scale-[0.98]"
                style={{ background: '#1b5e3e', boxShadow: '0 4px 16px rgba(27,94,62,0.4)' }}
              >
                Ir al inicio de sesión
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Login screen ─────────────────────────────────────────── */

export function LoginScreen({ onLogin, onRegister }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showForgot, setShowForgot] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setTimeout(() => {
      const user = INITIAL_USERS.find(
        (u) => u.email.toLowerCase() === email.trim().toLowerCase() && u.password === password
      );
      if (!user) { setError('Correo o contraseña incorrectos.'); setLoading(false); return; }
      if (user.blocked) { setError('Tu cuenta ha sido bloqueada. Contacta al administrador.'); setLoading(false); return; }
      setLoading(false);
      onLogin(user);
    }, 700);
  };

  const fillHint = (hint: typeof ROLE_HINTS[number]) => {
    setEmail(hint.email);
    setPassword(hint.password);
    setError('');
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1758409571024-20dcf43d52bf?w=1920&h=1080&fit=crop&auto=format&q=85"
          alt="Región de los Lagos, Chile"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/75" />
        <div className="absolute inset-0 bg-[#1b5e3e]/15" />
      </div>

      <div className="relative z-10 w-full max-w-md px-6 py-8">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-[#1b5e3e] flex items-center justify-center">
              <Mountain className="w-5 h-5 text-white" />
            </div>
            <span className="text-white tracking-[0.15em] uppercase"
              style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '1.6rem', fontWeight: 700 }}>
              3MTOURS
            </span>
          </div>
          <p className="text-white/60 text-xs tracking-widest uppercase">Región de Los Lagos · Patagonia</p>
        </div>

        {/* Role hints */}
        <div className="flex gap-2 mb-5">
          {ROLE_HINTS.map((h) => {
            const Icon = h.icon;
            return (
              <button
                key={h.role}
                onClick={() => fillHint(h)}
                className="flex-1 flex flex-col items-center gap-1.5 rounded-xl py-2.5 px-1 transition-all hover:scale-105 active:scale-95"
                style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)' }}
                title={`${h.email} / ${h.password}`}
              >
                <Icon className="w-4 h-4" style={{ color: h.color === '#1b5e3e' ? '#4ade80' : h.color === '#c8531a' ? '#fb923c' : '#93c5fd' }} />
                <span className="text-white/70 text-[10px] text-center leading-tight">{h.role}</span>
              </button>
            );
          })}
        </div>
        <p className="text-white/40 text-center text-[10px] mb-5 -mt-2">
          Clic en un rol para autocompletar credenciales de prueba
        </p>

        {/* Login card */}
        <div className="rounded-2xl p-7 shadow-2xl"
          style={{ background: 'rgba(255,255,255,0.09)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.18)' }}>
          <h2 className="text-white mb-1"
            style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '1.4rem', fontWeight: 600 }}>
            Iniciar sesión
          </h2>
          <p className="text-white/50 text-sm mb-6">Accede con tu cuenta 3MTOURS</p>

          {error && (
            <div className="flex items-center gap-2 bg-red-500/20 border border-red-400/30 rounded-lg px-3 py-2.5 mb-4">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-white/75 text-sm mb-1.5">Correo electrónico</label>
              <input
                type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@correo.cl" required
                className="w-full rounded-lg px-4 py-3 text-white placeholder-white/25 outline-none focus:ring-2 focus:ring-[#1b5e3e] transition-all"
                style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.18)' }}
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-white/75 text-sm">Contraseña</label>
                <button
                  type="button"
                  onClick={() => setShowForgot(true)}
                  className="text-[#4ade80] text-xs hover:text-[#86efac] hover:underline transition-colors font-medium"
                >
                  ¿Olvidaste tu contraseña?
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password} onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••" required
                  className="w-full rounded-lg px-4 py-3 pr-11 text-white placeholder-white/25 outline-none focus:ring-2 focus:ring-[#1b5e3e] transition-all"
                  style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.18)' }}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/35 hover:text-white/70 transition-colors">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit" disabled={loading}
              className="w-full py-3.5 rounded-xl text-white font-semibold transition-all active:scale-[0.98] disabled:opacity-60 mt-1"
              style={{ background: '#1b5e3e', boxShadow: '0 4px 20px rgba(27,94,62,0.4)' }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Verificando…
                </span>
              ) : 'Ingresar'}
            </button>
          </form>
        </div>

        <p className="text-center text-white/50 text-sm mt-5">
          ¿No tienes cuenta?{' '}
          <button
            onClick={onRegister}
            className="text-[#4ade80] hover:text-[#86efac] font-semibold transition-colors hover:underline"
          >
            Regístrate gratis
          </button>
        </p>
        <p className="text-center text-white/25 text-xs mt-2">
          © 2026 3MTOURS · Sistema de gestión de tours
        </p>
      </div>

      {/* Forgot password modal */}
      {showForgot && <ForgotPasswordModal onClose={() => setShowForgot(false)} />}
    </div>
  );
}
