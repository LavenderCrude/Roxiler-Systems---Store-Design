const pool = require('../config/database');
const { ALLOWED_SORT } = require('../utils/queryBuilder');

class RatingRepository {
  async countAll() {
    const [rows] = await pool.execute('SELECT COUNT(*) AS total FROM ratings');
    return rows[0].total;
  }

  async findByUserAndStore(userId, storeId) {
    const [rows] = await pool.execute(
      'SELECT id, user_id, store_id, rating, created_at, updated_at FROM ratings WHERE user_id = ? AND store_id = ?',
      [userId, storeId]
    );
    return rows[0] || null;
  }

  async create({ userId, storeId, rating }) {
    const [result] = await pool.execute(
      'INSERT INTO ratings (user_id, store_id, rating) VALUES (?, ?, ?)',
      [userId, storeId, rating]
    );
    const [rows] = await pool.execute(
      'SELECT id, user_id, store_id, rating, created_at, updated_at FROM ratings WHERE id = ?',
      [result.insertId]
    );
    return rows[0];
  }

  async update(id, rating) {
    await pool.execute('UPDATE ratings SET rating = ? WHERE id = ?', [rating, id]);
    const [rows] = await pool.execute(
      'SELECT id, user_id, store_id, rating, created_at, updated_at FROM ratings WHERE id = ?',
      [id]
    );
    return rows[0];
  }

  async findByStoreId({ storeId, sort, pagination }) {
    const sortBy = ALLOWED_SORT.ratings.includes(sort.sortBy) ? sort.sortBy : 'created_at';
    const sortOrder = sort.sortOrder === 'DESC' ? 'DESC' : 'ASC';
    const limit = Math.min(Math.max(pagination.limit, 1), 100);
    const offset = (Math.max(pagination.page, 1) - 1) * limit;

    const orderColumn = sortBy === 'user_name' ? 'u.name' : `rt.${sortBy}`;

    const dataQuery = `
      SELECT
        rt.id, rt.rating, rt.created_at, rt.updated_at,
        u.id AS user_id, u.name AS user_name, u.email AS user_email, u.address AS user_address
      FROM ratings rt
      INNER JOIN users u ON u.id = rt.user_id
      WHERE rt.store_id = ?
      ORDER BY ${orderColumn} ${sortOrder}
      LIMIT ? OFFSET ?
    `;

    const [rows] = await pool.execute(dataQuery, [storeId, limit, offset]);
    const [countRows] = await pool.execute(
      'SELECT COUNT(*) AS total FROM ratings WHERE store_id = ?',
      [storeId]
    );

    return {
      data: rows,
      total: countRows[0].total,
      page: pagination.page,
      limit,
    };
  }

  async getStoreAverageRating(storeId) {
    const [rows] = await pool.execute(
      `SELECT COALESCE(AVG(rating), 0) AS avg_rating, COUNT(*) AS rating_count
       FROM ratings WHERE store_id = ?`,
      [storeId]
    );
    return {
      avg_rating: parseFloat(Number(rows[0].avg_rating).toFixed(2)),
      rating_count: rows[0].rating_count,
    };
  }
}

module.exports = new RatingRepository();
