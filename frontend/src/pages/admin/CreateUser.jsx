import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import Layout from '../../components/Layout';
import Input from '../../components/Input';
import Select from '../../components/Select';
import Button from '../../components/Button';
import { adminService } from '../../services';
import { validationRules } from '../../utils/validation';

export default function CreateUser() {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: { role: 'USER' },
  });

  const onSubmit = async (data) => {
    setError('');
    setLoading(true);
    try {
      await adminService.createUser(data);
      navigate('/admin/users');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout title="Add New User">
      <Link to="/admin/users" className="back-link">&larr; Back to Users</Link>

      <div className="card card-narrow">
        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit(onSubmit)} className="form-grid">
          <Input label="Name" register={register('name', validationRules.name)} error={errors.name} />
          <Input label="Email" type="email" register={register('email', validationRules.email)} error={errors.email} />
          <Input label="Address" register={register('address', validationRules.address)} error={errors.address} />
          <Input label="Password" type="password" register={register('password', validationRules.password)} error={errors.password} />
          <Select
            label="Role"
            register={register('role', { required: 'Role is required' })}
            error={errors.role}
            options={[
              { value: 'USER', label: 'Normal User' },
              { value: 'ADMIN', label: 'System Administrator' },
              { value: 'STORE_OWNER', label: 'Store Owner' },
            ]}
          />
          <Button type="submit" loading={loading}>Create User</Button>
        </form>
      </div>
    </Layout>
  );
}
