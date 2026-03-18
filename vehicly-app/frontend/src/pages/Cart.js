export default function Cart() {
  const cart = JSON.parse(localStorage.getItem('cart') || '[]');

  return (
    <div>
      <h1>Your Cart 🛍️</h1>
      {cart.map(item => <p key={item._id}>{item.title} - ₹{item.price}</p>)}
      <button onClick={() => { localStorage.removeItem('cart'); alert('🎉 Order Placed!'); }}>Checkout & Pay</button>
    </div>
  );
}