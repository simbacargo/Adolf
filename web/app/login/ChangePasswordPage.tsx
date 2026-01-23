import React, { useState } from 'react';
import { KeyRound, ShieldAlert, CheckCircle2, ArrowLeft, Loader2, Save } from 'lucide-react';
import { useNavigate, Link } from 'react-router';

const ChangePasswordPage = () => {
  const [formData, setFormData] = useState({ old_password: '', new_password: '', confirm_password: '' });
  const [status, setStatus] = useState({ type: '', message: '' }); // 'error' or 'success'
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = async (e) => {
    e.preventDefault();
    
    // Client-side validation
    if (formData.new_password !== formData.confirm_password) {
      setStatus({ type: 'error', message: 'New passwords do not match.' });
      return;
    }

    setIsLoading(true);
    setStatus({ type: '', message: '' });

    const token = localStorage.getItem('token');

    try {
      const res = await fetch('https://adolf.nsaro.com/api/change-password/', {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`
        },
        body: JSON.stringify({
          old_password: formData.old_password,
          new_password: formData.new_password
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus({ type: 'success', message: 'Password updated successfully! Redirecting...' });
        setTimeout(() => navigate('/'), 2000);
      } else {
        setStatus({ type: 'error', message: data.old_password || data.new_password || 'Failed to update password.' });
      }
    } catch (err) {
      setStatus({ type: 'error', message: 'Server connection error.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-[500px]">
        
        {/* Back Button */}
        <Link to="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-blue-600 font-bold text-sm mb-8 transition-colors group">
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          Back to Dashboard
        </Link>

        <div className="bg-white rounded-[32px] shadow-2xl shadow-slate-200/60 border border-slate-100 overflow-hidden">
          <div className="p-10 bg-slate-50/50 border-b border-slate-100 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-2xl shadow-sm mb-4 text-blue-600">
              <KeyRound size={32} />
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Security Settings</h1>
            <p className="text-sm text-slate-500 font-medium">Update your account password</p>
          </div>

          <form onSubmit={handleChange} className="p-10 space-y-6">
            
            {status.message && (
              <div className={`p-4 rounded-2xl text-sm font-bold border flex items-center gap-3 animate-in fade-in slide-in-from-top-2 ${
                status.type === 'success' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'
              }`}>
                {status.type === 'success' ? <CheckCircle2 size={20}/> : <ShieldAlert size={20}/>}
                {status.message}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Current Password</label>
              <input 
                required
                type="password" 
                className="w-full px-5 py-4 bg-slate-100 border-none rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:bg-white outline-none font-medium transition-all"
                onChange={e => setFormData({...formData, old_password: e.target.value})}
              />
            </div>

            <hr className="border-slate-50" />

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">New Password</label>
              <input 
                required
                type="password" 
                className="w-full px-5 py-4 bg-slate-100 border-none rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:bg-white outline-none font-medium transition-all"
                onChange={e => setFormData({...formData, new_password: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Confirm New Password</label>
              <input 
                required
                type="password" 
                className="w-full px-5 py-4 bg-slate-100 border-none rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:bg-white outline-none font-medium transition-all"
                onChange={e => setFormData({...formData, confirm_password: e.target.value})}
              />
            </div>

            <button 
              disabled={isLoading}
              type="submit" 
              className="w-full bg-slate-900 hover:bg-black text-white py-5 rounded-[22px] font-black shadow-xl transition-all active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-70 mt-4"
            >
              {isLoading ? <Loader2 className="animate-spin" size={24} /> : <><Save size={20} /> Update Password</>}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChangePasswordPage;
