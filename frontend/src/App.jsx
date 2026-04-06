import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Notices from './pages/Notices';
import SidebarLayout from './components/SidebarLayout';
import Attendance from './pages/Attendance';
import Letters from './pages/Letters';
import Marks from './pages/Marks';
import Profile from './pages/Profile';

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public route — no sidebar */}
        <Route path="/" element={<Login />} />

        {/* All authenticated pages share ONE SidebarLayout */}
        {/* BUG FIX: Original had 4 duplicate SidebarLayout blocks and /profile outside layout */}
        <Route element={<SidebarLayout />}>
          <Route path="/dashboard"  element={<Dashboard />}  />
          <Route path="/notices"    element={<Notices />}    />
          <Route path="/attendance" element={<Attendance />} />
          <Route path="/marks"      element={<Marks />}      />
          <Route path="/letters"    element={<Letters />}    />
          <Route path="/profile"    element={<Profile />}    />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;