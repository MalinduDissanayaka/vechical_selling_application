import { useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const demoAccounts = [
  { label: 'Admin demo', email: 'admin@test.com', password: '123456' },
  { label: 'User demo', email: 'user@test.com', password: '123456' }
];

export default function Login() {
  const [mode, setMode] = useState('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('admin@test.com');
  const [password, setPassword] = useState('123456');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user, login, register } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user?.role) return;

    if (user.role === 'admin') {
      navigate('/admin');
      return;
    }

    navigate('/dashboard');
  }, [navigate, user]);

  const modeCopy = useMemo(
    () =>
      mode === 'login'
        ? {
            title: 'Welcome Back',
            subtitle: 'Use one of the demo accounts or your registered credentials.',
            button: 'Sign In'
          }
        : {
            title: 'Create Your Account',
            subtitle: 'Sign up as a normal user and start browsing vehicles right away.',
            button: 'Create Account'
          },
    [mode]
  );

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (isSubmitting) return;

    if (mode === 'register' && password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    const result =
      mode === 'login'
        ? await login(email.trim(), password)
        : await register(name.trim(), email.trim(), password);

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
                    setMode('login');
                    setEmail(account.email);
                    setPassword(account.password);
                    setConfirmPassword('');
                    setError('');
                  }}
                >
                  {account.label}
                </button>
              ))}
            </div>
          </article>

          <article className="panel reveal" style={{ animationDelay: '90ms' }}>
            <div className="auth-switch">
              <button
                type="button"
                className={`pill ${mode === 'login' ? 'pill-active' : ''}`}
                onClick={() => {
                  setMode('login');
                  setError('');
                }}
              >
                Sign In
              </button>
              <button
                type="button"
                className={`pill ${mode === 'register' ? 'pill-active' : ''}`}
                onClick={() => {
                  setMode('register');
                  setName('');
                  setPassword('');
                  setConfirmPassword('');
                  setError('');
                }}
              >
                Sign Up
              </button>
            </div>

            <span className="eyebrow">{mode === 'login' ? 'Sign In' : 'Sign Up'}</span>
            <h2 className="page-title" style={{ fontSize: '2rem' }}>{modeCopy.title}</h2>
            <p className="page-subtitle">{modeCopy.subtitle}</p>

            <form className="auth-form" onSubmit={handleSubmit}>
              {mode === 'register' && (
                <div className="input-group">
                  <label className="label" htmlFor="name">Full Name</label>
                  <input
                    id="name"
                    className="input"
                    placeholder="Your full name"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    required
                  />
                </div>
              )}

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

              {mode === 'register' && (
                <div className="input-group">
                  <label className="label" htmlFor="confirmPassword">Confirm Password</label>
                  <input
                    id="confirmPassword"
                    type="password"
                    className="input"
                    placeholder="Re-enter password"
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    required
                  />
                </div>
              )}

              {error && <div className="status status-error">{error}</div>}

              <button type="submit" className="btn btn-primary btn-block" disabled={isSubmitting}>
                {isSubmitting ? (mode === 'login' ? 'Signing in...' : 'Creating account...') : modeCopy.button}
              </button>
            </form>

            {mode === 'login' && (
              <p className="hint" style={{ marginTop: '0.8rem' }}>
                Quick test: admin@test.com / 123456
              </p>
            )}
          </article>
        </section>
      </div>
    </main>
  );
}