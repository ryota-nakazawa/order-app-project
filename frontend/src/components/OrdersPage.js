import React, { useState, useEffect } from 'react';
import './OrderPage.css'; 

const OrdersPage = ({ items, addToCart }) => {
  const [quantities, setQuantities] = useState({});
  const [message, setMessage] = useState('');

  useEffect(() => {
    const initialQuantities = items.reduce((acc, item) => {
      acc[item._id] = 1;
      return acc;
    }, {});
    setQuantities(initialQuantities);
  }, [items]);

  const incrementQuantity = (id) => {
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [id]: (prevQuantities[id] || 1) + 1
    }));
  };

  const decrementQuantity = (id) => {
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [id]: Math.max((prevQuantities[id] || 1) - 1, 1)
    }));
  };

  const handleAddToCart = (item) => {
    const quantity = quantities[item._id] || 1;
    addToCart({ ...item, quantity });
    setMessage(`${item.name}をカートに追加しました`);
    setTimeout(() => setMessage(''), 1000);
  };

  return (
    <div className="App">
      <h2>Menu</h2>
      <div className="base-container">
        {message && <div className="popup-message">{message}</div>}
        <ul>
          {items.map((item) => (
            <li key={item._id}>
              <img src="/images/menu_bar.png" alt="bar" />
              <h3>{item.name}</h3>
              <p>Price: {item.price}</p>
              <p>Description: {item.description}</p>
              <div>
                <span> 個数: {quantities[item._id]} </span>
                <button type="button" onClick={() => incrementQuantity(item._id)}>+</button>
                <span> / </span>
                <button type="button" onClick={() => decrementQuantity(item._id)}>-</button>
              </div>
              <div className="button-container">
              <button className="addCartButton" type="button" onClick={() => handleAddToCart(item)}>Add to cart</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default OrdersPage;