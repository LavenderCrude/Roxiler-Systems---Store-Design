import { useEffect, useState, useCallback } from 'react';
import Layout from '../../components/Layout';
import DataTable, { Pagination } from '../../components/DataTable';
import RatingInput from '../../components/RatingInput';
import Button from '../../components/Button';
import LoadingSpinner from '../../components/LoadingSpinner';
import { storeService } from '../../services';
import { formatRating } from '../../utils/validation';

export default function StoreList() {
  const [stores, setStores] = useState([]);
  const [meta, setMeta] = useState({ page: 1, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ name: '', address: '' });
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('ASC');
  const [ratingLoading, setRatingLoading] = useState(null);
  const [message, setMessage] = useState('');

  const fetchStores = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const params = { page, limit: 10, sortBy, sortOrder, ...filters };
      Object.keys(params).forEach((k) => !params[k] && delete params[k]);
      const { data } = await storeService.getStores(params);
      setStores(data.data);
      setMeta(data.meta);
    } catch {
      setStores([]);
    } finally {
      setLoading(false);
    }
  }, [filters, sortBy, sortOrder]);

  useEffect(() => { fetchStores(1); }, [fetchStores]);

  const handleRating = async (storeId, rating, hasExisting) => {
    setRatingLoading(storeId);
    setMessage('');
    try {
      if (hasExisting) {
        await storeService.updateRating(storeId, rating);
        setMessage('Rating updated successfully');
      } else {
        await storeService.submitRating(storeId, rating);
        setMessage('Rating submitted successfully');
      }
      fetchStores(meta.page);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to submit rating');
    } finally {
      setRatingLoading(null);
    }
  };

  return (
    <Layout title="Browse Stores">
      <div className="filters-bar">
        <input placeholder="Search by name" value={filters.name} onChange={(e) => setFilters({ ...filters, name: e.target.value })} />
        <input placeholder="Search by address" value={filters.address} onChange={(e) => setFilters({ ...filters, address: e.target.value })} />
        <Button variant="secondary" onClick={() => fetchStores(1)}>Search</Button>
      </div>

      {message && <div className="alert alert-success">{message}</div>}

      {loading ? <LoadingSpinner /> : (
        <>
          <div className="store-grid">
            {stores.map((store) => (
              <div key={store.id} className="store-card">
                <h3>{store.name}</h3>
                <p className="store-address">{store.address}</p>
                <div className="store-ratings">
                  <span>Overall: <strong>{formatRating(store.avg_rating)}</strong> ({store.rating_count})</span>
                  <span>Your rating: <strong>{store.user_rating ?? 'Not rated'}</strong></span>
                </div>
                <RatingInput
                  value={store.user_rating}
                  loading={ratingLoading === store.id}
                  onSubmit={(rating) => handleRating(store.id, rating, !!store.user_rating)}
                />
              </div>
            ))}
            {stores.length === 0 && <p className="empty-message">No stores found</p>}
          </div>
          <Pagination page={meta.page} totalPages={meta.totalPages} onPageChange={fetchStores} />
        </>
      )}
    </Layout>
  );
}
