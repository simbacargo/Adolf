import React, { useState } from 'react';
import { Lock, User, ShieldCheck, ArrowRight, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router';

const LoginPage = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const res = await fetch('https://adolf.nsaro.com/api/login/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });
      
      const data = await res.json();
      
      if (res.ok && data.token) {
        localStorage.setItem('token', data.token);
        navigate('/'); // Redirect to dashboard
      } else {
        setError('Invalid username or password. Please try again.');
      }
    } catch (err) {
      setError('Connection failed. Is the server running?');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-6 font-sans">
      {/* Decorative Background Elements */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-50 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-50 rounded-full blur-[120px]" />
      </div>

      <div className="w-full max-w-[480px] animate-in fade-in zoom-in duration-500">
        {/* Logo Section */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-600 rounded-[28px] shadow-2xl shadow-blue-200 mb-6 text-white">
            <ShieldCheck size={40} />
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Tanzania Registry</h1>
          <p className="text-slate-500 font-medium mt-2">Secure Access Gateway</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-[32px] shadow-2xl shadow-slate-200/60 border border-slate-100 p-10">
          <form onSubmit={handleLogin} className="space-y-6">
            
            {error && (
              <div className="bg-rose-50 text-rose-600 p-4 rounded-2xl text-sm font-bold border border-rose-100 animate-shake">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.15em] ml-1">Username</label>
              <div className="relative group">
                <User className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={20} />
                <input 
                  required
                  type="text" 
                  placeholder="Enter username" 
                  className="w-full pl-14 pr-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:bg-white outline-none font-medium transition-all text-slate-700"
                  onChange={e => setCredentials({...credentials, username: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.15em] ml-1">Password</label>
              <div className="relative group">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={20} />
                <input 
                  required
                  type="password" 
                  placeholder="••••••••" 
                  className="w-full pl-14 pr-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:bg-white outline-none font-medium transition-all text-slate-700"
                  onChange={e => setCredentials({...credentials, password: e.target.value})}
                />
              </div>
            </div>

            <button 
              disabled={isLoading}
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-5 rounded-[22px] font-black shadow-xl shadow-blue-200 transition-all active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-70"
            >
              {isLoading ? (
                <Loader2 className="animate-spin" size={24} />
              ) : (
                <>
                  Authenticate
                  <ArrowRight size={20} />
                </>
              )}
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-slate-50 text-center">
            <p className="text-sm text-slate-400 font-medium">
              Authorized Personnel Only. 
              <br />
              All access attempts are logged.
            </p>
          </div>
        </div>
        
        <p className="text-center mt-8 text-slate-400 text-xs font-bold uppercase tracking-widest">
          © 2026 Ministry of Information System
        </p>
      </div>
    </div>
  );
};

export default LoginPage;