import React, { useEffect, useState } from 'react';
import moment from 'moment-timezone';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './OrderHistoryPage.css';

const OrderHistoryPage = ({ seatId, sessionId }) => {
  const [orders, setOrders] = useState([]);
  const [groupedOrders, setGroupedOrders] = useState({});
  const [totalPrice, setTotalPrice] = useState(0);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const fetchOrderHistory = async (date = new Date(), all = false) => {
    try {
      const response = await fetch(`/api/orders${all ? '' : `?date=${date.toISOString().split('T')[0]}`}`);
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

    const sortedKeys = Object.keys(grouped).sort((a, b) => {
      const seatIdA = parseInt(a.split('-')[0], 10);
      const seatIdB = parseInt(b.split('-')[0], 10);
      return seatIdA - seatIdB;
    });

    const sortedGroupedOrders = {};
    sortedKeys.forEach(key => {
      sortedGroupedOrders[key] = grouped[key];
    });

    setGroupedOrders(sortedGroupedOrders);
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
    fetchOrderHistory(selectedDate, false);
  }, [selectedDate]);

  useEffect(() => {
    groupOrdersBySeatAndSessionId(orders);
  }, [orders]);

  const handleShowAll = () => {
    fetchOrderHistory(new Date(), true);
  };

  const convertToCSV = (array) => {
    const keys = Object.keys(array[0]);
    const csv = [
      keys.join(','), // ヘッダー行
      ...array.map(row => keys.map(key => row[key]).join(',')) // データ行
    ].join('\n');

    return csv;
  };

  const downloadCSV = () => {
    const flatOrders = orders.flatMap(order =>
      order.items.map(item => ({
        '注文番号': order._id,
        '席番号': order.seatId,
        'セッションID': order.sessionId,
        '商品名': item.name,
        '値段': item.price,
        '個数': item.quantity,
        '説明': item.description,
        '提供状況': item.status,
        '注文時間': new Date(order.createdAt).toLocaleString(),
        '会計状況': order.kaikei_status
      }))
    );

    const csv = convertToCSV(flatOrders);
    const totalRow = `,,,"合計金額",${totalPrice}`;
    const finalCSV = `${csv}\n${totalRow}`;
    const blob = new Blob([finalCSV], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'order_history.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="App">
      <h1>Order History</h1>
      <div className="base-container">
        <p>日付を選択してください: </p>
        <div className="date-picker-container">
          <div className="date-picker-wrapper">
            <DatePicker
              id="date-picker"
              selected={selectedDate}
              onChange={(date) => setSelectedDate(date)}
              className="custom-date-picker"
              dateFormat="yyyy/MM/dd"
            />
          </div>
        </div>
        <button className="display-All" onClick={handleShowAll}>全期間の売上を表示</button>
        <button onClick={downloadCSV}>CSVとしてダウンロード</button> {/* CSVダウンロードボタン */}
        {Object.keys(groupedOrders).length > 0 ? (
          Object.keys(groupedOrders).map(key => {
            const [seatId, sessionId] = key.split('-');
            return (
              <div key={key} className="seat-group">
                <img src="/images/menu_bar.png" alt="bar" />
                <h2>席番号: {seatId}</h2>
                <ul>
                  {groupedOrders[key].map((order, orderIndex) => (
                    <li key={orderIndex} className="order-item">
                      <h3>注文番号: {order._id}</h3>
                      <p>注文時間: {new Date(order.createdAt).toLocaleString()}</p>
                      <p>会計状況: {order.kaikei_status}</p>
                      <ul>
                        {order.items.map((item, itemIndex) => (
                          <li key={itemIndex} className="item">
                            <h4>{item.name}</h4>
                            <p>値段: {item.price}</p>
                            <p>個数: {item.quantity}</p>
                            <p>説明: {item.description}</p>
                            <p>提供状況: {item.status}</p>
                            {item.status !== '提供済' && (
                              <button onClick={() => updateItemStatus(order._id, item.item_id, item.status === '準備中' ? '提供済' : '準備中')}>
                                {item.status === '準備中' ? '提供済みに変更' : 'Mark as Pending'}
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
          <p>注文がありません</p>
        )}
        <h2>売上合計額: {totalPrice} 円</h2>
      </div>
    </div>
  );
};

export default OrderHistoryPage;
