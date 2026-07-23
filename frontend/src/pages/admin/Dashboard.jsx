import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../components/Layout';
import LoadingSpinner from '../../components/LoadingSpinner';
import { adminService } from '../../services';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    adminService.getDashboard()
      .then(({ data }) => setStats(data.data))
      .catch((err) => setError(err.response?.data?.message || 'Failed to load dashboard'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Layout><LoadingSpinner fullPage /></Layout>;

  return (
    <Layout title="Admin Dashboard">
      {error && <div className="alert alert-error">{error}</div>}

      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-value">{stats?.totalUsers ?? 0}</span>
          <span className="stat-label">Total Users</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{stats?.totalStores ?? 0}</span>
          <span className="stat-label">Total Stores</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{stats?.totalRatings ?? 0}</span>
          <span className="stat-label">Total Ratings</span>
        </div>
      </div>

      <div className="quick-links">
        <Link to="/admin/users/new" className="quick-link-card">Add New User</Link>
        <Link to="/admin/stores/new" className="quick-link-card">Add New Store</Link>
        <Link to="/admin/users" className="quick-link-card">Manage Users</Link>
        <Link to="/admin/stores" className="quick-link-card">Manage Stores</Link>
      </div>
    </Layout>
  );
}
