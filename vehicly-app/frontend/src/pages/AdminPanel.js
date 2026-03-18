import { useState, useEffect } from 'react';
import axios from 'axios';

export default function AdminPanel() {
  const [vehicles, setVehicles] = useState([]);
  const [form, setForm] = useState({ title: '', category: 'car', make: '', model: '', year: 2024, price: 1000000, image: 'https://picsum.photos/200' });

  const load = () => axios.get('http://localhost:5000/api/vehicles').then(r => setVehicles(r.data));

  useEffect(() => { load(); }, []);

  const create = async () => {
    await axios.post('http://localhost:5000/api/vehicles', form, { headers: { 'x-auth-token': localStorage.getItem('token') } });
    load();
    alert('Vehicle Created ✅');
  };

  const del = async (id) => {
    await axios.delete(`http://localhost:5000/api/vehicles/${id}`, { headers: { 'x-auth-token': localStorage.getItem('token') } });
    load();
  };

  return (
    <div>
      <h1>🔧 Admin - CRUD Vehicles</h1>
      <input placeholder="Title" onChange={e => setForm({ ...form, title: e.target.value })} />
      <select onChange={e => setForm({ ...form, category: e.target.value })}>
        {['car','van','bus','lorry'].map(c => <option key={c}>{c}</option>)}
      </select>
      <input placeholder="Make" onChange={e => setForm({ ...form, make: e.target.value })} />
      <input placeholder="Price" type="number" onChange={e => setForm({ ...form, price: +e.target.value })} />
      <button onClick={create}>Create Vehicle</button>

      <h2>All Vehicles</h2>
      {vehicles.map(v => (
        <div key={v._id}>
          {v.title} - {v.category} ₹{v.price}
          <button onClick={() => del(v._id)}>Delete ❌</button>
        </div>
      ))}
      <button onClick={() => window.location.href = '/dashboard'}>Back to Dashboard</button>
    </div>
  );
}