const storeRepository = require('../repositories/store.repository');
const ratingRepository = require('../repositories/rating.repository');
const { parseListParams } = require('../utils/queryBuilder');
const AppError = require('../utils/AppError');

class StoreService {
  async listStores(userId, query) {
    const { filters, sort, pagination } = parseListParams(query);
    const result = await storeRepository.findAllForUser({
      userId,
      filters,
      sort,
      pagination,
    });

    return {
      data: result.data,
      meta: {
        page: result.page,
        limit: result.limit,
        total: result.total,
        totalPages: Math.ceil(result.total / result.limit) || 1,
      },
    };
  }

  async submitRating(userId, storeId, rating) {
    const store = await storeRepository.findById(storeId);
    if (!store) {
      throw new AppError('Store not found', 404);
    }

    const existing = await ratingRepository.findByUserAndStore(userId, storeId);
    if (existing) {
      throw new AppError('You have already rated this store. Use update instead.', 409);
    }

    return ratingRepository.create({ userId, storeId, rating });
  }

  async updateRating(userId, storeId, rating) {
    const store = await storeRepository.findById(storeId);
    if (!store) {
      throw new AppError('Store not found', 404);
    }

    const existing = await ratingRepository.findByUserAndStore(userId, storeId);
    if (!existing) {
      throw new AppError('You have not rated this store yet. Submit a rating first.', 404);
    }

    return ratingRepository.update(existing.id, rating);
  }
}

module.exports = new StoreService();
