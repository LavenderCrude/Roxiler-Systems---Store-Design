import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from './Button';
import './Navbar.css';

export default function Navbar() {
  const { user, logout, homePath } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link to={homePath} className="logo">
          Store<span>Rate</span>
        </Link>

        <nav className="nav-links">
          {user.role === 'ADMIN' && (
            <>
              <Link to="/admin/dashboard">Dashboard</Link>
              <Link to="/admin/users">Users</Link>
              <Link to="/admin/stores">Stores</Link>
            </>
          )}

          {user.role === 'USER' && <Link to="/stores">Stores</Link>}

          {user.role === 'STORE_OWNER' && (
            <Link to="/owner/dashboard">My Store</Link>
          )}

          <Link to="/change-password">Password</Link>
        </nav>

        <div className="nav-right">
          <span>{user.name}</span>

          <Button variant="secondary" size="sm" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
}
