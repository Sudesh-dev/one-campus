import React, { useState } from 'react';

const DAYS = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
const DAY_SHORT = { Monday:'Mon', Tuesday:'Tue', Wednesday:'Wed', Thursday:'Thu', Friday:'Fri', Saturday:'Sat' };
const TIME_SLOTS = ['9:00 AM','10:00 AM','11:00 AM','12:00 PM','2:00 PM','3:00 PM','4:00 PM'];

// BACKEND: GET /api/hod/timetable?section=<sec>
const TIMETABLES = {
  'CSE-A': {
    'Monday-9:00 AM':     { subject: 'Machine Learning', code: 'BCS602', faculty: 'Dr. Priya Sharma', room: '402' },
    'Monday-11:00 AM':    { subject: 'DAA',              code: 'BCS401', faculty: 'Prof. Suresh Babu', room: '302' },
    'Tuesday-9:00 AM':    { subject: 'Computer Networks', code: 'BCS502', faculty: 'Prof. Anil Kumar', room: '402' },
    'Wednesday-10:00 AM': { subject: 'Machine Learning', code: 'BCS602', faculty: 'Dr. Priya Sharma', room: '402' },
    'Thursday-9:00 AM':   { subject: 'Compiler Design',  code: 'BCS613C', faculty: 'Prof. Anil Kumar', room: '402' },
    'Friday-10:00 AM':    { subject: 'Machine Learning', code: 'BCS602', faculty: 'Dr. Priya Sharma', room: '402' },
  },
  'CSE-B': {
    'Monday-11:00 AM':    { subject: 'Cloud Computing',  code: 'BCS601', faculty: 'Dr. Priya Sharma', room: '301' },
    'Tuesday-2:00 PM':    { subject: 'Machine Learning', code: 'BCS602', faculty: 'Dr. Priya Sharma', room: '305' },
    'Wednesday-3:00 PM':  { subject: 'Cloud Computing',  code: 'BCS601', faculty: 'Dr. Priya Sharma', room: '301' },
    'Thursday-11:00 AM':  { subject: 'DBMS',             code: 'BCS503', faculty: 'Dr. Meera Nair',   room: '203' },
    'Friday-2:00 PM':     { subject: 'Cloud Computing',  code: 'BCS601', faculty: 'Dr. Priya Sharma', room: '301' },
  },
  'CSE-C': {
    'Monday-9:00 AM':     { subject: 'Software Eng',    code: 'BCS501', faculty: 'Dr. Meera Nair',   room: '204' },
    'Tuesday-10:00 AM':   { subject: 'Blockchain',      code: 'BCS613A', faculty: 'Dr. Kavya Reddy', room: '302' },
    'Wednesday-9:00 AM':  { subject: 'Software Eng',    code: 'BCS501', faculty: 'Dr. Meera Nair',   room: '204' },
    'Thursday-2:00 PM':   { subject: 'Blockchain',      code: 'BCS613A', faculty: 'Dr. Kavya Reddy', room: '302' },
    'Friday-9:00 AM':     { subject: 'Software Eng',    code: 'BCS501', faculty: 'Dr. Meera Nair',   room: '204' },
  },
};

const SECTIONS = Object.keys(TIMETABLES);
const todayName = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'][new Date().getDay()];

const SECTION_COLORS = { 'CSE-A': 'bg-blue-100 border-blue-300 text-blue-900', 'CSE-B': 'bg-green-100 border-green-300 text-green-900', 'CSE-C': 'bg-purple-100 border-purple-300 text-purple-900' };

const HODTimetable = () => {
  const [activeSection, setActiveSection] = useState('CSE-A');
  const timetable = TIMETABLES[activeSection];

  const totalClasses = Object.keys(timetable).length;

  return (
    <div className="bg-gray-50 p-4 md:p-8 min-h-screen">
      <div className="mb-8 flex flex-col md:flex-row md:justify-between md:items-end gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-gray-800">Timetable Overview</h2>
          <p className="text-gray-500 text-sm mt-1">CSE Department — all sections. {totalClasses} classes/week for {activeSection}.</p>
        </div>
        <div className="flex bg-white rounded-xl p-1 shadow-sm border border-gray-200 w-max gap-1">
          {SECTIONS.map(s => (
            <button key={s} onClick={() => setActiveSection(s)}
              className={`px-5 py-2.5 rounded-lg text-sm font-bold transition-all ${activeSection === s ? 'bg-blue-800 text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}>
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Day headers */}
        <div className="grid border-b border-gray-100" style={{ gridTemplateColumns: '90px repeat(6, 1fr)' }}>
          <div className="p-3 bg-gray-50 border-r border-gray-100" />
          {DAYS.map(day => (
            <div key={day} className={`p-3 text-center border-r border-gray-100 last:border-r-0 ${day === todayName ? 'bg-blue-50' : 'bg-gray-50'}`}>
              <p className={`text-xs font-extrabold uppercase tracking-wider ${day === todayName ? 'text-blue-700' : 'text-gray-500'}`}>{DAY_SHORT[day]}</p>
            </div>
          ))}
        </div>

        {/* Time rows */}
        {TIME_SLOTS.map(time => (
          <div key={time} className="grid border-b border-gray-100 last:border-b-0" style={{ gridTemplateColumns: '90px repeat(6, 1fr)' }}>
            <div className="p-3 flex items-start justify-center border-r border-gray-100 bg-gray-50">
              <span className="text-xs font-bold text-gray-400">{time}</span>
            </div>
            {DAYS.map(day => {
              const slot = timetable[`${day}-${time}`];
              return (
                <div key={day} className={`p-2 border-r border-gray-100 last:border-r-0 min-h-17 ${day === todayName ? 'bg-blue-50/20' : ''}`}>
                  {slot && (
                    <div className={`w-full h-full p-2 rounded-lg border text-left ${SECTION_COLORS[activeSection]}`}>
                      <p className="text-xs font-extrabold leading-tight truncate">{slot.subject}</p>
                      <p className="text-[10px] font-semibold opacity-70 mt-0.5 truncate">{slot.faculty.split(' ').slice(-1)[0]}</p>
                      <p className="text-[10px] font-semibold opacity-60 mt-0.5">Rm {slot.room}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* All sections at a glance */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        {SECTIONS.map(sec => (
          <div key={sec} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-gray-800">{sec}</h3>
              <span className="text-xs font-bold bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                {Object.keys(TIMETABLES[sec]).length} classes/week
              </span>
            </div>
            <div className="space-y-1.5">
              {[...new Set(Object.values(TIMETABLES[sec]).map(v => v.faculty))].map(f => (
                <div key={f} className="text-xs text-gray-600 font-semibold flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full shrink-0" />{f}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HODTimetable;