import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, User, Menu, X, Sparkles } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-surface-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to={isAuthenticated ? '/dashboard' : '/'} className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-xl bg-primary-600 flex items-center justify-center shadow-sm group-hover:bg-primary-700 transition-colors duration-200">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-primary-600">HireHarvester</span>
            <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-primary-50 text-primary-600 rounded-full border border-primary-100">AI</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-2">
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="btn-ghost">Dashboard</Link>
                <Link to="/history" className="btn-ghost">History</Link>
                <Link to="/profile" className="btn-ghost">Profile</Link>

                <div className="relative ml-2">
                  <button
                    onClick={() => setProfileOpen(!profileOpen)}
                    className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-surface-100 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-xl bg-primary-600 flex items-center justify-center text-white text-sm font-bold">
                      {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                    <span className="text-sm font-medium text-surface-600 hidden lg:block">{user?.name}</span>
                  </button>

                  {profileOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-elevated border border-surface-200 py-2 animate-slide-down">
                      <div className="px-4 py-3 border-b border-surface-100">
                        <p className="text-sm font-bold text-surface-800">{user?.name}</p>
                        <p className="text-xs text-surface-400">{user?.email}</p>
                      </div>
                      <Link to="/profile" onClick={() => setProfileOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm text-surface-600 hover:bg-surface-50 hover:text-surface-800 transition-colors">
                        <User className="w-4 h-4" />
                        My Profile
                      </Link>
                      <button onClick={handleLogout} className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors">
                        <LogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="btn-ghost">Login</Link>
                <Link to="/signup" className="btn-primary text-sm !py-2.5 !px-5">Get Started</Link>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2 rounded-xl hover:bg-surface-100 text-surface-600">
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-surface-200 animate-slide-down absolute w-full shadow-elevated">
          <div className="px-4 py-4 space-y-2">
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" onClick={() => setMenuOpen(false)} className="block px-4 py-3 rounded-xl hover:bg-surface-50 text-surface-600 hover:text-surface-800 font-medium">Dashboard</Link>
                <Link to="/history" onClick={() => setMenuOpen(false)} className="block px-4 py-3 rounded-xl hover:bg-surface-50 text-surface-600 hover:text-surface-800 font-medium">History</Link>
                <Link to="/profile" onClick={() => setMenuOpen(false)} className="block px-4 py-3 rounded-xl hover:bg-surface-50 text-surface-600 hover:text-surface-800 font-medium">Profile</Link>
                <button onClick={handleLogout} className="w-full text-left px-4 py-3 rounded-xl hover:bg-red-50 text-red-600 font-medium">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setMenuOpen(false)} className="block px-4 py-3 rounded-xl hover:bg-surface-50 text-surface-600 hover:text-surface-800 font-medium">Login</Link>
                <Link to="/signup" onClick={() => setMenuOpen(false)} className="block px-4 py-3 rounded-xl text-center btn-primary">Get Started</Link>
              </>
            )}
          </div>
        </div>
      )}

      {/* Overlay to close profile dropdown */}
      {profileOpen && <div className="fixed inset-0 z-[-1]" onClick={() => setProfileOpen(false)} />}
    </nav>
  );
}
