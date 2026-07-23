import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../context/AuthContext';
import { validationRules } from '../../utils/validation';
import Input from '../../components/Input';
import Button from '../../components/Button';

export default function Register() {
  const { register: registerUser } = useAuth();
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
      await registerUser(data);
      navigate('/stores');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Create Account</h1>
        <p className="auth-subtitle">Register as a normal user</p>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
          <Input
            label="Name"
            register={register('name', validationRules.name)}
            error={errors.name}
          />
          <Input
            label="Email"
            type="email"
            register={register('email', validationRules.email)}
            error={errors.email}
          />
          <Input
            label="Address"
            register={register('address', validationRules.address)}
            error={errors.address}
          />
          <Input
            label="Password"
            type="password"
            register={register('password', validationRules.password)}
            error={errors.password}
          />
          <Button type="submit" loading={loading} className="btn-full">
            Register
          </Button>
        </form>

        <p className="auth-footer">
          Already have an account? <Link to="/login">Sign In</Link>
        </p>
      </div>
    </div>
  );
}
