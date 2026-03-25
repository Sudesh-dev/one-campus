import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';

const SidebarLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => location.pathname === path ? 'bg-blue-700 text-white' : 'text-blue-100 hover:bg-blue-600';

  const handleLogout = () => {
    navigate('/');
  };

  const handleLinkClick = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="flex h-screen bg-gray-50 flex-col lg:flex-row overflow-hidden">

      {/* Mobile & Tablet Top Bar (Hidden on Laptop) */}
      <div className="lg:hidden bg-blue-800 text-white p-4 flex justify-between items-center shadow-md z-40">
        <div className="flex items-center">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="text-white hover:text-blue-200 focus:outline-none"
          >
            {/* 3-Line Hamburger Icon */}
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          {/* Clickable Logo for Mobile */}
          <Link to="/dashboard" onClick={handleLinkClick} className="text-xl font-extrabold tracking-wider ml-4 hover:text-blue-200 transition">
            One Campus
          </Link>
        </div>

        {/* The Bell Icon for Mobile */}
        <button
          onClick={() => { navigate('/notices'); setIsSidebarOpen(false); }}
          className="text-white hover:text-blue-200 focus:outline-none"
        >
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
        </button>
      </div>

      {/* Dark Overlay for Mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar - Mobile/Tablet: Sliding | Laptop: Pinned */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-blue-800 text-white flex flex-col justify-between 
        transform transition-transform duration-300 ease-in-out lg:static lg:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>

        <div>
          {/* Sidebar Header (Laptop View) */}
          <div className="p-6 hidden lg:flex justify-between items-center">
            {/* Clickable Logo for Laptop */}
            <Link to="/dashboard" className="text-2xl font-extrabold tracking-wider hover:text-blue-200 transition">
              One Campus
            </Link>

            {/* The Bell Icon for Laptop */}
            <button
              onClick={() => navigate('/notices')}
              className="text-white hover:text-blue-200 focus:outline-none"
              title="Noticeboard"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </button>
          </div>

          {/* Close button for Mobile inside the sidebar */}
          <div className="p-4 lg:hidden flex justify-end">
            <button onClick={() => setIsSidebarOpen(false)} className="text-white">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <nav className="mt-2 px-4 space-y-2">
            <Link to="/dashboard" onClick={handleLinkClick} className={`block px-4 py-3 rounded-lg font-medium transition-colors ${isActive('/dashboard')}`}>
              Dashboard
            </Link>
            <Link to="/notices" onClick={handleLinkClick} className={`block px-4 py-3 rounded-lg font-medium transition-colors ${isActive('/notices')}`}>
              Noticeboard
            </Link>
            <Link to="/attendance" onClick={handleLinkClick} className={`block px-4 py-3 rounded-lg font-medium transition-colors ${isActive('/attendance')}`}>
              Attendance
            </Link>
            <Link to="/marks" onClick={handleLinkClick} className={`block px-4 py-3 rounded-lg font-medium transition-colors ${isActive('/marks')}`}>
              Marks & Results
            </Link>
            <Link to="/letters" onClick={handleLinkClick} className={`block px-4 py-3 rounded-lg font-medium transition-colors ${isActive('/letters')}`}>
              Letter Generator
            </Link>
          </nav>
        </div>

        <div className="p-4 border-t border-blue-700">
          <button
            onClick={handleLogout}
            className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg transition-colors"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto w-full">
        <div className="p-4 md:p-8">
          <Outlet />
        </div>
      </div>

    </div>
  );
};

export default SidebarLayout;