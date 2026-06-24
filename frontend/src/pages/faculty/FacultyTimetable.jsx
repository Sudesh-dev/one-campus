import React, { useState } from 'react';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const TIME_SLOTS = ['9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '2:00 PM', '3:00 PM', '4:00 PM'];

// BACKEND: GET /api/faculty/timetable  returns schedule slots
const TIMETABLE = {
  'Monday-9:00 AM':     { subject: 'Machine Learning',         code: 'BCS602', section: 'CSE-A', room: '402', sem: 6 },
  'Monday-11:00 AM':    { subject: 'Cloud Computing',           code: 'BCS601', section: 'CSE-B', room: '301', sem: 6 },
  'Tuesday-9:00 AM':    { subject: 'Design & Analysis of Algo', code: 'BCS401', section: 'CSE-A', room: '402', sem: 4 },
  'Tuesday-2:00 PM':    { subject: 'Machine Learning',          code: 'BCS602', section: 'CSE-B', room: '305', sem: 6 },
  'Wednesday-10:00 AM': { subject: 'Machine Learning',          code: 'BCS602', section: 'CSE-A', room: '402', sem: 6 },
  'Wednesday-3:00 PM':  { subject: 'Cloud Computing',           code: 'BCS601', section: 'CSE-B', room: '301', sem: 6 },
  'Thursday-9:00 AM':   { subject: 'Design & Analysis of Algo', code: 'BCS401', section: 'CSE-A', room: '402', sem: 4 },
  'Thursday-11:00 AM':  { subject: 'Machine Learning',          code: 'BCS602', section: 'CSE-B', room: '305', sem: 6 },
  'Friday-10:00 AM':    { subject: 'Machine Learning',          code: 'BCS602', section: 'CSE-A', room: '402', sem: 6 },
  'Friday-2:00 PM':     { subject: 'Cloud Computing',           code: 'BCS601', section: 'CSE-B', room: '301', sem: 6 },
  'Saturday-9:00 AM':   { subject: 'Design & Analysis of Algo', code: 'BCS401', section: 'CSE-A', room: '402', sem: 4 },
};

const SUBJECT_COLORS = {
  'BCS602': 'bg-blue-100 border-blue-300 text-blue-900',
  'BCS601': 'bg-green-100 border-green-300 text-green-900',
  'BCS401': 'bg-purple-100 border-purple-300 text-purple-900',
};

const DAY_SHORT = { Monday: 'Mon', Tuesday: 'Tue', Wednesday: 'Wed', Thursday: 'Thu', Friday: 'Fri', Saturday: 'Sat' };

const todayName = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'][new Date().getDay()];

const FacultyTimetable = () => {
  const [view, setView] = useState('week'); // 'week' | 'day'
  const [selectedDay, setSelectedDay] = useState(DAYS.includes(todayName) ? todayName : 'Monday');

  const totalClassesPerWeek = Object.keys(TIMETABLE).length;

  const dayClasses = (day) =>
    TIME_SLOTS.filter(t => TIMETABLE[`${day}-${t}`]).length;

  // Classes for selected day in day view
  const todaySchedule = TIME_SLOTS
    .filter(t => TIMETABLE[`${selectedDay}-${t}`])
    .map(t => ({ time: t, ...TIMETABLE[`${selectedDay}-${t}`] }));

  return (
    <div className="bg-gray-50 p-4 md:p-8 min-h-screen">

      <div className="mb-8 flex flex-col md:flex-row md:justify-between md:items-end gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-gray-800">My Timetable</h2>
          <p className="text-gray-500 text-sm mt-1">
            {totalClassesPerWeek} classes this week across {new Set(Object.values(TIMETABLE).map(v => v.code)).size} subjects.
          </p>
        </div>

        <div className="flex bg-white rounded-xl p-1 shadow-sm border border-gray-200 w-max">
          {['week', 'day'].map(v => (
            <button key={v} onClick={() => setView(v)}
              className={`px-5 py-2.5 rounded-lg text-sm font-bold capitalize transition-all ${
                view === v ? 'bg-blue-800 text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'
              }`}>
              {v === 'week' ? '📅 Week View' : '📋 Day View'}
            </button>
          ))}
        </div>
      </div>

      {/* ── WEEK VIEW ── */}
      {view === 'week' && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

          {/* Day headers */}
          <div className="grid border-b border-gray-100"
            style={{ gridTemplateColumns: '80px repeat(6, 1fr)' }}>
            <div className="p-3 bg-gray-50 border-r border-gray-100" />
            {DAYS.map(day => (
              <div key={day}
                className={`p-3 text-center border-r border-gray-100 last:border-r-0 ${
                  day === todayName ? 'bg-blue-50' : 'bg-gray-50'
                }`}>
                <p className={`text-xs font-extrabold uppercase tracking-wider ${
                  day === todayName ? 'text-blue-700' : 'text-gray-500'
                }`}>
                  {DAY_SHORT[day]}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">{dayClasses(day)} class{dayClasses(day) !== 1 ? 'es' : ''}</p>
              </div>
            ))}
          </div>

          {/* Time slot rows */}
          {TIME_SLOTS.map(time => (
            <div key={time} className="grid border-b border-gray-100 last:border-b-0"
              style={{ gridTemplateColumns: '80px repeat(6, 1fr)' }}>

              {/* Time label */}
              <div className="p-3 flex items-start justify-center border-r border-gray-100 bg-gray-50">
                <span className="text-xs font-bold text-gray-400">{time}</span>
              </div>

              {/* Day cells */}
              {DAYS.map(day => {
                const slot = TIMETABLE[`${day}-${time}`];
                return (
                  <div key={day}
                    className={`p-2 border-r border-gray-100 last:border-r-0 min-h-18
                                flex items-stretch ${day === todayName ? 'bg-blue-50/30' : ''}`}>
                    {slot ? (
                      <div className={`w-full p-2 rounded-lg border text-left transition-all
                                       hover:shadow-sm cursor-default ${SUBJECT_COLORS[slot.code]}`}>
                        <p className="text-xs font-extrabold leading-tight truncate">{slot.subject}</p>
                        <p className="text-[10px] font-bold opacity-70 mt-0.5">{slot.section}</p>
                        <p className="text-[10px] font-semibold opacity-60 mt-0.5">Rm {slot.room}</p>
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      )}

      {/* ── DAY VIEW ── */}
      {view === 'day' && (
        <div className="space-y-4">
          {/* Day selector */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {DAYS.map(day => (
              <button key={day} onClick={() => setSelectedDay(day)}
                className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${
                  selectedDay === day
                    ? 'bg-blue-800 text-white'
                    : day === todayName
                      ? 'bg-blue-100 text-blue-800 border border-blue-300'
                      : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                }`}>
                {day}
                {day === todayName && <span className="ml-1.5 text-[10px] font-extrabold uppercase">Today</span>}
              </button>
            ))}
          </div>

          {/* Day schedule */}
          {todaySchedule.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center shadow-sm">
              <p className="text-3xl mb-2">🎉</p>
              <p className="font-bold text-gray-600">No classes on {selectedDay}.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {todaySchedule.map((cls, i) => (
                <div key={i}
                  className={`bg-white rounded-2xl border p-5 shadow-sm flex items-center gap-5
                               ${SUBJECT_COLORS[cls.code]}`}>
                  <div className="text-center min-w-18">
                    <p className="text-xs font-bold opacity-60 uppercase">Time</p>
                    <p className="text-sm font-extrabold">{cls.time}</p>
                  </div>
                  <div className="w-px h-10 bg-current opacity-20" />
                  <div className="flex-1">
                    <p className="font-extrabold text-base">{cls.subject}</p>
                    <p className="text-xs font-bold opacity-70 mt-0.5">
                      {cls.code} · Sem {cls.sem} · Section {cls.section}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs font-bold opacity-60 uppercase">Room</p>
                    <p className="font-extrabold">{cls.room}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Legend */}
      <div className="mt-6 bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
        <p className="text-xs font-bold text-gray-400 uppercase mb-3">Subject Legend</p>
        <div className="flex flex-wrap gap-3">
          {[...new Set(Object.values(TIMETABLE).map(v => v.code))].map(code => {
            const subj = Object.values(TIMETABLE).find(v => v.code === code);
            return (
              <span key={code}
                className={`text-xs font-bold px-3 py-1.5 rounded-lg border ${SUBJECT_COLORS[code]}`}>
                {code} — {subj.subject}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default FacultyTimetable;