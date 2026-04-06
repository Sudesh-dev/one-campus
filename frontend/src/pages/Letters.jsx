import React, { useState } from 'react';

// ── LETTER PREVIEW (reused in both Compose and History) ─────
// Accepts `opts` to override defaults when viewing a saved letter.
const LetterPreview = ({ student, letterType, reason, startDate, endDate, opts }) => {
  const type  = opts?.type      || letterType;
  const rsn   = opts?.reason    || reason    || '';
  const sd    = opts?.startDate || startDate || '';
  const ed    = opts?.endDate   || endDate   || '';
  const today = new Date().toLocaleDateString('en-GB');

  const generateSubject = (t) => {
    if (t === 'leave')    return 'Application for Leave of Absence';
    if (t === 'bonafide') return 'Requisition for Bonafide Certificate';
    if (t === 'event')    return 'Permission to Attend Hackathon/Event';
    return '';
  };

  const generateBody = (t, r, s, e) => {
    if (t === 'leave') return (
      `With reference to the subject cited above, I, ${student.name}, bearing USN ${student.usn}, studying in ${student.sem} of ${student.branch}, request you to kindly grant me leave ${s && e ? `from ${s} to ${e}` : 'for the mentioned dates'}. The reason for my absence is ${r || '[Your Reason Here]'}.\n\nI will ensure that I cover up the missed academic portions. Kindly approve my leave.`
    );
    if (t === 'bonafide') return (
      `With reference to the subject cited above, I, ${student.name}, bearing USN ${student.usn}, am a bonafide student of ${student.college}, currently pursuing my B.E. in ${student.branch} (${student.sem}).\n\nI request you to kindly issue a Bonafide Certificate as it is required for ${r || '[Purpose, e.g., Passport / Bank Loan / Scholarship]'}. I have cleared all my dues up to the current semester.`
    );
    if (t === 'event') return (
      `With reference to the subject cited above, I, ${student.name} (${student.usn}) from ${student.sem} ${student.branch}, am writing to request permission to participate in ${r || '[Event Name]'} scheduled ${s && e ? `from ${s} to ${e}` : 'on the mentioned dates'}.\n\nParticipating in this event will greatly enhance my practical knowledge and skills. I request you to grant me permission to attend and consider my absence as On-Duty (OD).`
    );
  };

  return (
    <div
      id="printable-letter"
      className="bg-white p-8 md:p-12 rounded-xl border border-gray-200 shadow-sm
                 text-gray-800 font-serif leading-relaxed mx-auto w-full"
      style={{ maxWidth: '800px', minHeight: '860px' }}
    >
      {/* College Letterhead */}
      <div className="text-center border-b-2 border-gray-700 pb-4 mb-8">
        <h1 className="text-lg font-bold text-gray-900 uppercase tracking-wide">
          {student.college}
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          Affiliated to Visvesvaraya Technological University (VTU) · Approved by AICTE
        </p>
      </div>

      {/* From / Date */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <p className="font-bold">From,</p>
          <p>{student.name}</p>
          <p>USN: {student.usn}</p>
          <p>{student.sem}, {student.branch}</p>
          <p>{student.college}</p>
        </div>
        <div className="text-right">
          <p className="font-bold">Date:</p>
          <p>{opts?.createdAt || today}</p>
        </div>
      </div>

      {/* To */}
      <div className="mb-8">
        <p className="font-bold">To,</p>
        <p>The Head of Department,</p>
        <p>Department of {student.branch}</p>
        <p>{student.college}, Bengaluru</p>
      </div>

      <p className="mb-6">Respected Sir/Madam,</p>

      <p className="font-bold underline underline-offset-4 mb-6">
        Subject: {generateSubject(type)}
      </p>

      <div className="mb-12 whitespace-pre-wrap text-justify leading-8">
        {generateBody(type, rsn, sd, ed)}
      </div>

      <p className="mb-12">Thanking you,</p>

      <div className="flex justify-between items-end mt-16">
        <div>
          <p className="font-bold mb-10">Yours obediently,</p>
          <div className="border-b border-gray-400 w-40 mb-1" />
          <p className="font-bold">{student.name}</p>
          <p className="text-sm text-gray-500">{student.usn}</p>
        </div>
        {(type === 'leave' || type === 'event') && (
          <div className="text-center">
            <div className="border-b border-gray-400 w-40 mb-1" />
            <p className="text-sm text-gray-600">Parent/Guardian Signature</p>
          </div>
        )}
      </div>
    </div>
  );
};

// ── TYPE CONFIG ──────────────────────────────────────────────
const LETTER_TYPES = {
  leave:    { label: 'Leave Application',          color: 'bg-blue-100 text-blue-800 border-blue-200'    },
  bonafide: { label: 'Bonafide Certificate',        color: 'bg-purple-100 text-purple-800 border-purple-200' },
  event:    { label: 'Event/Hackathon Permission',  color: 'bg-green-100 text-green-800 border-green-200'  },
};

// ── MAIN COMPONENT ────────────────────────────────────────────
const Letters = () => {
  const [activeView,     setActiveView]     = useState('compose'); // 'compose' | 'history'
  const [letterType,     setLetterType]     = useState('leave');
  const [reason,         setReason]         = useState('');
  const [startDate,      setStartDate]      = useState('');
  const [endDate,        setEndDate]        = useState('');
  const [isSaving,       setIsSaving]       = useState(false);
  const [saveSuccess,    setSaveSuccess]    = useState(false);
  const [selectedLetter, setSelectedLetter] = useState(null); // for history preview

  // BACKEND: Replace with data from auth context / GET /api/student/profile
  const student = {
    name:    'John Doe',
    usn:     '1AP23CS019',
    sem:     '6th Semester',
    branch:  'Computer Science & Engineering',
    college: 'APS College of Engineering',
  };

  // BACKEND: Replace with GET /api/letters (returns array of saved letters)
  const [savedLetters, setSavedLetters] = useState([
    {
      id: 1, type: 'leave',
      reason: 'Family function',
      startDate: '2026-04-05', endDate: '2026-04-07',
      createdAt: '01/04/2026',
    },
    {
      id: 2, type: 'event',
      reason: 'Smart India Hackathon 2026 — Problem Statement PS1234',
      startDate: '2026-04-10', endDate: '2026-04-12',
      createdAt: '28/03/2026',
    },
  ]);

  // Save letter (add to local state)
  // BACKEND: Replace with POST /api/letters  { type, reason, startDate, endDate }
  const handleSaveLetter = () => {
    setIsSaving(true);
    setTimeout(() => {
      const newLetter = {
        id:        Date.now(),
        type:      letterType,
        reason:    reason    || 'No reason specified',
        startDate: startDate || '',
        endDate:   endDate   || '',
        createdAt: new Date().toLocaleDateString('en-GB'),
      };
      setSavedLetters(prev => [newLetter, ...prev]);
      setIsSaving(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }, 800);
  };

  // Delete saved letter
  // BACKEND: Replace with DELETE /api/letters/:id
  const handleDeleteLetter = (id, e) => {
    e.stopPropagation();
    setSavedLetters(prev => prev.filter(l => l.id !== id));
    if (selectedLetter?.id === id) setSelectedLetter(null);
  };

  const handlePrint = () => window.print();

  return (
    <div className="bg-gray-50 p-4 md:p-8 min-h-screen">

      {/* ── HEADER ── */}
      <div className="mb-8 flex flex-col md:flex-row md:justify-between md:items-end gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-gray-800">Smart Document Generator</h2>
          <p className="text-gray-500 text-sm mt-1">
            Draft, save, and print official college letters instantly.
          </p>
        </div>

        {/* Compose | History toggle */}
        <div className="flex bg-white rounded-xl p-1 shadow-sm border border-gray-200 w-max">
          <button
            onClick={() => setActiveView('compose')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold
                        transition-all ${activeView === 'compose'
                          ? 'bg-blue-800 text-white shadow-md'
                          : 'text-gray-500 hover:bg-gray-50'}`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Compose
          </button>
          <button
            onClick={() => setActiveView('history')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold
                        transition-all ${activeView === 'history'
                          ? 'bg-blue-800 text-white shadow-md'
                          : 'text-gray-500 hover:bg-gray-50'}`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
            </svg>
            My Letters
            {savedLetters.length > 0 && (
              <span className={`text-xs rounded-full px-2 py-0.5 font-bold ${
                activeView === 'history'
                  ? 'bg-white/20 text-white'
                  : 'bg-gray-100 text-gray-600'
              }`}>
                {savedLetters.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* ══════════════════════════════════════════
          VIEW 1: COMPOSE
      ══════════════════════════════════════════ */}
      {activeView === 'compose' && (
        <div className="flex flex-col xl:flex-row gap-8">

          {/* Left: Form */}
          <div className="xl:w-1/3 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-max">
            <h3 className="text-base font-bold text-gray-800 mb-5 pb-4 border-b border-gray-100">
              Letter Details
            </h3>

            <div className="space-y-5">

              {/* Document type */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Document Type</label>
                <select
                  value={letterType}
                  onChange={e => setLetterType(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2
                             focus:ring-blue-500 focus:outline-none bg-gray-50 font-semibold
                             text-gray-700 transition"
                >
                  <option value="leave">Leave Application</option>
                  <option value="bonafide">Bonafide Certificate Request</option>
                  <option value="event">Event/Hackathon Permission</option>
                </select>
              </div>

              {/* Reason */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  {letterType === 'leave'    ? 'Reason for Leave'        :
                   letterType === 'bonafide' ? 'Purpose of Certificate'  :
                                              'Event Name & Details'}
                </label>
                <textarea
                  value={reason}
                  onChange={e => setReason(e.target.value)}
                  placeholder="Type here..."
                  rows="3"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2
                             focus:ring-blue-500 focus:outline-none bg-gray-50 resize-none transition"
                />
              </div>

              {/* Date range (only for leave and event) */}
              {(letterType === 'leave' || letterType === 'event') && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">From Date</label>
                    <input type="date" value={startDate}
                      onChange={e => setStartDate(e.target.value)}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-xl text-sm
                                 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">To Date</label>
                    <input type="date" value={endDate}
                      onChange={e => setEndDate(e.target.value)}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-xl text-sm
                                 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50" />
                  </div>
                </div>
              )}

              {/* Action buttons */}
              <div className="pt-4 border-t border-gray-100 space-y-3">

                {/* Save to account */}
                <button
                  onClick={handleSaveLetter}
                  disabled={isSaving}
                  className="w-full bg-blue-800 hover:bg-blue-900 disabled:opacity-70 text-white
                             px-5 py-3 rounded-xl font-bold transition-colors flex items-center
                             justify-center gap-2 shadow-sm"
                >
                  {isSaving ? (
                    <>
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      Saving...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                          d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                      </svg>
                      Save to My Letters
                    </>
                  )}
                </button>

                {/* Success message */}
                {saveSuccess && (
                  <div className="flex items-center gap-2 bg-green-50 border border-green-200
                                  rounded-xl px-4 py-2.5 text-green-700">
                    <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-sm font-bold">Saved to My Letters!</span>
                  </div>
                )}

                {/* Print */}
                <button
                  onClick={handlePrint}
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 px-5 py-3
                             rounded-xl font-bold transition-colors flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                      d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                  </svg>
                  Print / Save PDF
                </button>
              </div>
            </div>
          </div>

          {/* Right: Live preview */}
          <div className="xl:w-2/3">
            <h3 className="text-base font-bold text-gray-700 mb-4">Live Preview</h3>
            <LetterPreview
              student={student}
              letterType={letterType}
              reason={reason}
              startDate={startDate}
              endDate={endDate}
            />
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════
          VIEW 2: HISTORY
      ══════════════════════════════════════════ */}
      {activeView === 'history' && (
        <div className="flex flex-col xl:flex-row gap-8">

          {/* Left: Saved letters list */}
          <div className="xl:w-1/3 space-y-3">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              {savedLetters.length} saved letter{savedLetters.length !== 1 ? 's' : ''}
            </p>

            {savedLetters.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-sm">
                <p className="text-4xl mb-3">📭</p>
                <p className="font-bold text-gray-600">No saved letters yet.</p>
                <p className="text-sm text-gray-400 mt-1">
                  Compose a letter and save it to your account.
                </p>
                <button
                  onClick={() => setActiveView('compose')}
                  className="mt-4 text-blue-700 font-bold text-sm hover:underline"
                >
                  Compose now →
                </button>
              </div>
            ) : (
              savedLetters.map(letter => (
                <div
                  key={letter.id}
                  onClick={() => setSelectedLetter(letter)}
                  className={`bg-white rounded-xl border p-4 cursor-pointer transition-all shadow-sm
                              hover:shadow-md ${
                    selectedLetter?.id === letter.id
                      ? 'border-blue-500 ring-2 ring-blue-100'
                      : 'border-gray-100 hover:border-gray-200'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full border
                                     ${LETTER_TYPES[letter.type].color}`}>
                      {LETTER_TYPES[letter.type].label}
                    </span>
                    <button
                      onClick={e => handleDeleteLetter(letter.id, e)}
                      className="text-gray-300 hover:text-red-500 transition-colors ml-2 shrink-0"
                      title="Delete letter"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                  <p className="text-sm font-semibold text-gray-700 truncate">{letter.reason}</p>
                  {letter.startDate && letter.endDate && (
                    <p className="text-xs text-gray-400 mt-1">
                      {letter.startDate} → {letter.endDate}
                    </p>
                  )}
                  <p className="text-xs text-gray-300 mt-2 font-medium">Saved {letter.createdAt}</p>
                </div>
              ))
            )}
          </div>

          {/* Right: Preview of selected letter */}
          <div className="xl:w-2/3">
            {selectedLetter ? (
              <>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className={`text-xs font-bold px-3 py-1.5 rounded-full border
                                     ${LETTER_TYPES[selectedLetter.type].color}`}>
                      {LETTER_TYPES[selectedLetter.type].label}
                    </span>
                    <span className="text-sm text-gray-400 font-medium">
                      Saved on {selectedLetter.createdAt}
                    </span>
                  </div>
                  <button
                    onClick={handlePrint}
                    className="flex items-center gap-2 bg-blue-800 hover:bg-blue-900 text-white
                               px-4 py-2 rounded-lg text-sm font-bold transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                        d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                    </svg>
                    Print
                  </button>
                </div>
                <LetterPreview student={student} opts={selectedLetter} />
              </>
            ) : (
              <div className="bg-white rounded-2xl border border-gray-100 h-80
                              flex flex-col items-center justify-center text-center
                              text-gray-400 shadow-sm gap-3 p-8">
                <svg className="w-12 h-12 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="font-semibold text-gray-500">Select a letter to preview it here</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Print CSS — hides sidebar and shows only the letter */}
      <style>{`
        @media print {
          body * { visibility: hidden; }
          #printable-letter, #printable-letter * { visibility: visible; }
          #printable-letter {
            position: absolute; left: 0; top: 0; width: 100%;
            border: none; box-shadow: none; padding: 2rem;
          }
        }
      `}</style>
    </div>
  );
};

export default Letters;