const pool = require('../config/database');

const ALLOWED_SORT = {
  users: ['name', 'email', 'address', 'role', 'created_at'],
  stores: ['name', 'email', 'address', 'created_at', 'avg_rating'],
  ratings: ['rating', 'created_at', 'user_name'],
};

function buildListQuery({ baseQuery, countQuery, filters, sort, pagination, allowedSortFields }) {
  const params = [];
  const conditions = [];

  if (filters.name) {
    conditions.push('name LIKE ?');
    params.push(`%${filters.name}%`);
  }
  if (filters.email) {
    conditions.push('email LIKE ?');
    params.push(`%${filters.email}%`);
  }
  if (filters.address) {
    conditions.push('address LIKE ?');
    params.push(`%${filters.address}%`);
  }
  if (filters.role) {
    conditions.push('role = ?');
    params.push(filters.role);
  }

  const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

  const sortBy = allowedSortFields.includes(sort.sortBy) ? sort.sortBy : allowedSortFields[0];
  const sortOrder = sort.sortOrder === 'DESC' ? 'DESC' : 'ASC';

  const limit = Math.min(Math.max(pagination.limit, 1), 100);
  const offset = (Math.max(pagination.page, 1) - 1) * limit;

  const dataQuery = `${baseQuery} ${whereClause} ORDER BY ${sortBy} ${sortOrder} LIMIT ? OFFSET ?`;
  const dataParams = [...params, limit, offset];
  const countParams = [...params];

  return {
    dataQuery,
    dataParams,
    countQuery: `${countQuery} ${whereClause}`,
    countParams,
    pagination: { page: pagination.page, limit, offset },
  };
}

function parseListParams(query) {
  return {
    filters: {
      name: query.name || null,
      email: query.email || null,
      address: query.address || null,
      role: query.role || null,
    },
    sort: {
      sortBy: query.sortBy || null,
      sortOrder: (query.sortOrder || 'ASC').toUpperCase(),
    },
    pagination: {
      page: parseInt(query.page, 10) || 1,
      limit: parseInt(query.limit, 10) || 10,
    },
  };
}

module.exports = { buildListQuery, parseListParams, ALLOWED_SORT };
