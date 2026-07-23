import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from './Button';

export default function Navbar() {
  const { user, logout, homePath } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to={homePath} className="navbar-brand">
          Store Rating Platform
        </Link>

        {user && (
          <div className="navbar-menu">
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
            <span className="navbar-user">{user.name}</span>
            <Button variant="secondary" size="sm" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
}
