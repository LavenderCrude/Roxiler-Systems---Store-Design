const userRepository = require('../repositories/user.repository');
const { hashPassword, comparePassword } = require('../utils/password');
const { signToken } = require('../utils/jwt');
const AppError = require('../utils/AppError');

class AuthService {
  async register({ name, email, address, password }) {
    const existing = await userRepository.findByEmail(email);
    if (existing) {
      throw new AppError('Email is already registered', 409);
    }

    const passwordHash = await hashPassword(password);
    const user = await userRepository.create({
      name,
      email,
      passwordHash,
      address,
      role: 'USER',
    });

    const token = signToken({ id: user.id, email: user.email, role: user.role });
    return { user: this._sanitize(user), token };
  }

  async login({ email, password }) {
    const user = await userRepository.findByEmail(email);
    if (!user) {
      throw new AppError('Invalid email or password', 401);
    }

    const isValid = await comparePassword(password, user.password_hash);
    if (!isValid) {
      throw new AppError('Invalid email or password', 401);
    }

    const token = signToken({ id: user.id, email: user.email, role: user.role });
    return { user: this._sanitize(user), token };
  }

  async changePassword(userId, { currentPassword, newPassword }) {
    const profile = await userRepository.findById(userId);
    if (!profile) {
      throw new AppError('User not found', 404);
    }

    const user = await userRepository.findByEmail(profile.email);
    const isValid = await comparePassword(currentPassword, user.password_hash);
    if (!isValid) {
      throw new AppError('Current password is incorrect', 401);
    }

    const passwordHash = await hashPassword(newPassword);
    await userRepository.updatePassword(userId, passwordHash);
  }

  async getProfile(userId) {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new AppError('User not found', 404);
    }
    return this._sanitize(user);
  }

  _sanitize(user) {
    const { password_hash, ...safe } = user;
    return safe;
  }
}

module.exports = new AuthService();
