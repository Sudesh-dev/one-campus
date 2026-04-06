import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';

// ── NAV ITEMS CONFIG ─────────────────────────────────────────
// Add or remove routes here. Icons are inline SVG (Heroicons Outline).
const navItems = [
  {
    path: '/dashboard',
    label: 'Dashboard',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75"
          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    path: '/notices',
    label: 'Noticeboard',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75"
          d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
      </svg>
    ),
  },
  {
    path: '/attendance',
    label: 'Attendance',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75"
          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
      </svg>
    ),
  },
  {
    path: '/marks',
    label: 'Marks & Results',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75"
          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
  {
    path: '/letters',
    label: 'Letter Generator',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75"
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
  {
    path: '/profile',
    label: 'My Profile',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75"
          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
  },
];

// ── COMPONENT ────────────────────────────────────────────────
const SidebarLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location  = useLocation();
  const navigate  = useNavigate();

  // BACKEND: Replace with unread count from GET /api/notices/unread-count
  const unreadCount = 3;

  // BACKEND: Replace with data from auth context / user session
  const currentStudent = {
    firstName : 'John',
    lastName  : 'Doe',
    usn       : '1AP23CS019',
  };

  const initials = `${currentStudent.firstName[0]}${currentStudent.lastName[0]}`;

  const isActive = (path) =>
    location.pathname === path
      ? 'bg-blue-700 text-white'
      : 'text-blue-100 hover:bg-blue-700/50';

  const handleLogout = () => {
    // BACKEND: Call POST /api/auth/logout to invalidate session/token
    navigate('/');
  };

  const closeSidebar = () => setIsSidebarOpen(false);

  // ── SIDEBAR CONTENT (shared between mobile and desktop) ──
  const SidebarContent = () => (
    <div className="flex flex-col h-full">

      {/* Logo Header */}
      <div className="p-5 flex justify-between items-center border-b border-blue-700/50">
        <Link to="/dashboard" onClick={closeSidebar}
          className="text-xl font-extrabold tracking-tight text-white hover:text-blue-200 transition">
          One Campus
        </Link>

        {/* Bell icon with unread badge */}
        <button
          onClick={() => { navigate('/notices'); closeSidebar(); }}
          className="relative text-blue-200 hover:text-white transition"
          title="Noticeboard"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          {/* BACKEND: Only show badge when unreadCount > 0 */}
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[10px]
                             font-bold text-white flex items-center justify-center leading-none">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto mt-2">
        {navItems.map(item => (
          <Link
            key={item.path}
            to={item.path}
            onClick={closeSidebar}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium
                        transition-all duration-150 ${isActive(item.path)}`}
          >
            {item.icon}
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      {/* Bottom: Student mini-card + Logout */}
      <div className="p-3 border-t border-blue-700/50 space-y-3">

        {/* Student info card */}
        <div className="flex items-center gap-3 px-3 py-2.5 bg-blue-700/40 rounded-xl">
          <div className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center
                          text-sm font-extrabold text-white shrink-0">
            {initials}
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-bold text-white truncate">
              {currentStudent.firstName} {currentStudent.lastName}
            </p>
            <p className="text-xs text-blue-300 font-mono">{currentStudent.usn}</p>
          </div>
        </div>

        {/* Logout button */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 bg-red-500/90 hover:bg-red-500
                     text-white font-bold py-2.5 px-4 rounded-xl transition-colors"
        >
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

      {/* ── MOBILE TOP BAR ── */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-blue-800 text-white
                      px-4 py-3 flex justify-between items-center shadow-md">
        <div className="flex items-center gap-3">
          <button onClick={() => setIsSidebarOpen(true)} className="text-white p-1">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <Link to="/dashboard" onClick={closeSidebar}
            className="text-lg font-extrabold tracking-tight hover:text-blue-200 transition">
            One Campus
          </Link>
        </div>

        <button
          onClick={() => { navigate('/notices'); closeSidebar(); }}
          className="relative text-blue-200 hover:text-white transition p-1"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 rounded-full text-[10px]
                             font-bold text-white flex items-center justify-center">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>
      </div>

      {/* ── MOBILE DARK OVERLAY ── */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* ── SIDEBAR ── */}
      {/* Mobile: slides in from left | Desktop: always visible */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-blue-800 flex flex-col
        transition-transform duration-300 ease-in-out
        lg:static lg:translate-x-0 lg:flex
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <SidebarContent />
      </aside>

      {/* ── MAIN CONTENT ── */}
      <main className="flex-1 overflow-y-auto w-full">
        {/* Spacer for mobile top bar */}
        <div className="lg:hidden h-14" />
        <div className="p-4 md:p-8">
          <Outlet />
        </div>
      </main>

    </div>
  );
};

export default SidebarLayout;