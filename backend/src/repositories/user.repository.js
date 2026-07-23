const pool = require('../config/database');
const { buildListQuery, ALLOWED_SORT } = require('../utils/queryBuilder');

class UserRepository {
  async findByEmail(email) {
    const [rows] = await pool.execute(
      `SELECT id, name, email, password_hash, address, role, created_at, updated_at
       FROM users WHERE email = ?`,
      [email]
    );
    return rows[0] || null;
  }

  async findById(id) {
    const [rows] = await pool.execute(
      `SELECT id, name, email, address, role, created_at, updated_at
       FROM users WHERE id = ?`,
      [id]
    );
    return rows[0] || null;
  }

  async create({ name, email, passwordHash, address, role }) {
    const [result] = await pool.execute(
      'INSERT INTO users (name, email, password_hash, address, role) VALUES (?, ?, ?, ?, ?)',
      [name, email, passwordHash, address, role]
    );
    return this.findById(result.insertId);
  }

  async updatePassword(id, passwordHash) {
    await pool.execute(
      'UPDATE users SET password_hash = ? WHERE id = ?',
      [passwordHash, id]
    );
  }

  async countAll(filters = {}) {
    const { whereClause, params } = this._buildFilterClause(filters);
    const [rows] = await pool.execute(
      `SELECT COUNT(*) AS total FROM users u ${whereClause}`,
      params
    );
    return rows[0].total;
  }

  async findAll({ filters, sort, pagination }) {
    const baseQuery = `
      SELECT u.id, u.name, u.email, u.address, u.role, u.created_at, u.updated_at
      FROM users u
    `;
    const countQuery = 'SELECT COUNT(*) AS total FROM users u';

    const { whereClause, params } = this._buildFilterClause(filters);
    const sortBy = ALLOWED_SORT.users.includes(sort.sortBy) ? sort.sortBy : 'name';
    const sortOrder = sort.sortOrder === 'DESC' ? 'DESC' : 'ASC';
    const limit = Math.min(Math.max(pagination.limit, 1), 100);
    const offset = (Math.max(pagination.page, 1) - 1) * limit;

    const dataQuery = `
      ${baseQuery}
      ${whereClause}
      ORDER BY u.${sortBy} ${sortOrder}
      LIMIT ? OFFSET ?
    `;

    const [rows] = await pool.execute(dataQuery, [...params, limit, offset]);
    const [countRows] = await pool.execute(
      `${countQuery} ${whereClause}`,
      params
    );

    return {
      data: rows,
      total: countRows[0].total,
      page: pagination.page,
      limit,
    };
  }

  async findByIdWithStoreRating(id) {
    const [rows] = await pool.execute(
      `SELECT
         u.id, u.name, u.email, u.address, u.role, u.created_at, u.updated_at,
         s.id AS store_id,
         s.name AS store_name,
         COALESCE(AVG(r.rating), 0) AS store_rating,
         COUNT(r.id) AS rating_count
       FROM users u
       LEFT JOIN stores s ON s.owner_id = u.id
       LEFT JOIN ratings r ON r.store_id = s.id
       WHERE u.id = ?
       GROUP BY u.id, s.id, s.name`,
      [id]
    );
    return rows[0] || null;
  }

  _buildFilterClause(filters) {
    const conditions = [];
    const params = [];

    if (filters.name) {
      conditions.push('u.name LIKE ?');
      params.push(`%${filters.name}%`);
    }
    if (filters.email) {
      conditions.push('u.email LIKE ?');
      params.push(`%${filters.email}%`);
    }
    if (filters.address) {
      conditions.push('u.address LIKE ?');
      params.push(`%${filters.address}%`);
    }
    if (filters.role) {
      conditions.push('u.role = ?');
      params.push(filters.role);
    }
    if (filters.roles && filters.roles.length > 0) {
      const placeholders = filters.roles.map(() => '?').join(', ');
      conditions.push(`u.role IN (${placeholders})`);
      params.push(...filters.roles);
    }

    const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
    return { whereClause, params };
  }
}

module.exports = new UserRepository();
