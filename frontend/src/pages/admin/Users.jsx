import { useEffect, useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout';
import DataTable, { Pagination } from '../../components/DataTable';
import Button from '../../components/Button';
import LoadingSpinner from '../../components/LoadingSpinner';
import { adminService } from '../../services';

export default function AdminUsers() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [meta, setMeta] = useState({ page: 1, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ name: '', email: '', address: '', role: '' });
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('ASC');

  const fetchUsers = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const params = { page, limit: 10, sortBy, sortOrder, roles: 'ADMIN,USER,STORE_OWNER', ...filters };
      Object.keys(params).forEach((k) => !params[k] && delete params[k]);
      const { data } = await adminService.getUsers(params);
      setUsers(data.data);
      setMeta(data.meta);
    } catch {
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, [filters, sortBy, sortOrder]);

  useEffect(() => { fetchUsers(1); }, [fetchUsers]);

  const columns = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'address', label: 'Address', sortable: true },
    { key: 'role', label: 'Role', sortable: true },
  ];

  return (
    <Layout
      title="Users"
      actions={<Link to="/admin/users/new"><Button>Add User</Button></Link>}
    >
      <div className="filters-bar">
        <input placeholder="Filter by name" value={filters.name} onChange={(e) => setFilters({ ...filters, name: e.target.value })} />
        <input placeholder="Filter by email" value={filters.email} onChange={(e) => setFilters({ ...filters, email: e.target.value })} />
        <input placeholder="Filter by address" value={filters.address} onChange={(e) => setFilters({ ...filters, address: e.target.value })} />
        <select value={filters.role} onChange={(e) => setFilters({ ...filters, role: e.target.value })}>
          <option value="">All Roles</option>
          <option value="ADMIN">Admin</option>
          <option value="USER">User</option>
          <option value="STORE_OWNER">Store Owner</option>
        </select>
        <Button variant="secondary" onClick={() => fetchUsers(1)}>Apply</Button>
      </div>

      {loading ? <LoadingSpinner /> : (
        <>
          <DataTable
            columns={columns}
            data={users}
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSort={(key, order) => { setSortBy(key); setSortOrder(order); }}
            onRowClick={(row) => navigate(`/admin/users/${row.id}`)}
          />
          <Pagination page={meta.page} totalPages={meta.totalPages} onPageChange={fetchUsers} />
        </>
      )}
    </Layout>
  );
}
