import React, { useState } from 'react';

const Notices = () => {
  // 1. State to keep track of which filter is currently clicked
  const [activeFilter, setActiveFilter] = useState('All');

  // 2. The list of categories for your buttons
  const filters = ['All', 'Overall College', 'Departmental', 'Class', 'Exams', 'Events', 'Fests'];

  // 3. Our mock database of notices (notice the custom hashtags!)
  const allNotices = [
    {
      id: 1,
      title: "AI Buildathon 2026 Registration",
      category: "Events",
      content: "All 6th-semester CSE students must register for the AI for Societal Good buildathon. Final teams need to be submitted by tomorrow 5 PM.",
      hashtags: ["#Buildathon", "#OpenAI", "#Hackathon"],
      author: "HOD - CSE",
      time: "2 hours ago",
      colorTheme: "blue"
    },
    {
      id: 2,
      title: "MEGAHERTZ Fest Schedule Live",
      category: "Fests",
      content: "The official MEGAHERTZ website is now up! Check out the one-page responsive site for the full lineup of cultural events and DJ nights.",
      hashtags: ["#MEGAHERTZ", "#CulturalFest", "#CampusLife"],
      author: "Cultural Committee",
      time: "5 hours ago",
      colorTheme: "purple"
    },
    {
      id: 3,
      title: "Fee Payment Reminder",
      category: "Overall College",
      content: "Please clear your pending dues for the current semester to download your hall ticket. Contact the admin office for details.",
      hashtags: ["#Fees", "#Admin", "#Urgent"],
      author: "Admin Office",
      time: "1 day ago",
      colorTheme: "red"
    },
    {
      id: 4,
      title: "Cloud Computing Lab Internals",
      category: "Exams",
      content: "The lab internals for 6th-semester students will be held next Wednesday. Ensure your records are signed.",
      hashtags: ["#Internals", "#Exams", "#CSE"],
      author: "Prof. Sharma",
      time: "2 days ago",
      colorTheme: "green"
    }
  ];

  // 4. The logic that actually filters the notices when you click a button
  const filteredNotices = activeFilter === 'All' 
    ? allNotices 
    : allNotices.filter(notice => notice.category === activeFilter);

  // A helper to make the colors dynamic without breaking Tailwind
  const getColors = (theme) => {
    switch(theme) {
      case 'purple': return 'bg-purple-50 border-purple-500 text-purple-900';
      case 'red': return 'bg-red-50 border-red-500 text-red-900';
      case 'green': return 'bg-green-50 border-green-500 text-green-900';
      default: return 'bg-blue-50 border-blue-500 text-blue-900'; // Default Blue
    }
  };

  return (
    <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gray-100 min-h-[80vh]">
      
      {/* Header - Notice the + New Notice button is GONE for students */}
      <div className="border-b pb-4 mb-6">
        <h2 className="text-3xl font-extrabold text-gray-800">Smart Noticeboard</h2>
        <p className="text-gray-500 text-sm mt-1">Stay updated with the latest campus announcements.</p>
      </div>

      {/* Filter Buttons (Scrollable horizontally on small screens) */}
      <div className="flex overflow-x-auto gap-2 pb-4 mb-6 scrollbar-hide">
        {filters.map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
              activeFilter === filter 
                ? 'bg-blue-800 text-white shadow-md' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {filter}
          </button>
        ))}
      </div>
      
      {/* Notices Feed */}
      <div className="space-y-5">
        
        {/* If no notices match the filter, show a blank state */}
        {filteredNotices.length === 0 ? (
          <div className="text-center py-10 text-gray-400">
            <p className="font-medium">No notices found for "{activeFilter}".</p>
          </div>
        ) : (
          filteredNotices.map((notice) => (
            <div key={notice.id} className={`border-l-4 p-5 rounded-r-xl shadow-sm transition-transform hover:-translate-y-1 duration-200 ${getColors(notice.colorTheme)}`}>
              
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-lg">{notice.title}</h3>
                <span className="text-xs font-bold uppercase tracking-wider opacity-75">{notice.category}</span>
              </div>
              
              <p className="text-sm opacity-90 mt-1 mb-4 leading-relaxed">{notice.content}</p>
              
              {/* Hashtags Section */}
              <div className="flex flex-wrap gap-2 mb-4">
                {notice.hashtags.map((tag, index) => (
                  <span key={index} className="text-xs font-bold bg-white bg-opacity-50 px-2 py-1 rounded-md cursor-pointer hover:bg-opacity-80 transition">
                    {tag}
                  </span>
                ))}
              </div>

              {/* Footer */}
              <div className="flex justify-between items-center text-xs font-medium opacity-75 mt-2 border-t border-black/10 pt-3">
                <span>Posted by: {notice.author}</span>
                <span>{notice.time}</span>
              </div>
            </div>
          ))
        )}

      </div>
    </div>
  );
};

export default Notices;