import React, { useState } from 'react';

// ============================================================
// BACKEND INTEGRATION NOTE:
// Replace `allNotices` with an API call e.g.:
//   const [allNotices, setAllNotices] = useState([]);
//   useEffect(() => { fetch('/api/notices').then(...).then(setAllNotices) }, []);
//
// Each notice object shape expected from the backend:
// {
//   id: number,
//   title: string,
//   category: string,        // must match one of the `filters` array values
//   content: string,
//   hashtags: string[],
//   author: string,
//   time: string,            // e.g. "2 hours ago" or ISO timestamp
//   colorTheme: string,      // 'blue' | 'purple' | 'red' | 'green' | 'orange' | 'teal'
//   isPinned: boolean,       // pinned notices always appear at top
//   attachment: {            // null if no attachment
//     name: string,          // e.g. "Hall_Ticket_Instructions.pdf"
//     url: string            // public URL to the PDF file
//   } | null
// }
// ============================================================

const Notices = () => {

  // --- STATE ---
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery]   = useState('');
  const [selectedPDF, setSelectedPDF]   = useState(null);   // { name, url } — controls PDF modal
  const [readIds, setReadIds]           = useState(new Set()); // tracks which notice IDs are read

  // --- FILTER CATEGORIES ---
  const filters = ['All', 'Overall College', 'Departmental', 'Class', 'Exams', 'Events', 'Fests'];

  // --- MOCK DATA (replace with API call) ---
  const allNotices = [
    {
      id: 1,
      title: "AI Buildathon 2026 Registration",
      category: "Events",
      content: "All 6th-semester CSE students must register for the AI for Societal Good buildathon. Final teams need to be submitted by tomorrow 5 PM. Check the attached PDF for team formation rules.",
      hashtags: ["#Buildathon", "#OpenAI", "#Hackathon"],
      author: "HOD - CSE",
      time: "2 hours ago",
      colorTheme: "blue",
      isPinned: true,
      attachment: {
        name: "Buildathon_Rules.pdf",
        url: "https://www.w3.org/WAI/WCAG21/Techniques/pdf/PDF1.pdf" // placeholder — swap with real S3/GDrive URL
      }
    },
    {
      id: 2,
      title: "MEGAHERTZ Fest Schedule Live",
      category: "Fests",
      content: "The official MEGAHERTZ website is now up! Check out the one-page responsive site for the full lineup of cultural events and DJ nights.",
      hashtags: ["#MEGAHERTZ", "#CulturalFest", "#CampusLife"],
      author: "Cultural Committee",
      time: "5 hours ago",
      colorTheme: "purple",
      isPinned: false,
      attachment: null
    },
    {
      id: 3,
      title: "Fee Payment Reminder",
      category: "Overall College",
      content: "Please clear your pending dues for the current semester to download your hall ticket. Contact the admin office for details. The deadline circular is attached below.",
      hashtags: ["#Fees", "#Admin", "#Urgent"],
      author: "Admin Office",
      time: "1 day ago",
      colorTheme: "red",
      isPinned: true,
      attachment: {
        name: "Fee_Deadline_Circular.pdf",
        url: "https://www.w3.org/WAI/WCAG21/Techniques/pdf/PDF1.pdf"
      }
    },
    {
      id: 4,
      title: "Cloud Computing Lab Internals",
      category: "Exams",
      content: "The lab internals for 6th-semester students will be held next Wednesday. Ensure your records are signed. Refer to the attached schedule for slot timings.",
      hashtags: ["#Internals", "#Exams", "#CSE"],
      author: "Prof. Sharma",
      time: "2 days ago",
      colorTheme: "green",
      isPinned: false,
      attachment: {
        name: "Lab_Internal_Schedule.pdf",
        url: "https://www.w3.org/WAI/WCAG21/Techniques/pdf/PDF1.pdf"
      }
    },
    {
      id: 5,
      title: "TCS & Infosys Campus Drive",
      category: "Departmental",
      content: "Placement cell announces an off-campus drive for TCS and Infosys. Eligible students (CGPA ≥ 6.5, no active backlogs) must register by Friday. Brochure attached.",
      hashtags: ["#Placements", "#TCS", "#Infosys"],
      author: "Placement Cell",
      time: "3 days ago",
      colorTheme: "teal",
      isPinned: false,
      attachment: {
        name: "Placement_Drive_Brochure.pdf",
        url: "https://www.w3.org/WAI/WCAG21/Techniques/pdf/PDF1.pdf"
      }
    },
    {
      id: 6,
      title: "Holiday Notice — Rajyotsava",
      category: "Overall College",
      content: "The college will remain closed on November 1st on account of Karnataka Rajyotsava. All pending submissions and evaluations are rescheduled accordingly.",
      hashtags: ["#Holiday", "#KarnatakaRajyotsava"],
      author: "Principal's Office",
      time: "4 days ago",
      colorTheme: "orange",
      isPinned: false,
      attachment: null
    }
  ];

  // --- FILTERING LOGIC ---
  // Step 1: filter by category
  // Step 2: filter by search query (matches title or content, case-insensitive)
  // Step 3: pinned notices always float to the top
  const filteredNotices = allNotices
    .filter(n => activeFilter === 'All' || n.category === activeFilter)
    .filter(n => {
      const q = searchQuery.toLowerCase().trim();
      if (!q) return true;
      return (
        n.title.toLowerCase().includes(q) ||
        n.content.toLowerCase().includes(q) ||
        n.hashtags.some(tag => tag.toLowerCase().includes(q))
      );
    })
    .sort((a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0)); // pinned first

  // --- HELPERS ---

  // Mark a notice as read
  const markAsRead = (id) => {
    setReadIds(prev => new Set([...prev, id]));
  };

  // Open PDF modal and mark notice as read
  const openPDF = (notice) => {
    markAsRead(notice.id);
    setSelectedPDF(notice.attachment);
  };

  // Color theme map — kept identical to original code for consistency
  const getColors = (theme) => {
    switch (theme) {
      case 'purple': return 'bg-purple-50 border-purple-500 text-purple-900';
      case 'red':    return 'bg-red-50 border-red-500 text-red-900';
      case 'green':  return 'bg-green-50 border-green-500 text-green-900';
      case 'orange': return 'bg-orange-50 border-orange-500 text-orange-900';
      case 'teal':   return 'bg-teal-50 border-teal-500 text-teal-900';
      default:       return 'bg-blue-50 border-blue-500 text-blue-900'; // blue
    }
  };

  // Badge color for category pill
  const getCategoryBadge = (theme) => {
    switch (theme) {
      case 'purple': return 'bg-purple-200 text-purple-800';
      case 'red':    return 'bg-red-200 text-red-800';
      case 'green':  return 'bg-green-200 text-green-800';
      case 'orange': return 'bg-orange-200 text-orange-800';
      case 'teal':   return 'bg-teal-200 text-teal-800';
      default:       return 'bg-blue-200 text-blue-800';
    }
  };

  // Unread count for the header badge
  const unreadCount = allNotices.filter(n => !readIds.has(n.id)).length;

  // ============================================================
  return (
    <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gray-100 min-h-[80vh]">

      {/* ── HEADER ── */}
      <div className="border-b pb-4 mb-6 flex items-start justify-between">
        <div>
          <h2 className="text-3xl font-extrabold text-gray-800">Smart Noticeboard</h2>
          <p className="text-gray-500 text-sm mt-1">Stay updated with the latest campus announcements.</p>
        </div>

        {/* Unread badge */}
        {unreadCount > 0 && (
          <span className="mt-1 bg-blue-800 text-white text-xs font-bold px-3 py-1 rounded-full">
            {unreadCount} Unread
          </span>
        )}
      </div>

      {/* ── SEARCH BAR ── */}
      <div className="relative mb-4">
        {/* Search icon */}
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round"
            d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
        </svg>
        <input
          type="text"
          placeholder="Search notices by title, content, or #hashtag..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg
                     focus:outline-none focus:ring-2 focus:ring-blue-800 focus:border-transparent
                     bg-gray-50 placeholder-gray-400 text-gray-700 transition"
        />
        {/* Clear button — only shows when there's text */}
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        )}
      </div>

      {/* ── FILTER BUTTONS (horizontally scrollable on mobile) ── */}
      <div className="flex overflow-x-auto gap-2 pb-4 mb-6 scrollbar-hide">
        {filters.map(filter => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-semibold
                        transition-all duration-200 ${
              activeFilter === filter
                ? 'bg-blue-800 text-white shadow-md'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* ── RESULT COUNT ── */}
      {(searchQuery || activeFilter !== 'All') && (
        <p className="text-xs text-gray-400 mb-4">
          Showing <span className="font-semibold text-gray-600">{filteredNotices.length}</span> notice{filteredNotices.length !== 1 ? 's' : ''}
          {activeFilter !== 'All' && <> in <span className="font-semibold text-gray-600">{activeFilter}</span></>}
          {searchQuery && <> matching "<span className="font-semibold text-gray-600">{searchQuery}</span>"</>}
        </p>
      )}

      {/* ── NOTICES FEED ── */}
      <div className="space-y-5">

        {filteredNotices.length === 0 ? (
          /* Empty state */
          <div className="text-center py-16 text-gray-400">
            <p className="text-4xl mb-3">🔍</p>
            <p className="font-semibold text-gray-500">No notices found.</p>
            <p className="text-sm mt-1">Try a different search or filter.</p>
          </div>
        ) : (
          filteredNotices.map(notice => {
            const isRead = readIds.has(notice.id);

            return (
              <div
                key={notice.id}
                onClick={() => markAsRead(notice.id)}
                className={`border-l-4 p-5 rounded-r-xl shadow-sm transition-transform
                            hover:-translate-y-1 duration-200 cursor-pointer relative
                            ${getColors(notice.colorTheme)}
                            ${isRead ? 'opacity-75' : 'opacity-100'}`}
              >

                {/* ── PIN BADGE ── */}
                {notice.isPinned && (
                  <span className="absolute top-3 right-3 text-xs font-bold bg-yellow-100
                                   text-yellow-800 px-2 py-0.5 rounded-full border border-yellow-300">
                    📌 Pinned
                  </span>
                )}

                {/* ── UNREAD DOT ── */}
                {!isRead && (
                  <span className="absolute top-5 right-3 w-2 h-2 rounded-full bg-blue-600"
                        style={{ display: notice.isPinned ? 'none' : 'block' }} />
                )}

                {/* Notice header */}
                <div className="flex justify-between items-start mb-2 pr-20">
                  <h3 className={`font-bold text-lg ${isRead ? '' : 'underline decoration-dotted underline-offset-2'}`}>
                    {notice.title}
                  </h3>
                </div>

                {/* Category badge */}
                <span className={`inline-block text-xs font-bold uppercase tracking-wider
                                  px-2 py-0.5 rounded-md mb-2 ${getCategoryBadge(notice.colorTheme)}`}>
                  {notice.category}
                </span>

                {/* Content */}
                <p className="text-sm opacity-90 mt-1 mb-4 leading-relaxed">
                  {notice.content}
                </p>

                {/* Hashtags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {notice.hashtags.map((tag, i) => (
                    <span key={i}
                      className="text-xs font-bold bg-white bg-opacity-50 px-2 py-1 rounded-md
                                 cursor-pointer hover:bg-opacity-80 transition">
                      {tag}
                    </span>
                  ))}
                </div>

                {/* ── PDF ATTACHMENT BUTTON ── */}
                {notice.attachment && (
                  <button
                    onClick={e => { e.stopPropagation(); openPDF(notice); }}
                    className="flex items-center gap-2 text-xs font-semibold mb-3 px-3 py-1.5
                               bg-white bg-opacity-70 rounded-lg border border-black/10
                               hover:bg-opacity-100 transition-all duration-150 w-fit"
                  >
                    {/* PDF icon */}
                    <svg className="w-4 h-4 text-red-600" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"/>
                      <path fill="white" d="M14 2v6h6"/>
                      <path fill="white" d="M9 13h6M9 17h3"/>
                    </svg>
                    View Attachment — {notice.attachment.name}
                  </button>
                )}

                {/* Footer */}
                <div className="flex justify-between items-center text-xs font-medium
                                opacity-75 mt-2 border-t border-black/10 pt-3">
                  <span>Posted by: {notice.author}</span>
                  <div className="flex items-center gap-2">
                    {isRead && <span className="text-[10px] font-semibold opacity-60">✓ Read</span>}
                    <span>{notice.time}</span>
                  </div>
                </div>

              </div>
            );
          })
        )}
      </div>

      {/* ════════════════════════════════════════════
          PDF PREVIEW MODAL
          Uses an <iframe> to render the PDF inline.

          BACKEND NOTE:
          `selectedPDF.url` should be a direct, publicly accessible
          PDF URL (e.g., from AWS S3 or Google Drive "direct download" link).
          CORS must be allowed on that URL for the iframe to load it.
      ════════════════════════════════════════════ */}
      {selectedPDF && (
        <div
          className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4"
          onClick={() => setSelectedPDF(null)} // click outside to close
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh]
                       flex flex-col overflow-hidden"
            onClick={e => e.stopPropagation()} // prevent close when clicking inside
          >
            {/* Modal header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-red-500" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"/>
                  <path fill="white" d="M14 2v6h6"/>
                </svg>
                <span className="font-semibold text-gray-800 text-sm">{selectedPDF.name}</span>
              </div>
              <div className="flex items-center gap-3">
                {/* Open in new tab */}
                <a
                  href={selectedPDF.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-blue-700 font-semibold hover:underline"
                >
                  Open in new tab ↗
                </a>
                {/* Close button */}
                <button
                  onClick={() => setSelectedPDF(null)}
                  className="text-gray-400 hover:text-gray-700 text-xl font-bold leading-none"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* PDF iframe */}
            <div className="flex-1 overflow-hidden">
              <iframe
                src={selectedPDF.url}
                title={selectedPDF.name}
                className="w-full h-full"
                style={{ minHeight: '60vh' }}
              />
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Notices;