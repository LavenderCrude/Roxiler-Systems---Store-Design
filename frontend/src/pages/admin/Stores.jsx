import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../components/Layout';
import DataTable, { Pagination } from '../../components/DataTable';
import Button from '../../components/Button';
import LoadingSpinner from '../../components/LoadingSpinner';
import { adminService } from '../../services';
import { formatRating } from '../../utils/validation';

export default function AdminStores() {
  const [stores, setStores] = useState([]);
  const [meta, setMeta] = useState({ page: 1, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ name: '', email: '', address: '' });
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('ASC');

  const fetchStores = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const params = { page, limit: 10, sortBy, sortOrder, ...filters };
      Object.keys(params).forEach((k) => !params[k] && delete params[k]);
      const { data } = await adminService.getStores(params);
      setStores(data.data);
      setMeta(data.meta);
    } catch {
      setStores([]);
    } finally {
      setLoading(false);
    }
  }, [filters, sortBy, sortOrder]);

  useEffect(() => { fetchStores(1); }, [fetchStores]);

  const columns = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'address', label: 'Address', sortable: true },
    { key: 'avg_rating', label: 'Rating', sortable: true, render: (row) => formatRating(row.avg_rating) },
  ];

  return (
    <Layout
      title="Stores"
      actions={<Link to="/admin/stores/new"><Button>Add Store</Button></Link>}
    >
      <div className="filters-bar">
        <input placeholder="Filter by name" value={filters.name} onChange={(e) => setFilters({ ...filters, name: e.target.value })} />
        <input placeholder="Filter by email" value={filters.email} onChange={(e) => setFilters({ ...filters, email: e.target.value })} />
        <input placeholder="Filter by address" value={filters.address} onChange={(e) => setFilters({ ...filters, address: e.target.value })} />
        <Button variant="secondary" onClick={() => fetchStores(1)}>Apply</Button>
      </div>

      {loading ? <LoadingSpinner /> : (
        <>
          <DataTable
            columns={columns}
            data={stores}
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSort={(key, order) => { setSortBy(key); setSortOrder(order); }}
          />
          <Pagination page={meta.page} totalPages={meta.totalPages} onPageChange={fetchStores} />
        </>
      )}
    </Layout>
  );
}
