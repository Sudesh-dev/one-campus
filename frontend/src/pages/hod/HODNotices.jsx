// ── HODNotices.jsx ────────────────────────────────────────────
// HOD can post department-wide notices (same pattern as FacultyNotices but scoped to whole dept)
import React, { useState } from 'react';

const THEME_PREVIEW = {
  blue: 'bg-blue-50 border-blue-500 text-blue-900', purple: 'bg-purple-50 border-purple-500 text-purple-900',
  green: 'bg-green-50 border-green-500 text-green-900', red: 'bg-red-50 border-red-500 text-red-900',
  orange: 'bg-orange-50 border-orange-500 text-orange-900', teal: 'bg-teal-50 border-teal-500 text-teal-900',
};
const THEME_BADGE = {
  blue: 'bg-blue-200 text-blue-800', purple: 'bg-purple-200 text-purple-800',
  green: 'bg-green-200 text-green-800', red: 'bg-red-200 text-red-800',
  orange: 'bg-orange-200 text-orange-800', teal: 'bg-teal-200 text-teal-800',
};

const CATEGORIES = ['Overall College', 'Departmental', 'Exams', 'Events', 'Fests', 'Placement'];
const COLOR_THEMES = ['blue', 'purple', 'green', 'red', 'orange', 'teal'];

