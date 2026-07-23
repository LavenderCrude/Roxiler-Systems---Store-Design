const mysql = require('mysql2/promise');
const env = require('./env');
const logger = require('../utils/logger');

const pool = mysql.createPool({
  host: env.db.host,
  port: env.db.port,
  user: env.db.user,
  password: env.db.password,
  database: env.db.database,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
});

pool.getConnection()
  .then((connection) => {
    logger.info('MySQL connection pool established');
    connection.release();
  })
  .catch((err) => {
    logger.error('MySQL connection failed:', err.message);
  });

module.exports = pool;
