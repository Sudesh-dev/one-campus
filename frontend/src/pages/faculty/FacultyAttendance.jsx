import React, { useState } from 'react';

// BACKEND: GET /api/faculty/subjects returns subjects the faculty teaches
// Each subject has sections it's taught to
const FACULTY_SUBJECTS = [
  { id: 's1', name: 'Machine Learning',          code: 'BCS602', sem: 6, sections: ['CSE-A', 'CSE-B'] },
  { id: 's2', name: 'Cloud Computing',            code: 'BCS601', sem: 6, sections: ['CSE-B'] },
  { id: 's3', name: 'Design & Analysis of Algo',  code: 'BCS401', sem: 4, sections: ['CSE-A'] },
];

// BACKEND: GET /api/faculty/students?subject=<code>&section=<sec>
const MOCK_STUDENTS = {
  'BCS602-CSE-A': [
    { usn: '1AP23CS001', name: 'Aarav Sharma' },
    { usn: '1AP23CS002', name: 'Bhavana Reddy' },
    { usn: '1AP23CS003', name: 'Chandan Kumar' },
    { usn: '1AP23CS004', name: 'Deepika Rao' },
    { usn: '1AP23CS005', name: 'Eshan Patel' },
    { usn: '1AP23CS019', name: 'John Doe' },
  ],
  'BCS602-CSE-B': [
    { usn: '1AP23CS051', name: 'Farhan Ali' },
    { usn: '1AP23CS052', name: 'Geetha Nair' },
    { usn: '1AP23CS053', name: 'Harish Menon' },
  ],
  'BCS601-CSE-B': [
    { usn: '1AP23CS051', name: 'Farhan Ali' },
    { usn: '1AP23CS052', name: 'Geetha Nair' },
  ],
  'BCS401-CSE-A': [
    { usn: '1AP21CS001', name: 'Ishaan Joshi' },
    { usn: '1AP21CS002', name: 'Jasmine Kaur' },
    { usn: '1AP21CS003', name: 'Kiran Das' },
  ],
};

const STATUS = { P: 'Present', A: 'Absent', OD: 'On Duty' };
const STATUS_COLORS = {
  P:  'bg-green-100 text-green-700 border-green-300',
  A:  'bg-red-100 text-red-700 border-red-300',
  OD: 'bg-yellow-100 text-yellow-700 border-yellow-300',
};

