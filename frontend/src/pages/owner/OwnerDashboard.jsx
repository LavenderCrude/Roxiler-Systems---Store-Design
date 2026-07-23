import { useEffect, useState, useCallback } from 'react';
import Layout from '../../components/Layout';
import DataTable, { Pagination } from '../../components/DataTable';
import LoadingSpinner from '../../components/LoadingSpinner';
import { storeOwnerService } from '../../services';
import { formatRating } from '../../utils/validation';

export default function OwnerDashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [ratings, setRatings] = useState([]);
  const [meta, setMeta] = useState({ page: 1, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('DESC');

  const fetchRatings = useCallback(async (page = 1) => {
    try {
      const { data } = await storeOwnerService.getRatings({ page, limit: 10, sortBy, sortOrder });
      setRatings(data.data);
      setMeta(data.meta);
    } catch {
      setRatings([]);
    }
  }, [sortBy, sortOrder]);

  useEffect(() => {
    Promise.all([
      storeOwnerService.getDashboard(),
      storeOwnerService.getRatings({ page: 1, limit: 10, sortBy, sortOrder }),
    ])
      .then(([dashRes, ratingsRes]) => {
        setDashboard(dashRes.data.data);
        setRatings(ratingsRes.data.data);
        setMeta(ratingsRes.data.meta);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { if (!loading) fetchRatings(meta.page); }, [sortBy, sortOrder]);

  const columns = [
    { key: 'user_name', label: 'User Name', sortable: true },
    { key: 'user_email', label: 'Email', sortable: false },
    { key: 'user_address', label: 'Address', sortable: false },
    { key: 'rating', label: 'Rating', sortable: true },
    { key: 'created_at', label: 'Date', sortable: true, render: (row) => new Date(row.created_at).toLocaleDateString() },
  ];

  if (loading) return <Layout><LoadingSpinner fullPage /></Layout>;

  return (
    <Layout title="Store Owner Dashboard">
      {dashboard && (
        <div className="owner-summary card">
          <h2>{dashboard.store.name}</h2>
          <p>{dashboard.store.address}</p>
          <div className="owner-stats">
            <div className="stat-card stat-card--highlight">
              <span className="stat-value">{formatRating(dashboard.avg_rating)}</span>
              <span className="stat-label">Average Rating</span>
            </div>
            <div className="stat-card">
              <span className="stat-value">{dashboard.rating_count}</span>
              <span className="stat-label">Total Ratings</span>
            </div>
          </div>
        </div>
      )}

      <h2 className="section-title">Users Who Rated Your Store</h2>
      <DataTable
        columns={columns}
        data={ratings}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSort={(key, order) => { setSortBy(key); setSortOrder(order); }}
        emptyMessage="No ratings yet"
      />
      <Pagination page={meta.page} totalPages={meta.totalPages} onPageChange={fetchRatings} />
    </Layout>
  );
}
