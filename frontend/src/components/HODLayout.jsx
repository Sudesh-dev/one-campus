import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';

const navItems = [
  {
    path: '/hod/dashboard', label: 'Dashboard',
    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>,
  },
  {
    path: '/hod/analytics', label: 'Dept Analytics',
    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>,
  },
  {
    path: '/hod/faculty', label: 'Faculty',
    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>,
  },
  {
    path: '/hod/students', label: 'Students',
    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
  },
  {
    path: '/hod/letters', label: 'Letters',
    badge: 2, // BACKEND: Replace with pending escalated letter count
    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>,
  },
  {
    path: '/hod/notices', label: 'Notices',
    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" /></svg>,
  },
  {
    path: '/hod/timetable', label: 'Timetable',
    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>,
  },
];

const HODLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // BACKEND: Replace with HOD auth context
  const hod = { name: 'Prof. Prasad', empId: 'HOD001', department: 'CSE' };
  const initials = hod.name.split(' ').slice(-2).map(w => w[0]).join('');

  const isActive = (path) =>
    location.pathname === path ? 'bg-blue-700 text-white' : 'text-blue-100 hover:bg-blue-700/50';

  const closeSidebar = () => setIsSidebarOpen(false);

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-5 border-b border-blue-700/50">
        <Link to="/hod/dashboard" onClick={closeSidebar}
          className="text-xl font-extrabold tracking-tight text-white hover:text-blue-200 transition block">
          One Campus
        </Link>
        <div className="mt-1.5 inline-flex items-center gap-1.5 bg-indigo-600/60 px-2.5 py-1
                        rounded-full text-xs font-bold text-blue-100">
          <span className="w-1.5 h-1.5 bg-green-400 rounded-full" />
          HOD Portal · {hod.department}
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto mt-2">
        {navItems.map(item => (
          <Link key={item.path} to={item.path} onClick={closeSidebar}
            className={`flex items-center justify-between px-4 py-3 rounded-xl font-medium
                        transition-all duration-150 text-sm ${isActive(item.path)}`}>
            <div className="flex items-center gap-3">{item.icon}<span>{item.label}</span></div>
            {item.badge > 0 && (
              <span className="bg-red-500 text-white text-[10px] font-bold w-5 h-5 rounded-full
                               flex items-center justify-center shrink-0">
                {item.badge}
              </span>
            )}
          </Link>
        ))}
      </nav>

      <div className="p-3 border-t border-blue-700/50 space-y-3">
        <div className="flex items-center gap-3 px-3 py-2.5 bg-blue-700/40 rounded-xl">
          <div className="w-9 h-9 bg-indigo-400/40 rounded-full flex items-center justify-center
                          text-sm font-extrabold text-white shrink-0">
            {initials}
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-bold text-white truncate">{hod.name}</p>
            <p className="text-xs text-blue-300">HOD · {hod.department}</p>
          </div>
        </div>
        <button onClick={() => navigate('/')}
          className="w-full flex items-center justify-center gap-2 bg-red-500/90 hover:bg-red-500
                     text-white font-bold py-2.5 px-4 rounded-xl transition">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-blue-800 text-white
                      px-4 py-3 flex justify-between items-center shadow-md">
        <div className="flex items-center gap-3">
          <button onClick={() => setIsSidebarOpen(true)} className="p-1">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <span className="text-lg font-extrabold">One Campus</span>
        </div>
        <span className="text-xs font-bold bg-indigo-600/60 px-3 py-1 rounded-full text-blue-100">
          HOD · {hod.department}
        </span>
      </div>

      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={closeSidebar} />
      )}

      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-blue-800 flex flex-col
                         transition-transform duration-300 lg:static lg:translate-x-0
                         ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <SidebarContent />
      </aside>

      <main className="flex-1 overflow-y-auto w-full">
        <div className="lg:hidden h-14" />
        <div className="p-4 md:p-8"><Outlet /></div>
      </main>
    </div>
  );
};

export default HODLayout;