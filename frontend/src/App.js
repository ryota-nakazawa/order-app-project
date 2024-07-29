import './App.css';
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useNavigate } from 'react-router-dom';
import OrdersPage from './components/OrdersPage';
import CartPage from './components/CartPage';
import OrderHistoryPage from './components/OrderHistoryPage';
import CheckoutPage from './components/CheckoutPage';
import { v4 as uuidv4 } from 'uuid';


function App() {
  const [items, setItems] = useState([]);
  const [cart, setCart] = useState([]);
  // const [sessionId, setSessionId] = useState(() => {
  //   const savedSessionId = localStorage.getItem('sessionId');
  //   return savedSessionId || uuidv4();
  // });
  const [seatId, setSeatId] = useState('');
  const sessionId = "2";
  const [menuOpen, setMenuOpen] = useState(false);


  // useEffect(() => {
  //   localStorage.setItem('sessionId', sessionId);
  // }, [sessionId]);

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
    // console.log(item);
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

  return (
    <Router>
      <div className="container">
        <h1>注文アプリ</h1>
        <nav>
          <div className="hamburger" onClick={toggleMenu}>
            <div className={menuOpen ? "bar open" : "bar"}></div>
            <div className={menuOpen ? "bar open" : "bar"}></div>
            <div className={menuOpen ? "bar open" : "bar"}></div>
          </div>
          <ul className={menuOpen ? "nav-links open" : "nav-links"}>
            <li><Link to="/" onClick={toggleMenu}>メニュー</Link></li>
            <li><Link to="/cart" onClick={toggleMenu}>カート</Link></li>
            <li><Link to="/history" onClick={toggleMenu}>注文履歴</Link></li>
            <li><Link to="/checkout" onClick={toggleMenu}>お会計</Link></li>
            <li><Link to="/select-seat" onClick={toggleMenu}>席番号の変更</Link></li>
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

function SelectSeat({ setSeatId }) {
  const [inputValue, setInputValue] = useState('');
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSeatId(inputValue);
    navigate('/');
  };

  return (
    <div>
      <h2>席番号を入力してください（テスト用表示）</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder="席番号を入力"
        />
        <button type="submit">確定</button>
      </form>
    </div>
  );
}


export default App;
