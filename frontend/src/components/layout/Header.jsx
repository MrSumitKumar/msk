// src/components/layout/Header.jsx

// src/components/layout/Header.jsx
import React, { useRef, useEffect, useState, useContext } from "react";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import { ThemeContext } from "../../context/ThemeContext";
import {
  House,
  Info,
  Mail,
  GraduationCap,
  IdCard,
  Cog,
  LockKeyhole,
  UserPlus,
  LogIn,
  LogOut,
  User,
  Sun,
  Moon,
  NotebookTabs,
  Layers,
} from "lucide-react";

const Header = () => {
  const [desktopProfileOpen, setDesktopProfileOpen] = useState(false);
  const [mobileProfileOpen, setMobileProfileOpen] = useState(false);
  const profileDropdownRef = useRef(null);
  const mobileProfileDropdownRef = useRef(null);

  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useContext(ThemeContext);

  const handleLogout = () => {
    try {
      logout();
      setDesktopProfileOpen(false);
      setMobileProfileOpen(false);
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(event.target)
      ) {
        setDesktopProfileOpen(false);
      }
      if (
        mobileProfileDropdownRef.current &&
        !mobileProfileDropdownRef.current.contains(event.target)
      ) {
        setMobileProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const themeClasses =
    theme === "dark"
      ? "bg-gray-900 text-white border-gray-700"
      : "bg-white text-gray-900 border-gray-200";

  const hoverTextClass =
    theme === "dark" ? "hover:text-blue-400" : "hover:text-blue-600";
  const profileBgClass =
    theme === "dark"
      ? "bg-gray-800 text-yellow-400 hover:bg-gray-700"
      : "bg-gray-100 text-gray-600 hover:bg-gray-200";
  const dropdownBgClass =
    theme === "dark"
      ? "bg-gray-800 border border-gray-700 text-white"
      : "bg-white border border-gray-200 text-gray-900";

  const linkHoverClass =
    theme === "dark"
      ? "hover:bg-gray-700 text-white"
      : "hover:bg-gray-200 text-gray-700";

  return (
    <header
      className={`shadow-md sticky top-0 z-50 transition-colors duration-300 ${themeClasses} border-b`}
    >
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          className={`text-xl font-bold tracking-wide transition-colors duration-300 ${theme === "dark"
              ? "text-white hover:text-blue-400"
              : "text-gray-900 hover:text-blue-600"
            }`}
        >
          MSK
        </Link>

        {/* Mobile Theme Button */}
        <div className="md:hidden flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-lg transition-colors duration-300 ${profileBgClass}`}
            aria-label="Toggle theme"
          >
            {theme === "dark" ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </button>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex gap-6 items-center">
          <Link
            to="/"
            className={`flex items-center gap-1 transition-colors duration-300 ${hoverTextClass}`}
          >
            <House className="h-4 w-4" /> Home
          </Link>
          <Link
            to="/courses"
            className={`flex items-center gap-1 transition-colors duration-300 ${hoverTextClass}`}
          >
            <GraduationCap className="h-4 w-4" /> Courses
          </Link>
          <Link
            to="/notes"
            className={`flex items-center gap-1 transition-colors duration-300 ${hoverTextClass}`}
          >
            <NotebookTabs className="h-4 w-4" /> Notes
          </Link>
          <Link
            to="/projects"
            className={`flex items-center gap-1 transition-colors duration-300 ${hoverTextClass}`}
          >
            <Layers className="h-4 w-4" /> Projects
          </Link>
          <Link
            to="/about"
            className={`flex items-center gap-1 transition-colors duration-300 ${hoverTextClass}`}
          >
            <Info className="h-4 w-4" /> About
          </Link>
          <Link
            to="/contact"
            className={`flex items-center gap-1 transition-colors duration-300 ${hoverTextClass}`}
          >
            <Mail className="h-4 w-4" /> Contact
          </Link>

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-lg transition-colors duration-300 ${profileBgClass}`}
            aria-label="Toggle theme"
          >
            {theme === "dark" ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </button>

          {/* Profile / Auth Links */}
          {user ? (
            <div className="relative" ref={profileDropdownRef}>
              <button
                onClick={() => setDesktopProfileOpen(!desktopProfileOpen)}
                aria-haspopup="true"
                aria-expanded={desktopProfileOpen}
                className={`flex items-center gap-2 relative transition-colors duration-300 ${hoverTextClass}`}
              >
                {user?.image ? (
                  <img
                    src={user.image}
                    alt="User Avatar"
                    className={`w-8 h-8 rounded-full object-cover border-2 ${theme === "dark"
                        ? "border-gray-600"
                        : "border-gray-300"
                      }`}
                  />
                ) : (
                  <User
                    className={`w-8 h-8 rounded-full p-1 ${theme === "dark"
                        ? "bg-gray-700 text-white"
                        : "bg-gray-200 text-gray-600"
                      }`}
                  />
                )}
              </button>

              {desktopProfileOpen && (
                <div
                  className={`absolute right-0 mt-2 rounded-lg shadow-lg w-48 z-50 transition-colors duration-300 ${dropdownBgClass}`}
                >
                  <Link
                    to="/profile"
                    onClick={() => setDesktopProfileOpen(false)}
                    className={`flex items-center gap-2 px-4 py-2 transition-colors duration-300 ${linkHoverClass}`}
                  >
                    <IdCard className="w-4 h-4" /> Your Profile
                  </Link>
                  <Link
                    to={`/${user?.role ? user.role.toLowerCase() : "user"}-dashboard`}
                    onClick={() => setDesktopProfileOpen(false)}
                    className={`flex items-center gap-2 px-4 py-2 transition-colors duration-300 ${linkHoverClass}`}
                  >
                    <House className="h-4 w-4" /> Dashboard
                  </Link>
                  <Link
                    to="/settings"
                    onClick={() => setDesktopProfileOpen(false)}
                    className={`flex items-center gap-2 px-4 py-2 transition-colors duration-300 ${linkHoverClass}`}
                  >
                    <Cog className="w-4 w-4" /> Settings
                  </Link>
                  <Link
                    to="/change-password"
                    onClick={() => setDesktopProfileOpen(false)}
                    className={`flex items-center gap-2 px-4 py-2 transition-colors duration-300 ${linkHoverClass}`}
                  >
                    <LockKeyhole className="h-4 w-4" /> Change Password
                  </Link>
                  <button
                    onClick={handleLogout}
                    className={`w-full text-left flex items-center gap-2 px-4 py-2 transition-colors duration-300 ${linkHoverClass}`}
                  >
                    <LogOut className="h-4 w-4" /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                to="/login"
                className={`flex items-center gap-1 transition-colors duration-300 ${hoverTextClass}`}
              >
                <LogIn className="h-4 w-4" /> Login
              </Link>
              <Link
                to="/register"
                className={`flex items-center gap-1 transition-colors duration-300 ${hoverTextClass}`}
              >
                <UserPlus className="h-4 w-4" /> Register
              </Link>
            </>
          )}
        </nav>
      </div>

      {/* Mobile Bottom Navigation */}
      <div
        className={`fixed left-0 w-full transition-all duration-300 z-40 md:hidden bottom-0 ${themeClasses} border-t`}
      >
        <div className="flex justify-around items-center py-2 relative">
          {user ? (
            <Link
              to={`/${user?.role ? user.role.toLowerCase() : "user"}-dashboard`}
              className="flex flex-col items-center hover:text-blue-600 dark:hover:text-blue-400"
            >
              <House className="h-5 w-5" />
              <span className="text-xs">Dashboard</span>
            </Link>
          ) : (
            <Link
              to="/"
              className="flex flex-col items-center hover:text-blue-600 dark:hover:text-blue-400"
            >
              <House className="h-5 w-5" />
              <span className="text-xs">Home</span>
            </Link>
          )}

          <Link
            to="/courses"
            className="flex flex-col items-center hover:text-blue-600 dark:hover:text-blue-400"
          >
            <GraduationCap className="h-5 w-5" />
            <span className="text-xs">Courses</span>
          </Link>
          <Link
            to="/notes"
            className="flex flex-col items-center hover:text-blue-600 dark:hover:text-blue-400"
          >
            <NotebookTabs className="h-5 w-5" />
            <span className="text-xs">Notes</span>
          </Link>
          <Link
            to="/projects"
            className="flex flex-col items-center hover:text-blue-600 dark:hover:text-blue-400"
          >
            <Layers className="h-5 w-5" />
            <span className="text-xs">Projects</span>
          </Link>

          {/* Mobile Profile Dropdown */}
          <div className="relative" ref={mobileProfileDropdownRef}>
            <button
              onClick={() => setMobileProfileOpen(!mobileProfileOpen)}
              className="flex flex-col items-center hover:text-blue-600 dark:hover:text-blue-400 focus:outline-none"
            >
              <User className="h-5 w-5" />
              <span className="text-xs">Profile</span>
            </button>

            {mobileProfileOpen && !user && (
              <div
                className={`absolute bottom-10 left-1/2 transform -translate-x-1/2 w-48 shadow-lg rounded-md flex flex-col py-2 ${dropdownBgClass}`}
              >
                <Link
                  to="/login"
                  onClick={() => setMobileProfileOpen(false)}
                  className={`px-4 py-2 flex items-center gap-2 transition-colors duration-300 ${linkHoverClass}`}
                >
                  <LogIn className="w-4 h-4" /> Login
                </Link>

                <Link
                  to="/register"
                  onClick={() => setMobileProfileOpen(false)}
                  className={`px-4 py-2 flex items-center gap-2 transition-colors duration-300 ${linkHoverClass}`}
                >
                  <UserPlus className="w-4 h-4" /> Register
                </Link>
              </div>
            )}

            {mobileProfileOpen && user && (
              <div
                className={`absolute bottom-10 left-1/2 transform -translate-x-1/2 w-48 shadow-lg rounded-md flex flex-col py-2 ${dropdownBgClass}`}
              >
                <Link
                  to="/profile"
                  onClick={() => setMobileProfileOpen(false)}
                  className={`px-4 py-2 flex items-center gap-2 transition-colors duration-300 ${linkHoverClass}`}
                >
                  <IdCard className="w-4 h-4" /> Your Profile
                </Link>
                <Link
                  to="/settings"
                  onClick={() => setMobileProfileOpen(false)}
                  className={`px-4 py-2 flex items-center gap-2 transition-colors duration-300 ${linkHoverClass}`}
                >
                  <Cog className="w-4 h-4" /> Settings
                </Link>
                <Link
                  to="/change-password"
                  onClick={() => setMobileProfileOpen(false)}
                  className={`px-4 py-2 flex items-center gap-2 transition-colors duration-300 ${linkHoverClass}`}
                >
                  <LockKeyhole className="w-4 h-4" /> Change Password
                </Link>

                <button
                  type="button"
                  onClick={handleLogout}
                  className={`w-full text-left flex items-center gap-2 px-4 py-2 transition-colors duration-300 ${linkHoverClass}`}
                >
                  <LogOut className="h-4 w-4" /> Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
