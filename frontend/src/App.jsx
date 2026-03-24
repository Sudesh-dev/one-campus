import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Notices from './pages/Notices';
import SidebarLayout from './components/SidebarLayout';
import Attendance from './pages/Attendance';
import Letters from './pages/Letters';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* The Login Page is entirely separate */}
        <Route path="/" element={<Login />} />

        {/* Everything inside SidebarLayout will have the sidebar next to it */}
        <Route element={<SidebarLayout />}>

          {/* Dashboard is nested inside the Layout */}
          <Route path="/dashboard" element={<Dashboard />} />

        </Route>

        <Route element={<SidebarLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/notices" element={<Notices />} />
        </Route>

        <Route element={<SidebarLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/notices" element={<Notices />} />
          <Route path="/attendance" element={<Attendance />} />
        </Route>

        <Route element={<SidebarLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/notices" element={<Notices />} />
          <Route path="/attendance" element={<Attendance />} />
          <Route path="/letters" element={<Letters />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;