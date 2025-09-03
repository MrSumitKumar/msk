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

export const routes = [
  { path: "/", element: <Home /> },
  { path: "/about", element: <About /> },
  { path: "/notes", element: <Notes /> },
  { path: "/projects", element: <Projects /> },
  { path: "/projects/:id", element: <ProjectDetail /> },
  { path: "/contact", element: <Contact /> },
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
  
  { path: "/profile", element: <PrivateRoute allowedRoles={["admin", "student", "teacher"]}><Profile /> </PrivateRoute> },
  
  // Admin Routes
  { path: "/admin-dashboard", element: <PrivateRoute allowedRoles={["admin"]}><AdminDashboard /> </PrivateRoute> },
  { path: "/admin/users", element: <PrivateRoute allowedRoles={["admin"]}><UserManagement /> </PrivateRoute> },
  { path: "/users/manage", element: <PrivateRoute allowedRoles={["admin"]}><UserManagement /> </PrivateRoute> },
  { path: "/admin/courses", element: <PrivateRoute allowedRoles={["admin", "teacher"]}><CourseManagement /> </PrivateRoute> },
  { path: "/admin/courses/create", element: <PrivateRoute allowedRoles={["admin", "teacher"]}><CourseForm /></PrivateRoute> },
  { path: "/admin/courses/:id", element: <PrivateRoute allowedRoles={["admin", "teacher"]}><CourseForm /></PrivateRoute> },
  { path: "/admin/reports", element: <PrivateRoute allowedRoles={["admin"]}><Reports /> </PrivateRoute> },
  
  // Teacher Routes
  { path: "/teacher-dashboard", element: <PrivateRoute allowedRoles={["teacher"]}><TeacherDashboard /> </PrivateRoute> },
  
  // Student Routes
  { path: "/student-dashboard", element: <PrivateRoute allowedRoles={["student"]}><StudentDashboard /> </PrivateRoute> },

  { path: "/courses", element: <CourseList /> },
  { path: "/courses/add", element: <PrivateRoute allowedRoles={["admin", "teacher"]}><CourseForm /></PrivateRoute> },
  { path: "/courses/:slug/edit", element: <PrivateRoute allowedRoles={["admin", "teacher"]}><CourseForm /></PrivateRoute> },
  { path: "/courses/:slug", element: <CourseDetail /> },

];
 