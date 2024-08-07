import React, { useState, useEffect } from 'react';
import './OrderPage.css';

const OrdersPage = ({ items, addToCart }) => {
  // 商品ごとの数量を管理するための状態を追加
  const [quantities, setQuantities] = useState({});
  const [message, setMessage] = useState(''); // メッセージを表示するための状態

  // 各アイテムの初期値を1にする
  useEffect(() => {
    const initialQuantities = items.reduce((acc, item) => {
      acc[item._id] = 1;
      return acc;
    }, {});
    //console.log(initialQuantities);
    setQuantities(initialQuantities);
  }, [items]);

  // 数量を増加させる関数
  const incrementQuantity = (id) => {
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [id]: (prevQuantities[id] || 1) + 1
    }));
  };

  // 数量を減少させる関数
  const decrementQuantity = (id) => {
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [id]: Math.max((prevQuantities[id] || 1) - 1, 1) // 数量が1未満にならないようにする
    }));
  };

  // カートに商品を追加する関数
  const handleAddToCart = (item) => {
    const quantity = quantities[item._id] || 1;
    // console.log(quantity);
    // console.log(item);
    addToCart({ ...item, quantity });
    setMessage(`${item.name}をカートに追加しました`);
    setTimeout(() => setMessage(''), 1000); // 3秒後にメッセージを消す
  };

  return (
    <div className="App">
      <h2>Menu</h2>
      <div className="base-container">
        {message && <div className="popup-message">{message}</div>} {/* ポップアップメッセージを表示 */}
        <ul>
          {items.map((item) => (
            <li key={item._id}>
              <img src="/images/menu_bar.png" alt="bar" />
              <h3>{item.name}</h3>
              <p>値段: {item.price}</p>
              <p>説明: {item.description}</p>
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
