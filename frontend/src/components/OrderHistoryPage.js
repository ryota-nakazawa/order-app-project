import React, { useEffect, useState } from 'react';

const OrderHistoryPage = ({ seatId, sessionId }) => {
  const [orders, setOrders] = useState([]);
  const [groupedOrders, setGroupedOrders] = useState({});
  const [totalPrice, setTotalPrice] = useState(0);

  // const fetchOrderHistory = async (seatId) => {
  //   try {
  //     const response = await fetch(`/api/orders/${seatId}`);
  //     const data = await response.json();
  //     setOrders(data.orders);
  //     calculateTotalPrice(data.orders);
  //     // console.log(data.orders); // 確認のためのログ出力
  //   } catch (error) {
  //     console.error('Error fetching order history:', error);
  //   }
  // };

  const fetchOrderHistory = async () => {
    try {
      const response = await fetch(`/api/orders`);
      const data = await response.json();
      setOrders(data.orders);
      groupOrdersBySeatAndSessionId(data.orders);
      calculateTotalPrice(data.orders);
    } catch (error) {
      console.error('Error fetching order history:', error);
    }
  };

  const groupOrdersBySeatAndSessionId = (orders) => {
    const grouped = orders.reduce((acc, order) => {
      const key = `${order.seatId}-${order.sessionId}`;
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(order);
      return acc;
    }, {});
    setGroupedOrders(grouped);
  };

  const calculateTotalPrice = (orders) => {
    let total = 0;
    orders.forEach(order => {
      order.items.forEach(item => {
        total += item.price * item.quantity;
      });
    });
    setTotalPrice(total);
  };

  const updateItemStatus = async (orderId, itemId, status) => {
    try {
      const response = await fetch(`/api/orders/${orderId}/items/${itemId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });
      const updatedOrder = await response.json();
      // console.log(updatedOrder);

      setOrders(prevOrders =>
        prevOrders.map(order =>
          order._id === updatedOrder.order._id ? updatedOrder.order : order,
        )
      );
    } catch (error) {
      console.error('Error updating item status:', error);
    }
  };

  useEffect(() => {
    fetchOrderHistory(seatId);
  }, [seatId]);

  useEffect(() => {
    groupOrdersBySeatAndSessionId(orders);
  }, [orders]);

  return (
    <div className="App">
      <h1>注文履歴</h1>
      <div className="order-history-container">
        {Object.keys(groupedOrders).length > 0 ? (
          Object.keys(groupedOrders).map(key => {
            const [seatId, sessionId] = key.split('-');
            return (
              <div key={key} className="seat-group">
                <h2>Seat ID: {seatId}</h2>
                {/* <h3>Session ID: {sessionId}</h3> */}
                <ul>
                  {groupedOrders[key].map((order, orderIndex) => (
                    <li key={orderIndex} className="order-item">
                      <h3>Order ID: {order._id}</h3>
                      <p>Created At: {new Date(order.createdAt).toLocaleString()}</p>
                      <p>会計状況: {order.kaikei_status}</p>
                      <ul>
                        {order.items.map((item, itemIndex) => (
                          <li key={itemIndex} className="item">
                            <h4>{item.name}</h4>
                            <p>Price: {item.price}</p>
                            <p>Quantity: {item.quantity}</p>
                            <p>Description: {item.description}</p>
                            <p>Status: {item.status}</p>
                            {item.status !== '提供済' && (
                              <button onClick={() => updateItemStatus(order._id, item.item_id, item.status === '準備中' ? '提供済' : '準備中')}>
                                {item.status === '準備中' ? 'Mark as Served' : 'Mark as Pending'}
                              </button>
                            )}
                          </li>
                        ))}
                      </ul>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })
        ) : (
          <p>No orders found</p>
        )}
        <h2>Total Price: ${totalPrice.toFixed(2)}</h2>
      </div>
    </div>
  );
};

export default OrderHistoryPage;
