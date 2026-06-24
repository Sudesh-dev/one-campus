import React, { useState } from 'react';

const CATEGORIES = ['Overall College', 'Departmental', 'Class', 'Exams', 'Events', 'Fests'];
const COLOR_THEMES = ['blue', 'purple', 'green', 'red', 'orange', 'teal'];

const THEME_PREVIEW = {
  blue:   'bg-blue-50 border-blue-500 text-blue-900',
  purple: 'bg-purple-50 border-purple-500 text-purple-900',
  green:  'bg-green-50 border-green-500 text-green-900',
  red:    'bg-red-50 border-red-500 text-red-900',
  orange: 'bg-orange-50 border-orange-500 text-orange-900',
  teal:   'bg-teal-50 border-teal-500 text-teal-900',
};

const THEME_BADGE = {
  blue:   'bg-blue-200 text-blue-800',
  purple: 'bg-purple-200 text-purple-800',
  green:  'bg-green-200 text-green-800',
  red:    'bg-red-200 text-red-800',
  orange: 'bg-orange-200 text-orange-800',
  teal:   'bg-teal-200 text-teal-800',
};

const FacultyNotices = () => {
  const [activeView, setActiveView] = useState('list'); // 'list' | 'compose'

  // Form state
  const [title,      setTitle]      = useState('');
  const [category,   setCategory]   = useState('Departmental');
  const [content,    setContent]    = useState('');
  const [hashtag,    setHashtag]    = useState('');
  const [hashtags,   setHashtags]   = useState([]);
  const [theme,      setTheme]      = useState('blue');
  const [isPinned,   setIsPinned]   = useState(false);
  const [isPosting,  setIsPosting]  = useState(false);

  // BACKEND: GET /api/notices?postedBy=<facultyId>
  const [myNotices, setMyNotices] = useState([
    {
      id: 1, title: 'AI Buildathon 2026 Registration',
      category: 'Events',
      content: 'All 6th-semester CSE students must register for the Buildathon. Deadline: Tomorrow 5 PM.',
      hashtags: ['#Buildathon', '#Hackathon'],
      author: 'Dr. Priya Sharma',
      time: '2 hours ago',
      colorTheme: 'blue',
      isPinned: true,
    },
    {
      id: 2, title: 'Cloud Computing Lab Internal Schedule',
      category: 'Exams',
      content: 'Lab internals for 6th-semester students will be held next Wednesday. Records must be signed.',
      hashtags: ['#Internals', '#CloudComputing'],
      author: 'Dr. Priya Sharma',
      time: '2 days ago',
      colorTheme: 'green',
      isPinned: false,
    },
  ]);

  const addHashtag = () => {
    const tag = hashtag.trim().startsWith('#') ? hashtag.trim() : `#${hashtag.trim()}`;
    if (tag !== '#' && !hashtags.includes(tag)) {
      setHashtags(prev => [...prev, tag]);
    }
    setHashtag('');
  };

  const removeHashtag = (tag) => setHashtags(prev => prev.filter(t => t !== tag));

  // BACKEND: POST /api/notices  { title, category, content, hashtags, colorTheme, isPinned }
  const handlePost = () => {
    if (!title.trim() || !content.trim()) return;
    setIsPosting(true);
    setTimeout(() => {
      const newNotice = {
        id:         Date.now(),
        title:      title.trim(),
        category,
        content:    content.trim(),
        hashtags,
        author:     'Dr. Priya Sharma',
        time:       'Just now',
        colorTheme: theme,
        isPinned,
      };
      setMyNotices(prev => [newNotice, ...prev]);
      setIsPosting(false);
      // Reset form
      setTitle(''); setContent(''); setHashtags([]); setHashtag('');
      setTheme('blue'); setIsPinned(false); setCategory('Departmental');
      setActiveView('list');
    }, 600);
  };

  // BACKEND: DELETE /api/notices/:id
  const handleDelete = (id) => setMyNotices(prev => prev.filter(n => n.id !== id));

  const canPost = title.trim() && content.trim();

  return (
    <div className="bg-gray-50 p-4 md:p-8 min-h-screen">

      <div className="mb-8 flex flex-col md:flex-row md:justify-between md:items-end gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-gray-800">Post Notices</h2>
          <p className="text-gray-500 text-sm mt-1">Publish announcements visible to your students.</p>
        </div>

        <div className="flex bg-white rounded-xl p-1 shadow-sm border border-gray-200 w-max">
          {[
            { id: 'list',    label: `My Notices (${myNotices.length})` },
            { id: 'compose', label: '+ New Notice' },
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

      {/* ── COMPOSE VIEW ── */}
      {activeView === 'compose' && (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">

          {/* Form */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-5">
            <h3 className="text-base font-bold text-gray-700 pb-3 border-b border-gray-100">
              Notice Details
            </h3>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">Title *</label>
              <input value={title} onChange={e => setTitle(e.target.value)}
                placeholder="e.g. Cloud Computing Internal Schedule"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2
                           focus:ring-blue-500 focus:outline-none bg-gray-50 text-gray-800" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">Category</label>
                <select value={category} onChange={e => setCategory(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2
                             focus:ring-blue-500 focus:outline-none bg-gray-50 font-semibold text-gray-700">
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">Color Theme</label>
                <div className="flex gap-2 flex-wrap pt-1">
                  {COLOR_THEMES.map(t => (
                    <button key={t} type="button" onClick={() => setTheme(t)}
                      title={t}
                      className={`w-7 h-7 rounded-full border-2 transition-all ${
                        theme === t ? 'scale-125 border-gray-800' : 'border-transparent'
                      } bg-${t}-500`}
                      style={{ backgroundColor:
                        t === 'blue' ? '#3b82f6' : t === 'purple' ? '#a855f7' :
                        t === 'green' ? '#22c55e' : t === 'red' ? '#ef4444' :
                        t === 'orange' ? '#f97316' : '#14b8a6' }}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">Content *</label>
              <textarea value={content} onChange={e => setContent(e.target.value)}
                placeholder="Write the notice content here..."
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2
                           focus:ring-blue-500 focus:outline-none bg-gray-50 resize-none text-gray-800" />
            </div>

            {/* Hashtags */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">Hashtags</label>
              <div className="flex gap-2">
                <input value={hashtag} onChange={e => setHashtag(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addHashtag())}
                  placeholder="#Exams"
                  className="flex-1 px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2
                             focus:ring-blue-500 focus:outline-none bg-gray-50 text-sm" />
                <button type="button" onClick={addHashtag}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold px-4 rounded-xl
                             text-sm transition">
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {hashtags.map(tag => (
                  <span key={tag}
                    className="text-xs font-bold bg-blue-100 text-blue-800 px-2.5 py-1 rounded-md
                               flex items-center gap-1">
                    {tag}
                    <button onClick={() => removeHashtag(tag)} className="hover:text-red-500 ml-0.5">✕</button>
                  </span>
                ))}
              </div>
            </div>

            {/* Pin toggle */}
            <label className="flex items-center gap-3 cursor-pointer select-none">
              <div
                onClick={() => setIsPinned(!isPinned)}
                className={`w-11 h-6 rounded-full transition-colors relative ${isPinned ? 'bg-blue-600' : 'bg-gray-300'}`}
              >
                <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${isPinned ? 'left-5' : 'left-0.5'}`} />
              </div>
              <span className="text-sm font-bold text-gray-700">Pin this notice to top</span>
            </label>

            {/* Post button */}
            <button onClick={handlePost} disabled={!canPost || isPosting}
              className="w-full bg-blue-800 hover:bg-blue-900 disabled:opacity-50 text-white font-bold
                         py-3 rounded-xl transition flex items-center justify-center gap-2">
              {isPosting ? (
                <><svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>Posting...</>
              ) : '📢 Post Notice'}
            </button>
          </div>

          {/* Live preview */}
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Live Preview</p>
            <div className={`border-l-4 p-5 rounded-r-xl shadow-sm ${THEME_PREVIEW[theme]}`}>
              {isPinned && (
                <span className="text-xs font-bold bg-yellow-100 text-yellow-800 px-2 py-0.5
                                 rounded-full border border-yellow-300 mb-2 inline-block">
                  📌 Pinned
                </span>
              )}
              <h3 className="font-bold text-lg">{title || 'Notice Title'}</h3>
              <span className={`inline-block text-xs font-bold uppercase tracking-wider px-2 py-0.5
                                rounded-md mb-2 mt-1 ${THEME_BADGE[theme]}`}>
                {category}
              </span>
              <p className="text-sm opacity-90 my-2 leading-relaxed">
                {content || 'Notice content will appear here...'}
              </p>
              <div className="flex flex-wrap gap-2 mb-3">
                {hashtags.map(tag => (
                  <span key={tag} className="text-xs font-bold bg-white/50 px-2 py-0.5 rounded-md">
                    {tag}
                  </span>
                ))}
              </div>
              <div className="flex justify-between text-xs font-medium opacity-75 border-t border-black/10 pt-2">
                <span>Posted by: Dr. Priya Sharma</span>
                <span>Just now</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── LIST VIEW ── */}
      {activeView === 'list' && (
        <div className="space-y-4">
          {myNotices.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center shadow-sm">
              <p className="text-4xl mb-3">📭</p>
              <p className="font-bold text-gray-600">No notices posted yet.</p>
              <button onClick={() => setActiveView('compose')}
                className="mt-4 text-blue-700 font-bold text-sm hover:underline">
                Post your first notice →
              </button>
            </div>
          ) : (
            myNotices
              .sort((a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0))
              .map(notice => (
                <div key={notice.id}
                  className={`border-l-4 p-5 rounded-r-xl shadow-sm relative ${THEME_PREVIEW[notice.colorTheme]}`}>
                  {notice.isPinned && (
                    <span className="absolute top-3 right-12 text-xs font-bold bg-yellow-100
                                     text-yellow-800 px-2 py-0.5 rounded-full border border-yellow-300">
                      📌 Pinned
                    </span>
                  )}
                  {/* Delete button */}
                  <button onClick={() => handleDelete(notice.id)}
                    title="Delete notice"
                    className="absolute top-3 right-3 text-gray-300 hover:text-red-500 transition">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>

                  <h3 className="font-bold text-lg pr-20">{notice.title}</h3>
                  <span className={`inline-block text-xs font-bold uppercase tracking-wider
                                    px-2 py-0.5 rounded-md mb-2 mt-1 ${THEME_BADGE[notice.colorTheme]}`}>
                    {notice.category}
                  </span>
                  <p className="text-sm opacity-90 my-2 leading-relaxed">{notice.content}</p>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {notice.hashtags.map(tag => (
                      <span key={tag} className="text-xs font-bold bg-white/50 px-2 py-0.5 rounded-md">{tag}</span>
                    ))}
                  </div>
                  <div className="flex justify-between text-xs font-medium opacity-75 border-t border-black/10 pt-2">
                    <span>Posted by: {notice.author}</span>
                    <span>{notice.time}</span>
                  </div>
                </div>
              ))
          )}
        </div>
      )}
    </div>
  );
};

export default FacultyNotices;