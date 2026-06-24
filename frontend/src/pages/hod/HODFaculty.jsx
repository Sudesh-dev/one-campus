// ── HODFaculty.jsx ────────────────────────────────────────────
import React, { useState } from 'react';

// BACKEND: GET /api/hod/faculty
const FACULTY_LIST = [
  { id: 'f1', name: 'Dr. Priya Sharma',  empId: 'FAC001', designation: 'Associate Professor', subjects: ['Machine Learning (BCS602)', 'Cloud Computing (BCS601)'], sections: ['CSE-A', 'CSE-B'], classesThisWeek: 8, avgAttendanceMarked: 96 },
  { id: 'f2', name: 'Prof. Anil Kumar',  empId: 'FAC002', designation: 'Assistant Professor', subjects: ['Computer Networks (BCS502)', 'Compiler Design (BCS613C)'], sections: ['CSE-A'], classesThisWeek: 6, avgAttendanceMarked: 100 },
  { id: 'f3', name: 'Dr. Meera Nair',    empId: 'FAC003', designation: 'Professor',            subjects: ['DBMS (BCS503)', 'Software Engineering (BCS501)'], sections: ['CSE-B', 'CSE-C'], classesThisWeek: 7, avgAttendanceMarked: 88 },
  { id: 'f4', name: 'Prof. Suresh Babu', empId: 'FAC004', designation: 'Assistant Professor', subjects: ['DAA (BCS401)', 'Operating Systems (BCS403)'], sections: ['CSE-A', 'CSE-B'], classesThisWeek: 6, avgAttendanceMarked: 92 },
  { id: 'f5', name: 'Dr. Kavya Reddy',   empId: 'FAC005', designation: 'Associate Professor', subjects: ['Blockchain (BCS613A)', 'Microcontrollers (BCS402)'], sections: ['CSE-C'], classesThisWeek: 5, avgAttendanceMarked: 80 },
];

const HODFaculty = () => {
  const [search, setSearch] = useState('');
  const [selectedFaculty, setSelectedFaculty] = useState(null);

  const filtered = FACULTY_LIST.filter(f =>
    !search ||
    f.name.toLowerCase().includes(search.toLowerCase()) ||
    f.empId.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-gray-50 p-4 md:p-8 min-h-screen">
      <div className="mb-8">
        <h2 className="text-3xl font-extrabold text-gray-800">Faculty Management</h2>
        <p className="text-gray-500 text-sm mt-1">All faculty in CSE department — {FACULTY_LIST.length} members.</p>
      </div>

      <div className="flex flex-col xl:flex-row gap-6">
        {/* List */}
        <div className="xl:w-2/5 space-y-3">
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" /></svg>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or ID..."
              className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-sm" />
          </div>
          {filtered.map(f => (
            <div key={f.id} onClick={() => setSelectedFaculty(f)}
              className={`bg-white rounded-xl border p-4 cursor-pointer transition-all shadow-sm hover:shadow-md ${
                selectedFaculty?.id === f.id ? 'border-blue-500 ring-2 ring-blue-100' : 'border-gray-100'}`}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-sm font-extrabold text-blue-700 shrink-0">
                  {f.name.split(' ').slice(-1)[0][0]}
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-gray-800 text-sm">{f.name}</p>
                  <p className="text-xs text-gray-400">{f.designation} · {f.empId}</p>
                </div>
                <div className={`ml-auto text-xs font-bold px-2 py-1 rounded-full ${f.avgAttendanceMarked >= 90 ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                  {f.avgAttendanceMarked}%
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Detail */}
        <div className="xl:w-3/5">
          {selectedFaculty ? (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100 bg-gray-50 flex items-center gap-4">
                <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center text-xl font-extrabold text-blue-700">
                  {selectedFaculty.name.split(' ').slice(-1)[0][0]}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800">{selectedFaculty.name}</h3>
                  <p className="text-sm text-gray-500">{selectedFaculty.designation} · {selectedFaculty.empId}</p>
                </div>
              </div>
              <div className="p-6 space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 rounded-xl p-4 text-center">
                    <p className="text-xs font-bold text-gray-400 uppercase mb-1">Classes/Week</p>
                    <p className="text-3xl font-extrabold text-blue-700">{selectedFaculty.classesThisWeek}</p>
                  </div>
                  <div className={`rounded-xl p-4 text-center ${selectedFaculty.avgAttendanceMarked >= 90 ? 'bg-green-50' : 'bg-yellow-50'}`}>
                    <p className="text-xs font-bold text-gray-400 uppercase mb-1">Attendance Marked</p>
                    <p className={`text-3xl font-extrabold ${selectedFaculty.avgAttendanceMarked >= 90 ? 'text-green-600' : 'text-yellow-600'}`}>{selectedFaculty.avgAttendanceMarked}%</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase mb-2">Subjects Assigned</p>
                  <div className="space-y-1.5">
                    {selectedFaculty.subjects.map(s => (
                      <div key={s} className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2">
                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full shrink-0" />
                        <span className="text-sm font-semibold text-gray-700">{s}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase mb-2">Sections</p>
                  <div className="flex gap-2 flex-wrap">
                    {selectedFaculty.sections.map(sec => (
                      <span key={sec} className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1.5 rounded-full">{sec}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-100 h-64 shadow-sm flex flex-col items-center justify-center text-gray-400 gap-2">
              <svg className="w-10 h-10 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
              <p className="font-semibold text-gray-500 text-sm">Select a faculty member</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HODFaculty;