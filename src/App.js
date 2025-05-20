import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import CoffeeList from './pages/CoffeeList';
import Cart from './pages/Cart';
import MyOrders from './pages/MyOrders';

const PrivateRoute = ({ children }) => {
  const { token } = React.useContext(AuthContext);
  return token ? children : <Navigate to="/" />;
};

function App() {
  useEffect(() => {
    const tg = window.Telegram.WebApp;
    console.log('Telegram WebApp initialized:', tg);
  }, []);

  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div>
            <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm">
              <div className="container-fluid">
                <Link className="navbar-brand fw-bold" to="/">☕ CoffeeTime</Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                  <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                  <ul className="navbar-nav ms-auto">
                    <li className="nav-item">
                      <Link className="nav-link" to="/">Меню</Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to="/cart">Корзина</Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to="/orders">Мои заказы</Link>
                    </li>
                  </ul>
                </div>
              </div>
            </nav>

            <div className="container mt-4">
              <Routes>
                <Route path="/" element={<CoffeeList />} />
                <Route path="/cart" element={<PrivateRoute><Cart /></PrivateRoute>} />
                <Route path="/orders" element={<PrivateRoute><MyOrders /></PrivateRoute>} />
              </Routes>
            </div>
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
