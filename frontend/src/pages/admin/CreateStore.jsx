import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import Layout from '../../components/Layout';
import Input from '../../components/Input';
import Select from '../../components/Select';
import Button from '../../components/Button';
import { adminService } from '../../services';
import { validationRules } from '../../utils/validation';

export default function CreateStore() {
  const navigate = useNavigate();
  const [owners, setOwners] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm();

  useEffect(() => {
    adminService.getUsers({ role: 'STORE_OWNER', limit: 100 })
      .then(({ data }) => setOwners(data.data))
      .catch(() => setOwners([]));
  }, []);

  const onSubmit = async (data) => {
    setError('');
    setLoading(true);
    try {
      await adminService.createStore({
        name: data.name,
        email: data.email,
        address: data.address,
        ownerId: parseInt(data.ownerId, 10),
      });
      navigate('/admin/stores');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create store');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout title="Add New Store">
      <Link to="/admin/stores" className="back-link">&larr; Back to Stores</Link>

      <div className="card card-narrow">
        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit(onSubmit)} className="form-grid">
          <Input label="Store Name" register={register('name', { required: 'Store name is required' })} error={errors.name} />
          <Input label="Store Email" type="email" register={register('email', validationRules.email)} error={errors.email} />
          <Input label="Address" register={register('address', validationRules.address)} error={errors.address} />
          <Select
            label="Store Owner"
            register={register('ownerId', { required: 'Store owner is required' })}
            error={errors.ownerId}
            options={[
              { value: '', label: 'Select an owner...' },
              ...owners.map((o) => ({ value: o.id, label: `${o.name} (${o.email})` })),
            ]}
          />
          <Button type="submit" loading={loading}>Create Store</Button>
        </form>
      </div>
    </Layout>
  );
}
