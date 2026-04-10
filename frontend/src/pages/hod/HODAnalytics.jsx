import React, { useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell,
  LineChart, Line, PieChart, Pie,
} from 'recharts';

// BACKEND: GET /api/hod/analytics?sem=<sem> → returns attendance + marks summary per section

const SEM_DATA = {
  6: {
    sections: [
      { section: 'CSE-A', avgAttendance: 81, avgIA: 38, students: 60, defaulters: 8  },
      { section: 'CSE-B', avgAttendance: 74, avgIA: 35, students: 60, defaulters: 16 },
      { section: 'CSE-C', avgAttendance: 78, avgIA: 36, students: 58, defaulters: 12 },
    ],
    subjects: [
      { name: 'ML',  avgAtt: 82, avgIA: 40 },
      { name: 'CC',  avgAtt: 74, avgIA: 35 },
      { name: 'BCT', avgAtt: 79, avgIA: 37 },
      { name: 'CN',  avgAtt: 68, avgIA: 31 },
      { name: 'CD',  avgAtt: 85, avgIA: 42 },
    ],
    weekly: [
      { week: 'W1', att: 88 }, { week: 'W2', att: 82 }, { week: 'W3', att: 80 },
      { week: 'W4', att: 75 }, { week: 'W5', att: 78 }, { week: 'W6', att: 77 },
    ],
  },
  4: {
    sections: [
      { section: 'CSE-A', avgAttendance: 85, avgIA: 40, students: 62, defaulters: 5  },
      { section: 'CSE-B', avgAttendance: 77, avgIA: 37, students: 60, defaulters: 11 },
    ],
    subjects: [
      { name: 'ADA', avgAtt: 86, avgIA: 42 },
      { name: 'MC',  avgAtt: 80, avgIA: 38 },
      { name: 'OS',  avgAtt: 84, avgIA: 41 },
    ],
    weekly: [
      { week: 'W1', att: 90 }, { week: 'W2', att: 87 }, { week: 'W3', att: 85 },
      { week: 'W4', att: 82 }, { week: 'W5', att: 84 }, { week: 'W6', att: 83 },
    ],
  },
};

const SEMESTERS = [6, 4];

