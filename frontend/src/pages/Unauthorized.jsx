import { Link } from 'react-router-dom';
import Button from '../components/Button';

export default function Unauthorized() {
  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Access Denied</h1>
        <p className="auth-subtitle">You do not have permission to view this page.</p>
        <Link to="/login"><Button>Go to Login</Button></Link>
      </div>
    </div>
  );
}
