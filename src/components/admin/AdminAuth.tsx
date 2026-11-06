import React, { useState } from 'react';
import { Lock, Mail, AlertCircle, ShieldCheck, ArrowRight, Database } from 'lucide-react';
import { getSupabase, getSupabaseConfig } from '../../lib/supabase';

interface AdminAuthProps {
  onAuthenticated: (user: { email: string; role: string }) => void;
  onExitToWebsite: () => void;
}

export const AdminAuth: React.FC<AdminAuthProps> = ({ onAuthenticated, onExitToWebsite }) => {
  const [email, setEmail] = useState('manparta0101@gmail.com');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [infoMsg, setInfoMsg] = useState<string | null>(null);

  const { isConfigured } = getSupabaseConfig();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setInfoMsg(null);

    const cleanEmail = email.trim().toLowerCase();
    if (cleanEmail !== 'manparta0101@gmail.com') {
      setErrorMsg('Akses ditolak: Hanya akun manparta0101@gmail.com yang memiliki hak akses administrator.');
      return;
    }

    if (!password.trim()) {
      setErrorMsg('Silakan masukkan password / Please enter your password.');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('Password minimal 6 karakter / Password must be at least 6 characters.');
      return;
    }

    setIsLoading(true);

    try {
      const supabase = getSupabase();

      if (supabase && isConfigured) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password: password.trim(),
        });

        if (error) {
          setErrorMsg(error.message);
        } else if (data.user) {
          if (data.user.email?.toLowerCase() !== 'manparta0101@gmail.com') {
            await supabase.auth.signOut();
            setErrorMsg('Akses ditolak: Hanya akun manparta0101@gmail.com yang berwenang sebagai administrator.');
            return;
          }
          onAuthenticated({ email: data.user.email, role: 'admin' });
        }
      } else {
        // Initial setup mode or local admin access
        sessionStorage.setItem('ptpd_admin_session', JSON.stringify({ email: cleanEmail, role: 'admin' }));
        onAuthenticated({ email: cleanEmail, role: 'admin' });
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Authentication error.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F6F8] flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background glass refraction */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-radial from-[#FF6B00]/10 via-transparent to-transparent blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="text-center space-y-3">
          <img
            src="/assets/aistudio/image_c7cccf24.png"
            alt="PT PARTA DIRGANTARA"
            className="h-12 w-auto object-contain mx-auto"
            referrerPolicy="no-referrer"
          />
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Export Desk Administrator
          </h2>
          <p className="text-xs text-slate-500">
            Authorized Personnel & Trade Operations Gateway
          </p>
        </div>

        <div className="mt-7 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="glass-panel rounded-2xl border border-white/80 shadow-xl p-7 sm:p-9 space-y-5">
            
            {/* Supabase connection indicator */}
            <div className="flex items-center justify-between text-[11px] p-2.5 rounded-lg bg-slate-50 border border-slate-200/80">
              <div className="flex items-center gap-1.5 text-slate-700">
                <Database className="w-3.5 h-3.5 text-[#FF6B00]" />
                <span>Supabase Auth:</span>
              </div>
              <span className={`font-semibold ${isConfigured ? 'text-emerald-700' : 'text-amber-700'}`}>
                {isConfigured ? 'Active Cloud Auth' : 'Initial Setup Mode'}
              </span>
            </div>

            {errorMsg && (
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2.5 animate-fadeIn">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            {infoMsg && (
              <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 text-xs flex items-start gap-2.5 animate-fadeIn">
                <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{infoMsg}</span>
              </div>
            )}

            <form onSubmit={handleAuth} className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-slate-700">
                    Administrator Email
                  </label>
                  <span className="text-[10px] font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    Akun Resmi
                  </span>
                </div>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="manparta0101@gmail.com"
                    className="w-full pl-9 pr-3.5 py-2.5 text-xs sm:text-sm bg-slate-50/80 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF6B00]/30 font-medium text-slate-800"
                  />
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Khusus administrator PT PARTA DIRGANTARA (manparta0101@gmail.com)
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3.5 py-2.5 text-xs sm:text-sm bg-white/90 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF6B00]/30"
                  />
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full inline-flex items-center justify-center gap-2 py-2.5 text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-[#FF6B00] to-[#E65100] hover:from-[#FF7A1A] hover:to-[#D84900] disabled:opacity-60 rounded-xl shadow-md transition-all active:scale-[0.99] cursor-pointer"
              >
                {isLoading ? (
                  <span>Memverifikasi Otorisasi...</span>
                ) : (
                  <>
                    <span>Sign In to Admin Dashboard</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="pt-2 flex items-center justify-between text-xs text-slate-500 border-t border-slate-100">
              <span className="text-[11px] text-slate-500 flex items-center gap-1 font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 inline" />
                Admin: manparta0101@gmail.com
              </span>

              <button
                type="button"
                onClick={onExitToWebsite}
                className="text-slate-500 hover:text-slate-800 font-medium transition-colors cursor-pointer"
              >
                Back to Website
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

