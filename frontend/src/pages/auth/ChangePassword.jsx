import { useState } from 'react';
import { useForm } from 'react-hook-form';
import Layout from '../../components/Layout';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { authService } from '../../services';
import { validationRules } from '../../utils/validation';

export default function ChangePassword() {
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setError('');
    setMessage('');
    setLoading(true);
    try {
      await authService.changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      setMessage('Password updated successfully');
      reset();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout title="Change Password">
      <div className="card card-narrow">
        {message && <div className="alert alert-success">{message}</div>}
        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit(onSubmit)} className="form-grid">
          <Input
            label="Current Password"
            type="password"
            register={register('currentPassword', { required: 'Current password is required' })}
            error={errors.currentPassword}
          />
          <Input
            label="New Password"
            type="password"
            register={register('newPassword', validationRules.password)}
            error={errors.newPassword}
          />
          <Button type="submit" loading={loading}>Update Password</Button>
        </form>
      </div>
    </Layout>
  );
}
