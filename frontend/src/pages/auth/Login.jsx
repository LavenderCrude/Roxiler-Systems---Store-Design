import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';

import { useAuth } from '../../context/AuthContext';
import { validationRules } from '../../utils/validation';
import Input from '../../components/Input';
import Button from '../../components/Button';

export default function Login() {
  const { login, homePath } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setError('');
    setLoading(true);
    try {
      const result = await login(data);
      navigate(
        result.user.role === 'ADMIN'
          ? '/admin/dashboard'
          : result.user.role === 'STORE_OWNER'
            ? '/owner/dashboard'
            : '/stores'
      );
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Sign In</h1>
        <p className="auth-subtitle">Welcome back to Store Rating Platform</p>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
          <Input
            label="Email"
            type="email"
            register={register('email', validationRules.email)}
            error={errors.email}
          />
          <Input
            label="Password"
            type="password"
            register={register('password', {
              required: 'Password is required',
            })}
            error={errors.password}
          />
          <Button type="submit" loading={loading} className="btn-full">
            Sign In
          </Button>
        </form>

        <p className="auth-footer">
          Don&apos;t have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
}
