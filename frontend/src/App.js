import './App.css';
//import './components/SelectSeat.css'; // CSSファイルをインポート
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useNavigate } from 'react-router-dom';
import OrdersPage from './components/OrdersPage';
import CartPage from './components/CartPage';
import OrderHistoryPage from './components/OrderHistoryPage';
import CheckoutPage from './components/CheckoutPage';
import SelectSeat from './components/SelectSeat';
import { v4 as uuidv4 } from 'uuid';

function App() {
  const [items, setItems] = useState([]);
  const [cart, setCart] = useState([]);
  const [seatId, setSeatId] = useState('');
  const sessionId = "2";
  const [menuOpen, setMenuOpen] = useState(false);

  const fetchOrders = () => {
    fetch('/api/items')
      .then((res) => res.json())
      .then((data) => setItems(data.items))
      .catch((err) => console.error('Error fetching orders:', err));
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const addToCart = (item) => {
    setCart([...cart, item]);
  };

  const removeFromCart = (index) => {
    setCart(cart.filter((_, i) => i !== index));
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <Router>
      <div className="container">
        <div className="header">
          <h1>注文アプリ</h1>
          <img src="/images/rabbit.png" alt="Rabbit" />
        </div>
        <nav>
          <div className="hamburger" onClick={toggleMenu}>
            <div className={menuOpen ? "bar open" : "bar"}></div>
            <div className={menuOpen ? "bar open" : "bar"}></div>
            <div className={menuOpen ? "bar open" : "bar"}></div>
          </div>
          <div className={menuOpen ? "menu-backdrop open" : "menu-backdrop"} onClick={closeMenu}></div>
          <ul className={menuOpen ? "nav-links open" : "nav-links"}>
            <li><Link to="/" onClick={toggleMenu}>メニュー</Link></li>
            <li><Link to="/cart" onClick={toggleMenu}>カート</Link></li>
            <li><Link to="/history" onClick={toggleMenu}>注文履歴</Link></li>
            <li><Link to="/checkout" onClick={toggleMenu}>お会計</Link></li>
            <li><Link to="/select-seat" onClick={toggleMenu}>席番号の変更</Link></li>
            <li className="close-menu-button" onClick={closeMenu}>閉じる</li>
          </ul>
        </nav>
        <Routes>
          {seatId ? (
            <>
              <Route path="/" element={<OrdersPage items={items} addToCart={addToCart} />} />
              <Route path="/cart" element={<CartPage cart={cart} calculateTotal={calculateTotal} seatId={seatId} sessionId={sessionId} setCart={setCart} removeFromCart={removeFromCart} />} />
              <Route path="/history" element={<OrderHistoryPage seatId={seatId} sessionId={sessionId} />} />
              <Route path="/checkout" element={<CheckoutPage seatId={seatId} sessionId={sessionId} />} />
            </>
          ) : (
            <Route path="*" element={<SelectSeat setSeatId={setSeatId} />} />
          )}
          <Route path="/select-seat" element={<SelectSeat setSeatId={setSeatId} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
