const pool = require('../config/database');
const { ALLOWED_SORT } = require('../utils/queryBuilder');

class StoreRepository {
  async create({ name, email, address, ownerId }) {
    const [result] = await pool.execute(
      'INSERT INTO stores (name, email, address, owner_id) VALUES (?, ?, ?, ?)',
      [name, email, address, ownerId]
    );
    return this.findById(result.insertId);
  }

  async findById(id) {
    const [rows] = await pool.execute(
      `SELECT s.id, s.name, s.email, s.address, s.owner_id, s.created_at, s.updated_at,
              COALESCE(AVG(r.rating), 0) AS avg_rating,
              COUNT(r.id) AS rating_count
       FROM stores s
       LEFT JOIN ratings r ON r.store_id = s.id
       WHERE s.id = ?
       GROUP BY s.id`,
      [id]
    );
    return rows[0] || null;
  }

  async findByOwnerId(ownerId) {
    const [rows] = await pool.execute(
      'SELECT id, name, email, address, owner_id, created_at, updated_at FROM stores WHERE owner_id = ?',
      [ownerId]
    );
    return rows[0] || null;
  }

  async countAll(filters = {}) {
    const { whereClause, params } = this._buildFilterClause(filters);
    const [rows] = await pool.execute(
      `SELECT COUNT(*) AS total FROM stores s ${whereClause}`,
      params
    );
    return rows[0].total;
  }

  async findAll({ filters, sort, pagination }) {
    const { whereClause, params } = this._buildFilterClause(filters);
    const sortBy = ALLOWED_SORT.stores.includes(sort.sortBy) ? sort.sortBy : 'name';
    const sortOrder = sort.sortOrder === 'DESC' ? 'DESC' : 'ASC';
    const limit = Math.min(Math.max(pagination.limit, 1), 100);
    const offset = (Math.max(pagination.page, 1) - 1) * limit;

    const orderColumn = sortBy === 'avg_rating' ? 'avg_rating' : `s.${sortBy}`;

    const dataQuery = `
      SELECT
        s.id, s.name, s.email, s.address, s.owner_id, s.created_at, s.updated_at,
        COALESCE(AVG(r.rating), 0) AS avg_rating,
        COUNT(r.id) AS rating_count
      FROM stores s
      LEFT JOIN ratings r ON r.store_id = s.id
      ${whereClause}
      GROUP BY s.id
      ORDER BY ${orderColumn} ${sortOrder}
      LIMIT ? OFFSET ?
    `;

    const countQuery = `SELECT COUNT(*) AS total FROM stores s ${whereClause}`;

    const [rows] = await pool.execute(dataQuery, [...params, limit, offset]);
    const [countRows] = await pool.execute(countQuery, params);

    return {
      data: rows.map((row) => ({
        ...row,
        avg_rating: parseFloat(Number(row.avg_rating).toFixed(2)),
      })),
      total: countRows[0].total,
      page: pagination.page,
      limit,
    };
  }

  async findAllForUser({ userId, filters, sort, pagination }) {
    const { whereClause, params } = this._buildFilterClause(filters);
    const sortBy = ALLOWED_SORT.stores.includes(sort.sortBy) ? sort.sortBy : 'name';
    const sortOrder = sort.sortOrder === 'DESC' ? 'DESC' : 'ASC';
    const limit = Math.min(Math.max(pagination.limit, 1), 100);
    const offset = (Math.max(pagination.page, 1) - 1) * limit;
    const orderColumn = sortBy === 'avg_rating' ? 'avg_rating' : `s.${sortBy}`;

    const dataQuery = `
      SELECT
        s.id, s.name, s.email, s.address, s.created_at,
        COALESCE(AVG(r.rating), 0) AS avg_rating,
        COUNT(r.id) AS rating_count,
        ur.rating AS user_rating,
        ur.id AS user_rating_id
      FROM stores s
      LEFT JOIN ratings r ON r.store_id = s.id
      LEFT JOIN ratings ur ON ur.store_id = s.id AND ur.user_id = ?
      ${whereClause}
      GROUP BY s.id, ur.rating, ur.id
      ORDER BY ${orderColumn} ${sortOrder}
      LIMIT ? OFFSET ?
    `;

    const countQuery = `SELECT COUNT(*) AS total FROM stores s ${whereClause}`;

    const [rows] = await pool.execute(dataQuery, [userId, ...params, limit, offset]);
    const [countRows] = await pool.execute(countQuery, params);

    return {
      data: rows.map((row) => ({
        id: row.id,
        name: row.name,
        address: row.address,
        avg_rating: parseFloat(Number(row.avg_rating).toFixed(2)),
        rating_count: row.rating_count,
        user_rating: row.user_rating ?? null,
      })),
      total: countRows[0].total,
      page: pagination.page,
      limit,
    };
  }

  _buildFilterClause(filters) {
    const conditions = [];
    const params = [];

    if (filters.name) {
      conditions.push('s.name LIKE ?');
      params.push(`%${filters.name}%`);
    }
    if (filters.email) {
      conditions.push('s.email LIKE ?');
      params.push(`%${filters.email}%`);
    }
    if (filters.address) {
      conditions.push('s.address LIKE ?');
      params.push(`%${filters.address}%`);
    }

    const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
    return { whereClause, params };
  }
}

module.exports = new StoreRepository();
