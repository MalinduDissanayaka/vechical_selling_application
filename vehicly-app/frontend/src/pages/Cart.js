import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const money = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0
});

export default function Cart() {
  const [items, setItems] = useState(() => JSON.parse(localStorage.getItem('cart') || '[]'));
  const navigate = useNavigate();

  const subtotal = useMemo(() => items.reduce((sum, item) => sum + (item.price || 0), 0), [items]);

  const persistCart = (nextItems) => {
    setItems(nextItems);
    localStorage.setItem('cart', JSON.stringify(nextItems));
  };

  const removeItem = (indexToRemove) => {
    const nextItems = items.filter((_, index) => index !== indexToRemove);
    persistCart(nextItems);
    toast.info('Vehicle removed from cart');
  };

  const clearCart = () => {
    persistCart([]);
    localStorage.removeItem('cart');
  };

  const checkout = () => {
    if (!items.length) return;
    localStorage.removeItem('cart');
    setItems([]);
    toast.success('Order placed successfully');
  };

  return (
    <main className="page">
      <div className="page-shell">
        <header className="panel topbar reveal">
          <div>
            <span className="eyebrow">Cart</span>
            <h1 className="page-title">Your shortlist</h1>
            <p className="page-subtitle">Review saved vehicles before placing your order.</p>
          </div>

          <div className="action-strip">
            <button className="btn btn-ghost" onClick={() => navigate('/dashboard')}>Continue Browsing</button>
            <button className="btn btn-danger" onClick={clearCart} disabled={!items.length}>Clear Cart</button>
          </div>
        </header>

        {!items.length ? (
          <section className="empty-state reveal">
            <h3>Your cart is empty</h3>
            <p>Explore categories and add vehicles you want to compare.</p>
            <button className="btn btn-primary" onClick={() => navigate('/dashboard')} style={{ marginTop: '0.8rem' }}>
              Go to Dashboard
            </button>
          </section>
        ) : (
          <section className="cart-layout">
            <div className="cart-list">
              {items.map((item, index) => (
                <article key={`${item._id || item.title}-${index}`} className="panel cart-item reveal" style={{ animationDelay: `${index * 50}ms` }}>
                  <img
                    src={item.image || `https://picsum.photos/seed/${item._id || item.title}/520/340`}
                    alt={item.title}
                  />
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.make || 'Vehicly'} {item.model || 'Edition'} ({item.year || 'N/A'})</p>
                    <strong>{money.format(item.price || 0)}</strong>
                  </div>
                  <button className="btn btn-ghost" onClick={() => removeItem(index)}>Remove</button>
                </article>
              ))}
            </div>

            <aside className="panel summary reveal" style={{ animationDelay: '140ms' }}>
              <h3>Checkout Summary</h3>
              <div className="summary-row">
                <span>Total Items</span>
                <strong>{items.length}</strong>
              </div>
              <div className="summary-row">
                <span>Subtotal</span>
                <strong>{money.format(subtotal)}</strong>
              </div>
              <button className="btn btn-primary btn-block" onClick={checkout}>Checkout & Pay</button>
            </aside>
          </section>
        )}
      </div>
    </main>
  );
}