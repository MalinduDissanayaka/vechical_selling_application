import { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const categories = [
  {
    key: 'car',
    title: 'Cars',
    badge: 'Daily Drive',
    description: 'Balanced comfort and fuel economy for city and highway commutes.'
  },
  {
    key: 'van',
    title: 'Vans',
    badge: 'Family Space',
    description: 'Flexible seating and cargo-friendly layouts for longer trips.'
  },
  {
    key: 'bus',
    title: 'Buses',
    badge: 'Commercial',
    description: 'Reliable larger-capacity options suited for group transport.'
  },
  {
    key: 'lorry',
    title: 'Lorries',
    badge: 'Heavy Duty',
    description: 'Workhorse picks for logistics, hauling, and business operations.'
  }
];

export default function Dashboard() {
  const { user, token, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) navigate('/');
  }, [navigate, token]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <main className="page dashboard-page">
      <div className="page-shell">
        <header className="panel topbar reveal">
          <div>
            <span className="eyebrow">Vehicle Hub</span>
            <h1 className="page-title">Welcome back, {user?.name || 'Driver'}.</h1>
            <p className="page-subtitle">Choose a category and build your shortlist in just a few clicks.</p>
          </div>

          <div className="action-strip">
            <button className="btn btn-secondary" onClick={() => navigate('/cart')}>Open Cart</button>
            {user?.role === 'admin' && (
              <button className="btn btn-primary" onClick={() => navigate('/admin')}>Admin Studio</button>
            )}
            <button className="btn btn-ghost" onClick={handleLogout}>Log Out</button>
          </div>
        </header>

        <section className="category-grid">
          {categories.map((category, index) => (
            <article
              key={category.key}
              className="category-card reveal"
              style={{ animationDelay: `${80 * index}ms` }}
            >
              <span className="badge badge-soft category-chip">{category.badge}</span>
              <div>
                <h3>{category.title}</h3>
                <p>{category.description}</p>
              </div>
              <button className="btn btn-primary" onClick={() => navigate(`/category/${category.key}`)}>
                Browse {category.title}
              </button>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}