import React, { useState } from 'react';

const CartPage = ({ cart, calculateTotal, seatId, sessionId, setCart, removeFromCart }) => {
  const [cartId, setCartId] = useState(null);

  const handleSaveCart = async () => {
    try {
      console.log(sessionId);
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ seatId, sessionId, cartItems: cart }),
      });

      const savedCart = await response.json();
      console.log(savedCart);
      setCartId(savedCart._id);

      alert('注文確定しました');
      setCart([]);
    } catch (error) {
      console.error('Error saving cart:', error);
      alert('注文に失敗しました');
    }
  };

  const handleRemoveFromCart = (index) => {
    const confirmDelete = window.confirm('選択した商品を削除しますか？');
    if (confirmDelete) {
      removeFromCart(index);
    }
  };

  return (
    <div className="App">
      <h1>カート</h1>
      <div className="cart-container">
        <ul>
          {cart.map((item, index) => (
            <li key={index} className="cart-item">
              <h3>{item.name}</h3>
              <p>Price: {item.price}</p>
              <p>Quantity: {item.quantity}</p>
              <p>Description: {item.description}</p>
              <button onClick={() => handleRemoveFromCart(index)}>削除</button>
            </li>
          ))}
        </ul>
        <h3 className="total-price">Total Price: ${calculateTotal()}</h3>
        <button onClick={handleSaveCart}>注文確定</button>
      </div>
    </div>
  );
};

export default CartPage;
