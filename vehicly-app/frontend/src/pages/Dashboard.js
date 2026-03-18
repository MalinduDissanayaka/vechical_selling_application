import { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const categories = ['car', 'van', 'bus', 'lorry'];

export default function Dashboard() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem('token')) navigate('/');
  }, [navigate]);

  return (
    <div>
      <h1>Welcome {user?.name} 👋</h1>
      <h2>Choose Vehicle Category</h2>
      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
        {categories.map(cat => (
          <button key={cat} style={{ padding: '20px', fontSize: '20px' }}
            onClick={() => navigate(`/category/${cat}`)}>
            🛒 {cat.toUpperCase()}
          </button>
        ))}
      </div>
      <br />
      <button onClick={() => navigate('/cart')}>🛍️ Cart</button>
      {user?.role === 'admin' && <button onClick={() => navigate('/admin')}>🔧 Admin Panel</button>}
    </div>
  );
}