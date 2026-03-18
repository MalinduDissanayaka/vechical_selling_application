import { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const categoryText = {
  car: 'Practical city and highway cars tailored for everyday comfort.',
  van: 'Spacious vehicles made for family plans and flexible hauling.',
  bus: 'Passenger-focused options built for capacity and long routes.',
  lorry: 'Heavy-duty commercial picks for freight and logistics work.'
};

const money = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0
});

export default function CategoryPage() {
  const { type } = useParams();
  const [vehicles, setVehicles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    let isActive = true;

    setIsLoading(true);
    setError('');

    axios
      .get(`${API_BASE_URL}/api/vehicles`, { params: { category: type } })
      .then((response) => {
        if (isActive) {
          setVehicles(response.data || []);
        }
      })
      .catch((requestError) => {
        if (isActive) {
          setError(requestError.response?.data?.msg || 'Could not fetch vehicles right now.');
        }
      })
      .finally(() => {
        if (isActive) {
          setIsLoading(false);
        }
      });

    return () => {
      isActive = false;
    };
  }, [type]);

  const headline = useMemo(() => {
    if (!type) return 'Vehicles';
    return `${type.charAt(0).toUpperCase()}${type.slice(1)} Collection`;
  }, [type]);

  const addToCart = (vehicle) => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    cart.push(vehicle);
    localStorage.setItem('cart', JSON.stringify(cart));
    toast.success(`${vehicle.title} added to cart`);
  };

  const buyNow = (vehicle) => {
    toast.success(`Order confirmed for ${vehicle.title}`);
  };

  return (
    <main className="page vehicles-page">
      <div className="page-shell">
        <header className="panel topbar reveal">
          <div>
            <span className="eyebrow">Category View</span>
            <h1 className="page-title">{headline}</h1>
            <p className="page-subtitle">{categoryText[type] || 'Explore all available options in this segment.'}</p>
          </div>

          <div className="action-strip">
            <button className="btn btn-secondary" onClick={() => navigate('/dashboard')}>Back to Dashboard</button>
            <button className="btn btn-ghost" onClick={() => navigate('/cart')}>Open Cart</button>
          </div>
        </header>

        {error && <div className="status status-error">{error}</div>}

        {isLoading && <div className="panel loading">Loading vehicles...</div>}

        {!isLoading && !vehicles.length && !error && (
          <section className="empty-state reveal">
            <h3>No vehicles listed yet</h3>
            <p>This category is currently empty. Please check back shortly.</p>
          </section>
        )}

        {!isLoading && vehicles.length > 0 && (
          <section className="vehicle-grid">
            {vehicles.map((vehicle, index) => (
              <article key={vehicle._id} className="panel vehicle-card reveal" style={{ animationDelay: `${index * 65}ms` }}>
                <img
                  className="vehicle-thumb"
                  src={vehicle.image || `https://picsum.photos/seed/${vehicle._id || vehicle.title}/640/420`}
                  alt={vehicle.title}
                />

                <div className="vehicle-body">
                  <div className="vehicle-meta">
                    <h3>{vehicle.title}</h3>
                    <span className="badge badge-warm">{vehicle.category}</span>
                  </div>

                  <p>{vehicle.description || `${vehicle.make || 'Popular'} ${vehicle.model || 'model'} ready for booking.`}</p>
                  <strong>{money.format(vehicle.price || 0)}</strong>

                  <div className="vehicle-actions">
                    <button className="btn btn-primary" onClick={() => addToCart(vehicle)}>Add to Cart</button>
                    <button className="btn btn-secondary" onClick={() => buyNow(vehicle)}>Buy Now</button>
                  </div>
                </div>
              </article>
            ))}
          </section>
        )}
      </div>
    </main>
  );
}