const HODNotices = () => {
  const [activeView, setActiveView] = useState('list');
  const [title,      setTitle]      = useState('');
  const [category,   setCategory]   = useState('Departmental');
  const [content,    setContent]    = useState('');
  const [hashtag,    setHashtag]    = useState('');
  const [hashtags,   setHashtags]   = useState([]);
  const [theme,      setTheme]      = useState('purple');
  const [isPinned,   setIsPinned]   = useState(false);
  const [isPosting,  setIsPosting]  = useState(false);

  // BACKEND: GET /api/notices?postedBy=<hodId>
  const [notices, setNotices] = useState([
    { id: 1, title: 'IA-2 Submission Deadline', category: 'Exams', content: 'All faculty must submit IA-2 marks to the department by April 15th, 2026. Students can view results after verification.', hashtags: ['#IA2', '#Marks'], author: 'HOD - CSE', time: '1 day ago', colorTheme: 'red', isPinned: true },
    { id: 2, title: 'Department Seminar on AI', category: 'Events', content: 'A department-wide seminar on Generative AI will be held on April 20th. Attendance is mandatory for all 6th sem students.', hashtags: ['#AI', '#Seminar'], author: 'HOD - CSE', time: '3 days ago', colorTheme: 'purple', isPinned: false },
  ]);

  const addHashtag = () => {
    const tag = hashtag.trim().startsWith('#') ? hashtag.trim() : `#${hashtag.trim()}`;
    if (tag !== '#' && !hashtags.includes(tag)) setHashtags(p => [...p, tag]);
    setHashtag('');
  };

  // BACKEND: POST /api/notices  { title, category, content, hashtags, colorTheme, isPinned, scope: 'department' }
  const handlePost = () => {
    if (!title.trim() || !content.trim()) return;
    setIsPosting(true);
    setTimeout(() => {
      setNotices(p => [{ id: Date.now(), title: title.trim(), category, content: content.trim(), hashtags, author: 'HOD - CSE', time: 'Just now', colorTheme: theme, isPinned }, ...p]);
      setIsPosting(false); setTitle(''); setContent(''); setHashtags([]); setHashtag('');
      setTheme('purple'); setIsPinned(false); setActiveView('list');
    }, 600);
  };

  return (
    <div className="bg-gray-50 p-4 md:p-8 min-h-screen">
      <div className="mb-8 flex flex-col md:flex-row md:justify-between md:items-end gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-gray-800">Department Notices</h2>
          <p className="text-gray-500 text-sm mt-1">Notices posted here are visible to all CSE students and faculty.</p>
        </div>
        <div className="flex bg-white rounded-xl p-1 shadow-sm border border-gray-200 w-max gap-1">
          {[{ id: 'list', label: `Notices (${notices.length})` }, { id: 'compose', label: '+ New Notice' }].map(v => (
            <button key={v.id} onClick={() => setActiveView(v.id)}
              className={`px-5 py-2.5 rounded-lg text-sm font-bold transition-all ${activeView === v.id ? 'bg-blue-800 text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}>
              {v.label}
            </button>
          ))}
        </div>
      </div>

      {activeView === 'compose' && (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-5">
            <h3 className="text-base font-bold text-gray-700 pb-3 border-b border-gray-100">Notice Details</h3>
            <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-3 flex items-center gap-2">
              <svg className="w-4 h-4 text-indigo-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <p className="text-xs text-indigo-800 font-semibold">This notice will be visible to all CSE department students and faculty.</p>
            </div>
            <div><label className="block text-sm font-bold text-gray-700 mb-1.5">Title *</label>
              <input value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Department Seminar on AI"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none bg-gray-50 text-gray-800" /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="block text-sm font-bold text-gray-700 mb-1.5">Category</label>
                <select value={category} onChange={e => setCategory(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none bg-gray-50 font-semibold text-gray-700">
                  {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select></div>
              <div><label className="block text-sm font-bold text-gray-700 mb-1.5">Color</label>
                <div className="flex gap-2 flex-wrap pt-2">
                  {COLOR_THEMES.map(t => (
                    <button key={t} type="button" onClick={() => setTheme(t)} title={t}
                      className={`w-7 h-7 rounded-full border-2 transition-all ${theme === t ? 'scale-125 border-gray-800' : 'border-transparent'}`}
                      style={{ backgroundColor: t === 'blue' ? '#3b82f6' : t === 'purple' ? '#a855f7' : t === 'green' ? '#22c55e' : t === 'red' ? '#ef4444' : t === 'orange' ? '#f97316' : '#14b8a6' }} />
                  ))}
                </div></div>
            </div>
            <div><label className="block text-sm font-bold text-gray-700 mb-1.5">Content *</label>
              <textarea value={content} onChange={e => setContent(e.target.value)} placeholder="Write the notice..." rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none bg-gray-50 resize-none text-gray-800 text-sm" /></div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">Hashtags</label>
              <div className="flex gap-2">
                <input value={hashtag} onChange={e => setHashtag(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addHashtag())} placeholder="#Department"
                  className="flex-1 px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none bg-gray-50 text-sm" />
                <button type="button" onClick={addHashtag} className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold px-4 rounded-xl text-sm transition">Add</button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {hashtags.map(tag => (
                  <span key={tag} className="text-xs font-bold bg-blue-100 text-blue-800 px-2.5 py-1 rounded-md flex items-center gap-1">
                    {tag}<button onClick={() => setHashtags(p => p.filter(t => t !== tag))} className="hover:text-red-500 ml-0.5">✕</button>
                  </span>
                ))}
              </div>
            </div>
            <label className="flex items-center gap-3 cursor-pointer">
              <div onClick={() => setIsPinned(!isPinned)} className={`w-11 h-6 rounded-full relative transition-colors ${isPinned ? 'bg-blue-600' : 'bg-gray-300'}`}>
                <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${isPinned ? 'left-5' : 'left-0.5'}`} />
              </div>
              <span className="text-sm font-bold text-gray-700">Pin this notice</span>
            </label>
            <button onClick={handlePost} disabled={!title.trim() || !content.trim() || isPosting}
              className="w-full bg-blue-800 hover:bg-blue-900 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition flex items-center justify-center gap-2">
              {isPosting ? '...' : '📢 Post Department Notice'}
            </button>
          </div>
          {/* Live preview */}
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Live Preview</p>
            <div className={`border-l-4 p-5 rounded-r-xl shadow-sm ${THEME_PREVIEW[theme]}`}>
              {isPinned && <span className="text-xs font-bold bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full border border-yellow-300 mb-2 inline-block">📌 Pinned</span>}
              <h3 className="font-bold text-lg">{title || 'Notice Title'}</h3>
              <span className={`inline-block text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-md mb-2 mt-1 ${THEME_BADGE[theme]}`}>{category}</span>
              <p className="text-sm opacity-90 my-2 leading-relaxed">{content || 'Notice content...'}</p>
              <div className="flex flex-wrap gap-2 mb-3">{hashtags.map(t => <span key={t} className="text-xs font-bold bg-white/50 px-2 py-0.5 rounded-md">{t}</span>)}</div>
              <div className="flex justify-between text-xs font-medium opacity-75 border-t border-black/10 pt-2">
                <span>HOD - CSE</span><span>Just now</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeView === 'list' && (
        <div className="space-y-4">
          {notices.sort((a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0)).map(n => (
            <div key={n.id} className={`border-l-4 p-5 rounded-r-xl shadow-sm relative ${THEME_PREVIEW[n.colorTheme]}`}>
              {n.isPinned && <span className="absolute top-3 right-10 text-xs font-bold bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full border border-yellow-300">📌 Pinned</span>}
              <button onClick={() => setNotices(p => p.filter(x => x.id !== n.id))} className="absolute top-3 right-3 text-gray-300 hover:text-red-500 transition">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
              </button>
              <h3 className="font-bold text-lg pr-16">{n.title}</h3>
              <span className={`inline-block text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-md mb-2 mt-1 ${THEME_BADGE[n.colorTheme]}`}>{n.category}</span>
              <p className="text-sm opacity-90 my-2 leading-relaxed">{n.content}</p>
              <div className="flex flex-wrap gap-2 mb-3">{n.hashtags.map(t => <span key={t} className="text-xs font-bold bg-white/50 px-2 py-0.5 rounded-md">{t}</span>)}</div>
              <div className="flex justify-between text-xs font-medium opacity-75 border-t border-black/10 pt-2"><span>{n.author}</span><span>{n.time}</span></div>
            </div>
          ))}
          {notices.length === 0 && <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center shadow-sm"><p className="text-4xl mb-3">📭</p><p className="font-bold text-gray-600">No notices posted yet.</p></div>}
        </div>
      )}
    </div>
  );
};

export default HODNotices;