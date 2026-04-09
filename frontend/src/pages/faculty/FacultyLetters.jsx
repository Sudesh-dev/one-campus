import React, { useState } from 'react';

const TYPE_CONFIG = {
  leave:    { label: 'Leave Application',         color: 'bg-blue-100 text-blue-800 border-blue-200'       },
  bonafide: { label: 'Bonafide Certificate',       color: 'bg-purple-100 text-purple-800 border-purple-200' },
  event:    { label: 'Event/Hackathon Permission', color: 'bg-green-100 text-green-800 border-green-200'    },
};

// BACKEND: GET /api/letters?facultyId=<id>  returns letters directed to this faculty
const MOCK_LETTERS = [
  {
    id: 1, type: 'leave', status: 'pending',
    student: { name: 'John Doe', usn: '1AP23CS019', sem: '6th Semester', section: 'CSE-A' },
    reason: 'Family function — attending cousin\'s wedding in Mysore.',
    startDate: '2026-04-10', endDate: '2026-04-12',
    submittedOn: '07/04/2026', remark: '',
  },
  {
    id: 2, type: 'event', status: 'pending',
    student: { name: 'Aarav Sharma', usn: '1AP23CS001', sem: '6th Semester', section: 'CSE-A' },
    reason: 'Smart India Hackathon 2026 — Problem Statement PS1234 at IISc Bengaluru.',
    startDate: '2026-04-15', endDate: '2026-04-17',
    submittedOn: '06/04/2026', remark: '',
  },
  {
    id: 3, type: 'leave', status: 'approved',
    student: { name: 'Bhavana Reddy', usn: '1AP23CS002', sem: '6th Semester', section: 'CSE-A' },
    reason: 'Medical — fever and doctor visit.',
    startDate: '2026-04-03', endDate: '2026-04-04',
    submittedOn: '02/04/2026', remark: 'Approved. Please submit medical certificate on return.',
  },
  {
    id: 4, type: 'bonafide', status: 'rejected',
    student: { name: 'Chandan Kumar', usn: '1AP23CS003', sem: '6th Semester', section: 'CSE-A' },
    reason: 'Passport application.',
    startDate: '', endDate: '',
    submittedOn: '01/04/2026', remark: 'Please apply through admin office for bonafide certificates.',
  },
];

const STATUS_PILL = {
  pending:  'bg-yellow-100 text-yellow-800 border-yellow-200',
  approved: 'bg-green-100 text-green-700 border-green-200',
  rejected: 'bg-red-100 text-red-700 border-red-200',
};

