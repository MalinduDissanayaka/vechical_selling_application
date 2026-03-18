import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const demoAccounts = [
  { label: 'Admin demo', email: 'admin@test.com', password: '123456' },
  { label: 'User demo', email: 'user@test.com', password: '123456' }
];

export default function Login() {
  const [email, setEmail] = useState('admin@test.com');
  const [password, setPassword] = useState('123456');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    setError('');

    const result = await login(email.trim(), password);

    if (result?.role === 'admin') {
      navigate('/admin');
    } else if (result?.role) {
      navigate('/dashboard');
    } else {
      setError(result?.error || 'Unable to sign in right now.');
    }

    setIsSubmitting(false);
  };

  return (
    <main className="page login-page">
      <div className="page-shell">
        <section className="login-grid">
          <article className="panel panel-ghost hero-copy reveal">
            <span className="eyebrow">Vehicly Marketplace</span>
            <h1>Find the right ride without the usual chaos.</h1>
            <p>
              Browse categories, compare pricing quickly, and keep your shortlist organized while
              you decide.
            </p>
            <ul className="feature-list">
              <li><span className="feature-dot" />Instant category browsing</li>
              <li><span className="feature-dot" />Fast cart with local persistence</li>
              <li><span className="feature-dot" />Dedicated admin panel for inventory</li>
            </ul>
            <div className="credentials">
              {demoAccounts.map((account) => (
                <button
                  key={account.label}
                  type="button"
                  className="pill"
                  onClick={() => {
                    setEmail(account.email);
                    setPassword(account.password);
                    setError('');
                  }}
                >
                  {account.label}
                </button>
              ))}
            </div>
          </article>

          <article className="panel reveal" style={{ animationDelay: '90ms' }}>
            <span className="eyebrow">Sign In</span>
            <h2 className="page-title" style={{ fontSize: '2rem' }}>Welcome Back</h2>
            <p className="page-subtitle">Use one of the demo accounts or your registered credentials.</p>

            <form className="auth-form" onSubmit={handleLogin}>
              <div className="input-group">
                <label className="label" htmlFor="email">Email</label>
                <input
                  id="email"
                  className="input"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                />
              </div>

              <div className="input-group">
                <label className="label" htmlFor="password">Password</label>
                <input
                  id="password"
                  type="password"
                  className="input"
                  placeholder="Enter password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                />
              </div>

              {error && <div className="status status-error">{error}</div>}

              <button type="submit" className="btn btn-primary btn-block" disabled={isSubmitting}>
                {isSubmitting ? 'Signing in...' : 'Sign In'}
              </button>
            </form>

            <p className="hint" style={{ marginTop: '0.8rem' }}>
              Quick test: admin@test.com / 123456
            </p>
          </article>
        </section>
      </div>
    </main>
  );
}