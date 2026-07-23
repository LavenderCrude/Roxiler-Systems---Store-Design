import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '../../components/Layout';
import LoadingSpinner from '../../components/LoadingSpinner';
import { adminService } from '../../services';
import { formatRating } from '../../utils/validation';

export default function UserDetail() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    adminService.getUserById(id)
      .then(({ data }) => setUser(data.data))
      .catch((err) => setError(err.response?.data?.message || 'User not found'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Layout><LoadingSpinner fullPage /></Layout>;

  return (
    <Layout title="User Details">
      <Link to="/admin/users" className="back-link">&larr; Back to Users</Link>

      {error && <div className="alert alert-error">{error}</div>}

      {user && (
        <div className="card detail-card">
          <dl className="detail-list">
            <dt>Name</dt><dd>{user.name}</dd>
            <dt>Email</dt><dd>{user.email}</dd>
            <dt>Address</dt><dd>{user.address}</dd>
            <dt>Role</dt><dd><span className="badge">{user.role}</span></dd>
            {user.role === 'STORE_OWNER' && user.store && (
              <>
                <dt>Store</dt><dd>{user.store.name}</dd>
                <dt>Store Rating</dt>
                <dd>{formatRating(user.store.rating)} ({user.store.rating_count} ratings)</dd>
              </>
            )}
          </dl>
        </div>
      )}
    </Layout>
  );
}
