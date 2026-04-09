import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Auth
import Login from './pages/Login';

// Student pages + layout
import SidebarLayout from './components/SidebarLayout';
import Dashboard     from './pages/Dashboard';
import Notices       from './pages/Notices';
import Attendance    from './pages/Attendance';
import Marks         from './pages/Marks';
import Letters       from './pages/Letters';
import Profile       from './pages/Profile';

// Faculty layout + pages
import FacultyLayout     from './components/FacultyLayout';
import FacultyDashboard  from './pages/faculty/FacultyDashboard';
import FacultyAttendance from './pages/faculty/FacultyAttendance';
import FacultyMarks      from './pages/faculty/FacultyMarks';
import FacultyNotices    from './pages/faculty/FacultyNotices';
import FacultyLetters    from './pages/faculty/FacultyLetters';
import FacultyTimetable  from './pages/faculty/FacultyTimetable';
import FacultyRoster     from './pages/faculty/FacultyRoster';
import FacultyNotes      from './pages/faculty/FacultyNotes';

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ── PUBLIC ── */}
        <Route path="/" element={<Login />} />

        {/* ── STUDENT PORTAL ── */}
        <Route element={<SidebarLayout />}>
          <Route path="/dashboard"  element={<Dashboard />}  />
          <Route path="/notices"    element={<Notices />}    />
          <Route path="/attendance" element={<Attendance />} />
          <Route path="/marks"      element={<Marks />}      />
          <Route path="/letters"    element={<Letters />}    />
          <Route path="/profile"    element={<Profile />}    />
        </Route>

        {/* ── FACULTY PORTAL ── */}
        {/* BACKEND: Wrap FacultyLayout with a role-guard that checks role === 'faculty' */}
        {/* If student tries to access /faculty/* redirect to /dashboard              */}
        <Route element={<FacultyLayout />}>
          <Route path="/faculty/dashboard"  element={<FacultyDashboard />}  />
          <Route path="/faculty/attendance" element={<FacultyAttendance />} />
          <Route path="/faculty/marks"      element={<FacultyMarks />}      />
          <Route path="/faculty/notices"    element={<FacultyNotices />}    />
          <Route path="/faculty/letters"    element={<FacultyLetters />}    />
          <Route path="/faculty/timetable"  element={<FacultyTimetable />}  />
          <Route path="/faculty/roster"     element={<FacultyRoster />}     />
          <Route path="/faculty/notes"      element={<FacultyNotes />}      />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;