const FacultyLetters = () => {
  const [letters,     setLetters]     = useState(MOCK_LETTERS);
  const [filter,      setFilter]      = useState('all');  // 'all'|'pending'|'approved'|'rejected'
  const [selectedId,  setSelectedId]  = useState(null);
  const [remark,      setRemark]      = useState('');
  const [isActing,    setIsActing]    = useState(false);

  const selected = letters.find(l => l.id === selectedId);

  const filtered = filter === 'all' ? letters : letters.filter(l => l.status === filter);

  const pendingCount = letters.filter(l => l.status === 'pending').length;

  // BACKEND: PATCH /api/letters/:id  { status: 'approved'|'rejected', remark }
  const handleAction = (action) => {
    setIsActing(true);
    setTimeout(() => {
      setLetters(prev => prev.map(l =>
        l.id === selectedId ? { ...l, status: action, remark } : l
      ));
      setIsActing(false);
      setRemark('');
      setSelectedId(null);
    }, 600);
  };

  return (
    <div className="bg-gray-50 p-4 md:p-8 min-h-screen">

      <div className="mb-8 flex flex-col md:flex-row md:justify-between md:items-end gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-gray-800">Student Letters</h2>
          <p className="text-gray-500 text-sm mt-1">Review and action student leave/event applications.</p>
        </div>
        {pendingCount > 0 && (
          <span className="bg-yellow-100 text-yellow-800 border border-yellow-200 text-sm font-bold
                           px-4 py-2 rounded-xl">
            {pendingCount} pending approval{pendingCount !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {['all', 'pending', 'approved', 'rejected'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-full text-sm font-bold capitalize transition-all ${
              filter === f ? 'bg-blue-800 text-white shadow-sm' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}>
            {f} {f === 'all' ? `(${letters.length})` :
                 f === 'pending' ? `(${letters.filter(l => l.status === 'pending').length})` :
                 f === 'approved' ? `(${letters.filter(l => l.status === 'approved').length})` :
                 `(${letters.filter(l => l.status === 'rejected').length})`}
          </button>
        ))}
      </div>

      <div className="flex flex-col xl:flex-row gap-6">

        {/* Left: Letter list */}
        <div className="xl:w-2/5 space-y-3">
          {filtered.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-sm">
              <p className="text-3xl mb-2">📭</p>
              <p className="font-semibold text-gray-500">No {filter} letters.</p>
            </div>
          ) : (
            filtered.map(letter => (
              <div key={letter.id}
                onClick={() => { setSelectedId(letter.id); setRemark(letter.remark || ''); }}
                className={`bg-white rounded-xl border p-4 cursor-pointer transition-all shadow-sm
                            hover:shadow-md ${
                  selectedId === letter.id
                    ? 'border-blue-500 ring-2 ring-blue-100'
                    : 'border-gray-100'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full border
                                   ${TYPE_CONFIG[letter.type].color}`}>
                    {TYPE_CONFIG[letter.type].label}
                  </span>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full border capitalize
                                   ${STATUS_PILL[letter.status]}`}>
                    {letter.status}
                  </span>
                </div>
                <p className="font-bold text-gray-800 text-sm">{letter.student.name}</p>
                <p className="text-xs text-gray-400 font-mono">{letter.student.usn}</p>
                <p className="text-xs text-gray-500 mt-1.5 line-clamp-2">{letter.reason}</p>
                <p className="text-xs text-gray-300 mt-1 font-medium">Submitted {letter.submittedOn}</p>
              </div>
            ))
          )}
        </div>

        {/* Right: Detail + Action panel */}
        <div className="xl:w-3/5">
          {selected ? (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

              {/* Detail header */}
              <div className="p-6 border-b border-gray-100 bg-gray-50 flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full border
                                     ${TYPE_CONFIG[selected.type].color}`}>
                      {TYPE_CONFIG[selected.type].label}
                    </span>
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full border capitalize
                                     ${STATUS_PILL[selected.status]}`}>
                      {selected.status}
                    </span>
                  </div>
                  <p className="text-lg font-bold text-gray-800">{selected.student.name}</p>
                  <p className="text-sm text-gray-500">
                    {selected.student.usn} · {selected.student.sem} · Section {selected.student.section}
                  </p>
                </div>
                <button onClick={() => setSelectedId(null)}
                  className="text-gray-400 hover:text-gray-600 text-xl font-bold">✕</button>
              </div>

              {/* Letter body */}
              <div className="p-6 space-y-4">

                <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase mb-1">Reason / Details</p>
                    <p className="text-sm text-gray-700 leading-relaxed">{selected.reason}</p>
                  </div>
                  {selected.startDate && (
                    <div className="flex gap-6">
                      <div>
                        <p className="text-xs font-bold text-gray-400 uppercase mb-1">From</p>
                        <p className="text-sm font-semibold text-gray-700">{selected.startDate}</p>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-400 uppercase mb-1">To</p>
                        <p className="text-sm font-semibold text-gray-700">{selected.endDate}</p>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-400 uppercase mb-1">Duration</p>
                        <p className="text-sm font-semibold text-gray-700">
                          {Math.round((new Date(selected.endDate) - new Date(selected.startDate)) / 86400000) + 1} day(s)
                        </p>
                      </div>
                    </div>
                  )}
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase mb-1">Submitted On</p>
                    <p className="text-sm font-semibold text-gray-700">{selected.submittedOn}</p>
                  </div>
                </div>

                {/* Remark */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">
                    Remark / Note (optional)
                  </label>
                  <textarea
                    value={remark}
                    onChange={e => setRemark(e.target.value)}
                    disabled={selected.status !== 'pending'}
                    placeholder="Add a note for the student..."
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2
                               focus:ring-blue-500 focus:outline-none bg-gray-50 resize-none text-sm
                               disabled:opacity-60 disabled:cursor-not-allowed"
                  />
                </div>

                {/* If previously actioned, show remark */}
                {selected.status !== 'pending' && selected.remark && (
                  <div className={`p-4 rounded-xl border ${
                    selected.status === 'approved'
                      ? 'bg-green-50 border-green-200 text-green-800'
                      : 'bg-red-50 border-red-200 text-red-800'
                  }`}>
                    <p className="text-xs font-bold uppercase mb-1">Your Remark</p>
                    <p className="text-sm">{selected.remark}</p>
                  </div>
                )}

                {/* Action buttons */}
                {selected.status === 'pending' && (
                  <div className="flex gap-3 pt-2">
                    <button onClick={() => handleAction('approved')} disabled={isActing}
                      className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700
                                 disabled:opacity-60 text-white font-bold py-3 rounded-xl transition">
                      {isActing ? '...' : '✅ Approve'}
                    </button>
                    <button onClick={() => handleAction('rejected')} disabled={isActing}
                      className="flex-1 flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600
                                 disabled:opacity-60 text-white font-bold py-3 rounded-xl transition">
                      {isActing ? '...' : '❌ Reject'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-100 h-80 shadow-sm
                            flex flex-col items-center justify-center text-gray-400 gap-3">
              <svg className="w-12 h-12 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <p className="font-semibold text-gray-500">Select a letter to review it</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FacultyLetters;