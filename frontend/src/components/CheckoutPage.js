import React, { useEffect, useState } from 'react';
import './CheckoutPage.css';

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

const CheckoutPage = ({ seatId, sessionId }) => {
  const [orders, setOrders] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    const fetchOrderHistory = async () => {
      try {
        // 本来はAPIからデータを取得するが、ここではダミーデータを使用する
        const filteredOrders = dummyOrders.filter(order => order.seatId === seatId);
        setOrders(filteredOrders);
        calculateTotalPrice(filteredOrders);
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
      // 本来はAPIにPOSTリクエストを送るが、ここではダミーデータを更新する
      const updatedOrders = orders.map(order => ({
        ...order,
        kaikei_status: order.seatId === seatId ? '会計済み' : order.kaikei_status
      }));
      setOrders(updatedOrders);
      calculateTotalPrice(updatedOrders); // 会計後に合計金額を再計算
      alert('お会計が完了しました');
    } catch (error) {
      console.error('Error during checkout:', error);
    }
  };

  return (
    <div className="App">
      <h1>Checkout</h1>
      <div className="base-container">
        {orders.length > 0 ? (
          <div>
            <ul>
              {orders.map((order, orderIndex) => (
                <li key={orderIndex} className={`order-item ${order.kaikei_status === '会計済み' ? 'paid' : ''}`}>
                  <img src="/images/menu_bar.png" alt="bar" />
                  <h3>注文番号: {order._id}</h3>
                  <p>席番号：{order.seatId}</p>
                  <p>会計ステータス: {order.kaikei_status}</p>
                  <ul>
                    {order.items.map((item, itemIndex) => (
                      <li key={itemIndex} className="item">
                        <h4>{item.name}</h4>
                        <p>値段: {item.price}</p>
                        <p>個数: {item.quantity}</p>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
            {orders.every(order => order.kaikei_status === '会計済み') ? (
              <p>すべての注文が会計済みです</p>
            ) : (
              <button className="checkoutButton" onClick={handleCheckout}>お会計</button>
            )}
            <h2>合計金額: {totalPrice} 円</h2>
          </div>
        ) : (
          <p> 座番号{seatId}にはまだ注文がありません</p>
        )}
      </div>
    </div>
  );
};

export default CheckoutPage;
