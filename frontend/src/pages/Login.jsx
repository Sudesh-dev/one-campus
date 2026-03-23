import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  
  // We added state here to control the input boxes!
  const [usn, setUsn] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  
  const navigate = useNavigate();

  // This function injects the demo credentials
  const fillDemoCreds = () => {
    setUsn('1AP23CS019');
    setPassword('demo123');
    setIsLogin(true); // Switches to login mode just in case
  };

  const handleAuth = (e) => {
    e.preventDefault(); 
    if (isLogin) {
      navigate('/dashboard');
    } else {
      alert("Registration successful! Please log in.");
      setIsLogin(true);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        
        <h1 className="text-3xl font-extrabold text-center text-blue-600 mb-2">One Campus</h1>
        <p className="text-center text-gray-500 mb-8 font-medium">
          {isLogin ? 'Welcome back, student!' : 'Create your account'}
        </p>

        {/* Demo Credentials Button */}
        <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-3 text-center cursor-pointer hover:bg-blue-100 transition" onClick={fillDemoCreds}>
          <p className="text-sm text-blue-800 font-semibold">⚡ Click to use Demo Creds</p>
          <p className="text-xs text-blue-600 mt-1">USN: 1AP23CS019 | Pass: demo123</p>
        </div>

        <form className="space-y-5" onSubmit={handleAuth}>
          
          {/* USN Field - Now controlled by React */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">USN</label>
            <input
              type="text"
              value={usn}
              onChange={(e) => setUsn(e.target.value)}
              placeholder="e.g. 1AP23CS019"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none uppercase"
              required
            />
          </div>

          {!isLogin && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student@apsce.edu.in"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              />
            </div>
          )}

          {/* Password Field - Now controlled by React */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition duration-200 mt-4"
          >
            {isLogin ? 'Sign In' : 'Register Account'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm">
          <span className="text-gray-600">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
          </span>
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-blue-600 font-bold hover:underline ml-1"
          >
            {isLogin ? 'Register here' : 'Log in here'}
          </button>
        </div>

      </div>
    </div>
  );
};

export default Login;