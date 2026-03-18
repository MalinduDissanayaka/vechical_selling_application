import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

export default function CategoryPage() {
  const { type } = useParams();
  const [vehicles, setVehicles] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`http://localhost:5000/api/vehicles?category=${type}`)
      .then(res => setVehicles(res.data));
  }, [type]);

  const addToCart = (v) => {
    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
    cart.push(v);
    localStorage.setItem('cart', JSON.stringify(cart));
    toast.success(`${v.title} added to cart!`);
  };

  return (
    <div>
      <h1>{type.toUpperCase()} Vehicles</h1>
      <button onClick={() => navigate('/dashboard')}>← Back to Categories</button>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '20px' }}>
        {vehicles.map(v => (
          <div key={v._id} style={{ border: '1px solid #ccc', padding: '10px' }}>
            <h3>{v.title}</h3>
            <p>₹{v.price}</p>
            <button onClick={() => addToCart(v)}>Add to Cart 🛒</button>
            <button onClick={() => alert(`🎉 You bought ${v.title}!`)}>Buy Now 💰</button>
          </div>
        ))}
      </div>
    </div>
  );
}