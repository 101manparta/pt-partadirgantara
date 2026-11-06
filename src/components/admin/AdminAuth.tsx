import React, { useState } from 'react';
import { Lock, Mail, AlertCircle, ShieldCheck, ArrowRight, Database } from 'lucide-react';
import { getSupabase, getSupabaseConfig } from '../../lib/supabase';

interface AdminAuthProps {
  onAuthenticated: (user: { email: string; role: string }) => void;
  onExitToWebsite: () => void;
}

export const AdminAuth: React.FC<AdminAuthProps> = ({ onAuthenticated, onExitToWebsite }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [infoMsg, setInfoMsg] = useState<string | null>(null);

  const { isConfigured, url } = getSupabaseConfig();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setInfoMsg(null);

    if (!email.trim() || !password.trim()) {
      setErrorMsg('Please enter both email and password.');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters.');
      return;
    }

    setIsLoading(true);

    try {
      const supabase = getSupabase();

      if (supabase && isConfigured) {
        if (isSignUp) {
          const { data, error } = await supabase.auth.signUp({
            email: email.trim(),
            password: password.trim(),
          });

          if (error) {
            setErrorMsg(error.message);
          } else if (data.session) {
            onAuthenticated({ email: data.user?.email || email, role: 'admin' });
          } else {
            setInfoMsg('Account created. If email confirmation is enabled on your Supabase project, check your inbox, or sign in now.');
            setIsSignUp(false);
          }
        } else {
          const { data, error } = await supabase.auth.signInWithPassword({
            email: email.trim(),
            password: password.trim(),
          });

          if (error) {
            setErrorMsg(error.message);
          } else if (data.user) {
            onAuthenticated({ email: data.user.email || email, role: 'admin' });
          }
        }
      } else {
        // When Supabase project keys are not yet configured in .env or settings,
        // we authenticate locally to grant administrator access so the engineer/client
        // can enter the dashboard and configure Supabase project keys!
        sessionStorage.setItem('ptpd_admin_session', JSON.stringify({ email: email.trim(), role: 'admin' }));
        onAuthenticated({ email: email.trim(), role: 'admin' });
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
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Administrator Email
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@partadirgantara.com"
                    className="w-full pl-9 pr-3.5 py-2.5 text-xs sm:text-sm bg-white/90 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF6B00]/30"
                  />
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                </div>
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
                className="w-full inline-flex items-center justify-center gap-2 py-2.5 text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-[#FF6B00] to-[#E65100] hover:from-[#FF7A1A] hover:to-[#D84900] disabled:opacity-60 rounded-xl shadow-md transition-all active:scale-[0.99]"
              >
                {isLoading ? (
                  <span>Authenticating...</span>
                ) : (
                  <>
                    <span>{isSignUp ? 'Create Admin Account' : 'Sign In to Admin Dashboard'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="pt-2 flex items-center justify-between text-xs text-slate-500 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-[#E65100] hover:underline font-medium"
              >
                {isSignUp ? 'Already have an admin account? Sign in' : 'First time? Create new admin account'}
              </button>

              <button
                type="button"
                onClick={onExitToWebsite}
                className="text-slate-500 hover:text-slate-800"
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
