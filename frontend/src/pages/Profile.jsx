import React, { useState } from 'react';

const Profile = () => {
  const [activeTab, setActiveTab]   = useState('personal');
  const [isSaving,  setIsSaving]    = useState(false);
  const [saveMsg,   setSaveMsg]     = useState('');

  // BACKEND: Replace with GET /api/student/profile
  const [studentInfo, setStudentInfo] = useState({
    firstName:      'John',
    lastName:       'Doe',
    email:          'john.doe@apscollege.edu.in',
    phone:          '+91 9876543210',
    dob:            '2004-05-15',
    address:        '123 Tech Park Road, Bengaluru, Karnataka 560001',
    parentName:     'Jane Doe',
    parentPhone:    '+91 9876543211',
    // Academic (read-only — synced from university DB)
    usn:            '1AP23CS019',
    program:        'B.E.',
    branch:         'Computer Science & Engineering',
    semester:       '6th Semester',
    section:        'A',
    admissionQuota: 'CET',
  });

  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
  const [pwError,   setPwError]   = useState('');

  // ── COMPLETION BAR ────────────────────────────────────────
  // Counts how many personal fields are filled in
  const completionFields = [
    studentInfo.firstName,  studentInfo.lastName,
    studentInfo.email,      studentInfo.phone,
    studentInfo.dob,        studentInfo.address,
    studentInfo.parentName, studentInfo.parentPhone,
  ];
  const filledCount        = completionFields.filter(Boolean).length;
  const completionPercent  = Math.round((filledCount / completionFields.length) * 100);
  const completionColor    =
    completionPercent === 100 ? 'bg-green-500' :
    completionPercent >= 60   ? 'bg-blue-600'  : 'bg-yellow-500';

  // ── HANDLERS ─────────────────────────────────────────────
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setStudentInfo(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswords(prev => ({ ...prev, [name]: value }));
  };

  // BACKEND: Replace with PATCH /api/student/profile  (for personal details)
  // BACKEND: Replace with POST  /api/auth/change-password  (for security tab)
  const handleSave = (e) => {
    e.preventDefault();
    setPwError('');

    if (activeTab === 'security') {
      if (passwords.new !== passwords.confirm) {
        setPwError('New passwords do not match.');
        return;
      }
      if (passwords.new.length < 8) {
        setPwError('Password must be at least 8 characters.');
        return;
      }
    }

    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setSaveMsg('Changes saved successfully!');
      setTimeout(() => setSaveMsg(''), 3000);
      if (activeTab === 'security') {
        setPasswords({ current: '', new: '', confirm: '' });
      }
    }, 1000);
  };

  // Initials for avatar
  const initials = `${studentInfo.firstName[0] || ''}${studentInfo.lastName[0] || ''}`;

  // Reusable read-only input for academic tab
  const ReadOnlyField = ({ label, value }) => (
    <div>
      <label className="block text-sm font-bold text-gray-600 mb-1.5">{label}</label>
      <div className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl
                      text-gray-600 font-semibold text-sm select-none">
        {value}
      </div>
    </div>
  );

  // Reusable editable input
  const EditableField = ({ label, name, type = 'text', value, onChange }) => (
    <div>
      <label className="block text-sm font-bold text-gray-700 mb-1.5">{label}</label>
      <input
        type={type} name={name} value={value} onChange={onChange}
        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2
                   focus:ring-blue-500 outline-none transition text-gray-800 bg-white"
      />
    </div>
  );

  // Tab button
  const TabButton = ({ id, label }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`px-5 py-3 text-sm font-bold border-b-2 whitespace-nowrap transition-colors ${
        activeTab === id
          ? 'border-blue-700 text-blue-700'
          : 'border-transparent text-gray-400 hover:text-gray-600'
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="bg-gray-50 p-4 md:p-8 min-h-screen">

      {/* ── HEADER ── */}
      <div className="mb-8">
        <h2 className="text-3xl font-extrabold text-gray-800">Student Profile</h2>
        <p className="text-gray-500 text-sm mt-1">
          Manage your personal information and account security.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">

        {/* ── LEFT COLUMN: ID CARD ── */}
        <div className="lg:w-1/3 space-y-5">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

            {/* Banner */}
            <div className="h-28 bg-linear-to-r from-blue-800 to-indigo-700" />

            {/* Avatar + Info */}
            <div className="px-6 pb-6 flex flex-col items-center text-center relative">

              {/* Avatar circle */}
              <div className="w-24 h-24 -mt-12 rounded-full border-4 border-white shadow-md
                              bg-blue-100 flex items-center justify-center relative group cursor-pointer">
                <span className="text-3xl font-extrabold text-blue-700">{initials}</span>
                {/* Camera overlay on hover */}
                <div className="absolute inset-0 rounded-full bg-black/50 hidden group-hover:flex
                                items-center justify-center transition-all">
                  {/* BACKEND: onClick opens image upload dialog */}
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                      d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                      d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
              </div>

              <h3 className="mt-3 text-xl font-extrabold text-gray-800">
                {studentInfo.firstName} {studentInfo.lastName}
              </h3>
              <p className="text-sm font-bold text-blue-600 font-mono mt-0.5">{studentInfo.usn}</p>

              <div className="mt-5 w-full text-left space-y-3 border-t border-gray-100 pt-5">
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase">Program</p>
                  <p className="text-sm font-semibold text-gray-700 mt-0.5">
                    {studentInfo.program} in {studentInfo.branch}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase">Status</p>
                  <p className="text-sm font-semibold text-gray-700 mt-0.5">
                    {studentInfo.semester} · Section {studentInfo.section}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ── PROFILE COMPLETION CARD ── */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-bold text-gray-700">Profile Completion</p>
              <span className={`text-sm font-extrabold ${
                completionPercent === 100 ? 'text-green-600' :
                completionPercent >= 60   ? 'text-blue-700'  : 'text-yellow-600'
              }`}>
                {completionPercent}%
              </span>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
              <div
                className={`h-2.5 rounded-full transition-all duration-700 ${completionColor}`}
                style={{ width: `${completionPercent}%` }}
              />
            </div>

            {completionPercent < 100 && (
              <p className="text-xs text-gray-400 mt-2 font-medium">
                {completionFields.length - filledCount} field{completionFields.length - filledCount !== 1 ? 's' : ''} remaining —{' '}
                <button
                  onClick={() => setActiveTab('personal')}
                  className="text-blue-600 font-bold hover:underline"
                >
                  complete your profile
                </button>
              </p>
            )}

            {completionPercent === 100 && (
              <p className="text-xs text-green-600 mt-2 font-semibold flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                </svg>
                Profile fully complete!
              </p>
            )}
          </div>
        </div>

        {/* ── RIGHT COLUMN: TABBED FORM ── */}
        <div className="lg:w-2/3 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

          {/* Tabs */}
          <div className="flex border-b border-gray-100 bg-gray-50/50 px-2 md:px-6 pt-2
                          overflow-x-auto gap-1">
            <TabButton id="personal" label="Personal Details" />
            <TabButton id="academic" label="Academic Info"    />
            <TabButton id="security" label="Security"         />
          </div>

          <div className="p-6 md:p-8">
            <form onSubmit={handleSave}>

              {/* ── TAB 1: Personal ── */}
              {activeTab === 'personal' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <EditableField label="First Name"    name="firstName" value={studentInfo.firstName} onChange={handleInputChange} />
                    <EditableField label="Last Name"     name="lastName"  value={studentInfo.lastName}  onChange={handleInputChange} />
                    <EditableField label="Email Address" name="email"     type="email" value={studentInfo.email} onChange={handleInputChange} />
                    <EditableField label="Phone Number"  name="phone"     type="tel"   value={studentInfo.phone} onChange={handleInputChange} />
                    <EditableField label="Date of Birth" name="dob"       type="date"  value={studentInfo.dob}   onChange={handleInputChange} />
                    <EditableField label="Address"       name="address"   value={studentInfo.address}   onChange={handleInputChange} />
                  </div>

                  <div className="border-t border-gray-100 pt-6">
                    <h4 className="text-sm font-bold text-gray-700 mb-4 flex items-center gap-2">
                      <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      Emergency / Parent Contact
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <EditableField label="Parent/Guardian Name"  name="parentName"  value={studentInfo.parentName}  onChange={handleInputChange} />
                      <EditableField label="Parent Phone Number"   name="parentPhone" type="tel" value={studentInfo.parentPhone} onChange={handleInputChange} />
                    </div>
                  </div>
                </div>
              )}

              {/* ── TAB 2: Academic (read-only) ── */}
              {activeTab === 'academic' && (
                <div className="space-y-6">
                  <div className="bg-blue-50 text-blue-800 p-4 rounded-xl flex items-start
                                  gap-3 border border-blue-100">
                    <svg className="w-5 h-5 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-sm font-medium">
                      Academic records are synced directly with the university database.
                      Contact the admin department to report any discrepancies.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <ReadOnlyField label="University Seat Number (USN)" value={studentInfo.usn}            />
                    <ReadOnlyField label="Admission Quota"              value={studentInfo.admissionQuota} />
                    <ReadOnlyField label="Program"                      value={studentInfo.program}        />
                    <ReadOnlyField label="Branch"                       value={studentInfo.branch}         />
                    <ReadOnlyField label="Current Semester"             value={studentInfo.semester}       />
                    <ReadOnlyField label="Section"                      value={studentInfo.section}        />
                  </div>
                </div>
              )}

              {/* ── TAB 3: Security ── */}
              {activeTab === 'security' && (
                <div className="space-y-5 max-w-md">
                  <h4 className="text-base font-bold text-gray-800">Update Password</h4>

                  {['current', 'new', 'confirm'].map(field => (
                    <div key={field}>
                      <label className="block text-sm font-bold text-gray-700 mb-1.5 capitalize">
                        {field === 'confirm' ? 'Confirm New Password' :
                         field === 'current' ? 'Current Password'     : 'New Password'}
                      </label>
                      <input
                        type="password"
                        name={field}
                        value={passwords[field]}
                        onChange={handlePasswordChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2
                                   focus:ring-blue-500 outline-none transition"
                      />
                    </div>
                  ))}

                  {pwError && (
                    <div className="flex items-center gap-2 bg-red-50 border border-red-200
                                    rounded-xl px-4 py-3 text-red-700">
                      <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                          d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                      </svg>
                      <p className="text-sm font-semibold">{pwError}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Save footer (not shown on academic tab) */}
              {activeTab !== 'academic' && (
                <div className="mt-8 pt-6 border-t border-gray-100 flex items-center
                                justify-end gap-4">
                  {saveMsg && (
                    <span className="text-green-600 font-bold text-sm flex items-center gap-1.5">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                      </svg>
                      {saveMsg}
                    </span>
                  )}
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="bg-blue-800 hover:bg-blue-900 disabled:opacity-70 text-white
                               font-bold py-3 px-8 rounded-xl shadow-sm transition-all
                               disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {isSaving ? (
                      <>
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        Saving...
                      </>
                    ) : 'Save Changes'}
                  </button>
                </div>
              )}

            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;