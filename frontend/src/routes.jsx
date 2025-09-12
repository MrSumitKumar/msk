// src/routes.jsx
import About from './pages/About.jsx';
import Home from './pages/Home.jsx';
import Contact from './pages/Contact.jsx';
import Login from './pages/auth/Login.jsx';
import Register from './pages/auth/Register.jsx';
import CourseList from './pages/Course/CourseList.jsx';
import CourseDetail from './pages/Course/CourseDetail.jsx';
import CourseForm from './components/forms/CourseForm.jsx';
import PrivateRoute from './components/PrivateRoute.jsx';
import Profile from './pages/auth/Profile.jsx';
import AdminDashboard from './pages/dashboard/AdminDashboard.jsx';
import TeacherDashboard from './pages/dashboard/TeacherDashboard.jsx';
import StudentDashboard from './pages/dashboard/StudentDashboard.jsx';
import UserManagement from './components/admin/UserManagement.jsx';
import Reports from './components/admin/Reports.jsx';
import CourseManagement from './components/admin/CourseManagement.jsx';
import Notes from './pages/Notes.jsx';
import Projects from './pages/projects/Projects.jsx';
import ProjectDetail from './pages/projects/ProjectDetail.jsx';
import NotFound from './pages/NotFound.jsx';
import ForgotPassword from './pages/auth/ForgotPassword.jsx';
import ResetPassword from './pages/auth/ResetPassword.jsx';

// -----------------------------
// Public Routes
// -----------------------------
export const publicRoutes = [
  { path: "/", element: <Home /> },
  { path: "/about", element: <About /> },
  { path: "/contact", element: <Contact /> },
  { path: "/notes", element: <Notes /> },
  { path: "/projects", element: <Projects /> },
  { path: "/projects/:id", element: <ProjectDetail /> },
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
  { path: "/courses", element: <CourseList /> },
  { path: "/courses/:slug", element: <CourseDetail /> },
  { path: "/forgot-password", element: <ForgotPassword /> },
  { path: "/reset-password/:uidb64/:token", element: <ResetPassword />}
];

// -----------------------------
// Private / Authenticated Routes
// -----------------------------
export const privateRoutes = [
  { path: "/profile", element: <PrivateRoute allowedRoles={["admin", "teacher", "student"]}><Profile /></PrivateRoute> },

  // Admin Routes
  { path: "/admin-dashboard", element: <PrivateRoute allowedRoles={["admin"]}><AdminDashboard /></PrivateRoute> },
  { path: "/admin/users", element: <PrivateRoute allowedRoles={["admin"]}><UserManagement /></PrivateRoute> },
  { path: "/admin/courses", element: <PrivateRoute allowedRoles={["admin", "teacher"]}><CourseManagement /></PrivateRoute> },

  // Standardize course management URLs
  { path: "/admin/courses/create", element: <PrivateRoute allowedRoles={["admin","teacher"]}><CourseForm /></PrivateRoute> },
  { path: "/admin/courses/:slug/edit", element: <PrivateRoute allowedRoles={["admin","teacher"]}><CourseForm /></PrivateRoute> },
  
  { path: "/admin/reports", element: <PrivateRoute allowedRoles={["admin"]}><Reports /></PrivateRoute> },

  // Teacher Routes
  { path: "/teacher-dashboard", element: <PrivateRoute allowedRoles={["teacher"]}><TeacherDashboard /></PrivateRoute> },

  // Student Routes
  { path: "/student-dashboard", element: <PrivateRoute allowedRoles={["student"]}><StudentDashboard /></PrivateRoute> },

  // Courses management for Teacher/Admin (alternate routes)
  { path: "/courses/add", element: <PrivateRoute allowedRoles={["admin", "teacher"]}><CourseForm /></PrivateRoute> },
  { path: "/courses/:slug/edit", element: <PrivateRoute allowedRoles={["admin", "teacher"]}><CourseForm /></PrivateRoute> },
];

// -----------------------------
// Fallback 404 Route
// -----------------------------
export const fallbackRoute = [
  { path: "*", element: <NotFound /> }
];

// -----------------------------
// Combined Routes
// -----------------------------
export const routes = [...publicRoutes, ...privateRoutes, ...fallbackRoute];
