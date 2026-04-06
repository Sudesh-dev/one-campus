import React, { useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, CartesianGrid,
} from 'recharts';

const Attendance = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // ── VTU BRAIN ────────────────────────────────────────────
  // Extracts semester, branch, and enrollment type from a USN.
  // Lateral entry (4th character = '4') students start at sem 3.
  const getStudentDetails = (usn) => {
    if (!usn || usn.length < 10)
      return { sem: 0, branch: 'Unknown', isLateral: false, status: 'Invalid' };

    const usnUpper    = usn.toUpperCase();
    const joinYear    = 2000 + parseInt(usnUpper.substring(3, 5), 10);
    const branchCode  = usnUpper.substring(5, 7);
    const isLateral   = usnUpper.substring(7, 8) === '4';

    const today        = new Date();
    const currentYear  = today.getFullYear();
    const currentMonth = today.getMonth() + 1;

    let yearsElapsed   = currentYear - joinYear;
    let calculatedSem  = yearsElapsed * 2;
    if (currentMonth >= 8) calculatedSem += 1;
    if (isLateral)         calculatedSem += 2;

    if (isNaN(calculatedSem) || calculatedSem < 1 || joinYear > currentYear)
      return { sem: 0, branch: branchCode, isLateral, status: 'Invalid' };

    if (calculatedSem > 8)
      return { sem: calculatedSem, branch: branchCode, isLateral, status: 'Graduated' };

    return { sem: calculatedSem, branch: branchCode, isLateral, status: 'Active' };
  };

  // BACKEND: Replace studentUsn with USN from your auth context / user session
  // e.g. const { usn: studentUsn } = useAuth();
  const studentUsn = '1AP23CS019';
  const { sem, branch, isLateral, status } = getStudentDetails(studentUsn);

  // ── ATTENDANCE DATA ───────────────────────────────────────
  // BACKEND: Replace with GET /api/attendance?usn=<usn>&sem=<sem>
  const db6thSemCS = [
    { short: 'ML',  subject: 'Machine Learning',      code: 'BCS602',  attended: 38, total: 42, fill: '#3b82f6', colorClass: 'bg-blue-500'   },
    { short: 'CC',  subject: 'Cloud Computing',        code: 'BCS601',  attended: 30, total: 40, fill: '#eab308', colorClass: 'bg-yellow-500' },
    { short: 'BCT', subject: 'Blockchain Technology',  code: 'BCS613A', attended: 28, total: 35, fill: '#22c55e', colorClass: 'bg-green-500'  },
    { short: 'CN',  subject: 'Computer Networks',      code: 'BCS502',  attended: 20, total: 36, fill: '#ef4444', colorClass: 'bg-red-500'    },
    { short: 'CD',  subject: 'Compiler Design',        code: 'BCS613C', attended: 34, total: 38, fill: '#8b5cf6', colorClass: 'bg-purple-500' },
  ];

  const db4thSemCS = [
    { short: 'ADA', subject: 'Design & Analysis of Algo', code: 'BCS401',  attended: 40, total: 45, fill: '#3b82f6', colorClass: 'bg-blue-500'   },
    { short: 'MC',  subject: 'Microcontrollers',           code: 'BCS402',  attended: 35, total: 40, fill: '#eab308', colorClass: 'bg-yellow-500' },
    { short: 'OS',  subject: 'Operating Systems',          code: 'BCS403',  attended: 38, total: 40, fill: '#22c55e', colorClass: 'bg-green-500'  },
    { short: 'Bio', subject: 'Biology for Engineers',      code: 'BBOK407', attended: 12, total: 20, fill: '#ef4444', colorClass: 'bg-red-500'    },
  ];

  let activeAttendanceData = [];
  if (branch === 'CS' && sem === 6)      activeAttendanceData = db6thSemCS;
  else if (branch === 'CS' && sem === 4) activeAttendanceData = db4thSemCS;
  else if (status === 'Active')          activeAttendanceData = db6thSemCS; // fallback

  // BACKEND: Replace with GET /api/attendance/weekly?usn=<usn>
  const consistencyData = [
    { week: 'W1', attendance: 90 }, { week: 'W2', attendance: 85 },
    { week: 'W3', attendance: 88 }, { week: 'W4', attendance: 75 },
    { week: 'W5', attendance: 82 }, { week: 'W6', attendance: 85 },
  ];

  const totalClasses   = activeAttendanceData.reduce((a, c) => a + c.total,    0) || 1;
  const totalAttended  = activeAttendanceData.reduce((a, c) => a + c.attended, 0) || 0;
  const overallPct     = Math.round((totalAttended / totalClasses) * 100);

  const pieData   = [
    { name: 'Attended', value: totalAttended },
    { name: 'Missed',   value: totalClasses - totalAttended },
  ];
  const pieColors = [overallPct >= 75 ? '#22c55e' : '#ef4444', '#e5e7eb'];

  // ── SHORTAGE / SAFE-BUNK HELPER ──────────────────────────
  // If below 75%:  classesNeeded to reach safety
  //   (attended + x) / (total + x) = 0.75  =>  x = (0.75*total - attended) / 0.25
  // If above 75%:  safe bunks left before dropping below 75%
  //   attended / (total + x) = 0.75         =>  x = (attended - 0.75*total) / 0.75
  const getShortageInfo = (attended, total) => {
    const pct = (attended / total) * 100;
    if (pct < 75) {
      const needed = Math.ceil((0.75 * total - attended) / 0.25);
      return { type: 'danger', needed };
    } else {
      const safeBunks = Math.floor((attended - 0.75 * total) / 0.75);
      return { type: 'safe', safeBunks };
    }
  };

  // ── RENDER ────────────────────────────────────────────────
  return (
    <div className="bg-gray-50 p-4 md:p-8 min-h-screen relative">

      {/* Page Header */}
      <div className="mb-8 flex flex-col md:flex-row md:justify-between md:items-end gap-3">
        <div>
          <h2 className="text-3xl font-extrabold text-gray-800">Attendance Analytics</h2>
          <p className="text-gray-500 text-sm mt-1">Deep dive into your class presence and consistency.</p>
        </div>
        {/* Student info badge (read-only, comes from auth) */}
        {status === 'Active' && (
          <div className="flex items-center gap-2 bg-blue-50 border border-blue-200 px-4 py-2
                          rounded-xl text-sm font-semibold text-blue-800">
            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            {sem}th Sem · {branch} {isLateral && '· Lateral'}
          </div>
        )}
      </div>

      {/* ── INVALID USN ── */}
      {status === 'Invalid' && (
        <div className="bg-red-50 border-l-8 border-red-500 p-8 rounded-xl shadow-sm
                        flex items-center gap-6">
          <div className="bg-red-100 p-4 rounded-full text-red-600">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div>
            <h3 className="text-xl font-extrabold text-red-800 mb-1">Invalid Credentials</h3>
            <p className="text-red-700 font-medium text-sm">
              USN ({studentUsn}) does not match a valid VTU format. Please contact administration.
            </p>
          </div>
        </div>
      )}

      {/* ── GRADUATED ── */}
      {status === 'Graduated' && (
        <div className="bg-linear-to-r from-yellow-500 to-yellow-400 p-8 rounded-2xl
                        shadow-sm flex items-center gap-6 text-white">
          <div className="bg-white/20 p-4 rounded-full">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <h3 className="text-2xl font-extrabold mb-1">Alumni Record</h3>
            <p className="text-yellow-50 font-medium text-sm">
              Student {studentUsn} has completed all 8 semesters. Congratulations!
            </p>
          </div>
        </div>
      )}

      {/* ── ACTIVE STUDENT DASHBOARD ── */}
      {status === 'Active' && (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <p className="text-gray-400 font-bold uppercase tracking-wider text-xs mb-1">
                Total Classes Held
              </p>
              <h3 className="text-4xl font-extrabold text-gray-800">{totalClasses}</h3>
              <p className="text-sm mt-2 text-gray-400 font-medium">Across all subjects</p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <p className="text-gray-400 font-bold uppercase tracking-wider text-xs mb-1">
                Total Attended
              </p>
              <h3 className="text-4xl font-extrabold text-blue-700">{totalAttended}</h3>
              <p className="text-sm mt-1 text-gray-400 font-medium">
                {totalClasses - totalAttended} classes missed
              </p>
              <button
                onClick={() => setIsModalOpen(true)}
                className="mt-4 text-sm font-bold text-white bg-blue-800 hover:bg-blue-900
                           px-4 py-2 rounded-lg transition-all flex items-center gap-2 shadow-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                View Subject Details
              </button>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100
                            flex items-center justify-between">
              <div>
                <p className="text-gray-400 font-bold uppercase tracking-wider text-xs mb-1">
                  Overall Status
                </p>
                <h3 className={`text-4xl font-extrabold ${overallPct >= 75 ? 'text-green-500' : 'text-red-500'}`}>
                  {overallPct}%
                </h3>
                <p className="text-sm mt-2 font-bold text-gray-600">
                  {overallPct >= 75 ? '✅ Safe Zone' : '⚠️ Shortage Risk'}
                </p>
              </div>
              <div className="h-28 w-28">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={pieData} innerRadius={35} outerRadius={50}
                      paddingAngle={5} dataKey="value" stroke="none">
                      {pieData.map((_, i) => <Cell key={i} fill={pieColors[i]} />)}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="text-base font-bold text-gray-700 mb-6">
                Subject vs Classes Attended
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={activeAttendanceData}
                    margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                    <XAxis dataKey="short" tick={{ fontSize: 12, fontWeight: 'bold' }}
                      axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                    <Tooltip cursor={{ fill: '#f9fafb' }} />
                    <Bar dataKey="attended" radius={[6, 6, 0, 0]} barSize={32}>
                      {activeAttendanceData.map((e, i) => <Cell key={i} fill={e.fill} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="text-base font-bold text-gray-700 mb-6">
                Weekly Consistency Tracker (%)
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={consistencyData}
                    margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                    <XAxis dataKey="week" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                    <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                    <Tooltip />
                    <Line type="monotone" dataKey="attendance" stroke="#1d4ed8" strokeWidth={4}
                      dot={{ r: 6, fill: '#1d4ed8', stroke: '#fff', strokeWidth: 2 }}
                      activeDot={{ r: 8 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ── SUBJECT DETAIL MODAL ─────────────────────────────
          Shows per-subject attendance with:
          - Animated progress bar
          - If safe: how many classes you can still bunk
          - If short: how many classes you MUST attend to reach 75%
      ── */}
      {isModalOpen && status === 'Active' && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50
                        flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl">

            {/* Modal Header */}
            <div className="p-6 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold text-gray-800">Subject-wise Attendance</h3>
                <p className="text-sm text-gray-500 mt-0.5">
                  {sem}th Semester · {branch} · 2022 Scheme
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-white hover:bg-red-500 transition-colors
                           rounded-full p-2 border border-gray-200 bg-white"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* VTU threshold legend */}
            <div className="px-6 pt-4 flex items-center gap-4 text-xs font-semibold">
              <span className="flex items-center gap-1.5 text-green-700">
                <span className="w-3 h-3 bg-green-500 rounded-sm inline-block" /> ≥ 75% Safe
              </span>
              <span className="flex items-center gap-1.5 text-red-700">
                <span className="w-3 h-3 bg-red-400 rounded-sm inline-block" /> &lt; 75% Shortage
              </span>
            </div>

            {/* Subject rows */}
            <div className="p-6 space-y-6 max-h-[65vh] overflow-y-auto">
              {activeAttendanceData.map((item) => {
                const pct   = Math.round((item.attended / item.total) * 100);
                const info  = getShortageInfo(item.attended, item.total);
                const isSafe = info.type === 'safe';

                return (
                  <div key={item.code}>

                    {/* Subject name + code + percentage */}
                    <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-2 gap-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-gray-800">{item.subject}</span>
                        <span className="text-xs font-bold text-gray-500 bg-gray-100
                                         px-2 py-0.5 rounded-md font-mono">
                          {item.code}
                        </span>
                      </div>
                      <span className={`text-sm font-extrabold ${isSafe ? 'text-green-600' : 'text-red-600'}`}>
                        {pct}%
                        <span className="text-xs font-semibold text-gray-400 ml-1.5">
                          ({item.attended}/{item.total})
                        </span>
                      </span>
                    </div>

                    {/* Progress bar */}
                    <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden mb-2">
                      <div
                        className={`h-3 rounded-full transition-all duration-700 ease-out
                          ${isSafe ? item.colorClass : 'bg-red-400'}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>

                    {/* Shortage / safe-bunk message */}
                    {isSafe ? (
                      <p className="text-xs font-semibold text-green-700 flex items-center gap-1">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                        </svg>
                        You can skip up to{' '}
                        <strong>{info.safeBunks} more class{info.safeBunks !== 1 ? 'es' : ''}</strong>
                        {' '}and stay safe.
                      </p>
                    ) : (
                      <p className="text-xs font-semibold text-red-700 flex items-center gap-1">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5"
                            d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                        </svg>
                        Attend the next{' '}
                        <strong>{info.needed} consecutive class{info.needed !== 1 ? 'es' : ''}</strong>
                        {' '}to reach 75%.
                      </p>
                    )}
                  </div>
                );
              })}
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default Attendance;