const FacultyAttendance = () => {
  const today = new Date().toISOString().split('T')[0];

  const [subjectId,  setSubjectId]  = useState('');
  const [section,    setSection]    = useState('');
  const [date,       setDate]       = useState(today);
  const [attendance, setAttendance] = useState({});  // { usn: 'P'|'A'|'OD' }
  const [submitted,  setSubmitted]  = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedSubject = FACULTY_SUBJECTS.find(s => s.id === subjectId);
  const studentKey      = selectedSubject ? `${selectedSubject.code}-${section}` : '';
  const students        = MOCK_STUDENTS[studentKey] || [];

  // When subject changes, reset section and attendance
  const handleSubjectChange = (id) => {
    setSubjectId(id);
    setSection('');
    setAttendance({});
    setSubmitted(false);
  };

  const handleSectionChange = (sec) => {
    setSection(sec);
    setSubmitted(false);
    // Pre-fill all as Present
    const sub = FACULTY_SUBJECTS.find(s => s.id === subjectId);
    if (!sub) return;
    const key = `${sub.code}-${sec}`;
    const studentList = MOCK_STUDENTS[key] || [];
    const initial = {};
    studentList.forEach(s => { initial[s.usn] = 'P'; });
    setAttendance(initial);
  };

  const setStatus = (usn, status) => {
    setAttendance(prev => ({ ...prev, [usn]: status }));
  };

  const markAll = (status) => {
    const updated = {};
    students.forEach(s => { updated[s.usn] = status; });
    setAttendance(updated);
  };

  const presentCount = Object.values(attendance).filter(v => v === 'P').length;
  const absentCount  = Object.values(attendance).filter(v => v === 'A').length;
  const odCount      = Object.values(attendance).filter(v => v === 'OD').length;

  // BACKEND: POST /api/attendance
  // Body: { subjectCode, section, date, records: [{ usn, status }] }
  const handleSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 800);
  };

  const canSubmit = selectedSubject && section && students.length > 0 &&
    students.every(s => attendance[s.usn]);

  return (
    <div className="bg-gray-50 p-4 md:p-8 min-h-screen">

      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-extrabold text-gray-800">Mark Attendance</h2>
        <p className="text-gray-500 text-sm mt-1">Select a subject and section to mark today's attendance.</p>
      </div>

      {/* Step 1: Selector */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
        <h3 className="text-base font-bold text-gray-700 mb-4">Select Class</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          <div>
            <label className="block text-sm font-bold text-gray-600 mb-1.5">Subject</label>
            <select
              value={subjectId}
              onChange={e => handleSubjectChange(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2
                         focus:ring-blue-500 focus:outline-none bg-gray-50 font-semibold text-gray-700"
            >
              <option value="">— Select Subject —</option>
              {FACULTY_SUBJECTS.map(s => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.code}) · Sem {s.sem}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-600 mb-1.5">Section</label>
            <select
              value={section}
              onChange={e => handleSectionChange(e.target.value)}
              disabled={!subjectId}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2
                         focus:ring-blue-500 focus:outline-none bg-gray-50 font-semibold text-gray-700
                         disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="">— Select Section —</option>
              {(selectedSubject?.sections || []).map(sec => (
                <option key={sec} value={sec}>{sec}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-600 mb-1.5">Date</label>
            <input
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              max={today}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2
                         focus:ring-blue-500 focus:outline-none bg-gray-50"
            />
          </div>
        </div>
      </div>

      {/* Step 2: Student List */}
      {section && students.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

          {/* Table header */}
          <div className="p-5 border-b border-gray-100 bg-gray-50 flex flex-col md:flex-row
                          md:items-center md:justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-gray-800">
                {selectedSubject?.name} — Section {section}
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                {students.length} students · {date}
              </p>
            </div>

            {/* Bulk mark buttons */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold text-gray-400 mr-1">Mark all:</span>
              {Object.entries(STATUS).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => markAll(key)}
                  className={`text-xs font-bold px-3 py-1.5 rounded-lg border transition ${STATUS_COLORS[key]}`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Summary bar */}
          <div className="px-5 py-3 bg-gray-50 border-b border-gray-100 flex gap-4 text-xs font-bold">
            <span className="text-green-700">✅ Present: {presentCount}</span>
            <span className="text-red-600">❌ Absent: {absentCount}</span>
            <span className="text-yellow-700">🟡 On Duty: {odCount}</span>
          </div>

          {/* Student rows */}
          <div className="divide-y divide-gray-100">
            {students.map((student, i) => {
              const current = attendance[student.usn] || '';
              return (
                <div key={student.usn}
                  className="flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition">
                  <div className="flex items-center gap-4">
                    <span className="text-xs font-bold text-gray-400 w-6">{i + 1}</span>
                    <div className="w-9 h-9 bg-blue-100 rounded-full flex items-center justify-center
                                    text-sm font-extrabold text-blue-700 shrink-0">
                      {student.name[0]}
                    </div>
                    <div>
                      <p className="font-bold text-gray-800 text-sm">{student.name}</p>
                      <p className="text-xs text-gray-400 font-mono">{student.usn}</p>
                    </div>
                  </div>

                  {/* Status buttons */}
                  <div className="flex gap-2">
                    {Object.entries(STATUS).map(([key, label]) => (
                      <button
                        key={key}
                        onClick={() => setStatus(student.usn, key)}
                        className={`text-xs font-bold px-3 py-1.5 rounded-lg border transition-all
                          ${current === key
                            ? `${STATUS_COLORS[key]} ring-2 ring-offset-1 ${
                                key === 'P'  ? 'ring-green-400'  :
                                key === 'A'  ? 'ring-red-400'    : 'ring-yellow-400'}`
                            : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-100'
                          }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Submit footer */}
          <div className="p-5 border-t border-gray-100 bg-gray-50 flex items-center justify-between gap-4">
            {submitted ? (
              <div className="flex items-center gap-2 text-green-700 font-bold text-sm">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                </svg>
                Attendance submitted successfully!
              </div>
            ) : (
              <p className="text-xs text-gray-400 font-medium">
                {students.filter(s => !attendance[s.usn]).length > 0
                  ? `${students.filter(s => !attendance[s.usn]).length} student(s) not marked yet.`
                  : 'All students marked. Ready to submit.'}
              </p>
            )}

            <button
              onClick={handleSubmit}
              disabled={!canSubmit || isSubmitting || submitted}
              className="flex items-center gap-2 bg-blue-800 hover:bg-blue-900 disabled:opacity-50
                         disabled:cursor-not-allowed text-white font-bold px-6 py-2.5 rounded-xl
                         transition shadow-sm"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Submitting...
                </>
              ) : submitted ? '✓ Submitted' : 'Submit Attendance'}
            </button>
          </div>
        </div>
      )}

      {/* Empty state when nothing selected */}
      {(!subjectId || !section) && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-16 text-center">
          <p className="text-4xl mb-3">📋</p>
          <p className="font-bold text-gray-600">Select a subject and section above</p>
          <p className="text-sm text-gray-400 mt-1">Student list will appear here.</p>
        </div>
      )}
    </div>
  );
};

export default FacultyAttendance;