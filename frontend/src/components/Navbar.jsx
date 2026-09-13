import { Link, useNavigate } from "react-router";
import { Button } from "./ui/button";

function Navbar({ user, onLogout }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    onLogout?.();
    navigate("/");
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link
          to="/"
          className="text-2xl font-bold text-gray-900 hover:text-blue-600 transition"
        >
          MoBlog
        </Link>
        <nav className="flex items-center gap-6">
          <Link
            to="/"
            className="text-gray-700 hover:text-blue-600 font-medium transition"
          >
            Bosh sahifa
          </Link>
          {user ? (
            <div className="flex items-center gap-4">
              <span className="text-gray-700 font-medium">{user.ism}</span>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                Chiqish
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="text-gray-700 hover:text-blue-600 font-medium transition"
              >
                Kirish
              </Link>
              <Link to="/register">
                <Button size="sm">Ro'yxatdan o'tish</Button>
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
