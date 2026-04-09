import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts';

// BACKEND: GET /api/faculty/roster?subject=<code>&section=<sec>
const FACULTY_SUBJECTS = [
  { id: 's1', name: 'Machine Learning',         code: 'BCS602', sem: 6, sections: ['CSE-A', 'CSE-B'] },
  { id: 's2', name: 'Cloud Computing',           code: 'BCS601', sem: 6, sections: ['CSE-B']          },
  { id: 's3', name: 'Design & Analysis of Algo', code: 'BCS401', sem: 4, sections: ['CSE-A']          },
];

const MOCK_ROSTER = {
  'BCS602-CSE-A': [
    { usn: '1AP23CS001', name: 'Aarav Sharma',   attended: 38, total: 42, ia1: 42, ia2: 45 },
    { usn: '1AP23CS002', name: 'Bhavana Reddy',  attended: 30, total: 42, ia1: 38, ia2: 35 },
    { usn: '1AP23CS003', name: 'Chandan Kumar',  attended: 40, total: 42, ia1: 28, ia2: 40 },
    { usn: '1AP23CS004', name: 'Deepika Rao',    attended: 20, total: 42, ia1: 18, ia2: 22 },
    { usn: '1AP23CS019', name: 'John Doe',        attended: 35, total: 42, ia1: 35, ia2: 38 },
  ],
  'BCS602-CSE-B': [
    { usn: '1AP23CS051', name: 'Farhan Ali',    attended: 40, total: 42, ia1: 44, ia2: 46 },
    { usn: '1AP23CS052', name: 'Geetha Nair',   attended: 28, total: 42, ia1: 30, ia2: 32 },
    { usn: '1AP23CS053', name: 'Harish Menon',  attended: 35, total: 42, ia1: 38, ia2: 40 },
  ],
  'BCS601-CSE-B': [
    { usn: '1AP23CS051', name: 'Farhan Ali',  attended: 38, total: 40, ia1: 44, ia2: 46 },
    { usn: '1AP23CS052', name: 'Geetha Nair', attended: 25, total: 40, ia1: 30, ia2: 32 },
  ],
  'BCS401-CSE-A': [
    { usn: '1AP21CS001', name: 'Ishaan Joshi',  attended: 43, total: 45, ia1: 40, ia2: 42 },
    { usn: '1AP21CS002', name: 'Jasmine Kaur',  attended: 30, total: 45, ia1: 28, ia2: 30 },
    { usn: '1AP21CS003', name: 'Kiran Das',     attended: 45, total: 45, ia1: 48, ia2: 50 },
  ],
};

