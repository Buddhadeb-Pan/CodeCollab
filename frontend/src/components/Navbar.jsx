import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="border-b border-line bg-bg-primary/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="font-mono font-bold text-lg text-cream tracking-tight">
          <span className="text-amber">⌘</span> CodeCollab
        </Link>

        <div className="flex items-center gap-6 font-mono text-sm">
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
      </div>
    </nav>
  );
};

export default Navbar;
