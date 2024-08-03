import React, { useState, useEffect } from 'react';

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
      <h2>メニュー</h2>
      <div className="base-container">
        <p>メニューの内容がここに表示されます</p>
        <p>------------------------------------------------------------------------</p>
        {message && <div className="popup-message">{message}</div>}
        <ul>
          {items.map((item) => (
            <li key={item._id}>
              <h3>{item.name}</h3>
              <p>値段: {item.price}</p>
              <p>説明: {item.description}</p>
              <div>
                <span> 個数: {quantities[item._id]} </span>
                <button type="button" onClick={() => incrementQuantity(item._id)}>+</button>
                <span> / </span>
                <button type="button" onClick={() => decrementQuantity(item._id)}>-</button>
              </div>
              <button type="button" onClick={() => handleAddToCart(item)}>カートに追加</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default OrdersPage;
