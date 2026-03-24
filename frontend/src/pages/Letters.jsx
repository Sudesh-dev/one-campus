import React, { useState } from 'react';

const Letters = () => {
  // State for the form inputs
  const [letterType, setLetterType] = useState('leave');
  const [reason, setReason] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Mock student data (This will come from the backend later)
  const student = {
    name: "John Doe",
    usn: "1AP23CS019",
    sem: "6th Semester",
    branch: "Computer Science & Engineering",
    college: "APS College of Engineering"
  };

  const today = new Date().toLocaleDateString('en-GB'); // DD/MM/YYYY format

  // Dynamic Letter Content Generator
  const generateSubject = () => {
    if (letterType === 'leave') return 'Application for Leave of Absence';
    if (letterType === 'bonafide') return 'Requisition for Bonafide Certificate';
    if (letterType === 'event') return 'Permission to Attend Hackathon/Event';
    return '';
  };

  const generateBody = () => {
    if (letterType === 'leave') {
      return `With reference to the subject cited above, I, ${student.name}, bearing USN ${student.usn}, studying in ${student.sem} of ${student.branch}, request you to kindly grant me leave ${startDate && endDate ? `from ${startDate} to ${endDate}` : 'for the mentioned dates'}. The reason for my absence is ${reason || '[Your Reason Here]'}.\n\nI will ensure that I cover up the missed academic portions. Kindly approve my leave.`;
    }
    if (letterType === 'bonafide') {
      return `With reference to the subject cited above, I, ${student.name}, bearing USN ${student.usn}, am a bonafide student of ${student.college}, currently pursuing my B.E. in ${student.branch} (${student.sem}).\n\nI request you to kindly issue a Bonafide Certificate as it is required for ${reason || '[Purpose, e.g., Passport / Bank Loan / Scholarship]'}. I have cleared all my dues up to the current semester.`;
    }
    if (letterType === 'event') {
      return `With reference to the subject cited above, I, ${student.name} (${student.usn}) from ${student.sem} ${student.branch}, am writing to request permission to participate in ${reason || '[Event Name]'} scheduled ${startDate && endDate ? `from ${startDate} to ${endDate}` : 'on the mentioned dates'}.\n\nParticipating in this event will greatly enhance my practical knowledge and skills. I request you to grant me permission to attend and consider my absence as On-Duty (OD).`;
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-gray-50 p-4 md:p-8 min-h-screen">
      
      <div className="mb-8">
        <h2 className="text-3xl font-extrabold text-gray-800">Smart Document Generator</h2>
        <p className="text-gray-500 text-sm mt-1">Instantly draft and print official college letters.</p>
      </div>

      <div className="flex flex-col xl:flex-row gap-8">
        
        {/* LEFT COLUMN: Input Form */}
        <div className="xl:w-1/3 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-max">
          <h3 className="text-xl font-bold text-gray-800 mb-6 border-b pb-4">Letter Details</h3>
          
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Document Type</label>
              <select 
                value={letterType} 
                onChange={(e) => setLetterType(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-gray-50"
              >
                <option value="leave">Leave Application</option>
                <option value="bonafide">Bonafide Certificate Request</option>
                <option value="event">Event/Hackathon Permission</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {letterType === 'leave' ? 'Reason for Leave' : letterType === 'bonafide' ? 'Purpose of Certificate' : 'Event Name & Details'}
              </label>
              <textarea 
                value={reason} 
                onChange={(e) => setReason(e.target.value)}
                placeholder="Type here..."
                rows="3"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-gray-50 resize-none"
              ></textarea>
            </div>

            {(letterType === 'leave' || letterType === 'event') && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">From Date</label>
                  <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">To Date</label>
                  <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50" />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Live Preview */}
        <div className="xl:w-2/3 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-gray-700">Live Preview</h3>
            <button 
              onClick={handlePrint}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-bold transition-colors flex items-center gap-2 shadow-sm"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
              Print / Save PDF
            </button>
          </div>

          {/* The Actual "Paper" Sheet */}
          <div 
            id="printable-letter" 
            className="bg-white p-8 md:p-12 rounded-lg shadow-md border border-gray-200 text-gray-800 font-serif leading-relaxed mx-auto w-full"
            style={{ maxWidth: '800px', minHeight: '900px' }}
          >
            
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
                <p>{today}</p>
              </div>
            </div>

            <div className="mb-8">
              <p className="font-bold">To,</p>
              <p>The Head of Department,</p>
              <p>Department of {student.branch}</p>
              <p>{student.college}</p>
              <p>Bengaluru</p>
            </div>

            <p className="mb-6">Respected Sir/Madam,</p>

            <p className="font-bold mb-6 underline underline-offset-4">
              Subject: {generateSubject()}
            </p>

            <div className="mb-12 whitespace-pre-wrap text-justify">
              {generateBody()}
            </div>

            <p className="mb-12">Thanking you,</p>

            <div className="flex justify-between items-end mt-16">
              <div>
                <p className="font-bold mb-8">Yours obediently,</p>
                <p>(Signature)</p>
                <p className="font-bold mt-2">{student.name}</p>
              </div>
              
              {(letterType === 'leave' || letterType === 'event') && (
                <div className="text-center">
                  <p className="mb-8">(Signature of Parent/Guardian)</p>
                </div>
              )}
            </div>

          </div>
        </div>

      </div>

      {/* Hide the sidebar and nav when printing! */}
      <style>{`
        @media print {
          body * { visibility: hidden; }
          #printable-letter, #printable-letter * { visibility: visible; }
          #printable-letter { position: absolute; left: 0; top: 0; width: 100%; border: none; box-shadow: none; padding: 0; }
        }
      `}</style>
    </div>
  );
};

export default Letters;