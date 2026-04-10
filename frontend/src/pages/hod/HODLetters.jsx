import React, { useState } from 'react';

// Reuse same type config + status pill from FacultyLetters
const TYPE_CONFIG = {
  leave:    { label: 'Leave Application',         color: 'bg-blue-100 text-blue-800 border-blue-200'       },
  bonafide: { label: 'Bonafide Certificate',       color: 'bg-purple-100 text-purple-800 border-purple-200' },
  event:    { label: 'Event/Hackathon Permission', color: 'bg-green-100 text-green-800 border-green-200'    },
};

const STATUS_PILL = {
  pending:  'bg-yellow-100 text-yellow-800 border-yellow-200',
  approved: 'bg-green-100 text-green-700 border-green-200',
  rejected: 'bg-red-100 text-red-700 border-red-200',
};

// BACKEND: GET /api/hod/letters?status=escalated
// These are letters that faculty already approved and forwarded to HOD for final sign-off
const MOCK_LETTERS = [
  {
    id: 1, type: 'event', status: 'pending',
    student: { name: 'Aarav Sharma', usn: '1AP23CS001', sem: '6th Semester', section: 'CSE-A' },
    reason: 'Smart India Hackathon 2026 — IISc Bengaluru. Representing CSE department.',
    startDate: '2026-04-15', endDate: '2026-04-17', submittedOn: '06/04/2026',
    facultyRemark: 'Approved by faculty. Student is representing the college. Recommended for OD.',
    remark: '',
  },
  {
    id: 2, type: 'leave', status: 'pending',
    student: { name: 'Deepika Rao', usn: '1AP23CS004', sem: '6th Semester', section: 'CSE-A' },
    reason: 'Medical emergency — hospitalisation.',
    startDate: '2026-04-08', endDate: '2026-04-10', submittedOn: '07/04/2026',
    facultyRemark: 'Faculty approved. Medical documents to be submitted.',
    remark: '',
  },
  {
    id: 3, type: 'bonafide', status: 'approved',
    student: { name: 'Farhan Ali', usn: '1AP23CS051', sem: '6th Semester', section: 'CSE-B' },
    reason: 'Passport application.',
    startDate: '', endDate: '', submittedOn: '01/04/2026',
    facultyRemark: 'Verified bonafide student. No dues.',
    remark: 'Approved. Admin office to issue certificate.',
  },
];

