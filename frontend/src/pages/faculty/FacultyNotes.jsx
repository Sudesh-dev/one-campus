import React, { useState, useRef } from 'react';

// BACKEND: Notes uploaded here are visible to students matching sem + branch in Notices/Study Materials.
// Student portal should GET /api/notes?sem=<sem>&branch=<branch> to show relevant notes.

const SEMESTERS = [1, 2, 3, 4, 5, 6, 7, 8];
const BRANCHES  = ['CSE', 'ISE', 'ECE', 'EEE', 'ME', 'CE', 'CH'];
const SUBJECTS  = {
  'CSE-6': ['Machine Learning (BCS602)', 'Cloud Computing (BCS601)', 'Blockchain Technology (BCS613A)', 'Computer Networks (BCS502)', 'Compiler Design (BCS613C)'],
  'CSE-4': ['Design & Analysis of Algorithms (BCS401)', 'Microcontrollers (BCS402)', 'Operating Systems (BCS403)'],
  'CSE-5': ['Software Engineering (BCS501)', 'Computer Networks (BCS502)', 'Database Management Systems (BCS503)'],
  // BACKEND: Populate this map with all sem/branch combinations from VTU syllabus
  default: ['General / Other'],
};

const getSubjects = (branch, sem) => SUBJECTS[`${branch}-${sem}`] || SUBJECTS.default;

const FILE_TYPE_ICON = {
  pdf:  { icon: '📄', color: 'text-red-500 bg-red-50'    },
  pptx: { icon: '📊', color: 'text-orange-500 bg-orange-50' },
  docx: { icon: '📝', color: 'text-blue-500 bg-blue-50'  },
  zip:  { icon: '📦', color: 'text-gray-500 bg-gray-100' },
  default: { icon: '📁', color: 'text-gray-400 bg-gray-50' },
};

const getFileIcon = (name) => {
  const ext = name.split('.').pop()?.toLowerCase();
  return FILE_TYPE_ICON[ext] || FILE_TYPE_ICON.default;
};

