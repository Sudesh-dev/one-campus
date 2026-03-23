import React from 'react';

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      
      {/* Top Navbar */}
      <nav className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm mb-6">
        <h1 className="text-2xl font-bold text-blue-600">One Campus</h1>
        <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold transition duration-200">
          Logout
        </button>
      </nav>

      {/* Welcome Section */}
      <div className="bg-blue-600 text-white rounded-xl p-8 shadow-lg mb-6">
        <h2 className="text-3xl font-extrabold mb-2">Welcome back, Student! 👋</h2>
        <p className="text-blue-100">Here is your daily overview for APS College of Engineering.</p>
      </div>

      {/* Grid for Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Attendance Card */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-700 mb-2">My Attendance</h3>
          <p className="text-4xl font-extrabold text-green-500">85%</p>
          <p className="text-sm text-gray-500 mt-2">You are safe! Keep it up.</p>
        </div>

        {/* Timetable Card */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-700 mb-2">Next Class</h3>
          <p className="text-xl font-bold text-gray-800">Machine Learning</p>
          <p className="text-sm text-gray-500 mt-1">10:30 AM - Room 402</p>
        </div>

        {/* Notices Card */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-700 mb-2">Recent Notices</h3>
          <p className="text-sm text-gray-600 border-b pb-2 mb-2">Hackathon registrations close tomorrow.</p>
          <p className="text-sm text-gray-600">Fees due for 6th semester by Friday.</p>
        </div>

      </div>
      
    </div>
  );
};

export default Dashboard;