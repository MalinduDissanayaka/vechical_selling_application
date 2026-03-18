import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import CategoryPage from './pages/CategoryPage';
import AdminPanel from './pages/AdminPanel';
import Cart from './pages/Cart';
import { AuthProvider } from './context/AuthContext';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/category/:type" element={<CategoryPage />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/cart" element={<Cart />} />
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