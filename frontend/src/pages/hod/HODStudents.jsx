import React, { useState } from 'react';

// BACKEND: GET /api/hod/students?sem=<sem>&section=<sec>
const ALL_STUDENTS = [
  { usn: '1AP23CS001', name: 'Aarav Sharma',  sem: 6, section: 'CSE-A', attendance: 90, avgIA: 43, backlogs: 0 },
  { usn: '1AP23CS002', name: 'Bhavana Reddy', sem: 6, section: 'CSE-A', attendance: 71, avgIA: 36, backlogs: 0 },
  { usn: '1AP23CS003', name: 'Chandan Kumar', sem: 6, section: 'CSE-A', attendance: 95, avgIA: 34, backlogs: 0 },
  { usn: '1AP23CS004', name: 'Deepika Rao',   sem: 6, section: 'CSE-A', attendance: 55, avgIA: 20, backlogs: 1 },
  { usn: '1AP23CS019', name: 'John Doe',       sem: 6, section: 'CSE-A', attendance: 83, avgIA: 36, backlogs: 0 },
  { usn: '1AP23CS051', name: 'Farhan Ali',     sem: 6, section: 'CSE-B', attendance: 95, avgIA: 45, backlogs: 0 },
  { usn: '1AP23CS052', name: 'Geetha Nair',    sem: 6, section: 'CSE-B', attendance: 67, avgIA: 31, backlogs: 0 },
  { usn: '1AP23CS053', name: 'Harish Menon',   sem: 6, section: 'CSE-B', attendance: 83, avgIA: 39, backlogs: 0 },
  { usn: '1AP21CS001', name: 'Ishaan Joshi',   sem: 4, section: 'CSE-A', attendance: 96, avgIA: 41, backlogs: 0 },
  { usn: '1AP21CS002', name: 'Jasmine Kaur',   sem: 4, section: 'CSE-A', attendance: 67, avgIA: 29, backlogs: 1 },
  { usn: '1AP21CS003', name: 'Kiran Das',       sem: 4, section: 'CSE-A', attendance: 100, avgIA: 49, backlogs: 0 },
];

const SECTIONS = [...new Set(ALL_STUDENTS.map(s => s.section))].sort();
const SEMS     = [...new Set(ALL_STUDENTS.map(s => s.sem))].sort();

const HODStudents = () => {
  const [filterSem,     setFilterSem]     = useState('');
  const [filterSection, setFilterSection] = useState('');
  const [filterStatus,  setFilterStatus]  = useState('all'); // 'all'|'defaulters'|'backlogs'
  const [search,        setSearch]        = useState('');
  const [sortBy,        setSortBy]        = useState('name');

  const filtered = ALL_STUDENTS
    .filter(s => !filterSem     || s.sem     === Number(filterSem))
    .filter(s => !filterSection || s.section === filterSection)
    .filter(s => filterStatus === 'defaulters' ? s.attendance < 75 :
                 filterStatus === 'backlogs'   ? s.backlogs > 0    : true)
    .filter(s => !search || s.name.toLowerCase().includes(search.toLowerCase()) || s.usn.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) =>
      sortBy === 'attendance' ? a.attendance - b.attendance :
      sortBy === 'ia'         ? b.avgIA - a.avgIA            :
      a.name.localeCompare(b.name)
    );

  const defaulterCount = ALL_STUDENTS.filter(s => s.attendance < 75).length;
  const backlogCount   = ALL_STUDENTS.filter(s => s.backlogs > 0).length;

  return (
    <div className="bg-gray-50 p-4 md:p-8 min-h-screen">
      <div className="mb-8">
        <h2 className="text-3xl font-extrabold text-gray-800">Student Overview</h2>
        <p className="text-gray-500 text-sm mt-1">{ALL_STUDENTS.length} students across all semesters · {defaulterCount} defaulters · {backlogCount} with backlogs</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-6">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <div className="relative md:col-span-2">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" /></svg>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search name or USN..."
              className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50" />
          </div>
          <select value={filterSem} onChange={e => setFilterSem(e.target.value)}
            className="px-3 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400">
            <option value="">All Sems</option>
            {SEMS.map(s => <option key={s} value={s}>Sem {s}</option>)}
          </select>
          <select value={filterSection} onChange={e => setFilterSection(e.target.value)}
            className="px-3 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400">
            <option value="">All Sections</option>
            {SECTIONS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
            className="px-3 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400">
            <option value="all">All Students</option>
            <option value="defaulters">Defaulters Only</option>
            <option value="backlogs">Has Backlogs</option>
          </select>
        </div>
        <div className="flex items-center justify-between mt-3">
          <p className="text-xs text-gray-400">{filtered.length} student{filtered.length !== 1 ? 's' : ''} shown</p>
          <select value={sortBy} onChange={e => setSortBy(e.target.value)}
            className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 bg-white font-semibold text-gray-600 focus:outline-none">
            <option value="name">Sort: Name</option>
            <option value="attendance">Sort: Attendance ↑</option>
            <option value="ia">Sort: IA Avg ↓</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-400 text-xs uppercase tracking-wider border-b border-gray-100">
                <th className="p-4">#</th>
                <th className="p-4">Student</th>
                <th className="p-4 text-center">Sem</th>
                <th className="p-4 text-center">Section</th>
                <th className="p-4 text-center">Attendance</th>
                <th className="p-4 text-center">Avg IA</th>
                <th className="p-4 text-center">Backlogs</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((s, i) => (
                <tr key={s.usn} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 text-xs font-bold text-gray-400">{i + 1}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-xs font-extrabold text-blue-700 shrink-0">
                        {s.name[0]}
                      </div>
                      <div>
                        <p className="font-bold text-gray-800 text-sm">{s.name}</p>
                        <p className="text-xs text-gray-400 font-mono">{s.usn}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-center font-semibold text-gray-700">{s.sem}</td>
                  <td className="p-4 text-center">
                    <span className="text-xs font-bold bg-blue-100 text-blue-800 px-2 py-1 rounded-full">{s.section}</span>
                  </td>
                  <td className="p-4 text-center">
                    <div className="flex flex-col items-center gap-1">
                      <span className={`text-sm font-extrabold ${s.attendance >= 75 ? 'text-green-600' : 'text-red-600'}`}>
                        {s.attendance}%
                      </span>
                      <div className="w-14 bg-gray-100 rounded-full h-1.5 overflow-hidden">
                        <div className={`h-1.5 rounded-full ${s.attendance >= 75 ? 'bg-green-500' : 'bg-red-400'}`} style={{ width: `${s.attendance}%` }} />
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-center font-extrabold text-blue-700">{s.avgIA}</td>
                  <td className="p-4 text-center">
                    {s.backlogs > 0 ? (
                      <span className="bg-red-100 text-red-700 text-xs font-bold px-2 py-1 rounded-full border border-red-200">{s.backlogs}</span>
                    ) : (
                      <span className="text-green-500 font-bold text-xs">✓ Clear</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <p className="font-semibold">No students match your filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HODStudents;