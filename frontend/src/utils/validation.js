export const PASSWORD_PATTERN = /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,16}$/;

export const validationRules = {
  name: {
    required: 'Name is required',
    minLength: { value: 20, message: 'Name must be at least 20 characters' },
    maxLength: { value: 60, message: 'Name must not exceed 60 characters' },
  },
  email: {
    required: 'Email is required',
    pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Invalid email address' },
  },
  address: {
    required: 'Address is required',
    maxLength: { value: 400, message: 'Address must not exceed 400 characters' },
  },
  password: {
    required: 'Password is required',
    minLength: { value: 8, message: 'Password must be at least 8 characters' },
    maxLength: { value: 16, message: 'Password must not exceed 16 characters' },
    pattern: {
      value: PASSWORD_PATTERN,
      message: 'Password must include an uppercase letter and a special character',
    },
  },
};

export function getRoleHomePath(role) {
  switch (role) {
    case 'ADMIN': return '/admin/dashboard';
    case 'STORE_OWNER': return '/owner/dashboard';
    default: return '/stores';
  }
}

export function formatRating(value) {
  return value ? Number(value).toFixed(1) : '0.0';
}
