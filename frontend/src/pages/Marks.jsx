import React, { useState, useRef } from 'react';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from 'recharts';

const Marks = () => {
  const [activeTab, setActiveTab] = useState('internals');
  const detailsRef = useRef(null);

  const scrollToDetails = () => {
    detailsRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // BACKEND: Replace with GET /api/marks/internals?usn=<usn>&sem=<sem>
  const internalsData = [
    { subject: 'Machine Learning',   code: 'BCS602',  ia1: 42, ia2: 45, max: 50, min: 18 },
    { subject: 'Cloud Computing',    code: 'BCS601',  ia1: 38, ia2: 35, max: 50, min: 18 },
    { subject: 'Blockchain Tech',    code: 'BCS613A', ia1: 28, ia2: 40, max: 50, min: 18 },
    { subject: 'Computer Networks',  code: 'BCS502',  ia1: 18, ia2: 22, max: 50, min: 18 },
    { subject: 'Compiler Design',    code: 'BCS613C', ia1: 35, ia2: 38, max: 40, min: 14 },
  ];

  // BACKEND: Replace with GET /api/marks/results?usn=<usn>
  const vtuResults = [
    { sem: 1, status: 'Pass', marks: '680/800', sgpa: 8.2 },
    { sem: 2, status: 'Pass', marks: '710/800', sgpa: 8.5 },
    { sem: 3, status: 'Pass', marks: '650/900', sgpa: 7.8 },
    { sem: 4, status: 'Pass', marks: '720/900', sgpa: 8.4 },
    { sem: 5, status: 'Pass', marks: '750/900', sgpa: 8.9 },
  ];

  const currentCGPA = 8.36;

  // Tab button helper
  const TabButton = ({ id, label }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${
        activeTab === id
          ? 'bg-blue-800 text-white shadow-md'
          : 'text-gray-500 hover:bg-gray-50'
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="bg-gray-50 p-4 md:p-8 min-h-screen">

      {/* ── HEADER ── */}
      <div className="mb-8 flex flex-col md:flex-row md:justify-between md:items-end gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-gray-800">Marks & Results</h2>
          <p className="text-gray-500 text-sm mt-1">Track your IA performance and VTU academic history.</p>
        </div>

        <div className="flex bg-white rounded-xl p-1 shadow-sm border border-gray-200 w-max">
          <TabButton id="internals" label="IA (Current Sem)" />
          <TabButton id="externals" label="VTU Results (CGPA)" />
        </div>
      </div>

      {/* ── TAB 1: INTERNAL ASSESSMENTS ── */}
      {activeTab === 'internals' && (
        <div className="space-y-6">

          {/* Summary cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            <div className="bg-linear-to-r from-blue-800 to-blue-700 p-6 rounded-2xl shadow-sm text-white">
              <p className="text-blue-200 font-bold mb-1 uppercase tracking-wider text-xs">
                Subjects Above Minimum
              </p>
              <h3 className="text-4xl font-extrabold">
                {internalsData.filter(i => Math.ceil((i.ia1 + i.ia2) / 2) >= i.min).length}
                <span className="text-2xl text-blue-300 font-bold">/{internalsData.length}</span>
              </h3>
              <p className="text-sm mt-2 text-blue-100">Pass threshold met</p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 md:col-span-2
                            flex items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-gray-800">IA-2 Results are out!</h3>
                <p className="text-sm text-gray-500 mt-1">Check your updated averages below.</p>
              </div>
              <span className="shrink-0 bg-green-100 text-green-700 px-4 py-2 rounded-xl
                               font-bold text-sm border border-green-200">
                Updated Today
              </span>
            </div>
          </div>

          {/* IA Table */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-5 border-b border-gray-100 bg-gray-50">
              <h3 className="text-base font-bold text-gray-800">6th Semester — IA Breakdown</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-gray-400 text-xs uppercase tracking-wider
                                 border-b border-gray-100">
                    <th className="p-4 font-semibold">Subject & Code</th>
                    <th className="p-4 font-semibold text-center">IA‑1</th>
                    <th className="p-4 font-semibold text-center">IA‑2</th>
                    <th className="p-4 font-semibold text-center bg-blue-50 text-blue-700">
                      Average
                    </th>
                    <th className="p-4 font-semibold text-center">Max</th>
                    <th className="p-4 font-semibold text-center text-red-400">Min Req.</th>
                    <th className="p-4 font-semibold text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {internalsData.map((item, index) => {
                    const avg      = Math.ceil((item.ia1 + item.ia2) / 2);
                    const isDanger = avg < item.min;

                    return (
                      <tr key={index} className="hover:bg-gray-50 transition-colors">

                        <td className="p-4">
                          <p className="font-bold text-gray-800">{item.subject}</p>
                          <p className="text-xs text-gray-400 font-mono mt-0.5">{item.code}</p>
                        </td>

                        <td className="p-4 text-center font-semibold text-gray-700">{item.ia1}</td>
                        <td className="p-4 text-center font-semibold text-gray-700">{item.ia2}</td>

                        <td className={`p-4 text-center text-lg font-extrabold bg-blue-50/50
                            ${isDanger ? 'text-red-600' : 'text-blue-700'}`}>
                          {avg}
                        </td>

                        <td className="p-4 text-center font-semibold text-gray-400">{item.max}</td>
                        <td className="p-4 text-center font-bold text-red-400">{item.min}</td>

                        {/* Status badge — ADDED */}
                        <td className="p-4 text-center">
                          {isDanger ? (
                            <span className="inline-flex items-center gap-1 bg-red-100 text-red-700
                                             px-3 py-1 rounded-full text-xs font-bold border border-red-200">
                              <span className="w-1.5 h-1.5 bg-red-500 rounded-full" />
                              Danger
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 bg-green-100 text-green-700
                                             px-3 py-1 rounded-full text-xs font-bold border border-green-200">
                              <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                              Safe
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 2: VTU EXTERNALS ── */}
      {activeTab === 'externals' && (
        <div className="space-y-6">

          {/* Summary cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            <div className="bg-linear-to-r from-purple-800 to-indigo-700 p-6 rounded-2xl
                            shadow-sm text-white text-center relative overflow-hidden">
              <p className="text-purple-200 font-bold mb-1 uppercase tracking-wider text-xs relative z-10">
                Overall CGPA
              </p>
              <h3 className="text-5xl font-extrabold relative z-10">{currentCGPA}</h3>
              <button
                onClick={scrollToDetails}
                className="mt-4 bg-white/20 hover:bg-white/30 text-white text-xs font-bold
                           py-2 px-5 rounded-full transition-all relative z-10"
              >
                View Sem Details →
              </button>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <p className="text-gray-400 font-bold uppercase tracking-wider text-xs mb-1">
                Credits Earned
              </p>
              <h3 className="text-4xl font-extrabold text-gray-800">110</h3>
              <p className="text-sm mt-2 text-gray-400">Up to 5th Semester</p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <p className="text-gray-400 font-bold uppercase tracking-wider text-xs mb-1">
                Active Backlogs
              </p>
              <h3 className="text-4xl font-extrabold text-green-500">0</h3>
              <p className="text-sm mt-2 text-gray-400">All clear! Keep it up.</p>
            </div>
          </div>

          {/* SGPA Chart */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-base font-bold text-gray-800 mb-6">SGPA Progression Curve</h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={vtuResults} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                  <XAxis dataKey="sem" tickFormatter={s => `Sem ${s}`}
                    tick={{ fontSize: 12, fontWeight: 'bold' }} axisLine={false} tickLine={false} />
                  <YAxis domain={[0, 10]} tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                  <Tooltip
                    formatter={v => [`${v} SGPA`, 'Result']}
                    labelFormatter={l => `Semester ${l}`}
                    cursor={{ fill: '#f9fafb' }}
                  />
                  <Line type="monotone" dataKey="sgpa" stroke="#4f46e5" strokeWidth={4}
                    dot={{ r: 6, fill: '#4f46e5', stroke: '#fff', strokeWidth: 2 }}
                    activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Semester-wise Results Table */}
          <div ref={detailsRef}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden scroll-mt-6">
            <div className="p-5 border-b border-gray-100 bg-gray-50">
              <h3 className="text-base font-bold text-gray-800">Semester-wise VTU Results</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-gray-400 text-xs uppercase tracking-wider
                                 border-b border-gray-100">
                    <th className="p-4 font-semibold">Semester</th>
                    <th className="p-4 font-semibold">Status</th>
                    <th className="p-4 font-semibold text-center">Marks</th>
                    <th className="p-4 font-semibold text-center">SGPA</th>
                    <th className="p-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {vtuResults.map((item, i) => (
                    <tr key={i} className="hover:bg-gray-50 transition-colors">

                      <td className="p-4 font-bold text-gray-800">Semester {item.sem}</td>

                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold border
                          ${item.status === 'Pass'
                            ? 'bg-green-50 text-green-700 border-green-200'
                            : 'bg-red-50 text-red-700 border-red-200'}`}>
                          {item.status}
                        </span>
                      </td>

                      <td className="p-4 text-center font-semibold text-gray-700">{item.marks}</td>

                      <td className="p-4 text-center font-extrabold text-indigo-600">{item.sgpa}</td>

                      <td className="p-4">
                        <div className="flex justify-end gap-2">
                          {/* BACKEND: "View" opens detailed markscard modal for this sem */}
                          <button className="text-blue-700 hover:bg-blue-50 px-3 py-1.5
                                             rounded-lg text-xs font-bold transition">
                            View
                          </button>
                          {/* BACKEND: "PDF" triggers download of marksheet PDF */}
                          <button className="flex items-center gap-1.5 bg-gray-100 hover:bg-gray-200
                                             text-gray-700 px-3 py-1.5 rounded-lg text-xs font-bold transition">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                            PDF
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

    </div>
  );
};

export default Marks;