import React, { useState } from 'react';

// BACKEND: GET /api/faculty/subjects
const FACULTY_SUBJECTS = [
  { id: 's1', name: 'Machine Learning',         code: 'BCS602', sem: 6, sections: ['CSE-A', 'CSE-B'], maxMarks: 50 },
  { id: 's2', name: 'Cloud Computing',           code: 'BCS601', sem: 6, sections: ['CSE-B'],          maxMarks: 50 },
  { id: 's3', name: 'Design & Analysis of Algo', code: 'BCS401', sem: 4, sections: ['CSE-A'],          maxMarks: 50 },
];

// BACKEND: GET /api/faculty/students?subject=<code>&section=<sec>
const MOCK_STUDENTS = {
  'BCS602-CSE-A': [
    { usn: '1AP23CS001', name: 'Aarav Sharma'  },
    { usn: '1AP23CS002', name: 'Bhavana Reddy' },
    { usn: '1AP23CS003', name: 'Chandan Kumar' },
    { usn: '1AP23CS004', name: 'Deepika Rao'   },
    { usn: '1AP23CS019', name: 'John Doe'       },
  ],
  'BCS602-CSE-B': [
    { usn: '1AP23CS051', name: 'Farhan Ali'    },
    { usn: '1AP23CS052', name: 'Geetha Nair'   },
    { usn: '1AP23CS053', name: 'Harish Menon'  },
  ],
  'BCS601-CSE-B': [
    { usn: '1AP23CS051', name: 'Farhan Ali'  },
    { usn: '1AP23CS052', name: 'Geetha Nair' },
  ],
  'BCS401-CSE-A': [
    { usn: '1AP21CS001', name: 'Ishaan Joshi'  },
    { usn: '1AP21CS002', name: 'Jasmine Kaur'  },
    { usn: '1AP21CS003', name: 'Kiran Das'     },
  ],
};

