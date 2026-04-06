import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [isLogin, setIsLogin]     = useState(true);
  const [usn, setUsn]             = useState('');
  const [password, setPassword]   = useState('');
  const [email, setEmail]         = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const fillDemoCreds = () => {
    setUsn('1AP23CS019');
    setPassword('demo123');
    setIsLogin(true);
  };

  // BACKEND: Replace with POST /api/auth/login  { usn, password }
  // BACKEND: Replace with POST /api/auth/register { usn, email, password }
  const handleAuth = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      if (isLogin) {
        navigate('/dashboard');
      } else {
        alert('Registration successful! Please log in.');
        setIsLogin(true);
      }
    }, 800);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">

      {/* ── LEFT PANEL: Branding (hidden on mobile) ── */}
      <div className="hidden lg:flex lg:w-1/2 bg-blue-800 flex-col justify-between p-12 relative overflow-hidden">

        {/* Background decorative circles */}
        <div className="absolute -top-16 -right-16 w-64 h-64 bg-blue-700 rounded-full opacity-50" />
        <div className="absolute -bottom-20 -left-10 w-80 h-80 bg-blue-900 rounded-full opacity-40" />

        <div className="relative z-10">
          <h1 className="text-4xl font-extrabold text-white tracking-tight">One Campus</h1>
          <p className="text-blue-200 mt-2 font-medium">APS College of Engineering</p>
        </div>

        <div className="relative z-10 space-y-6">
          {[
            { icon: '📊', title: 'Smart Attendance',   desc: 'VTU-aware analytics & shortage alerts'   },
            { icon: '📝', title: 'Marks & Results',    desc: 'IA tracking and SGPA progression'        },
            { icon: '📄', title: 'Document Generator', desc: 'Draft and print official letters instantly' },
          ].map(item => (
            <div key={item.title} className="flex items-start gap-4">
              <div className="w-10 h-10 bg-blue-700 rounded-xl flex items-center justify-center text-xl shrink-0">
                {item.icon}
              </div>
              <div>
                <p className="text-white font-bold">{item.title}</p>
                <p className="text-blue-200 text-sm">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <p className="relative z-10 text-blue-300 text-xs">
          Affiliated to Visvesvaraya Technological University (VTU) · 2022 Scheme
        </p>
      </div>

      {/* ── RIGHT PANEL: Form ── */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6">
        <div className="w-full max-w-md">

          {/* Mobile logo */}
          <div className="lg:hidden mb-8 text-center">
            <h1 className="text-3xl font-extrabold text-blue-800">One Campus</h1>
            <p className="text-gray-500 text-sm mt-1">APS College of Engineering</p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">

            <h2 className="text-2xl font-extrabold text-gray-800 mb-1">
              {isLogin ? 'Welcome back 👋' : 'Create account'}
            </h2>
            <p className="text-gray-500 text-sm mb-6">
              {isLogin ? 'Sign in to access your student portal.' : 'Register with your college USN.'}
            </p>

            {/* Demo credentials banner */}
            <button
              type="button"
              onClick={fillDemoCreds}
              className="w-full mb-6 bg-blue-50 border border-blue-200 rounded-xl p-3 text-center
                         hover:bg-blue-100 transition group"
            >
              <p className="text-sm text-blue-800 font-bold group-hover:text-blue-900">
                ⚡ Click to fill demo credentials
              </p>
              <p className="text-xs text-blue-500 mt-0.5">USN: 1AP23CS019 &nbsp;|&nbsp; Password: demo123</p>
            </button>

            <form className="space-y-4" onSubmit={handleAuth}>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">
                  University Seat Number (USN)
                </label>
                <input
                  type="text"
                  value={usn}
                  onChange={(e) => setUsn(e.target.value.toUpperCase())}
                  placeholder="e.g. 1AP23CS019"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2
                             focus:ring-blue-500 focus:outline-none font-mono font-bold uppercase
                             tracking-wider text-gray-800 bg-gray-50 transition"
                  required
                />
              </div>

              {!isLogin && (
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">
                    College Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="student@apsce.edu.in"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2
                               focus:ring-blue-500 focus:outline-none bg-gray-50 transition"
                    required
                  />
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
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2
                             focus:ring-blue-500 focus:outline-none bg-gray-50 transition"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-800 hover:bg-blue-900 disabled:opacity-70 text-white
                           font-bold py-3 rounded-xl transition duration-200 flex items-center
                           justify-center gap-2 mt-2"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    {isLogin ? 'Signing in...' : 'Creating account...'}
                  </>
                ) : (
                  isLogin ? 'Sign In' : 'Register Account'
                )}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-gray-500">
              {isLogin ? "Don't have an account?" : 'Already have an account?'}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-blue-700 font-bold hover:underline ml-1"
              >
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