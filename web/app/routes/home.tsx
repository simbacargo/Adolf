import React, { useState, useMemo, useEffect } from 'react';
import { Search, ChevronUp, ChevronDown, CheckCircle2, XCircle, Users, Calendar, UserPlus, X, Trash2, Edit3, Baby, Phone, UserCircle, CreditCard } from 'lucide-react';
import { NavLink } from 'react-router';
import { log } from 'console';


const generateMembers = () => {
  const firstNames = ['Juma', 'Asha', 'Mwinyi', 'Neema', 'Baraka', 'Zuwena', 'Said', 'Fatuma', 'Elias', 'Lulu'];
  const lastNames = ['Kassim', 'Mbeki', 'Nyerere', 'Mlowo', 'Makamba', 'Mtungi', 'Chale', 'Sokoine', 'Mwinyi', 'Moyo'];
  const maritalOptions = ['Single', 'Married', 'Divorced', 'Widowed'];
  
  return Array.from({ length: 100 }, (_, i) => {
    const regDate = new Date(2025, Math.floor(Math.random() * 6), Math.floor(Math.random() * 28));
    const expDate = new Date(regDate);
    expDate.setFullYear(expDate.getFullYear() + (Math.random() > 0.4 ? 1 : 0)); 
    return {
      id: i + 1,
      fullName: `${firstNames[Math.floor(Math.random() * 10)]} ${lastNames[Math.floor(Math.random() * 10)]}`,
      age: Math.floor(Math.random() * 45) + 18,
      sex: Math.random() > 0.5 ? 'Male' : 'Female',
      maritalStatus: maritalOptions[Math.floor(Math.random() * 4)],
      children: Math.floor(Math.random() * 6),
      phone: `+255 ${700 + Math.floor(Math.random() * 99)} ${Math.floor(100000 + Math.random() * 900000)}`,
      regDate: regDate.toISOString().split('T')[0],
      expDate: expDate.toISOString().split('T')[0],
    };
  });
};

const INITIAL_MEMBERS = generateMembers();
const API_URL = 'https://adolf.nsaro.com/api/members/';

const MemberList = () => {
  const [members, setMembers] = useState(INITIAL_MEMBERS);
  console.log('====================================');
  console.log(members);
  console.log('====================================');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMemberId, setEditingMemberId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'fullName', direction: 'asc' });

  const [formData, setFormData] = useState({
    fullName: '', age: '', sex: 'Male', maritalStatus: 'Single', children: 0, phone: '+255 ', regDate: '', expDate: '',
    membershipPlan: 'Basic 5,000 ($5)' // Default Plan
  });

  const today = new Date();

useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await fetch(API_URL, {
          headers: { 
            'Authorization': `Token ${localStorage.getItem('token')}` 
          }
        });

        // Check for 401 Unauthorized
        if (response.status === 401) {
          localStorage.removeItem('token'); // Delete the invalid token
          window.location.reload();         // Refresh the page (will likely redirect to login)
          return;                           // Exit the function
        }

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setMembers(data);
      }
      catch (error) {
        console.error("Fetch error:", error);
      }
    };
    fetchMembers();
  }, []);

  const processedData = useMemo(() => {
    return members.map(m => ({ ...m, isActive: new Date(m.expDate) > today }));
  }, [members]);

  const filteredMembers = useMemo(() => {
    return processedData.filter((m) =>
      m.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || m.phone.includes(searchTerm)
    );
  }, [processedData, searchTerm]);

  const sortedMembers = useMemo(() => {
    const sortableItems = [...filteredMembers];
    sortableItems.sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
      if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
    return sortableItems;
  }, [filteredMembers, sortConfig]);

  const openCreateModal = () => {
    setEditingMemberId(null);
    setFormData({ 
      fullName: '', age: '', sex: 'Male', maritalStatus: 'Single', children: 0, phone: '+255 ', regDate: '', expDate: '', 
      membershipPlan: 'Basic ($5)' 
    });
    setIsModalOpen(true);
  };

  const openEditModal = (member) => {
    setEditingMemberId(member.id);
    setFormData(member);
    setIsModalOpen(true);
  };

  const deleteMember = async (id) => {
    if (window.confirm("Permanent Action: Delete this member?")) {
      const response = await fetch(`${API_URL}${id}/`, { method: 'DELETE', 
        headers: { 'Authorization': `Token ${localStorage.getItem('token')}` }
      });
      if (response.ok) {
        setMembers(members.filter(m => m.id !== id));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = editingMemberId ? 'PUT' : 'POST';
    const url = editingMemberId ? `${API_URL}${editingMemberId}/` : API_URL;

    const response = await fetch(url, {
      method: method,
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Token ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      const savedMember = await response.json();
      if (editingMemberId) {
        setMembers(members.map(m => m.id === editingMemberId ? savedMember : m));
      } else {
        setMembers([savedMember, ...members]);
      }
      setIsModalOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] p-6 md:p-10 font-sans text-slate-900">
      <div className="max-w-7xl mx-auto">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">Tanzania Registry</h1>
            <p className="text-slate-500 font-medium">Community Member Management System</p>
          </div>
          <div className="flex gap-3">
            <button onClick={openCreateModal} className="flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-bold shadow-xl shadow-blue-200 transition-all active:scale-95">
              <UserPlus size={22} />
              Register Member
            </button>
            <NavLink to="/change-password" title="Settings" className="flex items-center justify-center gap-3 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-4 rounded-2xl font-bold shadow-xl shadow-emerald-200 transition-all active:scale-95">
              <UserCircle size={24} />
            </NavLink>
          </div>
        </div>
      
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-6 rounded-[24px] shadow-sm border border-slate-200 flex items-center gap-5">
            <div className="bg-blue-50 p-4 rounded-2xl text-blue-600"><Users size={28} /></div>
            <div><p className="text-sm text-slate-400 font-bold uppercase tracking-wider">Total Records</p><p className="text-3xl font-black">{members.length}</p></div>
          </div>
          <div className="bg-white p-6 rounded-[24px] shadow-sm border border-slate-200 flex items-center gap-5">
            <div className="bg-emerald-50 p-4 rounded-2xl text-emerald-600"><CheckCircle2 size={28} /></div>
            <div><p className="text-sm text-slate-400 font-bold uppercase tracking-wider">Active Members</p><p className="text-3xl font-black text-emerald-600">{processedData.filter(m => m.isActive).length}</p></div>
          </div>
          <div className="bg-white p-6 rounded-[24px] shadow-sm border border-slate-200 flex items-center gap-5">
            <div className="bg-rose-50 p-4 rounded-2xl text-rose-600"><XCircle size={28} /></div>
            <div><p className="text-sm text-slate-400 font-bold uppercase tracking-wider">Expired</p><p className="text-3xl font-black text-rose-600">{processedData.filter(m => !m.isActive).length}</p></div>
          </div>
        </div>

        <div className="bg-white rounded-[32px] shadow-2xl shadow-slate-200/60 border border-slate-200 overflow-hidden">
          <div className="p-8 border-b border-slate-100 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="relative group w-full lg:w-[450px]">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={22} />
              <input
                type="text"
                placeholder="Search by name, phone..."
                className="w-full pl-14 pr-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:bg-white transition-all outline-none text-slate-700 font-medium"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="overflow-x-auto max-h-[600px] custom-scrollbar">
            <table className="w-full text-left border-separate border-spacing-0">
              <thead className="sticky top-0 z-30 bg-white/95 backdrop-blur-md">
                <tr className="text-slate-400 text-[10px] uppercase tracking-[0.2em] font-black">
                  {['fullName', 'membershipPlan', 'phone', 'expDate', 'isActive'].map((key) => (
                    <th key={key} className="px-8 py-5 border-b border-slate-100 cursor-pointer hover:text-blue-600 transition-colors" onClick={() => setSortConfig({ key, direction: sortConfig.direction === 'asc' ? 'desc' : 'asc' })}>
                      <div className="flex items-center gap-2">
                        {key === 'membershipPlan' ? 'Plan' : key.replace(/([A-Z])/g, ' $1').trim()}
                        {sortConfig.key === key && (sortConfig.direction === 'asc' ? <ChevronUp size={14}/> : <ChevronDown size={14}/>)}
                      </div>
                    </th>
                  ))}
                  <th className="px-8 py-5 border-b border-slate-100 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {sortedMembers.map((m) => (
                  <tr key={m.id} className="group hover:bg-blue-50/40 transition-all">
                    <td className="px-8 py-5 font-bold text-slate-800 whitespace-nowrap">{m.fullName}</td>
                    <td className="px-8 py-5">
                      <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold border border-slate-200">
                        {m.membershipPlan || 'Basic 5,000 ($3)'}
                      </span>
                    </td>
                    <td className="px-8 py-5 font-mono text-sm text-slate-500">{m.phone}</td>
                    <td className="px-8 py-5 text-slate-500 text-sm whitespace-nowrap">{m.expDate}</td>
                    <td className="px-8 py-5">
                      <span className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase border ${m.isActive ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'}`}>
                        {m.isActive ? <><span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Active</> : <><XCircle size={10} /> Expired</>}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                        <button onClick={() => openEditModal(m)} className="p-2.5 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all"><Edit3 size={18} /></button>
                        <button onClick={() => deleteMember(m.id)} className="p-2.5 bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-600 hover:text-white transition-all"><Trash2 size={18} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md">
          <div className="bg-white rounded-[32px] w-full max-w-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-8 border-b flex justify-between items-center bg-slate-50/50">
              <div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">{editingMemberId ? 'Update Record' : 'New Registration'}</h2>
                <p className="text-sm text-slate-500 font-medium">Registry ID: {editingMemberId || 'Auto-generated'}</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-3 hover:bg-rose-50 hover:text-rose-500 rounded-2xl transition-all"><X size={24} /></button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-10 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              <div className="space-y-2 col-span-2">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Full Name</label>
                <input required type="text" className="w-full px-5 py-4 bg-slate-100 border-none rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:bg-white outline-none font-medium transition-all" 
                  value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} />
              </div>

              {/* NEW MEMBERSHIP PLAN FIELD */}
              <div className="space-y-2 col-span-2">
                <label className="text-[10px] font-black uppercase text-blue-600 tracking-widest ml-1">Membership Plan</label>
                <div className="relative">
                   <select required className="w-full px-5 py-4 bg-blue-50/50 border-2 border-blue-100 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:bg-white outline-none font-bold text-blue-900 transition-all appearance-none"
                    value={formData.membershipPlan} onChange={e => setFormData({...formData, membershipPlan: e.target.value})}>
                    <option value="Basic 5,000 ($3)">Basic Tier — 5,000 ( $5.00)</option>
                    <option value="Standard 7,000 ($5)">Standard Tier — 7,000 ( $7.00)</option>
                    <option value="Premium 10,000 ($10)">Premium Tier —  10,000 ($10.00)</option>
                  </select>
                  <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-blue-400 pointer-events-none" size={20} />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Age</label>
                <input required type="number" className="w-full px-5 py-4 bg-slate-100 border-none rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:bg-white outline-none font-medium transition-all"
                  value={formData.age} onChange={e => setFormData({...formData, age: e.target.value})} />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Sex</label>
                <select className="w-full px-5 py-4 bg-slate-100 border-none rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:bg-white outline-none font-medium transition-all appearance-none"
                  value={formData.sex} onChange={e => setFormData({...formData, sex: e.target.value})}>
                  <option>Male</option><option>Female</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Phone (+255)</label>
                <input required type="text" className="w-full px-5 py-4 bg-slate-100 border-none rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:bg-white outline-none font-medium transition-all font-mono"
                  value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-emerald-600 tracking-widest ml-1">Reg. Date</label>
                <input required type="date" className="w-full px-5 py-4 bg-slate-100 border-none rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:bg-white outline-none font-medium transition-all"
                  value={formData.regDate} onChange={e => setFormData({...formData, regDate: e.target.value})} />
              </div>

              <div className="space-y-2 col-span-2 md:col-span-1">
                <label className="text-[10px] font-black uppercase text-rose-600 tracking-widest ml-1">Exp. Date</label>
                <input required type="date" className="w-full px-5 py-4 bg-slate-100 border-none rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:bg-white outline-none font-medium transition-all"
                  value={formData.expDate} onChange={e => setFormData({...formData, expDate: e.target.value})} />
              </div>

              <div className="col-span-2 pt-6 flex flex-col md:flex-row gap-4">
                <button type="submit" className="flex-1 bg-blue-600 text-white py-5 rounded-[20px] font-black shadow-xl shadow-blue-200 hover:bg-blue-700 transition-all active:scale-[0.98]">
                  {editingMemberId ? 'Update Member Info' : 'Confirm Registration'}
                </button>
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-10 bg-slate-100 text-slate-500 py-5 rounded-[20px] font-black hover:bg-slate-200 transition-all">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MemberList;