const FacultyRoster = () => {
  const [subjectId, setSubjectId] = useState('');
  const [section,   setSection]   = useState('');
  const [search,    setSearch]    = useState('');
  const [sortBy,    setSortBy]    = useState('name'); // 'name'|'attendance'|'avg'

  const selectedSubject = FACULTY_SUBJECTS.find(s => s.id === subjectId);
  const key             = selectedSubject ? `${selectedSubject.code}-${section}` : '';
  const rawStudents     = MOCK_ROSTER[key] || [];

  // Enrich with computed fields
  const students = rawStudents.map(s => ({
    ...s,
    pct: Math.round((s.attended / s.total) * 100),
    avg: Math.ceil((s.ia1 + s.ia2) / 2),
  }));

  // Filter + sort
  const filtered = students
    .filter(s =>
      !search ||
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.usn.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) =>
      sortBy === 'attendance' ? b.pct - a.pct :
      sortBy === 'avg'        ? b.avg - a.avg  :
      a.name.localeCompare(b.name)
    );

  // Analytics
  const shortageCount = students.filter(s => s.pct < 75).length;
  const avgAttendance = students.length
    ? Math.round(students.reduce((a, c) => a + c.pct, 0) / students.length) : 0;
  const avgIA = students.length
    ? (students.reduce((a, c) => a + c.avg, 0) / students.length).toFixed(1) : 0;

  // Chart data
  const chartData = filtered.map(s => ({
    name: s.name.split(' ')[0],
    pct:  s.pct,
    avg:  s.avg,
  }));

  return (
    <div className="bg-gray-50 p-4 md:p-8 min-h-screen">

      <div className="mb-8">
        <h2 className="text-3xl font-extrabold text-gray-800">Student Roster</h2>
        <p className="text-gray-500 text-sm mt-1">View attendance and marks for each class.</p>
      </div>

      {/* Selectors */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-gray-600 mb-1.5">Subject</label>
            <select value={subjectId} onChange={e => { setSubjectId(e.target.value); setSection(''); }}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2
                         focus:ring-blue-500 focus:outline-none bg-gray-50 font-semibold text-gray-700">
              <option value="">— Select Subject —</option>
              {FACULTY_SUBJECTS.map(s => (
                <option key={s.id} value={s.id}>{s.name} ({s.code}) · Sem {s.sem}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-600 mb-1.5">Section</label>
            <select value={section} onChange={e => setSection(e.target.value)} disabled={!subjectId}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2
                         focus:ring-blue-500 focus:outline-none bg-gray-50 font-semibold text-gray-700
                         disabled:opacity-50 disabled:cursor-not-allowed">
              <option value="">— Select Section —</option>
              {(selectedSubject?.sections || []).map(sec => (
                <option key={sec} value={sec}>{sec}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {section && students.length > 0 && (
        <>
          {/* Summary cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {[
              { label: 'Total Students',      value: students.length, accent: 'bg-blue-50',   text: 'text-blue-700'  },
              { label: 'Avg Attendance',       value: `${avgAttendance}%`, accent: 'bg-green-50', text: avgAttendance >= 75 ? 'text-green-700' : 'text-red-600' },
              { label: 'Attendance Shortage',  value: shortageCount,   accent: 'bg-red-50',    text: 'text-red-600'   },
              { label: 'Avg IA Marks',         value: avgIA,           accent: 'bg-purple-50', text: 'text-purple-700' },
            ].map(card => (
              <div key={card.label} className={`${card.accent} rounded-2xl p-5 border border-gray-100`}>
                <p className="text-xs font-bold text-gray-400 uppercase mb-1">{card.label}</p>
                <p className={`text-3xl font-extrabold ${card.text}`}>{card.value}</p>
              </div>
            ))}
          </div>

          {/* Attendance bar chart */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
            <h3 className="text-base font-bold text-gray-700 mb-4">
              Class Attendance Overview — {selectedSubject?.name} · {section}
            </h3>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fontWeight: 'bold' }} axisLine={false} tickLine={false} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip formatter={v => [`${v}%`, 'Attendance']} />
                  {/* Red reference line at 75 */}
                  <Bar dataKey="pct" radius={[6, 6, 0, 0]} barSize={28}>
                    {chartData.map((entry, i) => (
                      <Cell key={i} fill={entry.pct >= 75 ? '#22c55e' : '#ef4444'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="text-xs text-gray-400 mt-2">
              <span className="inline-flex items-center gap-1 mr-3">
                <span className="w-3 h-3 bg-green-500 rounded-sm inline-block" /> ≥ 75% Safe
              </span>
              <span className="inline-flex items-center gap-1">
                <span className="w-3 h-3 bg-red-400 rounded-sm inline-block" /> &lt; 75% Shortage
              </span>
            </p>
          </div>

          {/* Student table */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

            <div className="p-5 border-b border-gray-100 bg-gray-50 flex flex-col md:flex-row
                            md:items-center gap-3">
              {/* Search */}
              <div className="relative flex-1">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
                  fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round"
                    d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
                </svg>
                <input value={search} onChange={e => setSearch(e.target.value)}
                  placeholder="Search by name or USN..."
                  className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-xl
                             focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" />
              </div>

              {/* Sort */}
              <select value={sortBy} onChange={e => setSortBy(e.target.value)}
                className="px-3 py-2 text-sm border border-gray-200 rounded-xl bg-white font-semibold
                           text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400">
                <option value="name">Sort: Name</option>
                <option value="attendance">Sort: Attendance ↓</option>
                <option value="avg">Sort: IA Avg ↓</option>
              </select>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-gray-400 text-xs uppercase tracking-wider border-b border-gray-100">
                    <th className="p-4">#</th>
                    <th className="p-4">Student</th>
                    <th className="p-4 text-center">Attended</th>
                    <th className="p-4 text-center">Attendance %</th>
                    <th className="p-4 text-center">IA-1</th>
                    <th className="p-4 text-center">IA-2</th>
                    <th className="p-4 text-center">Avg</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filtered.map((student, i) => (
                    <tr key={student.usn} className="hover:bg-gray-50 transition-colors">
                      <td className="p-4 text-xs font-bold text-gray-400">{i + 1}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center
                                          text-xs font-extrabold text-blue-700 shrink-0">
                            {student.name[0]}
                          </div>
                          <div>
                            <p className="font-bold text-gray-800 text-sm">{student.name}</p>
                            <p className="text-xs text-gray-400 font-mono">{student.usn}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-center text-sm font-semibold text-gray-700">
                        {student.attended}/{student.total}
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex flex-col items-center gap-1">
                          <span className={`text-sm font-extrabold ${student.pct >= 75 ? 'text-green-600' : 'text-red-600'}`}>
                            {student.pct}%
                          </span>
                          <div className="w-16 bg-gray-100 rounded-full h-1.5 overflow-hidden">
                            <div className={`h-1.5 rounded-full ${student.pct >= 75 ? 'bg-green-500' : 'bg-red-400'}`}
                              style={{ width: `${student.pct}%` }} />
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-center font-semibold text-gray-700">{student.ia1}</td>
                      <td className="p-4 text-center font-semibold text-gray-700">{student.ia2}</td>
                      <td className="p-4 text-center">
                        <span className={`text-sm font-extrabold ${student.avg >= 18 ? 'text-blue-700' : 'text-red-600'}`}>
                          {student.avg}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {(!subjectId || !section) && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-16 text-center">
          <p className="text-4xl mb-3">👥</p>
          <p className="font-bold text-gray-600">Select a subject and section</p>
          <p className="text-sm text-gray-400 mt-1">Student roster and analytics will appear here.</p>
        </div>
      )}
    </div>
  );
};

export default FacultyRoster;