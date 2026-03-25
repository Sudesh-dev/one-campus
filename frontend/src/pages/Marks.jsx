import React, { useState, useRef } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from 'recharts';

const Marks = () => {
  const [activeTab, setActiveTab] = useState('internals');
  
  // Reference to scroll to the detailed table
  const detailsRef = useRef(null);

  const scrollToDetails = () => {
    detailsRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // --- MOCK DATA: 6th Sem Internals (Dynamic Max/Min for Backend integration later) ---
  const internalsData = [
    { subject: 'Machine Learning', code: 'BCS602', ia1: 42, ia2: 45, max: 50, min: 18 },
    { subject: 'Cloud Computing', code: 'BCS601', ia1: 38, ia2: 35, max: 50, min: 18 },
    { subject: 'Blockchain Tech', code: 'BCS613A', ia1: 28, ia2: 40, max: 50, min: 18 },
    { subject: 'Computer Networks', code: 'BCS502', ia1: 18, ia2: 22, max: 50, min: 18 }, 
    { subject: 'Compiler Design', code: 'BCS613C', ia1: 35, ia2: 38, max: 40, min: 14 }, // Example of a 40-mark subject
  ];

  // --- MOCK DATA: Historical VTU Results ---
  const vtuResults = [
    { sem: 1, status: 'Pass', marks: '680/800', sgpa: 8.2 },
    { sem: 2, status: 'Pass', marks: '710/800', sgpa: 8.5 },
    { sem: 3, status: 'Pass', marks: '650/900', sgpa: 7.8 },
    { sem: 4, status: 'Pass', marks: '720/900', sgpa: 8.4 },
    { sem: 5, status: 'Pass', marks: '750/900', sgpa: 8.9 },
  ];

  const currentCGPA = 8.36;

  return (
    <div className="bg-gray-50 p-4 md:p-8 min-h-screen">
      
      {/* Header */}
      <div className="mb-8 flex flex-col md:flex-row md:justify-between md:items-end gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-gray-800">Marks & Results</h2>
          <p className="text-gray-500 text-sm mt-1">Track your IA performance and VTU academic history.</p>
        </div>
        
        {/* Tab Switcher */}
        <div className="flex bg-white rounded-lg p-1 shadow-sm border border-gray-200 w-max">
          <button 
            onClick={() => setActiveTab('internals')}
            className={`px-6 py-2 rounded-md text-sm font-bold transition-all ${activeTab === 'internals' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}
          >
            IA (Current Sem)
          </button>
          <button 
            onClick={() => setActiveTab('externals')}
            className={`px-6 py-2 rounded-md text-sm font-bold transition-all ${activeTab === 'externals' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}
          >
            VTU Results (CGPA)
          </button>
        </div>
      </div>

      {/* --- TAB 1: INTERNAL ASSESSMENTS --- */}
      {activeTab === 'internals' && (
        <div className="space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-linear-to-r from-blue-700 to-blue-600 p-6 rounded-2xl shadow-md text-white">
              <p className="text-blue-100 font-semibold mb-1 uppercase tracking-wider text-xs">Target Met</p>
              <h3 className="text-4xl font-extrabold">5/5</h3>
              <p className="text-sm mt-2 opacity-90">Subjects above minimum passing marks</p>
            </div>
            
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 md:col-span-2 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-gray-800">IA-2 Results are out!</h3>
                <p className="text-sm text-gray-500 mt-1">Check your updated averages below.</p>
              </div>
              <span className="bg-green-100 text-green-700 px-4 py-2 rounded-lg font-bold text-sm">Updated Today</span>
            </div>
          </div>

          {/* Upgraded Internals Table */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 bg-gray-50">
              <h3 className="text-lg font-bold text-gray-800">6th Semester IA Breakdown</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider border-b border-gray-100">
                    <th className="p-4 font-semibold">Subject & Code</th>
                    <th className="p-4 font-semibold text-center">IA - 1</th>
                    <th className="p-4 font-semibold text-center">IA - 2</th>
                    <th className="p-4 font-semibold text-center bg-blue-50 text-blue-800">Average</th>
                    <th className="p-4 font-semibold text-center">Max Marks</th>
                    <th className="p-4 font-semibold text-center text-red-500">Min Required</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {internalsData.map((item, index) => {
                    const avg = Math.ceil((item.ia1 + item.ia2) / 2);
                    const isDanger = avg < item.min;
                    
                    return (
                      <tr key={index} className="hover:bg-gray-50 transition-colors">
                        <td className="p-4">
                          <p className="font-bold text-gray-800">{item.subject}</p>
                          <p className="text-xs text-gray-500 font-mono mt-1">{item.code}</p>
                        </td>
                        <td className="p-4 text-center font-medium text-gray-700">{item.ia1}</td>
                        <td className="p-4 text-center font-medium text-gray-700">{item.ia2}</td>
                        <td className={`p-4 text-center text-lg font-extrabold bg-blue-50/50 ${isDanger ? 'text-red-600' : 'text-blue-700'}`}>
                          {avg}
                        </td>
                        <td className="p-4 text-center font-semibold text-gray-500">{item.max}</td>
                        <td className="p-4 text-center font-bold text-red-400">{item.min}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* --- TAB 2: VTU EXTERNALS (CGPA) --- */}
      {activeTab === 'externals' && (
        <div className="space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-linear-to-r from-purple-700 to-indigo-600 p-6 rounded-2xl shadow-md text-white flex flex-col justify-center items-center text-center relative overflow-hidden">
              <p className="text-purple-200 font-semibold mb-1 uppercase tracking-wider text-xs relative z-10">Overall CGPA</p>
              <h3 className="text-5xl font-extrabold relative z-10">{currentCGPA}</h3>
              
              {/* The New View Details Button */}
              <button 
                onClick={scrollToDetails}
                className="mt-4 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white text-xs font-bold py-2 px-4 rounded-full transition-all flex items-center gap-1 relative z-10"
              >
                View Sem Details &rarr;
              </button>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-center">
              <p className="text-gray-500 font-semibold mb-1 uppercase tracking-wider text-xs">Total Credits Earned</p>
              <h3 className="text-4xl font-extrabold text-gray-800">110</h3>
              <p className="text-sm mt-2 text-gray-400 font-medium">Up to 5th Semester</p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-center">
              <p className="text-gray-500 font-semibold mb-1 uppercase tracking-wider text-xs">Active Backlogs</p>
              <h3 className="text-4xl font-extrabold text-green-500">0</h3>
              <p className="text-sm mt-2 text-gray-400 font-medium">All clear! Keep it up.</p>
            </div>
          </div>

          {/* SGPA Progression Chart */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-800 mb-6">SGPA Progression Curve</h3>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={vtuResults} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                  <XAxis dataKey="sem" tickFormatter={(sem) => `Sem ${sem}`} tick={{ fontSize: 12, fontWeight: 'bold' }} axisLine={false} tickLine={false} />
                  <YAxis domain={[0, 10]} tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                  <Tooltip cursor={{ fill: '#f9fafb' }} formatter={(value) => [`${value} SGPA`, 'Result']} labelFormatter={(label) => `Semester ${label}`} />
                  <Line type="monotone" dataKey="sgpa" stroke="#4f46e5" strokeWidth={4} dot={{ r: 6, fill: '#4f46e5', stroke: '#fff', strokeWidth: 2 }} activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* --- NEW: Semester-wise Detailed Table --- */}
          <div ref={detailsRef} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mt-8 scroll-mt-6">
            <div className="p-6 border-b border-gray-100 bg-gray-50">
              <h3 className="text-lg font-bold text-gray-800">Semester-wise VTU Results</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider border-b border-gray-100">
                    <th className="p-4 font-semibold">Semester</th>
                    <th className="p-4 font-semibold">Status</th>
                    <th className="p-4 font-semibold text-center">Total Marks</th>
                    <th className="p-4 font-semibold text-center">SGPA</th>
                    <th className="p-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {vtuResults.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50 transition-colors">
                      <td className="p-4 font-bold text-gray-800">Semester {item.sem}</td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${item.status === 'Pass' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="p-4 text-center font-medium text-gray-700">{item.marks}</td>
                      <td className="p-4 text-center font-extrabold text-indigo-600">{item.sgpa}</td>
                      <td className="p-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 px-3 py-1 rounded-md text-sm font-bold transition">
                            View
                          </button>
                          <button className="flex items-center gap-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-md text-sm font-bold transition">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                            PDF
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

    </div>
  );
};

export default Marks;