const HODAnalytics = () => {
  const [selectedSem, setSelectedSem] = useState(6);
  const data = SEM_DATA[selectedSem];

  const totalStudents   = data.sections.reduce((a, s) => a + s.students, 0);
  const totalDefaulters = data.sections.reduce((a, s) => a + s.defaulters, 0);
  const overallAvgAtt   = Math.round(data.sections.reduce((a, s) => a + s.avgAttendance, 0) / data.sections.length);
  const overallAvgIA    = (data.sections.reduce((a, s) => a + s.avgIA, 0) / data.sections.length).toFixed(1);

  const pieData = [
    { name: 'Safe',     value: totalStudents - totalDefaulters },
    { name: 'Shortage', value: totalDefaulters },
  ];

  return (
    <div className="bg-gray-50 p-4 md:p-8 min-h-screen">

      <div className="mb-8 flex flex-col md:flex-row md:justify-between md:items-end gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-gray-800">Department Analytics</h2>
          <p className="text-gray-500 text-sm mt-1">Attendance and marks overview across all sections.</p>
        </div>

        {/* Semester switcher */}
        <div className="flex bg-white rounded-xl p-1 shadow-sm border border-gray-200 w-max gap-1">
          {SEMESTERS.map(s => (
            <button key={s} onClick={() => setSelectedSem(s)}
              className={`px-5 py-2.5 rounded-lg text-sm font-bold transition-all ${
                selectedSem === s ? 'bg-blue-800 text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'
              }`}>
              Sem {s}
            </button>
          ))}
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Students',    value: totalStudents,         color: 'text-blue-700',   bg: 'bg-blue-50'   },
          { label: 'Avg Attendance',    value: `${overallAvgAtt}%`,   color: overallAvgAtt >= 75 ? 'text-green-600' : 'text-red-600', bg: 'bg-green-50' },
          { label: 'Attendance Defaulters', value: totalDefaulters,   color: 'text-red-600',    bg: 'bg-red-50'    },
          { label: 'Avg IA Marks',      value: overallAvgIA,          color: 'text-purple-700', bg: 'bg-purple-50' },
        ].map(c => (
          <div key={c.label} className={`${c.bg} rounded-2xl p-5 border border-gray-100`}>
            <p className="text-xs font-bold text-gray-400 uppercase mb-1">{c.label}</p>
            <p className={`text-3xl font-extrabold ${c.color}`}>{c.value}</p>
          </div>
        ))}
      </div>

      {/* Section-wise attendance bar + pie */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">

        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-base font-bold text-gray-700 mb-5">
            Attendance by Section — Sem {selectedSem}
          </h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.sections} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="section" tick={{ fontSize: 12, fontWeight: 'bold' }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip formatter={v => [`${v}%`, 'Avg Attendance']} />
                <Bar dataKey="avgAttendance" radius={[6, 6, 0, 0]} barSize={40}>
                  {data.sections.map((s, i) => (
                    <Cell key={i} fill={s.avgAttendance >= 75 ? '#22c55e' : '#ef4444'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          {/* 75% reference label */}
          <p className="text-xs text-gray-400 mt-2">
            <span className="inline-flex items-center gap-1 mr-3">
              <span className="w-3 h-3 bg-green-500 rounded-sm" />≥ 75% Safe
            </span>
            <span className="inline-flex items-center gap-1">
              <span className="w-3 h-3 bg-red-400 rounded-sm" />&lt; 75% Shortage
            </span>
          </p>
        </div>

        {/* Defaulters pie */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col
                        items-center justify-center">
          <h3 className="text-base font-bold text-gray-700 mb-4 self-start">
            Defaulter Ratio — Sem {selectedSem}
          </h3>
          <div className="h-44 w-44">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} innerRadius={40} outerRadius={65} paddingAngle={4}
                  dataKey="value" stroke="none">
                  <Cell fill="#22c55e" />
                  <Cell fill="#ef4444" />
                </Pie>
                <Tooltip formatter={(v, n) => [`${v} students`, n]} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex gap-4 mt-2 text-xs font-bold">
            <span className="flex items-center gap-1 text-green-700">
              <span className="w-3 h-3 bg-green-500 rounded-sm" />Safe ({totalStudents - totalDefaulters})
            </span>
            <span className="flex items-center gap-1 text-red-600">
              <span className="w-3 h-3 bg-red-400 rounded-sm" />Shortage ({totalDefaulters})
            </span>
          </div>
        </div>
      </div>

      {/* Subject-wise attendance + Weekly trend */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-base font-bold text-gray-700 mb-5">Subject-wise Avg Attendance</h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.subjects} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="name" tick={{ fontSize: 12, fontWeight: 'bold' }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip formatter={v => [`${v}%`, 'Avg Attendance']} />
                <Bar dataKey="avgAtt" radius={[6, 6, 0, 0]} barSize={32}>
                  {data.subjects.map((s, i) => (
                    <Cell key={i} fill={s.avgAtt >= 75 ? '#3b82f6' : '#f97316'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-base font-bold text-gray-700 mb-5">Weekly Consistency Trend</h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.weekly} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="week" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis domain={[60, 100]} tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip formatter={v => [`${v}%`, 'Avg Attendance']} />
                <Line type="monotone" dataKey="att" stroke="#1d4ed8" strokeWidth={4}
                  dot={{ r: 6, fill: '#1d4ed8', stroke: '#fff', strokeWidth: 2 }} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Section detail table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-5 border-b border-gray-100 bg-gray-50">
          <h3 className="text-base font-bold text-gray-800">Section-wise Breakdown — Sem {selectedSem}</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-400 text-xs uppercase tracking-wider border-b border-gray-100">
                <th className="p-4">Section</th>
                <th className="p-4 text-center">Students</th>
                <th className="p-4 text-center">Avg Attendance</th>
                <th className="p-4 text-center">Defaulters (&lt;75%)</th>
                <th className="p-4 text-center">Avg IA Marks</th>
                <th className="p-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {data.sections.map(s => (
                <tr key={s.section} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 font-bold text-gray-800">{s.section}</td>
                  <td className="p-4 text-center font-semibold text-gray-700">{s.students}</td>
                  <td className="p-4 text-center">
                    <span className={`font-extrabold ${s.avgAttendance >= 75 ? 'text-green-600' : 'text-red-600'}`}>
                      {s.avgAttendance}%
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <span className={`font-bold ${s.defaulters > 0 ? 'text-red-600' : 'text-green-600'}`}>
                      {s.defaulters}
                    </span>
                  </td>
                  <td className="p-4 text-center font-semibold text-gray-700">{s.avgIA}/50</td>
                  <td className="p-4 text-center">
                    {s.avgAttendance >= 75 ? (
                      <span className="bg-green-100 text-green-700 border border-green-200 text-xs font-bold px-3 py-1 rounded-full">Good</span>
                    ) : (
                      <span className="bg-red-100 text-red-700 border border-red-200 text-xs font-bold px-3 py-1 rounded-full">Needs Attention</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default HODAnalytics;