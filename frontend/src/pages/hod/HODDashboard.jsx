import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// BACKEND: GET /api/hod/faculty → list of all faculty in dept
const DEPT_FACULTY = [
  { id: 'f1', name: 'Dr. Priya Sharma',   empId: 'FAC001', subjects: ['Machine Learning', 'Cloud Computing'] },
  { id: 'f2', name: 'Prof. Anil Kumar',   empId: 'FAC002', subjects: ['Computer Networks', 'Compiler Design'] },
  { id: 'f3', name: 'Dr. Meera Nair',     empId: 'FAC003', subjects: ['DBMS', 'Software Engineering'] },
  { id: 'f4', name: 'Prof. Suresh Babu',  empId: 'FAC004', subjects: ['DAA', 'Operating Systems'] },
  { id: 'f5', name: 'Dr. Kavya Reddy',    empId: 'FAC005', subjects: ['Blockchain', 'Microcontrollers'] },
];

const StatCard = ({ icon, label, value, sub, accent, onClick }) => (
  <div onClick={onClick}
    className={`bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-start gap-4
                transition-all ${onClick ? 'hover:shadow-md hover:-translate-y-0.5 cursor-pointer' : ''}`}>
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${accent}`}>{icon}</div>
    <div>
      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">{label}</p>
      <p className="text-2xl font-extrabold text-gray-800 leading-tight">{value}</p>
      {sub && <p className="text-sm text-gray-500 mt-1">{sub}</p>}
    </div>
  </div>
);

const HODDashboard = () => {
  const navigate = useNavigate();
  const [now, setNow] = useState(new Date());
  const [showMeetingModal, setShowMeetingModal] = useState(false);

  // Meeting form state
  const [meetingTopic,    setMeetingTopic]    = useState('');
  const [meetingDate,     setMeetingDate]     = useState('');
  const [meetingTime,     setMeetingTime]     = useState('');
  const [meetingAgenda,   setMeetingAgenda]   = useState('');
  const [meetingVenue,    setMeetingVenue]    = useState('');
  const [selectedFaculty, setSelectedFaculty] = useState(new Set(DEPT_FACULTY.map(f => f.id)));
  const [isSending,       setIsSending]       = useState(false);
  const [meetingSent,     setMeetingSent]     = useState(false);

  // Meeting history
  // BACKEND: GET /api/hod/meetings
  const [meetingHistory, setMeetingHistory] = useState([
    {
      id: 1, topic: 'Monthly Dept Review',
      date: '2026-03-28', time: '11:00', venue: 'HOD Room 201',
      sentTo: 5, agenda: 'Review attendance defaulters, discuss upcoming VTU exam schedule.',
    },
    {
      id: 2, topic: 'IA-2 Marks Submission Deadline',
      date: '2026-04-01', time: '14:00', venue: 'Conference Hall',
      sentTo: 5, agenda: 'All faculty must submit IA-2 marks by April 5th.',
    },
  ]);

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const toggleFaculty = (id) => {
    setSelectedFaculty(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const selectAll = () => setSelectedFaculty(new Set(DEPT_FACULTY.map(f => f.id)));
  const clearAll  = () => setSelectedFaculty(new Set());

  // BACKEND: POST /api/hod/meetings
  // Body: { topic, date, time, venue, agenda, facultyIds }
  // Backend sends push notification + email to selected faculty
  const handleSendMeeting = () => {
    if (!meetingTopic || !meetingDate || !meetingTime || selectedFaculty.size === 0) return;
    setIsSending(true);
    setTimeout(() => {
      const newMeeting = {
        id:      Date.now(),
        topic:   meetingTopic,
        date:    meetingDate,
        time:    meetingTime,
        venue:   meetingVenue || 'TBD',
        sentTo:  selectedFaculty.size,
        agenda:  meetingAgenda,
      };
      setMeetingHistory(prev => [newMeeting, ...prev]);
      setIsSending(false);
      setMeetingSent(true);
      setTimeout(() => {
        setMeetingSent(false);
        setShowMeetingModal(false);
        setMeetingTopic(''); setMeetingDate(''); setMeetingTime('');
        setMeetingAgenda(''); setMeetingVenue('');
        setSelectedFaculty(new Set(DEPT_FACULTY.map(f => f.id)));
      }, 2000);
    }, 1000);
  };

  const greeting = now.getHours() < 12 ? 'Good morning' :
                   now.getHours() < 17 ? 'Good afternoon' : 'Good evening';

  // BACKEND: GET /api/hod/dashboard-summary
  const stats = { totalStudents: 240, totalFaculty: 5, avgAttendance: 78, pendingLetters: 2 };

  return (
    <div className="min-h-screen flex flex-col gap-6">

      {/* Welcome Banner */}
      <div className="bg-blue-800 text-white rounded-2xl p-8 shadow-sm relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-48 h-48 bg-blue-700 rounded-full opacity-50" />
        <div className="absolute bottom-0 right-32 w-32 h-32 bg-blue-900 rounded-full translate-y-1/2 opacity-40" />
        <div className="relative z-10 flex flex-col md:flex-row md:justify-between md:items-center gap-6">
          <div>
            <p className="text-blue-300 text-sm font-semibold mb-1">HOD Portal · CSE Department</p>
            <h2 className="text-3xl font-extrabold mb-1">{greeting}, Prof. Prasad! 👋</h2>
            <p className="text-blue-200 font-medium">Department overview for APS College of Engineering.</p>
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

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        <StatCard label="Total Students" value={stats.totalStudents} sub="CSE Department"
          accent="bg-blue-50" onClick={() => navigate('/hod/students')}
          icon={<svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>}
        />
        <StatCard label="Faculty Members" value={stats.totalFaculty} sub="Active this semester"
          accent="bg-green-50" onClick={() => navigate('/hod/faculty')}
          icon={<svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>}
        />
        <StatCard label="Dept Avg Attendance" value={`${stats.avgAttendance}%`}
          sub={stats.avgAttendance >= 75 ? 'Above threshold' : '⚠️ Below 75%'}
          accent="bg-yellow-50" onClick={() => navigate('/hod/analytics')}
          icon={<svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>}
        />
        <StatCard label="Pending Letters" value={stats.pendingLetters} sub="Awaiting HOD approval"
          accent="bg-red-50" onClick={() => navigate('/hod/letters')}
          icon={<svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>}
        />
      </div>

      {/* Call Meeting + History row */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

        {/* Call Meeting card */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6
                        flex flex-col items-center justify-center text-center gap-4">
          <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center">
            <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75"
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-800">Call Department Meeting</h3>
            <p className="text-sm text-gray-500 mt-1">
              Notify all or selected faculty with topic, time, venue & agenda instantly.
            </p>
          </div>
          <button onClick={() => setShowMeetingModal(true)}
            className="bg-blue-800 hover:bg-blue-900 text-white font-bold px-6 py-3 rounded-xl
                       transition shadow-sm flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            Schedule Meeting
          </button>
        </div>

        {/* Meeting history */}
        <div className="lg:col-span-3 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-base font-bold text-gray-800 mb-4">Recent Meeting Calls</h3>
          {meetingHistory.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-8">No meetings called yet.</p>
          ) : (
            <div className="space-y-3">
              {meetingHistory.map(m => (
                <div key={m.id}
                  className="flex items-start gap-4 p-3.5 bg-gray-50 rounded-xl hover:bg-blue-50 transition">
                  <div className="bg-blue-100 text-blue-800 rounded-lg px-3 py-2 text-center shrink-0">
                    <p className="text-xs font-bold">{new Date(m.date).toLocaleDateString('en-US', { month: 'short' })}</p>
                    <p className="text-lg font-extrabold leading-tight">{new Date(m.date).getDate()}</p>
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-gray-800 text-sm truncate">{m.topic}</p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {m.time} · {m.venue} · Notified {m.sentTo} faculty
                    </p>
                    {m.agenda && (
                      <p className="text-xs text-gray-400 mt-0.5 truncate">{m.agenda}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Dept Analytics', path: '/hod/analytics', icon: '📊', color: 'bg-blue-50 border-blue-200 text-blue-800 hover:bg-blue-100'     },
          { label: 'Student Roster', path: '/hod/students',  icon: '👥', color: 'bg-green-50 border-green-200 text-green-800 hover:bg-green-100'   },
          { label: 'Post Notice',    path: '/hod/notices',   icon: '📢', color: 'bg-yellow-50 border-yellow-200 text-yellow-800 hover:bg-yellow-100' },
          { label: 'Approve Letters',path: '/hod/letters',   icon: '✉️', color: 'bg-purple-50 border-purple-200 text-purple-800 hover:bg-purple-100' },
        ].map(a => (
          <button key={a.path} onClick={() => navigate(a.path)}
            className={`flex flex-col items-center justify-center gap-2 p-5 rounded-2xl border
                        font-bold text-sm transition-all ${a.color}`}>
            <span className="text-2xl">{a.icon}</span>{a.label}
          </button>
        ))}
      </div>

      {/* ══════════════════════════════════════
          CALL MEETING MODAL
      ══════════════════════════════════════ */}
      {showMeetingModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center
                        justify-center p-4" onClick={() => !isSending && setShowMeetingModal(false)}>
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden"
            onClick={e => e.stopPropagation()}>

            {/* Modal header */}
            <div className="p-6 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold text-gray-800">Schedule Department Meeting</h3>
                <p className="text-sm text-gray-500 mt-0.5">Notifications sent to selected faculty</p>
              </div>
              <button onClick={() => setShowMeetingModal(false)}
                className="text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full p-2 transition">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">

              {/* Topic */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">Meeting Topic *</label>
                <input value={meetingTopic} onChange={e => setMeetingTopic(e.target.value)}
                  placeholder="e.g. Monthly Department Review"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2
                             focus:ring-blue-500 focus:outline-none bg-gray-50 text-gray-800" />
              </div>

              {/* Date + Time */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">Date *</label>
                  <input type="date" value={meetingDate} onChange={e => setMeetingDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2
                               focus:ring-blue-500 focus:outline-none bg-gray-50" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">Time *</label>
                  <input type="time" value={meetingTime} onChange={e => setMeetingTime(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2
                               focus:ring-blue-500 focus:outline-none bg-gray-50" />
                </div>
              </div>

              {/* Venue */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">Venue</label>
                <input value={meetingVenue} onChange={e => setMeetingVenue(e.target.value)}
                  placeholder="e.g. HOD Room 201 / Conference Hall"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2
                             focus:ring-blue-500 focus:outline-none bg-gray-50 text-gray-800" />
              </div>

              {/* Agenda */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">Agenda / Notes</label>
                <textarea value={meetingAgenda} onChange={e => setMeetingAgenda(e.target.value)}
                  placeholder="Points to discuss, action items, etc."
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2
                             focus:ring-blue-500 focus:outline-none bg-gray-50 resize-none text-sm" />
              </div>

              {/* Faculty selector */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-bold text-gray-700">
                    Notify Faculty * ({selectedFaculty.size}/{DEPT_FACULTY.length} selected)
                  </label>
                  <div className="flex gap-2">
                    <button type="button" onClick={selectAll}
                      className="text-xs text-blue-700 font-bold hover:underline">All</button>
                    <span className="text-gray-300">|</span>
                    <button type="button" onClick={clearAll}
                      className="text-xs text-gray-500 font-bold hover:underline">None</button>
                  </div>
                </div>
                <div className="space-y-2">
                  {DEPT_FACULTY.map(f => (
                    <label key={f.id}
                      className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition ${
                        selectedFaculty.has(f.id)
                          ? 'bg-blue-50 border-blue-300'
                          : 'bg-gray-50 border-gray-200 hover:border-gray-300'
                      }`}>
                      <input type="checkbox" checked={selectedFaculty.has(f.id)}
                        onChange={() => toggleFaculty(f.id)} className="w-4 h-4 accent-blue-700" />
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center
                                      text-xs font-extrabold text-blue-700 shrink-0">
                        {f.name.split(' ').slice(-1)[0][0]}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-800">{f.name}</p>
                        <p className="text-xs text-gray-400">{f.subjects.join(', ')}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Send button */}
              {meetingSent ? (
                <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
                  <p className="text-green-700 font-bold text-sm flex items-center justify-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                    </svg>
                    Notifications sent to {selectedFaculty.size} faculty members!
                  </p>
                </div>
              ) : (
                <button onClick={handleSendMeeting}
                  disabled={!meetingTopic || !meetingDate || !meetingTime || selectedFaculty.size === 0 || isSending}
                  className="w-full bg-blue-800 hover:bg-blue-900 disabled:opacity-50 text-white
                             font-bold py-3 rounded-xl transition flex items-center justify-center gap-2">
                  {isSending ? (
                    <><svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>Sending...</>
                  ) : (
                    <><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                    Send Notifications to {selectedFaculty.size} Faculty</>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HODDashboard;