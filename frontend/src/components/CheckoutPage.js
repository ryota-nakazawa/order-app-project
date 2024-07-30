import React, { useEffect, useState } from 'react';

const CheckoutPage = ({ seatId, sessionId }) => {
  const [orders, setOrders] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    const fetchOrderHistory = async () => {
      try {
        const response = await fetch(`/api/orders/${seatId}/未会計`);
        const data = await response.json();
        setOrders(data.orders);
        calculateTotalPrice(data.orders);
      } catch (error) {
        console.error('Error fetching order history:', error);
      }
    };

    fetchOrderHistory();
  }, [seatId]);

  const calculateTotalPrice = (orders) => {
    let total = 0;
    orders.forEach(order => {
      order.items.forEach(item => {
        total += item.price * item.quantity;
      });
    });
    setTotalPrice(total);
  };

  const handleCheckout = async () => {
    try {
      const response = await fetch(`/api/checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ seatId }),
      });
      const data = await response.json();
      if (data.success) {
        alert('お会計が完了しました');
        // お会計完了後の処理
        const updatedOrders = orders.map(order => ({
          ...order,
          kaikei_status: order.seatId === seatId ? '会計済み' : order.kaikei_status
        }));
        setOrders(updatedOrders);
        calculateTotalPrice(updatedOrders); // 会計後に合計金額を再計算
      }
    } catch (error) {
      console.error('Error during checkout:', error);
    }
  };

  return (
    <div className="App">
      <h1>お会計</h1>
      <div className="base-container">
        <p>会計の詳細がここに表示されます</p>
        <p>-------------------------------------------------------------------------</p>
        {orders.length > 0 ? (
          <div>
            <ul>
              {orders.map((order, orderIndex) => (
                <li key={orderIndex} className={`order-item ${order.kaikei_status === '会計済み' ? 'paid' : ''}`}>
                  <h3>注文番号: {order._id}</h3>
                  <p>席番号：{order.seatId}</p>
                  <p>会計ステータス: {order.kaikei_status}</p>
                  <ul>
                    {order.items.map((item, itemIndex) => (
                      <li key={itemIndex} className="item">
                        <h4>{item.name}</h4>
                        <p>値段: {item.price}</p>
                        <p>個数: {item.quantity}</p>
                        <p>説明: {item.description}</p>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
            <h2>合計金額: {totalPrice} 円</h2>
            {/* 会計ステータスが "会計済み" でない場合にボタンを表示 */}
            {orders.every(order => order.kaikei_status === '会計済み') ? (
              <p>すべての注文が会計済みです</p>
            ) : (
              <button onClick={handleCheckout}>お会計</button>
            )}
          </div>
        ) : (
          <p> 座番号{seatId}にはまだ注文がありません</p>
        )}
      </div>
    </div>
  );
};

export default CheckoutPage;
