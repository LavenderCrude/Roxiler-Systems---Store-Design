const storeRepository = require('../repositories/store.repository');
const ratingRepository = require('../repositories/rating.repository');
const { parseListParams } = require('../utils/queryBuilder');
const AppError = require('../utils/AppError');

class StoreOwnerService {
  async getDashboard(ownerId) {
    const store = await storeRepository.findByOwnerId(ownerId);
    if (!store) {
      throw new AppError('No store found for this owner account', 404);
    }

    const stats = await ratingRepository.getStoreAverageRating(store.id);

    return {
      store: {
        id: store.id,
        name: store.name,
        email: store.email,
        address: store.address,
      },
      avg_rating: stats.avg_rating,
      rating_count: stats.rating_count,
    };
  }

  async listRatings(ownerId, query) {
    const store = await storeRepository.findByOwnerId(ownerId);
    if (!store) {
      throw new AppError('No store found for this owner account', 404);
    }

    const { sort, pagination } = parseListParams(query);
    const result = await ratingRepository.findByStoreId({
      storeId: store.id,
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
}

module.exports = new StoreOwnerService();
