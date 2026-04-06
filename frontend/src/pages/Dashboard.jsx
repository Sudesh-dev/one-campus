import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// ── STAT CARD ────────────────────────────────────────────────
const StatCard = ({ icon, label, value, sub, accent, onClick }) => (
  <div
    onClick={onClick}
    className={`bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-start gap-4
                transition-all duration-200 ${onClick ? 'hover:shadow-md hover:-translate-y-0.5 cursor-pointer' : ''}`}
  >
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${accent}`}>
      {icon}
    </div>
    <div className="min-w-0">
      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">{label}</p>
      <p className="text-2xl font-extrabold text-gray-800 leading-tight">{value}</p>
      {sub && <p className="text-sm text-gray-500 mt-1 truncate">{sub}</p>}
    </div>
  </div>
);

// ── MAIN COMPONENT ────────────────────────────────────────────
const Dashboard = () => {
  const navigate  = useNavigate();
  const [now, setNow] = useState(new Date());

  // Live clock — updates every second
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedDate = now.toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });
  const formattedTime = now.toLocaleTimeString('en-US', {
    hour: '2-digit', minute: '2-digit', second: '2-digit',
  });

  // BACKEND: Replace all values below with data from:
  // GET /api/student/dashboard-summary
  // Returns: { studentName, attendancePercent, nextClass, unreadNotices, cgpa }
  const studentName        = 'John';
  const attendancePercent  = 85;
  const nextClass          = { subject: 'Machine Learning', time: '10:30 AM', room: 'Room 402' };
  const unreadNoticeCount  = 3;
  const cgpa               = 8.36;

  const attendanceColor =
    attendancePercent >= 75 ? 'text-green-600' :
    attendancePercent >= 65 ? 'text-yellow-600' : 'text-red-600';

  // BACKEND: Replace with GET /api/notices?limit=2&unread=true
  const recentNotices = [
    { id: 1, text: 'AI Buildathon registrations close tomorrow.' },
    { id: 2, text: 'Fee dues for 6th semester — pay by Friday.' },
  ];

  return (
    <div className="min-h-screen flex flex-col gap-6">

      {/* ── WELCOME BANNER ── */}
      <div className="bg-blue-800 text-white rounded-2xl p-8 shadow-sm relative overflow-hidden">

        {/* Subtle decorative circles */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-blue-700 rounded-full -translate-y-1/2 translate-x-1/4 opacity-50" />
        <div className="absolute bottom-0 right-32 w-32 h-32 bg-blue-900 rounded-full translate-y-1/2 opacity-40" />

        <div className="relative z-10 flex flex-col md:flex-row md:justify-between md:items-center gap-6">
          <div>
            <h2 className="text-3xl font-extrabold mb-1">
              Good {now.getHours() < 12 ? 'morning' : now.getHours() < 17 ? 'afternoon' : 'evening'}, {studentName}! 👋
            </h2>
            <p className="text-blue-200 font-medium">
              Here's your daily overview for APS College of Engineering.
            </p>
          </div>

          {/* Live date/time pill */}
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 px-6 py-4 rounded-xl
                          flex flex-col items-start md:items-end shrink-0">
            <p className="text-xs font-bold text-blue-300 uppercase tracking-widest mb-1">Current Time</p>
            <p className="text-sm font-semibold text-blue-100">{formattedDate}</p>
            <p className="text-2xl font-black font-mono tabular-nums text-white mt-0.5">{formattedTime}</p>
          </div>
        </div>
      </div>

      {/* ── STATS GRID ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">

        <StatCard
          label="My Attendance"
          value={<span className={attendanceColor}>{attendancePercent}%</span>}
          sub={attendancePercent >= 75 ? 'Safe — keep it up!' : '⚠️ Below 75% threshold'}
          accent="bg-green-50"
          onClick={() => navigate('/attendance')}
          icon={
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
          }
        />

        <StatCard
          label="Next Class"
          value={nextClass.subject}
          sub={`${nextClass.time} · ${nextClass.room}`}
          accent="bg-blue-50"
          icon={
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />

        <StatCard
          label="Unread Notices"
          value={unreadNoticeCount}
          sub="Tap to view all notices"
          accent="bg-yellow-50"
          onClick={() => navigate('/notices')}
          icon={
            <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          }
        />

        <StatCard
          label="Current CGPA"
          value={cgpa}
          sub="Up to 5th Semester"
          accent="bg-purple-50"
          onClick={() => navigate('/marks')}
          icon={
            <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          }
        />

      </div>

      {/* ── RECENT NOTICES CARD ── */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-800">Recent Notices</h3>
          <button
            onClick={() => navigate('/notices')}
            className="text-blue-700 text-sm font-bold hover:underline"
          >
            View all →
          </button>
        </div>

        <div className="space-y-3">
          {recentNotices.map(notice => (
            <div key={notice.id}
              className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl hover:bg-blue-50
                         transition-colors cursor-pointer"
              onClick={() => navigate('/notices')}
            >
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 shrink-0" />
              <p className="text-sm text-gray-700 font-medium">{notice.text}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default Dashboard;