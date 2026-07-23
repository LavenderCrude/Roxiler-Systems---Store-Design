const userRepository = require('../repositories/user.repository');
const storeRepository = require('../repositories/store.repository');
const ratingRepository = require('../repositories/rating.repository');
const { hashPassword } = require('../utils/password');
const { parseListParams } = require('../utils/queryBuilder');
const AppError = require('../utils/AppError');

class AdminService {
  async getDashboardStats() {
    const [totalUsers, totalStores, totalRatings] = await Promise.all([
      userRepository.countAll(),
      storeRepository.countAll(),
      ratingRepository.countAll(),
    ]);

    return { totalUsers, totalStores, totalRatings };
  }

  async createUser({ name, email, address, password, role }) {
    const existing = await userRepository.findByEmail(email);
    if (existing) {
      throw new AppError('Email is already registered', 409);
    }

    const passwordHash = await hashPassword(password);
    return userRepository.create({ name, email, passwordHash, address, role });
  }

  async listUsers(query) {
    const { filters, sort, pagination } = parseListParams(query);

    if (query.roles) {
      filters.roles = query.roles.split(',').map((r) => r.trim().toUpperCase());
    }

    const result = await userRepository.findAll({ filters, sort, pagination });
    return this._paginatedResponse(result);
  }

  async getUserById(id) {
    const user = await userRepository.findByIdWithStoreRating(id);
    if (!user) {
      throw new AppError('User not found', 404);
    }

    const response = {
      id: user.id,
      name: user.name,
      email: user.email,
      address: user.address,
      role: user.role,
      created_at: user.created_at,
      updated_at: user.updated_at,
    };

    if (user.role === 'STORE_OWNER' && user.store_id) {
      response.store = {
        id: user.store_id,
        name: user.store_name,
        rating: parseFloat(Number(user.store_rating).toFixed(2)),
        rating_count: user.rating_count,
      };
    }

    return response;
  }

  async createStore({ name, email, address, ownerId }) {
    const owner = await userRepository.findById(ownerId);
    if (!owner) {
      throw new AppError('Store owner not found', 404);
    }
    if (owner.role !== 'STORE_OWNER') {
      throw new AppError('Selected user must have the STORE_OWNER role', 400);
    }

    const existingStore = await storeRepository.findByOwnerId(ownerId);
    if (existingStore) {
      throw new AppError('This owner already has a registered store', 409);
    }

    const store = await storeRepository.create({ name, email, address, ownerId });
    return storeRepository.findById(store.id);
  }

  async listStores(query) {
    const { filters, sort, pagination } = parseListParams(query);
    const result = await storeRepository.findAll({ filters, sort, pagination });
    return this._paginatedResponse(result);
  }

  _paginatedResponse({ data, total, page, limit }) {
    return {
      data,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1,
      },
    };
  }
}

module.exports = new AdminService();
