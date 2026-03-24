import React, { useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, LineChart, Line, CartesianGrid 
} from 'recharts';

const Attendance = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [testUsn, setTestUsn] = useState('1AP23CS019'); 

  // --- UPGRADED VTU BRAIN ---
  const getStudentDetails = (usn) => {
    if (!usn || usn.length < 10) return { sem: 0, branch: 'Unknown', isLateral: false, status: 'Invalid' };

    const usnUpper = usn.toUpperCase();
    const yearString = usnUpper.substring(3, 5);
    const joinYear = 2000 + parseInt(yearString, 10);
    const branchCode = usnUpper.substring(5, 7);
    const isLateral = usnUpper.substring(7, 8) === '4'; 

    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth() + 1;

    let yearsElapsed = currentYear - joinYear;
    let calculatedSem = yearsElapsed * 2;

    if (currentMonth >= 8) calculatedSem += 1;
    if (isLateral) calculatedSem += 2;

    // Strict Bounds Checking
    if (isNaN(calculatedSem) || calculatedSem < 1 || joinYear > currentYear) {
      return { sem: 0, branch: branchCode, isLateral, status: 'Invalid' };
    }
    
    if (calculatedSem > 8) {
      return { sem: calculatedSem, branch: branchCode, isLateral, status: 'Graduated' };
    }

    return { sem: calculatedSem, branch: branchCode, isLateral, status: 'Active' };
  };

  const { sem, branch, isLateral, status } = getStudentDetails(testUsn);

  // Databases
  const db6thSemCS = [
    { short: 'ML', subject: 'Machine Learning', code: 'BCS602', attended: 38, total: 42, fill: '#3b82f6', colorClass: 'bg-blue-500' },
    { short: 'CC', subject: 'Cloud Computing', code: 'BCS601', attended: 30, total: 40, fill: '#eab308', colorClass: 'bg-yellow-500' },
    { short: 'BCT', subject: 'Blockchain Technology', code: 'BCS613A', attended: 28, total: 35, fill: '#22c55e', colorClass: 'bg-green-500' },
    { short: 'CN', subject: 'Computer Networks', code: 'BCS502', attended: 20, total: 36, fill: '#ef4444', colorClass: 'bg-red-500' }, 
    { short: 'CD', subject: 'Compiler Design', code: 'BCS613C', attended: 34, total: 38, fill: '#8b5cf6', colorClass: 'bg-purple-500' },
  ];

  const db4thSemCS = [
    { short: 'ADA', subject: 'Design & Analysis of Algo', code: 'BCS401', attended: 40, total: 45, fill: '#3b82f6', colorClass: 'bg-blue-500' },
    { short: 'MC', subject: 'Microcontrollers', code: 'BCS402', attended: 35, total: 40, fill: '#eab308', colorClass: 'bg-yellow-500' },
    { short: 'OS', subject: 'Operating Systems', code: 'BCS403', attended: 38, total: 40, fill: '#22c55e', colorClass: 'bg-green-500' },
    { short: 'Bio', subject: 'Biology for Engineers', code: 'BBOK407', attended: 12, total: 20, fill: '#ef4444', colorClass: 'bg-red-500' }, 
  ];

  let activeAttendanceData = [];
  if (branch === 'CS' && sem === 6) activeAttendanceData = db6thSemCS;
  else if (branch === 'CS' && sem === 4) activeAttendanceData = db4thSemCS;
  else if (status === 'Active') activeAttendanceData = db6thSemCS; 

  const consistencyData = [
    { week: 'W1', attendance: 90 }, { week: 'W2', attendance: 85 }, { week: 'W3', attendance: 88 },
    { week: 'W4', attendance: 75 }, { week: 'W5', attendance: 82 }, { week: 'W6', attendance: 85 },
  ];

  const totalClasses = activeAttendanceData.reduce((acc, curr) => acc + curr.total, 0) || 1;
  const totalAttended = activeAttendanceData.reduce((acc, curr) => acc + curr.attended, 0) || 0;
  const overallPercentage = Math.round((totalAttended / totalClasses) * 100);

  const pieData = [{ name: 'Attended', value: totalAttended }, { name: 'Missed', value: totalClasses - totalAttended }];
  const pieColors = [overallPercentage >= 75 ? '#22c55e' : '#ef4444', '#e5e7eb']; 

  return (
    <div className="bg-gray-50 p-4 md:p-8 min-h-screen relative">
      
      {/* DEV MODE TOGGLE */}
      <div className="mb-6 bg-blue-100 p-4 rounded-xl border border-blue-300 flex items-center justify-between shadow-sm">
        <div>
          <p className="text-xs font-bold text-blue-800 uppercase mb-1">Dev Mode: Test VTU Limits</p>
          <p className="text-sm text-blue-900">
            Calculated: <strong>{status === 'Active' ? `${sem}th Sem ${branch}` : status}</strong> {isLateral && '(Lateral)'}
          </p>
        </div>
        <input 
          type="text" 
          value={testUsn} 
          onChange={(e) => setTestUsn(e.target.value)}
          className="px-3 py-2 rounded-lg border border-blue-300 focus:outline-none uppercase w-40 font-bold text-gray-700"
          placeholder="Enter USN"
        />
      </div>

      <div className="mb-8">
        <h2 className="text-3xl font-extrabold text-gray-800">Attendance Analytics</h2>
        <p className="text-gray-500 text-sm mt-1">Deep dive into your class presence and consistency.</p>
      </div>

      {/* --- CONDITIONAL RENDERING BASED ON STATUS --- */}
      
      {status === 'Invalid' && (
        <div className="bg-red-50 border-l-8 border-red-500 p-8 rounded-xl shadow-md flex items-center gap-6">
          <div className="bg-red-100 p-4 rounded-full text-red-600">
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
          </div>
          <div>
            <h3 className="text-2xl font-extrabold text-red-800 mb-2">Invalid Credentials Detected</h3>
            <p className="text-red-700 font-medium">The USN provided ({testUsn}) does not match a valid VTU active student format. Please contact administration.</p>
          </div>
        </div>
      )}

      {status === 'Graduated' && (
        <div className="bg-linear-to-r from-yellow-500 to-yellow-400 p-8 rounded-xl shadow-lg flex items-center gap-6 text-white">
          <div className="bg-white bg-opacity-20 p-4 rounded-full">
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
          </div>
          <div>
            <h3 className="text-3xl font-extrabold mb-1">Alumni Record</h3>
            <p className="font-medium text-yellow-50">Congratulations! Student {testUsn} has completed all 8 semesters and graduated from the university.</p>
          </div>
        </div>
      )}

      {status === 'Active' && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-center">
              <p className="text-gray-500 font-semibold mb-1 uppercase tracking-wider text-xs">Total Classes Held</p>
              <h3 className="text-4xl font-extrabold text-gray-800">{totalClasses}</h3>
              <p className="text-sm mt-2 text-gray-400 font-medium">Across all subjects</p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-center">
              <p className="text-gray-500 font-semibold mb-1 uppercase tracking-wider text-xs">Total Attended</p>
              <h3 className="text-4xl font-extrabold text-blue-600">{totalAttended}</h3>
              <p className="text-sm mt-1 text-gray-400 font-medium">You missed {totalClasses - totalAttended} classes total</p>
              <button onClick={() => setIsModalOpen(true)} className="mt-4 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-all flex items-center justify-center gap-2 w-max shadow-sm">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                View Details
              </button>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
              <div>
                <p className="text-gray-500 font-semibold mb-1 uppercase tracking-wider text-xs">Overall Safe Status</p>
                <h3 className={`text-4xl font-extrabold ${overallPercentage >= 75 ? 'text-green-500' : 'text-red-500'}`}>{overallPercentage || 0}%</h3>
                <p className="text-sm mt-2 font-bold text-gray-600">{overallPercentage >= 75 ? '✅ Safe Zone' : '⚠️ Shortage Risk'}</p>
              </div>
              <div className="h-28 w-28 relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={pieData} innerRadius={35} outerRadius={50} paddingAngle={5} dataKey="value" stroke="none">
                      {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={pieColors[index]} />)}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold text-gray-700 mb-6">Subject vs Classes Attended</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={activeAttendanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                    <XAxis dataKey="short" tick={{ fontSize: 12, fontWeight: 'bold' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                    <Tooltip cursor={{ fill: '#f9fafb' }} />
                    <Bar dataKey="attended" radius={[4, 4, 0, 0]} barSize={35}>
                      {activeAttendanceData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.fill} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold text-gray-700 mb-6">Consistency Tracker (Weekly %)</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={consistencyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                    <XAxis dataKey="week" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                    <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                    <Tooltip />
                    <Line type="monotone" dataKey="attendance" stroke="#3b82f6" strokeWidth={4} dot={{ r: 6, fill: '#3b82f6', stroke: '#fff', strokeWidth: 2 }} activeDot={{ r: 8 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </>
      )}

      {/* MODAL */}
      {isModalOpen && status === 'Active' && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl transform transition-all">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <div>
                <h3 className="text-2xl font-bold text-gray-800">VTU Subject Details</h3>
                <p className="text-sm text-gray-500 font-medium">{sem}th Semester {branch} - 2022 Scheme</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-white hover:bg-red-500 transition-colors bg-white rounded-full p-2 shadow-sm border border-gray-200">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            
            <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
              {activeAttendanceData.map((item) => {
                const percentage = Math.round((item.attended / item.total) * 100);
                return (
                  <div key={item.code} className="relative">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-2">
                      <div>
                        <span className="font-bold text-gray-800 text-base">{item.subject}</span>
                        <span className="ml-2 text-xs font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded-md">{item.code}</span>
                      </div>
                      <span className="text-sm font-bold text-gray-800 mt-1 md:mt-0">{percentage}% <span className="text-xs font-semibold text-gray-400 ml-1">({item.attended}/{item.total})</span></span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-3 shadow-inner overflow-hidden">
                      <div className={`h-3 rounded-full ${item.colorClass} transition-all duration-1000 ease-out`} style={{ width: `${percentage}%` }}></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Attendance;