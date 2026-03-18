import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const categories = ['car', 'van', 'bus', 'lorry'];

const defaultForm = {
  title: '',
  category: 'car',
  make: '',
  model: '',
  year: 2024,
  price: 1000000,
  image: 'https://picsum.photos/seed/vehicly/620/390',
  description: ''
};

const money = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0
});

export default function AdminPanel() {
  const [vehicles, setVehicles] = useState([]);
  const [form, setForm] = useState(defaultForm);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const authHeaders = {
    headers: { 'x-auth-token': localStorage.getItem('token') }
  };

  const updateField = (field, value) => {
    setForm((prevForm) => ({ ...prevForm, [field]: value }));
  };

  const load = async () => {
    setIsLoading(true);
    setError('');

    try {
      const response = await axios.get(`${API_BASE_URL}/api/vehicles`);
      setVehicles(response.data || []);
    } catch (requestError) {
      setError(requestError.response?.data?.msg || 'Unable to load inventory.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const create = async (event) => {
    event.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    setError('');
    setStatus('');

    try {
      await axios.post(`${API_BASE_URL}/api/vehicles`, form, authHeaders);
      setForm(defaultForm);
      setStatus('Vehicle created successfully.');
      toast.success('Vehicle added to inventory');
      await load();
    } catch (requestError) {
      setError(requestError.response?.data?.msg || 'Unable to create vehicle. Log in as admin and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const del = async (id) => {
    const shouldDelete = window.confirm('Delete this vehicle from inventory?');
    if (!shouldDelete) return;

    setError('');
    setStatus('');

    try {
      await axios.delete(`${API_BASE_URL}/api/vehicles/${id}`, authHeaders);
      setVehicles((prevVehicles) => prevVehicles.filter((vehicle) => vehicle._id !== id));
      setStatus('Vehicle removed.');
      toast.info('Vehicle deleted');
    } catch (requestError) {
      setError(requestError.response?.data?.msg || 'Unable to delete vehicle.');
    }
  };

  return (
    <main className="page admin-page">
      <div className="page-shell">
        <header className="panel topbar reveal">
          <div>
            <span className="eyebrow">Admin Studio</span>
            <h1 className="page-title">Inventory control center</h1>
            <p className="page-subtitle">Add fresh listings and keep your marketplace inventory up to date.</p>
          </div>

          <div className="action-strip">
            <button className="btn btn-ghost" onClick={() => navigate('/dashboard')}>Back to Dashboard</button>
          </div>
        </header>

        {error && <div className="status status-error">{error}</div>}
        {status && <div className="status status-success">{status}</div>}

        <section className="admin-layout">
          <article className="panel reveal admin-form">
            <h3>Create Vehicle</h3>

            <form className="admin-form" onSubmit={create}>
              <div className="input-group">
                <label className="label" htmlFor="title">Title</label>
                <input
                  id="title"
                  className="input"
                  placeholder="Example: Urban Glide 1.8"
                  value={form.title}
                  onChange={(event) => updateField('title', event.target.value)}
                  required
                />
              </div>

              <div className="field-grid">
                <div className="input-group">
                  <label className="label" htmlFor="category">Category</label>
                  <select
                    id="category"
                    className="select"
                    value={form.category}
                    onChange={(event) => updateField('category', event.target.value)}
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                <div className="input-group">
                  <label className="label" htmlFor="year">Year</label>
                  <input
                    id="year"
                    type="number"
                    className="input"
                    value={form.year}
                    onChange={(event) => updateField('year', Number(event.target.value))}
                    min="1990"
                    max="2100"
                  />
                </div>
              </div>

              <div className="field-grid">
                <div className="input-group">
                  <label className="label" htmlFor="make">Make</label>
                  <input
                    id="make"
                    className="input"
                    placeholder="Brand"
                    value={form.make}
                    onChange={(event) => updateField('make', event.target.value)}
                  />
                </div>

                <div className="input-group">
                  <label className="label" htmlFor="model">Model</label>
                  <input
                    id="model"
                    className="input"
                    placeholder="Variant"
                    value={form.model}
                    onChange={(event) => updateField('model', event.target.value)}
                  />
                </div>
              </div>

              <div className="field-grid">
                <div className="input-group">
                  <label className="label" htmlFor="price">Price (INR)</label>
                  <input
                    id="price"
                    type="number"
                    className="input"
                    value={form.price}
                    onChange={(event) => updateField('price', Number(event.target.value))}
                    min="0"
                    required
                  />
                </div>

                <div className="input-group">
                  <label className="label" htmlFor="image">Image URL</label>
                  <input
                    id="image"
                    className="input"
                    value={form.image}
                    onChange={(event) => updateField('image', event.target.value)}
                  />
                </div>
              </div>

              <div className="input-group">
                <label className="label" htmlFor="description">Description</label>
                <textarea
                  id="description"
                  className="textarea"
                  rows="3"
                  value={form.description}
                  onChange={(event) => updateField('description', event.target.value)}
                  placeholder="Highlight key features"
                />
              </div>

              <button className="btn btn-primary btn-block" type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Create Vehicle'}
              </button>
            </form>
          </article>

          <article className="panel reveal" style={{ animationDelay: '110ms' }}>
            <h3>Current Inventory</h3>
            <p className="hint">{vehicles.length} listings available</p>

            {isLoading ? (
              <div className="loading">Loading inventory...</div>
            ) : (
              <div className="vehicle-list" style={{ marginTop: '0.75rem' }}>
                {vehicles.map((vehicle) => (
                  <div key={vehicle._id} className="vehicle-row">
                    <div>
                      <div className="vehicle-row-head">
                        <h4>{vehicle.title}</h4>
                        <span className="badge badge-soft">{vehicle.category}</span>
                      </div>
                      <p>{vehicle.make || 'Vehicly'} {vehicle.model || ''} • {vehicle.year || 'N/A'}</p>
                      <strong>{money.format(vehicle.price || 0)}</strong>
                    </div>

                    <button className="btn btn-danger" onClick={() => del(vehicle._id)}>Delete</button>
                  </div>
                ))}

                {!vehicles.length && (
                  <div className="empty-state">
                    <h4>No vehicles yet</h4>
                    <p>Create your first listing using the form.</p>
                  </div>
                )}
              </div>
            )}
          </article>
        </section>
      </div>
    </main>
  );
}