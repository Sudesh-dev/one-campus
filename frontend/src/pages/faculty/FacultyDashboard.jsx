import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Reusable stat card
const StatCard = ({ icon, label, value, sub, accent, onClick }) => (
  <div
    onClick={onClick}
    className={`bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-start gap-4
                transition-all ${onClick ? 'hover:shadow-md hover:-translate-y-0.5 cursor-pointer' : ''}`}
  >
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${accent}`}>
      {icon}
    </div>
    <div>
      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">{label}</p>
      <p className="text-2xl font-extrabold text-gray-800 leading-tight">{value}</p>
      {sub && <p className="text-sm text-gray-500 mt-1">{sub}</p>}
    </div>
  </div>
);

const FacultyDashboard = () => {
  const navigate = useNavigate();
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  // BACKEND: Replace with GET /api/faculty/dashboard-summary
  const faculty = { name: 'Dr. Priya Sharma', department: 'CSE' };

  // BACKEND: Replace with GET /api/faculty/today-classes
  const todayClasses = [
    { time: '9:00 AM',  subject: 'Machine Learning',     section: 'CSE-A', room: '402', sem: 6 },
    { time: '11:00 AM', subject: 'Cloud Computing',       section: 'CSE-B', room: '301', sem: 6 },
    { time: '2:00 PM',  subject: 'Design & Analysis of Algo', section: 'CSE-A', room: '402', sem: 4 },
  ];

  // BACKEND: Replace with GET /api/faculty/pending-letters-count
  const pendingLetters = 3;

  // BACKEND: Replace with GET /api/faculty/stats
  const stats = {
    totalStudents:    124,
    classesThisWeek:  8,
    notesUploaded:    12,
    pendingLetters,
  };

  const greeting =
    now.getHours() < 12 ? 'Good morning' :
    now.getHours() < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="min-h-screen flex flex-col gap-6">

      {/* Welcome Banner */}
      <div className="bg-blue-800 text-white rounded-2xl p-8 shadow-sm relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-48 h-48 bg-blue-700 rounded-full opacity-50" />
        <div className="absolute bottom-0 right-32 w-32 h-32 bg-blue-900 rounded-full translate-y-1/2 opacity-40" />

        <div className="relative z-10 flex flex-col md:flex-row md:justify-between md:items-center gap-6">
          <div>
            <p className="text-blue-300 text-sm font-semibold mb-1">Faculty Portal · CSE Department</p>
            <h2 className="text-3xl font-extrabold mb-1">
              {greeting}, {faculty.name.split(' ')[1]}! 👋
            </h2>
            <p className="text-blue-200 font-medium">
              You have {todayClasses.length} class{todayClasses.length !== 1 ? 'es' : ''} scheduled today.
            </p>
          </div>
          <div className="bg-white/10 border border-white/20 px-6 py-4 rounded-xl shrink-0">
            <p className="text-xs font-bold text-blue-300 uppercase tracking-widest mb-1">Current Time</p>
            <p className="text-sm font-semibold text-blue-100">
              {now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </p>
            <p className="text-2xl font-black font-mono tabular-nums text-white mt-0.5">
              {now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </p>
          </div>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        <StatCard
          label="Total Students"
          value={stats.totalStudents}
          sub="Across all sections"
          accent="bg-blue-50"
          onClick={() => navigate('/faculty/roster')}
          icon={<svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>}
        />
        <StatCard
          label="Classes This Week"
          value={stats.classesThisWeek}
          sub="View timetable →"
          accent="bg-green-50"
          onClick={() => navigate('/faculty/timetable')}
          icon={<svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>}
        />
        <StatCard
          label="Pending Approvals"
          value={stats.pendingLetters}
          sub="Student leave letters"
          accent="bg-yellow-50"
          onClick={() => navigate('/faculty/letters')}
          icon={<svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>}
        />
        <StatCard
          label="Notes Uploaded"
          value={stats.notesUploaded}
          sub="Study materials"
          accent="bg-purple-50"
          onClick={() => navigate('/faculty/notes')}
          icon={<svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>}
        />
      </div>

      {/* Today's Schedule */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-bold text-gray-800">Today's Schedule</h3>
          <button
            onClick={() => navigate('/faculty/timetable')}
            className="text-blue-700 text-sm font-bold hover:underline"
          >
            Full timetable →
          </button>
        </div>

        {todayClasses.length === 0 ? (
          <div className="text-center py-10 text-gray-400">
            <p className="text-3xl mb-2">🎉</p>
            <p className="font-semibold">No classes today. Enjoy your break!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {todayClasses.map((cls, i) => (
              <div key={i}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-xl
                           hover:bg-blue-50 transition-colors group"
              >
                <div className="flex items-center gap-4">
                  {/* Time bubble */}
                  <div className="bg-blue-100 text-blue-800 text-xs font-extrabold px-3 py-2
                                  rounded-lg text-center min-w-18">
                    {cls.time}
                  </div>
                  <div>
                    <p className="font-bold text-gray-800">{cls.subject}</p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Sem {cls.sem} · Section {cls.section} · {cls.room}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => navigate('/faculty/attendance')}
                  className="text-xs font-bold text-blue-700 bg-blue-100 hover:bg-blue-200
                             px-3 py-1.5 rounded-lg transition opacity-0 group-hover:opacity-100"
                >
                  Mark Attendance →
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Mark Attendance', path: '/faculty/attendance', icon: '✅', color: 'bg-green-50 border-green-200 text-green-800 hover:bg-green-100' },
          { label: 'Enter IA Marks',  path: '/faculty/marks',      icon: '📝', color: 'bg-blue-50 border-blue-200 text-blue-800 hover:bg-blue-100'   },
          { label: 'Post Notice',     path: '/faculty/notices',    icon: '📢', color: 'bg-yellow-50 border-yellow-200 text-yellow-800 hover:bg-yellow-100' },
          { label: 'Upload Notes',    path: '/faculty/notes',      icon: '📁', color: 'bg-purple-50 border-purple-200 text-purple-800 hover:bg-purple-100' },
        ].map(action => (
          <button
            key={action.path}
            onClick={() => navigate(action.path)}
            className={`flex flex-col items-center justify-center gap-2 p-5 rounded-2xl border
                        font-bold text-sm transition-all ${action.color}`}
          >
            <span className="text-2xl">{action.icon}</span>
            {action.label}
          </button>
        ))}
      </div>

    </div>
  );
};

export default FacultyDashboard;