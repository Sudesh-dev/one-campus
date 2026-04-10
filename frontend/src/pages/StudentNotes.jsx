import React, { useState } from 'react';

// BACKEND: GET /api/notes?sem=<studentSem>&branch=<studentBranch>
// Only returns notes where note.sem === student.sem AND note.branch === student.branch
// This filtering happens on the backend — student can only see their own sem+branch notes

const FILE_TYPE_ICON = {
  pdf:  { icon: '📄', color: 'text-red-500 bg-red-50'       },
  pptx: { icon: '📊', color: 'text-orange-500 bg-orange-50' },
  docx: { icon: '📝', color: 'text-blue-500 bg-blue-50'     },
  zip:  { icon: '📦', color: 'text-gray-500 bg-gray-100'    },
  default: { icon: '📁', color: 'text-gray-400 bg-gray-50'  },
};

const getFileIcon = (name) => {
  const ext = name?.split('.').pop()?.toLowerCase();
  return FILE_TYPE_ICON[ext] || FILE_TYPE_ICON.default;
};

const formatSize = (bytes) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

// Mock data — simulates what backend returns for Sem 6 CSE student
const STUDENT_NOTES = [
  {
    id: 1, title: 'Unit 1 — ML Foundations',
    subject: 'Machine Learning (BCS602)', faculty: 'Dr. Priya Sharma',
    sem: 6, branch: 'CSE',
    description: 'Introduction to supervised learning, regression, and classification algorithms.',
    fileName: 'ML_Unit1_Notes.pdf', fileSize: 2400000, uploadedOn: '01/04/2026',
    // BACKEND: fileUrl is a signed S3/GDrive URL returned by the backend
    fileUrl: '#',
  },
  {
    id: 2, title: 'CNN Architectures Slides',
    subject: 'Machine Learning (BCS602)', faculty: 'Dr. Priya Sharma',
    sem: 6, branch: 'CSE',
    description: 'ResNet, VGG, EfficientNet — lecture slides with visual explanations.',
    fileName: 'CNN_Slides.pptx', fileSize: 5100000, uploadedOn: '28/03/2026',
    fileUrl: '#',
  },
  {
    id: 3, title: 'AWS EC2 & S3 Lab Manual',
    subject: 'Cloud Computing (BCS601)', faculty: 'Dr. Priya Sharma',
    sem: 6, branch: 'CSE',
    description: 'Step-by-step lab guide for AWS practical exam — EC2, S3, Lambda.',
    fileName: 'AWS_Lab_Manual.pdf', fileSize: 1800000, uploadedOn: '25/03/2026',
    fileUrl: '#',
  },
  {
    id: 4, title: 'Compiler Design — LEX & YACC',
    subject: 'Compiler Design (BCS613C)', faculty: 'Prof. Anil Kumar',
    sem: 6, branch: 'CSE',
    description: 'Practical notes for writing lexical analyzers and parsers.',
    fileName: 'LEX_YACC_Notes.pdf', fileSize: 1200000, uploadedOn: '20/03/2026',
    fileUrl: '#',
  },
  {
    id: 5, title: 'Computer Networks — OSI Model',
    subject: 'Computer Networks (BCS502)', faculty: 'Prof. Anil Kumar',
    sem: 6, branch: 'CSE',
    description: 'Detailed notes on OSI layers, TCP/IP stack and subnetting.',
    fileName: 'CN_OSI_Notes.pdf', fileSize: 980000, uploadedOn: '15/03/2026',
    fileUrl: '#',
  },
];

// All unique subjects from notes
const ALL_SUBJECTS = ['All', ...new Set(STUDENT_NOTES.map(n => n.subject))];

const StudentNotes = () => {
  const [filterSubject, setFilterSubject] = useState('All');
  const [search,        setSearch]        = useState('');

  // BACKEND: studentSem and studentBranch come from auth context
  const student = { sem: 6, branch: 'CSE' };

  const filtered = STUDENT_NOTES
    .filter(n => filterSubject === 'All' || n.subject === filterSubject)
    .filter(n =>
      !search ||
      n.title.toLowerCase().includes(search.toLowerCase()) ||
      n.subject.toLowerCase().includes(search.toLowerCase()) ||
      n.faculty.toLowerCase().includes(search.toLowerCase())
    );

  return (
    <div className="bg-gray-50 p-4 md:p-8 min-h-screen">

      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-extrabold text-gray-800">Study Materials</h2>
        <p className="text-gray-500 text-sm mt-1">
          Notes uploaded by your faculty for{' '}
          <span className="font-bold text-blue-700">Sem {student.sem} · {student.branch}</span>.
        </p>
      </div>

      {/* Info banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 flex items-start gap-3">
        <svg className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-sm text-blue-800 font-medium">
          You can only see notes uploaded for <strong>Sem {student.sem} {student.branch}</strong>.
          Notes from other semesters or branches are not visible to you.
        </p>
      </div>

      {/* Search + Subject filter */}
      <div className="flex flex-col md:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
          </svg>
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search notes by title, subject or faculty..."
            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none
                       focus:ring-2 focus:ring-blue-500 bg-white text-sm" />
        </div>
      </div>

      {/* Subject filter pills */}
      <div className="flex overflow-x-auto gap-2 pb-3 mb-6 scrollbar-hide">
        {ALL_SUBJECTS.map(s => (
          <button key={s} onClick={() => setFilterSubject(s)}
            className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-semibold transition-all ${
              filterSubject === s ? 'bg-blue-800 text-white shadow-sm' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}>
            {s === 'All' ? `All (${STUDENT_NOTES.length})` : s.split('(')[0].trim()}
          </button>
        ))}
      </div>

      {/* Notes grid */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center shadow-sm">
          <p className="text-4xl mb-3">📭</p>
          <p className="font-bold text-gray-600">No notes found.</p>
          <p className="text-sm text-gray-400 mt-1">Try a different search or subject filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map(note => {
            const fi = getFileIcon(note.fileName);
            return (
              <div key={note.id}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5
                           hover:shadow-md transition-all">

                {/* File icon + title */}
                <div className="flex items-start gap-3 mb-3">
                  <div className={`text-xl p-2.5 rounded-xl shrink-0 ${fi.color}`}>{fi.icon}</div>
                  <div className="min-w-0">
                    <p className="font-bold text-gray-800 text-sm leading-tight">{note.title}</p>
                    <p className="text-xs text-gray-400 mt-0.5 truncate">{note.subject}</p>
                  </div>
                </div>

                {/* Faculty + date */}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-gray-500 flex items-center gap-1">
                    <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    {note.faculty}
                  </span>
                  <span className="text-xs text-gray-300 font-medium">{note.uploadedOn}</span>
                </div>

                {note.description && (
                  <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 mb-4">
                    {note.description}
                  </p>
                )}

                {/* File info + download */}
                <div className="flex items-center justify-between border-t border-gray-100 pt-3">
                  <div>
                    <p className="text-xs font-semibold text-gray-500 truncate max-w-30">{note.fileName}</p>
                    <p className="text-xs text-gray-400">{formatSize(note.fileSize)}</p>
                  </div>
                  {/* BACKEND: Replace href with signed download URL from backend */}
                  <a href={note.fileUrl}
                    className="flex items-center gap-1.5 bg-blue-800 hover:bg-blue-900 text-white
                               text-xs font-bold px-3 py-2 rounded-lg transition"
                    download>
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Download
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default StudentNotes;