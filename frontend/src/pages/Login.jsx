import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ROLES = [
  { id: 'student', label: '🎒 Student',  redirect: '/dashboard'      },
  { id: 'faculty', label: '👨‍🏫 Faculty',  redirect: '/faculty/dashboard' },
  { id: 'hod',     label: '🏛️ HOD',       redirect: '/hod/dashboard'  },
];

const DEMO = {
  student: { field: 'USN',         placeholder: '1AP23CS019', value: '1AP23CS019', pass: 'demo123'     },
  faculty: { field: 'Employee ID', placeholder: 'FAC001',     value: 'FAC001',     pass: 'faculty123'  },
  hod:     { field: 'Employee ID', placeholder: 'HOD001',     value: 'HOD001',     pass: 'hod123'      },
};

const FEATURES = {
  student: [
    { icon: '📊', title: 'Smart Attendance',    desc: 'VTU-aware analytics & shortage alerts'      },
    { icon: '📝', title: 'Marks & Results',     desc: 'IA tracking and SGPA progression'           },
    { icon: '📄', title: 'Document Generator',  desc: 'Draft and print official letters instantly' },
  ],
  faculty: [
    { icon: '✅', title: 'Mark Attendance',    desc: 'Class-by-class attendance marking'     },
    { icon: '🎓', title: 'Enter IA Marks',     desc: 'IA-1 & IA-2 entry for all subjects'    },
    { icon: '📁', title: 'Upload Study Notes', desc: 'Sem & branch-scoped material upload'   },
  ],
  hod: [
    { icon: '📊', title: 'Dept Analytics',    desc: 'Attendance & marks at a glance'         },
    { icon: '👥', title: 'Faculty & Students', desc: 'Full department oversight'              },
    { icon: '📅', title: 'Call Meetings',     desc: 'Notify all faculty instantly'           },
  ],
};

const Login = () => {
  const [role,      setRole]      = useState('student');
  const [isLogin,   setIsLogin]   = useState(true);
  const [id,        setId]        = useState('');
  const [password,  setPassword]  = useState('');
  const [email,     setEmail]     = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const demo = DEMO[role];

  const fillDemo = () => { setId(demo.value); setPassword(demo.pass); setIsLogin(true); };

  const handleRoleChange = (r) => { setRole(r); setId(''); setPassword(''); setEmail(''); };

  // BACKEND: POST /api/auth/login  { role, id, password }
  // Response: { token, role, redirectTo }
  const handleAuth = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const r = ROLES.find(r => r.id === role);
      if (isLogin) navigate(r.redirect);
      else { alert('Registration successful! Please log in.'); setIsLogin(true); }
    }, 800);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">

      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-blue-800 flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute -top-16 -right-16 w-64 h-64 bg-blue-700 rounded-full opacity-50" />
        <div className="absolute -bottom-20 -left-10 w-80 h-80 bg-blue-900 rounded-full opacity-40" />
        <div className="relative z-10">
          <h1 className="text-4xl font-extrabold text-white tracking-tight">One Campus</h1>
          <p className="text-blue-200 mt-2 font-medium">APS College of Engineering</p>
        </div>
        <div className="relative z-10 space-y-6">
          {FEATURES[role].map(f => (
            <div key={f.title} className="flex items-start gap-4">
              <div className="w-10 h-10 bg-blue-700 rounded-xl flex items-center justify-center text-xl shrink-0">
                {f.icon}
              </div>
              <div>
                <p className="text-white font-bold">{f.title}</p>
                <p className="text-blue-200 text-sm">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
        <p className="relative z-10 text-blue-300 text-xs">
          Affiliated to Visvesvaraya Technological University (VTU) | NBA | AICTE
        </p>
      </div>

      {/* Right panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6">
        <div className="w-full max-w-md">

          <div className="lg:hidden mb-8 text-center">
            <h1 className="text-3xl font-extrabold text-blue-800">One Campus</h1>
            <p className="text-gray-500 text-sm mt-1">APS College of Engineering</p>
          </div>

          {/* Role switcher — 3 roles */}
          <div className="flex bg-gray-100 rounded-2xl p-1.5 mb-6 gap-1">
            {ROLES.map(r => (
              <button key={r.id} type="button"
                onClick={() => handleRoleChange(r.id)}
                className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  role === r.id
                    ? 'bg-white text-blue-800 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}>
                {r.label}
              </button>
            ))}
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">

            <h2 className="text-2xl font-extrabold text-gray-800 mb-1">
              {isLogin ? 'Welcome back 👋' : 'Create account'}
            </h2>
            <p className="text-gray-500 text-sm mb-6">
              {isLogin ? `Sign in to your ${role} portal.` : `Register your ${role} account.`}
            </p>

            {/* Demo credentials */}
            <button type="button" onClick={fillDemo}
              className="w-full mb-6 bg-blue-50 border border-blue-200 rounded-xl p-3
                         text-center hover:bg-blue-100 transition group">
              <p className="text-sm text-blue-800 font-bold">⚡ Fill demo credentials</p>
              <p className="text-xs text-blue-500 mt-0.5">
                {demo.field}: {demo.value} · Password: {demo.pass}
              </p>
            </button>

            <form className="space-y-4" onSubmit={handleAuth}>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">{demo.field}</label>
                <input type="text" value={id}
                  onChange={e => setId(e.target.value.toUpperCase())}
                  placeholder={demo.placeholder}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2
                             focus:ring-blue-500 focus:outline-none font-mono font-bold uppercase
                             tracking-wider text-gray-800 bg-gray-50 transition"
                  required />
              </div>

              {!isLogin && (
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">Official Email</label>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                    placeholder="user@apsce.edu.in"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2
                               focus:ring-blue-500 focus:outline-none bg-gray-50 transition"
                    required />
                </div>
              )}

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-sm font-bold text-gray-700">Password</label>
                  {isLogin && (
                    <button type="button" className="text-xs text-blue-600 font-semibold hover:underline">
                      Forgot password?
                    </button>
                  )}
                </div>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2
                             focus:ring-blue-500 focus:outline-none bg-gray-50 transition"
                  required />
              </div>

              <button type="submit" disabled={isLoading}
                className="w-full bg-blue-800 hover:bg-blue-900 disabled:opacity-70 text-white
                           font-bold py-3 rounded-xl transition flex items-center justify-center gap-2 mt-2">
                {isLoading ? (
                  <><svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>Signing in...</>
                ) : isLogin ? 'Sign In' : 'Register Account'}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-gray-500">
              {isLogin ? "Don't have an account?" : 'Already have an account?'}
              <button onClick={() => setIsLogin(!isLogin)}
                className="text-blue-700 font-bold hover:underline ml-1">
                {isLogin ? 'Register here' : 'Log in here'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;