const formatSize = (bytes) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const FacultyNotes = () => {
  const [activeView,   setActiveView]   = useState('uploaded'); // 'uploaded' | 'upload'
  const [sem,          setSem]          = useState('');
  const [branch,       setBranch]       = useState('');
  const [subject,      setSubject]      = useState('');
  const [title,        setTitle]        = useState('');
  const [description,  setDescription]  = useState('');
  const [file,         setFile]         = useState(null);
  const [isUploading,  setIsUploading]  = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const fileRef = useRef(null);

  // Filter for uploaded notes list
  const [filterSem,    setFilterSem]    = useState('');
  const [filterBranch, setFilterBranch] = useState('');

  // BACKEND: GET /api/notes?facultyId=<id> → returns all notes uploaded by this faculty
  const [uploadedNotes, setUploadedNotes] = useState([
    {
      id: 1, title: 'Unit 1 — ML Foundations', subject: 'Machine Learning (BCS602)',
      sem: 6, branch: 'CSE', description: 'Intro to supervised learning, regression, classification.',
      fileName: 'ML_Unit1_Notes.pdf', fileSize: 2400000, uploadedOn: '01/04/2026',
    },
    {
      id: 2, title: 'CNN Architectures Slides', subject: 'Machine Learning (BCS602)',
      sem: 6, branch: 'CSE', description: 'ResNet, VGG, EfficientNet — lecture slides.',
      fileName: 'CNN_Slides.pptx', fileSize: 5100000, uploadedOn: '28/03/2026',
    },
    {
      id: 3, title: 'AWS EC2 & S3 Lab Manual', subject: 'Cloud Computing (BCS601)',
      sem: 6, branch: 'CSE', description: 'Step-by-step lab guide for AWS practical exam.',
      fileName: 'AWS_Lab_Manual.pdf', fileSize: 1800000, uploadedOn: '25/03/2026',
    },
  ]);

  const subjectOptions = branch && sem ? getSubjects(branch, Number(sem)) : [];

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    if (f) setFile(f);
  };

  const resetForm = () => {
    setSem(''); setBranch(''); setSubject(''); setTitle(''); setDescription('');
    setFile(null);
    if (fileRef.current) fileRef.current.value = '';
  };

  // BACKEND: POST /api/notes (multipart/form-data)
  // Fields: title, description, subject, sem, branch, file
  // After upload, students with matching sem+branch see this in their portal
  const handleUpload = () => {
    if (!title || !sem || !branch || !subject || !file) return;
    setIsUploading(true);
    setTimeout(() => {
      const newNote = {
        id:          Date.now(),
        title,       subject,
        sem:         Number(sem),
        branch,      description,
        fileName:    file.name,
        fileSize:    file.size,
        uploadedOn:  new Date().toLocaleDateString('en-GB'),
      };
      setUploadedNotes(prev => [newNote, ...prev]);
      setIsUploading(false);
      setUploadSuccess(true);
      setTimeout(() => { setUploadSuccess(false); resetForm(); setActiveView('uploaded'); }, 1500);
    }, 900);
  };

  // BACKEND: DELETE /api/notes/:id
  const handleDelete = (id) => setUploadedNotes(prev => prev.filter(n => n.id !== id));

  const filteredNotes = uploadedNotes.filter(n =>
    (!filterSem    || n.sem    === Number(filterSem)) &&
    (!filterBranch || n.branch === filterBranch)
  );

  const canUpload = title && sem && branch && subject && file && !isUploading;

  return (
    <div className="bg-gray-50 p-4 md:p-8 min-h-screen">

      <div className="mb-8 flex flex-col md:flex-row md:justify-between md:items-end gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-gray-800">Upload Notes</h2>
          <p className="text-gray-500 text-sm mt-1">
            Upload study materials — only students of the matching semester & branch can see them.
          </p>
        </div>

        <div className="flex bg-white rounded-xl p-1 shadow-sm border border-gray-200 w-max">
          {[
            { id: 'uploaded', label: `My Uploads (${uploadedNotes.length})` },
            { id: 'upload',   label: '+ Upload New' },
          ].map(v => (
            <button key={v.id} onClick={() => setActiveView(v.id)}
              className={`px-5 py-2.5 rounded-lg text-sm font-bold transition-all ${
                activeView === v.id ? 'bg-blue-800 text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'
              }`}>
              {v.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── UPLOAD VIEW ── */}
      {activeView === 'upload' && (
        <div className="max-w-2xl">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-5">
            <h3 className="text-base font-bold text-gray-700 pb-4 border-b border-gray-100">
              Note Details
            </h3>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">Title *</label>
              <input value={title} onChange={e => setTitle(e.target.value)}
                placeholder="e.g. Unit 3 — Neural Networks"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2
                           focus:ring-blue-500 focus:outline-none bg-gray-50 text-gray-800" />
            </div>

            {/* Scope: Sem + Branch */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">
                  Semester *
                  <span className="text-xs font-normal text-gray-400 ml-1">(who can see this)</span>
                </label>
                <select value={sem} onChange={e => { setSem(e.target.value); setSubject(''); }}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2
                             focus:ring-blue-500 focus:outline-none bg-gray-50 font-semibold text-gray-700">
                  <option value="">— Semester —</option>
                  {SEMESTERS.map(s => <option key={s} value={s}>Semester {s}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">
                  Branch *
                </label>
                <select value={branch} onChange={e => { setBranch(e.target.value); setSubject(''); }}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2
                             focus:ring-blue-500 focus:outline-none bg-gray-50 font-semibold text-gray-700">
                  <option value="">— Branch —</option>
                  {BRANCHES.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>
            </div>

            {/* Scope info banner */}
            {sem && branch && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 flex items-start gap-2">
                <svg className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm text-blue-800 font-medium">
                  This note will be visible only to <strong>Semester {sem} {branch}</strong> students.
                </p>
              </div>
            )}

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">Subject *</label>
              <select value={subject} onChange={e => setSubject(e.target.value)}
                disabled={!sem || !branch}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2
                           focus:ring-blue-500 focus:outline-none bg-gray-50 font-semibold text-gray-700
                           disabled:opacity-50 disabled:cursor-not-allowed">
                <option value="">— Select Subject —</option>
                {subjectOptions.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">Description</label>
              <textarea value={description} onChange={e => setDescription(e.target.value)}
                placeholder="Brief summary of what's covered in this material..."
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2
                           focus:ring-blue-500 focus:outline-none bg-gray-50 resize-none text-gray-800 text-sm" />
            </div>

            {/* File drop zone */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">
                File * <span className="text-xs font-normal text-gray-400">(PDF, PPTX, DOCX, ZIP — max 50 MB)</span>
              </label>
              <div
                onClick={() => fileRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
                  file ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
                }`}
              >
                {file ? (
                  <div className="flex items-center justify-center gap-3">
                    <span className={`text-2xl p-2 rounded-lg ${getFileIcon(file.name).color}`}>
                      {getFileIcon(file.name).icon}
                    </span>
                    <div className="text-left">
                      <p className="font-bold text-gray-800 text-sm">{file.name}</p>
                      <p className="text-xs text-gray-400">{formatSize(file.size)}</p>
                    </div>
                    <button type="button" onClick={e => { e.stopPropagation(); setFile(null); }}
                      className="ml-4 text-gray-300 hover:text-red-500 transition">✕</button>
                  </div>
                ) : (
                  <div>
                    <p className="text-3xl mb-2">📁</p>
                    <p className="font-semibold text-gray-600 text-sm">Click to select file</p>
                    <p className="text-xs text-gray-400 mt-1">or drag and drop here</p>
                  </div>
                )}
              </div>
              <input ref={fileRef} type="file" onChange={handleFileChange} className="hidden"
                accept=".pdf,.pptx,.ppt,.docx,.doc,.zip" />
            </div>

            {/* Upload button */}
            <button onClick={handleUpload} disabled={!canUpload}
              className="w-full bg-blue-800 hover:bg-blue-900 disabled:opacity-50 text-white font-bold
                         py-3 rounded-xl transition flex items-center justify-center gap-2">
              {isUploading ? (
                <><svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>Uploading...</>
              ) : uploadSuccess ? (
                '✅ Uploaded! Redirecting...'
              ) : (
                <><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>Upload Note</>
              )}
            </button>
          </div>
        </div>
      )}

      {/* ── UPLOADED NOTES LIST ── */}
      {activeView === 'uploaded' && (
        <div className="space-y-5">

          {/* Filters */}
          <div className="flex gap-3 flex-wrap">
            <select value={filterSem} onChange={e => setFilterSem(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-xl text-sm font-semibold text-gray-700
                         bg-white focus:outline-none focus:ring-2 focus:ring-blue-400">
              <option value="">All Semesters</option>
              {SEMESTERS.map(s => <option key={s} value={s}>Semester {s}</option>)}
            </select>
            <select value={filterBranch} onChange={e => setFilterBranch(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-xl text-sm font-semibold text-gray-700
                         bg-white focus:outline-none focus:ring-2 focus:ring-blue-400">
              <option value="">All Branches</option>
              {BRANCHES.map(b => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>

          {filteredNotes.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center shadow-sm">
              <p className="text-4xl mb-3">📭</p>
              <p className="font-bold text-gray-600">No notes uploaded yet.</p>
              <button onClick={() => setActiveView('upload')}
                className="mt-4 text-blue-700 font-bold text-sm hover:underline">
                Upload your first note →
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredNotes.map(note => {
                const fi = getFileIcon(note.fileName);
                return (
                  <div key={note.id}
                    className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5
                               hover:shadow-md transition-all group relative">

                    {/* Delete */}
                    <button onClick={() => handleDelete(note.id)}
                      className="absolute top-4 right-4 text-gray-200 hover:text-red-500
                                 transition opacity-0 group-hover:opacity-100">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>

                    {/* File icon + title */}
                    <div className="flex items-start gap-3 mb-3">
                      <div className={`text-xl p-2.5 rounded-xl shrink-0 ${fi.color}`}>
                        {fi.icon}
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-gray-800 text-sm leading-tight truncate pr-6">
                          {note.title}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5 truncate">{note.subject}</p>
                      </div>
                    </div>

                    {/* Scope badge */}
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xs font-bold bg-blue-100 text-blue-800 px-2.5 py-1
                                       rounded-full border border-blue-200">
                        Sem {note.sem} · {note.branch}
                      </span>
                    </div>

                    {note.description && (
                      <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 mb-3">
                        {note.description}
                      </p>
                    )}

                    {/* File info footer */}
                    <div className="flex items-center justify-between border-t border-gray-100 pt-3 mt-1">
                      <div>
                        <p className="text-xs font-semibold text-gray-500 truncate max-w-30">
                          {note.fileName}
                        </p>
                        <p className="text-xs text-gray-400">{formatSize(note.fileSize)}</p>
                      </div>
                      <p className="text-xs text-gray-300 font-medium">{note.uploadedOn}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FacultyNotes;