const HODLetters = () => {
  const [letters,    setLetters]    = useState(MOCK_LETTERS);
  const [filter,     setFilter]     = useState('all');
  const [selectedId, setSelectedId] = useState(null);
  const [remark,     setRemark]     = useState('');
  const [isActing,   setIsActing]   = useState(false);

  const selected      = letters.find(l => l.id === selectedId);
  const filtered      = filter === 'all' ? letters : letters.filter(l => l.status === filter);
  const pendingCount  = letters.filter(l => l.status === 'pending').length;

  // BACKEND: PATCH /api/hod/letters/:id  { status, remark }
  const handleAction = (action) => {
    setIsActing(true);
    setTimeout(() => {
      setLetters(prev => prev.map(l => l.id === selectedId ? { ...l, status: action, remark } : l));
      setIsActing(false); setRemark(''); setSelectedId(null);
    }, 600);
  };

  return (
    <div className="bg-gray-50 p-4 md:p-8 min-h-screen">
      <div className="mb-8 flex flex-col md:flex-row md:justify-between md:items-end gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-gray-800">Student Letters</h2>
          <p className="text-gray-500 text-sm mt-1">Letters escalated by faculty for HOD approval.</p>
        </div>
        {pendingCount > 0 && (
          <span className="bg-yellow-100 text-yellow-800 border border-yellow-200 text-sm font-bold px-4 py-2 rounded-xl">
            {pendingCount} pending HOD approval
          </span>
        )}
      </div>

      <div className="flex gap-2 mb-6 flex-wrap">
        {['all', 'pending', 'approved', 'rejected'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-full text-sm font-bold capitalize transition-all ${
              filter === f ? 'bg-blue-800 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}>
            {f} ({f === 'all' ? letters.length : letters.filter(l => l.status === f).length})
          </button>
        ))}
      </div>

      <div className="flex flex-col xl:flex-row gap-6">
        <div className="xl:w-2/5 space-y-3">
          {filtered.map(letter => (
            <div key={letter.id} onClick={() => { setSelectedId(letter.id); setRemark(letter.remark || ''); }}
              className={`bg-white rounded-xl border p-4 cursor-pointer shadow-sm hover:shadow-md transition-all ${
                selectedId === letter.id ? 'border-blue-500 ring-2 ring-blue-100' : 'border-gray-100'}`}>
              <div className="flex items-start justify-between mb-2">
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${TYPE_CONFIG[letter.type].color}`}>{TYPE_CONFIG[letter.type].label}</span>
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full border capitalize ${STATUS_PILL[letter.status]}`}>{letter.status}</span>
              </div>
              <p className="font-bold text-gray-800 text-sm">{letter.student.name}</p>
              <p className="text-xs text-gray-400 font-mono">{letter.student.usn}</p>
              <p className="text-xs text-gray-500 mt-1 line-clamp-1">{letter.reason}</p>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-sm">
              <p className="text-3xl mb-2">📭</p><p className="font-semibold text-gray-500 text-sm">No {filter} letters.</p>
            </div>
          )}
        </div>

        <div className="xl:w-3/5">
          {selected ? (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100 bg-gray-50 flex justify-between items-start">
                <div>
                  <div className="flex gap-2 mb-2 flex-wrap">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${TYPE_CONFIG[selected.type].color}`}>{TYPE_CONFIG[selected.type].label}</span>
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full border capitalize ${STATUS_PILL[selected.status]}`}>{selected.status}</span>
                  </div>
                  <p className="text-lg font-bold text-gray-800">{selected.student.name}</p>
                  <p className="text-sm text-gray-500">{selected.student.usn} · {selected.student.sem} · {selected.student.section}</p>
                </div>
                <button onClick={() => setSelectedId(null)} className="text-gray-400 hover:text-gray-600 text-xl font-bold">✕</button>
              </div>
              <div className="p-6 space-y-4">
                <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase mb-1">Reason</p>
                    <p className="text-sm text-gray-700">{selected.reason}</p>
                  </div>
                  {selected.startDate && (
                    <div className="flex gap-6">
                      <div><p className="text-xs font-bold text-gray-400 uppercase mb-0.5">From</p><p className="text-sm font-semibold text-gray-700">{selected.startDate}</p></div>
                      <div><p className="text-xs font-bold text-gray-400 uppercase mb-0.5">To</p><p className="text-sm font-semibold text-gray-700">{selected.endDate}</p></div>
                    </div>
                  )}
                </div>
                {/* Faculty remark */}
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <p className="text-xs font-bold text-blue-500 uppercase mb-1">Faculty Remark</p>
                  <p className="text-sm text-blue-800">{selected.facultyRemark}</p>
                </div>
                {/* HOD remark */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">HOD Remark</label>
                  <textarea value={remark} onChange={e => setRemark(e.target.value)}
                    disabled={selected.status !== 'pending'}
                    placeholder="Add your note..." rows={2}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none bg-gray-50 resize-none text-sm disabled:opacity-60 disabled:cursor-not-allowed" />
                </div>
                {selected.status === 'pending' && (
                  <div className="flex gap-3">
                    <button onClick={() => handleAction('approved')} disabled={isActing}
                      className="flex-1 bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white font-bold py-3 rounded-xl transition">
                      {isActing ? '...' : '✅ Approve'}
                    </button>
                    <button onClick={() => handleAction('rejected')} disabled={isActing}
                      className="flex-1 bg-red-500 hover:bg-red-600 disabled:opacity-60 text-white font-bold py-3 rounded-xl transition">
                      {isActing ? '...' : '❌ Reject'}
                    </button>
                  </div>
                )}
                {selected.status !== 'pending' && selected.remark && (
                  <div className={`p-4 rounded-xl border ${selected.status === 'approved' ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
                    <p className="text-xs font-bold uppercase mb-1">Your Remark</p>
                    <p className="text-sm">{selected.remark}</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-100 h-64 shadow-sm flex flex-col items-center justify-center text-gray-400 gap-2">
              <svg className="w-10 h-10 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              <p className="font-semibold text-gray-500 text-sm">Select a letter to review</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HODLetters;