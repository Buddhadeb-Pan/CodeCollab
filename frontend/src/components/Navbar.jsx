import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
    setMenuOpen(false);
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className="border-b border-line bg-bg-primary/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 md:py-4">
        <div className="flex items-center justify-between">
          <Link
            to="/"
            onClick={closeMenu}
            className="font-mono font-bold text-base md:text-lg text-cream tracking-tight"
          >
            <span className="text-amber">⌘</span> CodeCollab
          </Link>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center gap-6 font-mono text-sm">
            {user ? (
              <>
                <Link to="/dashboard" className="text-muted hover:text-amber transition-colors">
                  dashboard
                </Link>
                <span className="text-muted">
                  <span className="text-amber">●</span> {user.name}
                </span>
                <button
                  onClick={handleLogout}
                  className="text-muted hover:text-red-500 transition-colors"
                >
                  [ logout ]
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-muted hover:text-amber transition-colors">
                  [ login ]
                </Link>
                <Link to="/register" className="text-amber hover:text-amber-bright transition-colors">
                  [ register ]
                </Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden font-mono text-2xl text-amber p-2"
            aria-label="Toggle menu"
          >
            {menuOpen ? "×" : "≡"}
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden mt-3 pt-3 border-t border-line flex flex-col gap-3 font-mono text-sm">
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  onClick={closeMenu}
                  className="text-muted hover:text-amber transition-colors py-2"
                >
                  → dashboard
                </Link>
                <div className="text-muted py-2">
                  <span className="text-amber">●</span> {user.name}
                </div>
                <button
                  onClick={handleLogout}
                  className="text-left text-muted hover:text-red-500 transition-colors py-2"
                >
                  [ logout ]
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={closeMenu}
                  className="text-muted hover:text-amber transition-colors py-2"
                >
                  [ login ]
                </Link>
                <Link
                  to="/register"
                  onClick={closeMenu}
                  className="text-amber hover:text-amber-bright transition-colors py-2"
                >
                  [ register ]
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
