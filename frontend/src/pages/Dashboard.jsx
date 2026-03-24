import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  
  // State to hold the current date and time
  const [now, setNow] = useState(new Date());

  // This hook updates the time every 1 second
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer); // Cleanup when leaving the page
  }, []);

  const formattedDate = now.toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });
  
  const formattedTime = now.toLocaleTimeString('en-US', {
    hour: '2-digit', minute: '2-digit', second: '2-digit'
  });

  return (
    <div className="min-h-screen flex flex-col gap-6">
      
      {/* Welcome Section with Live Clock */}
      <div className="bg-blue-600 text-white rounded-xl p-8 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl"></div>
        <div className="absolute bottom-0 right-20 w-24 h-24 bg-white opacity-10 rounded-full blur-xl"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:justify-between md:items-end">
          <div className="mb-6 md:mb-0">
            <h2 className="text-3xl font-extrabold mb-2">Welcome back, Student! 👋</h2>
            <p className="text-blue-100">Here is your daily overview for APS College of Engineering.</p>
          </div>
          
          {/* The Fixed Date/Time Pill */}
          <div className="bg-white px-6 py-3 rounded-xl shadow-lg border-2 border-blue-400 flex flex-col items-start md:items-end transform transition hover:scale-105">
            <p className="text-xs font-bold text-blue-500 uppercase tracking-widest mb-1">Current Time</p>
            <p className="text-sm font-bold text-gray-800 tracking-wide">{formattedDate}</p>
            {/* Using tabular-nums so the width doesn't jitter when the seconds tick */}
            <p className="text-2xl font-black text-blue-700 font-mono tabular-nums mt-1">{formattedTime}</p>
          </div>
        </div>
      </div>

      {/* Grid for Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-700 mb-2">My Attendance</h3>
          <p className="text-4xl font-extrabold text-green-500">85%</p>
          <p className="text-sm text-gray-500 mt-2">You are safe! Keep it up.</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-700 mb-2">Next Class</h3>
          <p className="text-xl font-bold text-gray-800">Machine Learning</p>
          <p className="text-sm text-gray-500 mt-1">10:30 AM - Room 402</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-gray-700 mb-2">Recent Notices</h3>
            <p className="text-sm text-gray-600 border-b pb-2 mb-2">Buildathon registrations close tomorrow.</p>
            <p className="text-sm text-gray-600">Fees due for 6th semester by Friday.</p>
          </div>
          <button onClick={() => navigate('/notices')} className="text-blue-600 text-sm font-bold hover:underline mt-4 text-left">
            View all notices &rarr;
          </button>
        </div>
      </div>
      
    </div>
  );
};

export default Dashboard;