import { useContext } from 'react';
import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import CategoryPage from './pages/CategoryPage';
import AdminPanel from './pages/AdminPanel';
import Cart from './pages/Cart';
import { AuthContext, AuthProvider } from './context/AuthContext';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

function ProtectedRoute({ children }) {
  const { token } = useContext(AuthContext);
  return token ? children : <Navigate to="/" replace />;
}

function AdminRoute({ children }) {
  const { token, user } = useContext(AuthContext);

  if (!token) {
    return <Navigate to="/" replace />;
  }

  if (user?.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route
            path="/dashboard"
            element={(
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            )}
          />
          <Route
            path="/category/:type"
            element={(
              <ProtectedRoute>
                <CategoryPage />
              </ProtectedRoute>
            )}
          />
          <Route
            path="/admin"
            element={(
              <AdminRoute>
                <AdminPanel />
              </AdminRoute>
            )}
          />
          <Route
            path="/cart"
            element={(
              <ProtectedRoute>
                <Cart />
              </ProtectedRoute>
            )}
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
      <ToastContainer
        position="top-right"
        autoClose={2400}
        hideProgressBar
        newestOnTop
        pauseOnHover
      />
    </AuthProvider>
  );
}

export default App;