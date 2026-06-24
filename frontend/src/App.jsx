import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Auth
import Login from './pages/Login';

// Student portal
import SidebarLayout   from './components/SidebarLayout';
import Dashboard       from './pages/Dashboard';
import Notices         from './pages/Notices';
import Attendance      from './pages/Attendance';
import Marks           from './pages/Marks';
import Letters         from './pages/Letters';
import Profile         from './pages/Profile';
import StudentNotes    from './pages/StudentNotes';       // NEW

// Faculty portal
import FacultyLayout     from './components/FacultyLayout';
import FacultyDashboard  from './pages/faculty/FacultyDashboard';
import FacultyAttendance from './pages/faculty/FacultyAttendance';
import FacultyMarks      from './pages/faculty/FacultyMarks';
import FacultyNotices    from './pages/faculty/FacultyNotices';
import FacultyLetters    from './pages/faculty/FacultyLetters';
import FacultyTimetable  from './pages/faculty/FacultyTimetable';
import FacultyRoster     from './pages/faculty/FacultyRoster';
import FacultyNotes      from './pages/faculty/FacultyNotes';

// HOD portal
import HODLayout      from './components/HODLayout';
import HODDashboard   from './pages/hod/HODDashboard';
import HODAnalytics   from './pages/hod/HODAnalytics';
import HODFaculty     from './pages/hod/HODFaculty';
import HODStudents    from './pages/hod/HODStudents';
import HODLetters     from './pages/hod/HODLetters';
import HODNotices     from './pages/hod/HODNotices';
import HODTimetable   from './pages/hod/HODTimetable';

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ── PUBLIC ── */}
        <Route path="/" element={<Login />} />

        {/* ── STUDENT PORTAL ── */}
        <Route element={<SidebarLayout />}>
          <Route path="/dashboard"  element={<Dashboard />}    />
          <Route path="/notices"    element={<Notices />}      />
          <Route path="/attendance" element={<Attendance />}   />
          <Route path="/marks"      element={<Marks />}        />
          <Route path="/letters"    element={<Letters />}      />
          <Route path="/notes"      element={<StudentNotes />} />
          <Route path="/profile"    element={<Profile />}      />
        </Route>

        {/* ── FACULTY PORTAL ── */}
        {/* BACKEND: Guard with role === 'faculty' */}
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

        {/* ── HOD PORTAL ── */}
        {/* BACKEND: Guard with role === 'hod' */}
        <Route element={<HODLayout />}>
          <Route path="/hod/dashboard"  element={<HODDashboard />}  />
          <Route path="/hod/analytics"  element={<HODAnalytics />}  />
          <Route path="/hod/faculty"    element={<HODFaculty />}    />
          <Route path="/hod/students"   element={<HODStudents />}   />
          <Route path="/hod/letters"    element={<HODLetters />}    />
          <Route path="/hod/notices"    element={<HODNotices />}    />
          <Route path="/hod/timetable"  element={<HODTimetable />}  />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;