const FacultyMarks = () => {
  const [subjectId,    setSubjectId]    = useState('');
  const [section,      setSection]      = useState('');
  const [iaNumber,     setIaNumber]     = useState('IA1'); // 'IA1' | 'IA2'
  const [marks,        setMarks]        = useState({});    // { usn: markValue }
  const [errors,       setErrors]       = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted,    setSubmitted]    = useState(false);

  const selectedSubject = FACULTY_SUBJECTS.find(s => s.id === subjectId);
  const studentKey      = selectedSubject ? `${selectedSubject.code}-${section}` : '';
  const students        = MOCK_STUDENTS[studentKey] || [];
  const maxMarks        = selectedSubject?.maxMarks || 50;

  const handleSubjectChange = (id) => {
    setSubjectId(id);
    setSection('');
    setMarks({});
    setErrors({});
    setSubmitted(false);
  };

  const handleSectionChange = (sec) => {
    setSection(sec);
    setMarks({});
    setErrors({});
    setSubmitted(false);
  };

  const handleMarkChange = (usn, value) => {
    const num = value === '' ? '' : Number(value);
    setMarks(prev => ({ ...prev, [usn]: value }));
    // Validate in real time
    if (value !== '' && (isNaN(num) || num < 0 || num > maxMarks)) {
      setErrors(prev => ({ ...prev, [usn]: `0–${maxMarks}` }));
    } else {
      setErrors(prev => { const next = { ...prev }; delete next[usn]; return next; });
    }
  };

  const filledCount = students.filter(s => marks[s.usn] !== '' && marks[s.usn] !== undefined).length;
  const hasErrors   = Object.keys(errors).length > 0;

  const classAvg = (() => {
    const vals = students.map(s => Number(marks[s.usn])).filter(v => !isNaN(v) && marks[Object.keys(marks).find(k => k === s.usn)] !== '');
    if (vals.length === 0) return null;
    return (vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(1);
  })();

  // BACKEND: POST /api/marks
  // Body: { subjectCode, section, iaNumber, records: [{ usn, marks }] }
  const handleSubmit = () => {
    // Final validation
    const newErrors = {};
    students.forEach(s => {
      const v = marks[s.usn];
      if (v === '' || v === undefined) { newErrors[s.usn] = 'Required'; return; }
      const num = Number(v);
      if (isNaN(num) || num < 0 || num > maxMarks) newErrors[s.usn] = `0–${maxMarks}`;
    });
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }

    setIsSubmitting(true);
    setTimeout(() => { setIsSubmitting(false); setSubmitted(true); }, 800);
  };

  const canSubmit = selectedSubject && section && students.length > 0 && !hasErrors && !submitted;

  return (
    <div className="bg-gray-50 p-4 md:p-8 min-h-screen">

      <div className="mb-8">
        <h2 className="text-3xl font-extrabold text-gray-800">Enter IA Marks</h2>
        <p className="text-gray-500 text-sm mt-1">Enter Internal Assessment marks for your subjects.</p>
      </div>

      {/* Selector */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
        <h3 className="text-base font-bold text-gray-700 mb-4">Select Class & Assessment</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          <div>
            <label className="block text-sm font-bold text-gray-600 mb-1.5">Subject</label>
            <select value={subjectId} onChange={e => handleSubjectChange(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2
                         focus:ring-blue-500 focus:outline-none bg-gray-50 font-semibold text-gray-700">
              <option value="">— Select Subject —</option>
              {FACULTY_SUBJECTS.map(s => (
                <option key={s.id} value={s.id}>{s.name} ({s.code})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-600 mb-1.5">Section</label>
            <select value={section} onChange={e => handleSectionChange(e.target.value)}
              disabled={!subjectId}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2
                         focus:ring-blue-500 focus:outline-none bg-gray-50 font-semibold text-gray-700
                         disabled:opacity-50 disabled:cursor-not-allowed">
              <option value="">— Select Section —</option>
              {(selectedSubject?.sections || []).map(sec => (
                <option key={sec} value={sec}>{sec}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-600 mb-1.5">Assessment</label>
            <div className="flex bg-gray-100 rounded-xl p-1 gap-1">
              {['IA1', 'IA2'].map(ia => (
                <button
                  key={ia}
                  type="button"
                  onClick={() => { setIaNumber(ia); setMarks({}); setErrors({}); setSubmitted(false); }}
                  className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all ${
                    iaNumber === ia ? 'bg-white text-blue-800 shadow-sm' : 'text-gray-500'
                  }`}
                >
                  {ia}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Marks Table */}
      {section && students.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

          <div className="p-5 border-b border-gray-100 bg-gray-50 flex flex-col md:flex-row
                          md:items-center md:justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-gray-800">
                {selectedSubject?.name} · {section} · {iaNumber}
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Max marks: {maxMarks} · {students.length} students ·{' '}
                {filledCount} filled
              </p>
            </div>

            {/* Class average live */}
            {classAvg && (
              <div className="bg-blue-50 border border-blue-200 px-4 py-2 rounded-xl text-center">
                <p className="text-xs font-bold text-blue-500 uppercase">Class Avg</p>
                <p className="text-xl font-extrabold text-blue-800">{classAvg}</p>
              </div>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-400 text-xs uppercase tracking-wider border-b border-gray-100">
                  <th className="p-4 w-10">#</th>
                  <th className="p-4">Student</th>
                  <th className="p-4">USN</th>
                  <th className="p-4 text-center w-40">
                    {iaNumber} Marks
                    <span className="text-gray-300 font-normal ml-1">(out of {maxMarks})</span>
                  </th>
                  <th className="p-4 text-center w-24">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {students.map((student, i) => {
                  const val       = marks[student.usn] ?? '';
                  const hasError  = !!errors[student.usn];
                  const num       = Number(val);
                  const minPass   = Math.ceil(maxMarks * 0.35); // 35% minimum — adjust per VTU
                  const isDanger  = val !== '' && !isNaN(num) && num < minPass;
                  const isSafe    = val !== '' && !isNaN(num) && num >= minPass;

                  return (
                    <tr key={student.usn} className="hover:bg-gray-50 transition-colors">
                      <td className="p-4 text-xs font-bold text-gray-400">{i + 1}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center
                                          text-xs font-extrabold text-blue-700 shrink-0">
                            {student.name[0]}
                          </div>
                          <span className="font-bold text-gray-800 text-sm">{student.name}</span>
                        </div>
                      </td>
                      <td className="p-4 text-xs font-mono text-gray-400">{student.usn}</td>
                      <td className="p-4">
                        <div className="flex justify-center">
                          <input
                            type="number"
                            min="0"
                            max={maxMarks}
                            value={val}
                            onChange={e => handleMarkChange(student.usn, e.target.value)}
                            placeholder="—"
                            className={`w-24 text-center px-3 py-2 border rounded-xl font-bold text-gray-800
                                        focus:ring-2 focus:outline-none transition text-sm
                                        ${hasError
                                          ? 'border-red-400 bg-red-50 focus:ring-red-300'
                                          : 'border-gray-300 bg-gray-50 focus:ring-blue-400'}`}
                          />
                        </div>
                        {hasError && (
                          <p className="text-center text-xs text-red-500 font-bold mt-1">
                            {errors[student.usn]}
                          </p>
                        )}
                      </td>
                      <td className="p-4 text-center">
                        {isSafe && (
                          <span className="text-xs font-bold bg-green-100 text-green-700 px-2 py-1
                                           rounded-full border border-green-200">Safe</span>
                        )}
                        {isDanger && (
                          <span className="text-xs font-bold bg-red-100 text-red-700 px-2 py-1
                                           rounded-full border border-red-200">Low</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div className="p-5 border-t border-gray-100 bg-gray-50 flex items-center justify-between gap-4">
            {submitted ? (
              <div className="flex items-center gap-2 text-green-700 font-bold text-sm">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                </svg>
                Marks submitted successfully!
              </div>
            ) : (
              <p className="text-xs text-gray-400">
                {hasErrors ? '⚠️ Fix the errors before submitting.' : `${filledCount}/${students.length} marks entered.`}
              </p>
            )}
            <button
              onClick={handleSubmit}
              disabled={!canSubmit || isSubmitting}
              className="flex items-center gap-2 bg-blue-800 hover:bg-blue-900 disabled:opacity-50
                         disabled:cursor-not-allowed text-white font-bold px-6 py-2.5 rounded-xl
                         transition shadow-sm"
            >
              {isSubmitting ? (
                <><svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>Saving...</>
              ) : submitted ? '✓ Submitted' : 'Save Marks'}
            </button>
          </div>
        </div>
      )}

      {(!subjectId || !section) && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-16 text-center">
          <p className="text-4xl mb-3">📝</p>
          <p className="font-bold text-gray-600">Select a subject and section above</p>
          <p className="text-sm text-gray-400 mt-1">Mark entry table will appear here.</p>
        </div>
      )}
    </div>
  );
};

export default FacultyMarks;