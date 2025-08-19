// src/components/layout/Header.jsx
import React, { useRef, useEffect, useState, useContext } from "react";
import { useAuth } from "../../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { ThemeContext } from "../../context/ThemeContext";
import {
  House,
  Info,
  Mail,
  GraduationCap,
  Library,
  IdCard,
  Cog,
  LockKeyhole,
  UserPlus,
  LogIn,
  LogOut,
  Menu,
  X,
  User,
  Sun,
  Moon
} from "lucide-react";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileDropdownRef = useRef(null);
  const mobileSidebarRef = useRef(null);
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useContext(ThemeContext);
  const navigate = useNavigate();

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const toggleProfile = () => setProfileOpen(!profileOpen);

  const handleLogout = () => {
    try {
      logout();
      setProfileOpen(false);
      setMenuOpen(false);
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(event.target)
      ) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header
      className={`shadow-md sticky top-0 z-50 transition-colors duration-300 ${
        theme === "dark"
          ? "bg-gray-900 text-white border-b border-gray-700"
          : "bg-white text-gray-900 border-b border-gray-200"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link
          to="/"
          className={`text-xl font-bold tracking-wide transition-colors duration-300 ${
            theme === "dark"
              ? "text-white hover:text-blue-400"
              : "text-gray-900 hover:text-blue-600"
          }`}
        >
          MSK
        </Link>

        {/* Mobile Controls */}
        <div className="md:hidden flex items-center gap-2">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-lg transition-colors duration-300 ${
              theme === "dark"
                ? "bg-gray-800 text-yellow-400 hover:bg-gray-700"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
            aria-label="Toggle theme"
          >
            {theme === "dark" ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </button>

          {/* Menu Button */}
          <button
            onClick={toggleMenu}
            className={`p-1 transition-colors duration-300 ${
              theme === "dark"
                ? "text-white hover:text-blue-400"
                : "text-gray-900 hover:text-blue-600"
            }`}
          >
            {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex gap-6 items-center">
          <Link
            to="/"
            className={`flex items-center gap-1 transition-colors duration-300 ${
              theme === "dark"
                ? "text-white hover:text-blue-400"
                : "text-gray-700 hover:text-blue-600"
            }`}
          >
            <House className="h-4 w-4" /> Home
          </Link>
          <Link
            to="/courses"
            className={`flex items-center gap-1 transition-colors duration-300 ${
              theme === "dark"
                ? "text-white hover:text-blue-400"
                : "text-gray-700 hover:text-blue-600"
            }`}
          >
            <GraduationCap className="h-4 w-4" /> Courses
          </Link>
          <Link
            to="/about"
            className={`flex items-center gap-1 transition-colors duration-300 ${
              theme === "dark"
                ? "text-white hover:text-blue-400"
                : "text-gray-700 hover:text-blue-600"
            }`}
          >
            <Info className="h-4 w-4" /> About
          </Link>
          <Link
            to="/contact"
            className={`flex items-center gap-1 transition-colors duration-300 ${
              theme === "dark"
                ? "text-white hover:text-blue-400"
                : "text-gray-700 hover:text-blue-600"
            }`}
          >
            <Mail className="h-4 w-4" /> Contact
          </Link>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-lg transition-colors duration-300 ${
              theme === "dark"
                ? "bg-gray-800 text-yellow-400 hover:bg-gray-700"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
            aria-label="Toggle theme"
          >
            {theme === "dark" ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </button>

          {/* Profile / Auth */}
          {user ? (
            <div className="relative group" ref={profileDropdownRef}>
              <button
                onClick={toggleProfile}
                aria-haspopup="true"
                aria-expanded={profileOpen}
                className={`flex items-center gap-2 relative transition-colors duration-300 ${
                  theme === "dark"
                    ? "hover:text-blue-400"
                    : "hover:text-blue-600"
                }`}
              >
                {user?.image ? (
                  <img
                    src={user.image}
                    alt="User Avatar"
                    className={`w-8 h-8 rounded-full object-cover border-2 transition-colors duration-300 ${
                      theme === "dark"
                        ? "border-gray-600"
                        : "border-gray-300"
                    }`}
                  />
                ) : (
                  <User
                    className={`w-8 h-8 rounded-full p-1 transition-colors duration-300 ${
                      theme === "dark"
                        ? "bg-gray-700 text-white"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  />
                )}
              </button>

              {profileOpen && (
                <div
                  className={`absolute right-0 mt-2 rounded-lg shadow-lg w-48 z-50 transition-colors duration-300 ${
                    theme === "dark"
                      ? "bg-gray-800 border border-gray-700"
                      : "bg-white border border-gray-200"
                  }`}
                >
                  <Link
                    to="/profile"
                    className={`flex items-center gap-2 px-4 py-2 transition-colors duration-300 ${
                      theme === "dark"
                        ? "text-white hover:bg-gray-700"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                    onClick={() => setProfileOpen(false)}
                  >
                    <IdCard className="w-4 h-4" /> Your Profile
                  </Link>
                  <Link
                    to="/your-courses"
                    className={`block px-4 py-2 flex items-center gap-2 transition-colors duration-300 ${
                      theme === "dark"
                        ? "text-white hover:bg-gray-700"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                    onClick={() => setProfileOpen(false)}
                  >
                    <Library className="h-4 w-4" /> Your Courses
                  </Link>
                  <Link
                    to="/settings"
                    className={`block px-4 py-2 flex items-center gap-2 transition-colors duration-300 ${
                      theme === "dark"
                        ? "text-white hover:bg-gray-700"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                    onClick={() => setProfileOpen(false)}
                  >
                    <Cog className="h-4 w-4" /> Settings
                  </Link>
                  <Link
                    to="/change-password"
                    className={`block px-4 py-2 flex items-center gap-2 transition-colors duration-300 ${
                      theme === "dark"
                        ? "text-white hover:bg-gray-700"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                    onClick={() => setProfileOpen(false)}
                  >
                    <LockKeyhole className="h-4 w-4" /> Change Password
                  </Link>
                  <button
                    onClick={handleLogout}
                    className={`w-full text-left px-4 py-2 flex items-center gap-2 transition-colors duration-300 ${
                      theme === "dark"
                        ? "text-white hover:bg-gray-700"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
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
                className={`flex items-center gap-1 transition-colors duration-300 ${
                  theme === "dark"
                    ? "text-white hover:text-blue-400"
                    : "text-gray-700 hover:text-blue-600"
                }`}
              >
                <LogIn className="h-4 w-4" /> Login
              </Link>
              <Link
                to="/register"
                className={`flex items-center gap-1 transition-colors duration-300 ${
                  theme === "dark"
                    ? "text-white hover:text-blue-400"
                    : "text-gray-700 hover:text-blue-600"
                }`}
              >
                <UserPlus className="h-4 w-4" /> Register
              </Link>
            </>
          )}
        </nav>
      </div>

      {/* Mobile Overlay */}
      {menuOpen && (
        <div
          onClick={toggleMenu}
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
        />
      )}

      {/* Mobile Sidebar */}
      <div
        ref={mobileSidebarRef}
        className={`md:hidden fixed top-0 right-0 h-full w-72 shadow-lg transform transition-all duration-300 z-50 flex flex-col justify-between ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        } ${theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-gray-900"}`}
      >
        {/* Mobile Menu Header */}
        <div
          className={`flex justify-between items-center px-4 py-3 border-b transition-colors duration-300 ${
            theme === "dark" ? "border-gray-700" : "border-gray-200"
          }`}
        >
          <span className="text-lg font-semibold">Menu</span>
          <button
            onClick={toggleMenu}
            className={`transition-colors duration-300 ${
              theme === "dark"
                ? "text-white hover:text-blue-400"
                : "text-gray-900 hover:text-blue-600"
            }`}
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Mobile Links */}
        <div className="px-4 py-3 space-y-2 flex-1 overflow-y-auto">
          <Link to="/" onClick={toggleMenu} className="flex items-center gap-2 py-2">
            <House className="h-5 w-5" /> Home
          </Link>
          <Link to="/courses" onClick={toggleMenu} className="flex items-center gap-2 py-2">
            <GraduationCap className="h-5 w-5" /> Courses
          </Link>
          <Link to="/about" onClick={toggleMenu} className="flex items-center gap-2 py-2">
            <Info className="h-5 w-5" /> About
          </Link>
          <Link to="/contact" onClick={toggleMenu} className="flex items-center gap-2 py-2">
            <Mail className="h-5 w-5" /> Contact
          </Link>
        </div>

        {/* Mobile Auth/Profile */}
        <div className={`border-t px-3 py-4 text-sm ${theme === "dark" ? "border-gray-700" : "border-gray-200"}`}>
          {!user ? (
            <div className="space-y-1">
              <Link to="/login" onClick={toggleMenu} className="flex items-center gap-2 px-3 py-2 rounded">
                <LogIn className="w-4 h-4" /> Login
              </Link>
              <Link to="/register" onClick={toggleMenu} className="flex items-center gap-2 px-3 py-2 rounded">
                <UserPlus className="w-4 h-4" /> Register
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-3 px-1">
                {user?.image ? (
                  <img src={user.image} alt="User Avatar" className="w-9 h-9 rounded-full object-cover border-2" />
                ) : (
                  <User className="w-9 h-9 rounded-full p-1" />
                )}
                <div>
                  <p className="font-medium">{user.name || "User"}</p>
                  <p className="text-xs">{user.email}</p>
                </div>
              </div>

              <div className="space-y-1">
                <Link to="/profile" onClick={toggleMenu} className="flex items-center gap-2 px-3 py-1.5 rounded">
                  <IdCard className="w-4 h-4" /> Your Profile
                </Link>
                <Link to="/your-courses" onClick={toggleMenu} className="flex items-center gap-2 px-3 py-1.5 rounded">
                  <Library className="w-4 h-4" /> Your Courses
                </Link>
                <Link to="/settings" onClick={toggleMenu} className="flex items-center gap-2 px-3 py-1.5 rounded">
                  <Cog className="w-4 h-4" /> Settings
                </Link>
                <Link to="/change-password" onClick={toggleMenu} className="flex items-center gap-2 px-3 py-1.5 rounded">
                  <LockKeyhole className="w-4 h-4" /> Change Password
                </Link>
                <button onClick={() => { toggleMenu(); handleLogout(); }} className="w-full text-left flex items-center gap-2 px-3 py-1.5 rounded">
                  <LogOut className="w-4 h-4" /> Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
