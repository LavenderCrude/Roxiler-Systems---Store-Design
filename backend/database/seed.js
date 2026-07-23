require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const bcrypt = require('bcryptjs');
const mysql = require('mysql2/promise');

const SALT_ROUNDS = 12;

const seedUsers = [
  {
    name: 'System Administrator Account',
    email: 'admin@storeplatform.com',
    password: 'Admin@1234',
    address: '100 Admin Boulevard, Suite 500, Platform City, PC 10001',
    role: 'ADMIN',
  },
  {
    name: 'John Doe Normal User Account',
    email: 'user@storeplatform.com',
    password: 'User@1234',
    address: '200 User Street, Apartment 3B, Platform City, PC 10002',
    role: 'USER',
  },
  {
    name: 'Jane Smith Store Owner Account',
    email: 'owner@storeplatform.com',
    password: 'Owner@1234',
    address: '300 Commerce Avenue, Platform City, PC 10003',
    role: 'STORE_OWNER',
  },
  {
    name: 'Robert Johnson Store Owner Two',
    email: 'owner2@storeplatform.com',
    password: 'Owner@1234',
    address: '400 Market Lane, Platform City, PC 10004',
    role: 'STORE_OWNER',
  },
];

const seedStores = [
  {
    name: 'Fresh Mart Grocery',
    email: 'freshmart@stores.com',
    address: '10 Market Street, Platform City, PC 10010',
    ownerEmail: 'owner@storeplatform.com',
  },
  {
    name: 'Tech Hub Electronics',
    email: 'techhub@stores.com',
    address: '20 Innovation Drive, Platform City, PC 10011',
    ownerEmail: 'owner2@storeplatform.com',
  },
];

async function seed() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT, 10) || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'store_rating_db',
  });

  try {
    console.log('Seeding database...');

    const userIds = {};
    for (const user of seedUsers) {
      const hash = await bcrypt.hash(user.password, SALT_ROUNDS);
      const [existing] = await connection.execute(
        'SELECT id FROM users WHERE email = ?',
        [user.email]
      );

      if (existing.length > 0) {
        userIds[user.email] = existing[0].id;
        console.log(`  User already exists: ${user.email}`);
      } else {
        const [result] = await connection.execute(
          'INSERT INTO users (name, email, password_hash, address, role) VALUES (?, ?, ?, ?, ?)',
          [user.name, user.email, hash, user.address, user.role]
        );
        userIds[user.email] = result.insertId;
        console.log(`  Created user: ${user.email} (${user.role})`);
      }
    }

    for (const store of seedStores) {
      const ownerId = userIds[store.ownerEmail];
      const [existing] = await connection.execute(
        'SELECT id FROM stores WHERE email = ?',
        [store.email]
      );

      if (existing.length > 0) {
        console.log(`  Store already exists: ${store.name}`);
      } else {
        await connection.execute(
          'INSERT INTO stores (name, email, address, owner_id) VALUES (?, ?, ?, ?)',
          [store.name, store.email, store.address, ownerId]
        );
        console.log(`  Created store: ${store.name}`);
      }
    }

    const [stores] = await connection.execute('SELECT id FROM stores LIMIT 1');
    const normalUserId = userIds['user@storeplatform.com'];

    if (stores.length > 0) {
      const [existingRating] = await connection.execute(
        'SELECT id FROM ratings WHERE user_id = ? AND store_id = ?',
        [normalUserId, stores[0].id]
      );

      if (existingRating.length === 0) {
        await connection.execute(
          'INSERT INTO ratings (user_id, store_id, rating) VALUES (?, ?, ?)',
          [normalUserId, stores[0].id, 4]
        );
        console.log('  Created sample rating');
      }
    }

    console.log('Seed complete');
    console.log('\nDefault credentials:');
    console.log('  Admin:       admin@storeplatform.com / Admin@1234');
    console.log('  User:        user@storeplatform.com  / User@1234');
    console.log('  Store Owner: owner@storeplatform.com / Owner@1234');
  } catch (err) {
    console.error('Seed failed:', err.message);
    process.exit(1);
  } finally {
    await connection.end();
  }
}

seed();
