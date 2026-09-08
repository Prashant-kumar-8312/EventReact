// src/components/layout/Navbar.jsx
import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
//import { useAuth } from "../../hooks/useAuth";

export default function NavBar () {
  const { user, logout } = useAuth();
 // console.log("NavBar user:", user);
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const linkClass = ({ isActive }) =>
    `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
      isActive
        ? "text-indigo-600 bg-indigo-50"
        : "text-gray-700 hover:text-indigo-600 hover:bg-gray-50"
    }`;

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 font-bold text-xl text-indigo-600">
            🎟️ EventBook
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-1">
            <NavLink to="/events" className={linkClass}>Events</NavLink>
            {user && (
              <NavLink to="/my-tickets" className={linkClass}>My Tickets</NavLink>
            )}
            {user?.role === "Organizer" && (
              <NavLink to="/admin" className={linkClass}>Admin</NavLink>
            )}
            {user?.role == "Organizer" && ( <NavLink to="/create-event" className = {linkClass} >Create Event</NavLink>)}
          </div>

          {/* Right side */}
          <div className="hidden md:flex items-center gap-3">
            {!user ? (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-indigo-600"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
                >
                  Sign Up
                </Link>
              </>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setProfileOpen((o) => !o)}
                  className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-50"
                >
                  <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center text-sm font-semibold">
                    {user.name?.[0]?.toUpperCase() || "U"}
                  </div>
                  <span className="text-sm font-medium text-gray-700">{user.name}</span>
                </button>

                {profileOpen && (
                  <div
                    className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg py-1"
                    onMouseLeave={() => setProfileOpen(false)}
                  >
                  
                    <Link to="/my-tickets" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                      My Tickets
                    </Link>
                    {user.role === "Organizer" && (
                      <Link to="/admin" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                        Admin Dashboard
                      </Link>
                      

                    )}

                     {user.role === "Organizer" && (
                      <Link to="/create-event" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                        Create Event
                      </Link>
                      

                    )}
                    <hr className="my-1 border-gray-100" />
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden p-2 rounded-md text-gray-700 hover:bg-gray-50"
            onClick={() => setMenuOpen((o) => !o)}
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-200 px-4 py-3 space-y-1">
          <NavLink to="/events" className={linkClass} onClick={() => setMenuOpen(false)}>
            Events
          </NavLink>
          {user && (
            <NavLink to="/my-tickets" className={linkClass} onClick={() => setMenuOpen(false)}>
              My Tickets
            </NavLink>
          )}
          {user?.role === "Organizer" && (
            <NavLink to="/admin" className={linkClass} onClick={() => setMenuOpen(false)}>
              Admin
            </NavLink>
          )}

           {user?.role === "Organizer" && (
            <NavLink to="/create-event" className={linkClass} onClick={() => setMenuOpen(false)}>
              Create Event
            </NavLink>
          )}
          <hr className="my-2 border-gray-100" />
          {!user ? (
            <>
              <Link to="/login" className="block px-3 py-2 text-sm text-gray-700" onClick={() => setMenuOpen(false)}>
                Login
              </Link>
              <Link to="/register" className="block px-3 py-2 text-sm text-indigo-600 font-medium" onClick={() => setMenuOpen(false)}>
                Sign Up
              </Link>
            </>
          ) : (
            <>
            
              <button
                onClick={() => { setMenuOpen(false); handleLogout(); }}
                className="block w-full text-left px-3 py-2 text-sm text-red-600"
              >
                Logout
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
}