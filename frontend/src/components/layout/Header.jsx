// src/components/layout/Header.jsx
import React, { useRef, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Home,
  Menu,
  X,
  User,
  LogIn,
  LogOut,
  Settings,
  BookOpen,
  Key,
  UserCircle,
} from "lucide-react";
import { useAuth } from "../../hooks/AuthContext";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileDropdownRef = useRef(null);
  const mobileSidebarRef = useRef(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const toggleProfile = () => setProfileOpen(!profileOpen);

  const handleLogout = () => {
    try {
      logout();
      setProfileOpen(false);
      toggleMenu();
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
    <header className="bg-gray-900 text-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold tracking-wide">
          MSK
        </Link>

        <div className="md:hidden">
          <button onClick={toggleMenu}>
            {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex gap-6 items-center">
          <Link to="/" className="hover:text-blue-400 flex items-center gap-1">
            <Home className="h-4 w-4" /> Home
          </Link>
          <Link to="/about" className="hover:text-blue-400 flex items-center gap-1">
            <BookOpen className="h-4 w-4" /> About
          </Link>
          <Link to="/contact" className="hover:text-blue-400 flex items-center gap-1">
            <BookOpen className="h-4 w-4" /> Contact
          </Link>
          <Link to="/courses" className="hover:text-blue-400 flex items-center gap-1">
            <BookOpen className="h-4 w-4" /> Courses
          </Link>

          {user ? (
            <div className="relative group" ref={profileDropdownRef}>
              <button
                onClick={toggleProfile}
                aria-haspopup="true"
                aria-expanded={profileOpen}
                className="flex items-center gap-2 hover:text-blue-400 relative"
              >
                {user?.image ? (
                  <img
                    src={user.image}
                    alt="User Avatar"
                    className="w-8 h-8 rounded-full object-cover border border-gray-600"
                  />
                ) : (
                  <User className="w-8 h-8 rounded-full bg-gray-700 p-1 text-white" />
                )}
              </button>

              {profileOpen && (
                <div className="absolute right-0 mt-2 bg-gray-800 rounded-lg shadow-lg w-48 z-50">
                  <Link to="/your-courses" className="block px-4 py-2 hover:bg-gray-700 flex items-center gap-2" onClick={() => setProfileOpen(false)}>
                    <BookOpen className="h-4 w-4" /> Your Courses
                  </Link>
                  <Link to="/profile" className="flex items-center gap-2 px-3 py-1.5 rounded hover:bg-gray-700 transition" onClick={toggleMenu}>
                    <UserCircle className="w-4 h-4" /> Your Profile
                  </Link>
                  <Link to="/settings" className="block px-4 py-2 hover:bg-gray-700 flex items-center gap-2" onClick={() => setProfileOpen(false)}>
                    <Settings className="h-4 w-4" /> Settings
                  </Link>
                  <Link to="/change-password" className="block px-4 py-2 hover:bg-gray-700 flex items-center gap-2" onClick={() => setProfileOpen(false)}>
                    <Key className="h-4 w-4" /> Change Password
                  </Link>
                  <button onClick={handleLogout} className="w-full text-left px-4 py-2 hover:bg-gray-700 flex items-center gap-2">
                    <LogOut className="h-4 w-4" /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login" className="hover:text-blue-400 flex items-center gap-1">
                <LogIn className="h-4 w-4" /> Login
              </Link>
              <Link to="/register" className="hover:text-blue-400 flex items-center gap-1">
                <User className="h-4 w-4" /> Register
              </Link>
            </>
          )}
        </nav>
      </div>

      {/* Mobile Overlay */}
      {menuOpen && (
        <div onClick={toggleMenu} className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden" />
      )}

      {/* Mobile Sidebar */}
      <div
        ref={mobileSidebarRef}
        className={`md:hidden fixed top-0 right-0 h-full w-72 bg-gray-900 text-white shadow-lg transform transition-transform duration-300 z-50 flex flex-col justify-between ${menuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        onTouchStart={(e) => {
          if (window.innerWidth < 768) {
            window._touchStartX = e.changedTouches[0].screenX;
          }
        }}
        onTouchEnd={(e) => {
          if (window.innerWidth < 768) {
            const diffX = e.changedTouches[0].screenX - window._touchStartX;
            if (diffX < -50) toggleMenu();
          }
        }}
      >
        <div className="flex justify-between items-center px-4 py-3 border-b border-gray-700">
          <span className="text-lg font-semibold">Menu</span>
          <button onClick={toggleMenu}>
            <X className="h-6 w-6 text-white" />
          </button>
        </div>

        <div className="px-4 py-3 space-y-2 flex-1 overflow-y-auto">
          <Link to="/" onClick={toggleMenu} className="flex items-center gap-2 hover:text-blue-400">
            <Home className="h-5 w-5" /> Home
          </Link>
          <Link to="/about" onClick={toggleMenu} className="flex items-center gap-2 hover:text-blue-400">
            <BookOpen className="h-5 w-5" /> About
          </Link>
          <Link to="/contact" onClick={toggleMenu} className="flex items-center gap-2 hover:text-blue-400">
            <BookOpen className="h-5 w-5" /> Contact
          </Link>
          <Link to="/courses" onClick={toggleMenu} className="flex items-center gap-2 hover:text-blue-400">
            <BookOpen className="h-5 w-5" /> Courses
          </Link>
        </div>

        <div className="border-t border-gray-700 px-3 py-4 text-sm">
          {!user ? (
            <div className="space-y-1">
              <Link to="/login" onClick={toggleMenu} className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-700 transition">
                <LogIn className="w-4 h-4" /> Login
              </Link>
              <Link to="/register" onClick={toggleMenu} className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-700 transition">
                <User className="w-4 h-4" /> Register
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-3 px-1">
                {user?.image ? (
                  <img src={user.image} alt="User Avatar" className="w-9 h-9 rounded-full object-cover border border-gray-600" />
                ) : (
                  <User className="w-9 h-9 rounded-full bg-gray-700 p-1 text-white" />
                )}
                <div>
                  <p className="font-medium">{user.name || "User"}</p>
                  <p className="text-xs text-gray-400">{user.email}</p>
                </div>
              </div>

              <div className="space-y-1">
                <Link to="/your-courses" className="flex items-center gap-2 px-3 py-1.5 rounded hover:bg-gray-700 transition" onClick={toggleMenu}>
                  <BookOpen className="w-4 h-4" /> Your Courses
                </Link>
                <Link to="/profile" className="flex items-center gap-2 px-3 py-1.5 rounded hover:bg-gray-700 transition" onClick={toggleMenu}>
                  <UserCircle className="w-4 h-4" /> Your Profile
                </Link>
                <Link to="/settings" className="flex items-center gap-2 px-3 py-1.5 rounded hover:bg-gray-700 transition" onClick={toggleMenu}>
                  <Settings className="w-4 h-4" /> Settings
                </Link>
                <Link to="/change-password" className="flex items-center gap-2 px-3 py-1.5 rounded hover:bg-gray-700 transition" onClick={toggleMenu}>
                  <Key className="w-4 h-4" /> Change Password
                </Link>
                <button onClick={() => { toggleMenu(); handleLogout(); }} className="w-full text-left flex items-center gap-2 px-3 py-1.5 rounded bg-gray-800 hover:bg-gray-700 transition">
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
