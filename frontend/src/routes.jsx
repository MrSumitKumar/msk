import About from './pages/About.jsx';
import Home from './pages/Home.jsx';
import Contact from './pages/Contact.jsx';
import Login from './pages/auth/Login.jsx';
import Register from './pages/auth/Register.jsx';
import CourseList from './pages/Course/CourseList.jsx';
import CourseDetail from './pages/Course/CourseDetail.jsx';
import CourseForm from './pages/Course/CourseForm.jsx';
import PrivateRoute from './components/PrivateRoute.jsx';
import Profile from './pages/Profile.jsx';
import AdminDashboard from './pages/dashboard/AdminDashboard.jsx';
import TeacherDashboard from './pages/dashboard/TeacherDashboard.jsx';
import StudentDashboard from './pages/dashboard/StudentDashboard.jsx';


export const routes = [
  { path: "/", element: <Home /> },
  { path: "/about", element: <About /> },
  { path: "/contact", element: <Contact /> },
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
  
  { path: "/profile", element: <PrivateRoute allowedRoles={["admin", "student", "teacher"]}><Profile /> </PrivateRoute>, },
  { path: "/admin-dashboard", element: <PrivateRoute allowedRoles={["admin"]}><AdminDashboard /> </PrivateRoute>, },
  { path: "/teacher-dashboard", element: <PrivateRoute allowedRoles={["teacher"]}><TeacherDashboard /> </PrivateRoute>, },
  { path: "/student-dashboard", element: <PrivateRoute allowedRoles={["student"]}><StudentDashboard /> </PrivateRoute>, },

  { path: "/courses", element: <CourseList /> },
  { path: "/courses/add", element: <CourseForm /> },
  { path: "/courses/edit/:id", element: <CourseForm /> },
  { path: "/courses/:slug", element: <CourseDetail /> },

];
 