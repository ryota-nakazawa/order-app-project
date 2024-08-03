import './App.css';
import './components/Navigation.css';
import './components/Button.css';
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useNavigate } from 'react-router-dom';
import OrdersPage from './components/OrdersPage';
import CartPage from './components/CartPage';
import OrderHistoryPage from './components/OrderHistoryPage';
import CheckoutPage from './components/CheckoutPage';
import SelectSeat from './components/SelectSeat';
import Header from './components/Header'; // Headerをインポート
import HamburgerMenu from './components/HamburgerMenu'; // HamburgerMenuをインポート
import { v4 as uuidv4 } from 'uuid';

const dummyItems = [
  {
    _id: '1',
    name: 'ラーメン',
    price: 800,
    description: '美味しいラーメンです。',
  },
  {
    _id: '2',
    name: '寿司',
    price: 1200,
    description: '新鮮なネタの寿司です。',
  },
  {
    _id: '3',
    name: 'カレー',
    price: 700,
    description: 'スパイシーなカレーライスです。',
  },
];

const dummyOrders = [
  {
    _id: 'order1',
    seatId: '1',
    sessionId: 'session1',
    items: [
      {
        name: 'ラーメン',
        price: 800,
        description: '美味しいラーメンです。',
        status: '準備中',
        item_id: 'item1',
        quantity: 1,
      },
    ],
    createdAt: new Date(),
    kaikei_status: '未会計',
  },
  {
    _id: 'order2',
    seatId: '2',
    sessionId: 'session2',
    items: [
      {
        name: '寿司',
        price: 1200,
        description: '新鮮なネタの寿司です。',
        status: '準備中',
        item_id: 'item2',
        quantity: 2,
      },
    ],
    createdAt: new Date(),
    kaikei_status: '未会計',
  },
];

function App() {
  const [items, setItems] = useState(dummyItems);
  const [orders, setOrders] = useState(dummyOrders);
  const [cart, setCart] = useState([]);
  const [seatId, setSeatId] = useState('');
  const sessionId = "2";
  const [menuOpen, setMenuOpen] = useState(false);

  const fetchOrders = () => {
    // 本来はAPIからデータを取得するが、ここではダミーデータを使用する
    setItems(dummyItems);
    setOrders(dummyOrders);
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
        <Header />
        <nav>
          <HamburgerMenu toggleMenu={toggleMenu} menuOpen={menuOpen} closeMenu={closeMenu} />
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
              <Route path="/history" element={<OrderHistoryPage orders={orders} seatId={seatId} sessionId={sessionId} />} />
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
