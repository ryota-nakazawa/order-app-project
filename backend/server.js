const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const mongoose = require("mongoose");
const cors = require('cors');
const path = require('path');
const port = process.env.PORT || 3001;
const Item = require("./models/itemSchema");
const Order = require("./models/orderSchema");

app.use(bodyParser.json());
app.use(cors());

mongoose.connect("mongodb+srv://ryota:Konikat@cluster0.2bu5olw.mongodb.net/orders?retryWrites=true&w=majority&appName=Cluster0"
).then(() => console.log("orderDB接続完了"))
  .catch((err) => console.log(err));


app.use(express.static(path.join(__dirname, '../frontend/build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/build/index.html'));
});

//getメソッド
app.get("/api/items", async (req, res) => {
  try {
    const items = await Item.find();
    // console.log(orders);
    res.status(200).json({ message: "注文取得しました", items });
  } catch (err) {
    console.log(err);
  }
})

app.get('/api/orders', async (req, res) => {
  try {
    const orders = await Order.find();
    res.status(200).json({ message: '注文履歴取得しました', orders });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: '注文履歴取得失敗しました' });
  }
});

// app.get('/api/orders/:seatId', async (req, res) => {
//   try {
//     const { seatId } = req.params;
//     console.log(seatId);
//     const orders = await Order.find({ seatId: seatId });
//     if (!orders) {
//       return res.status(404).json({ message: '注文が見つかりませんでした' });
//     }
//     res.status(200).json({ message: '注文を取得しました', orders });
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ message: '注文取得失敗しました' });
//   }
// });

app.get('/api/orders/:seatId/:kaikei_status', async (req, res) => {
  const { seatId, kaikei_status } = req.params;
  try {
    const orders = await Order.find({ seatId, kaikei_status });
    res.status(200).json({ orders });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: '注文履歴取得に失敗しました' });
  }
});

app.post('/api/orders', async (req, res) => {
  try {
    const { seatId, sessionId, cartItems } = req.body;
    const order = new Order({ seatId, sessionId, items: cartItems });
    console.log(cartItems);
    const savedOrder = await order.save();
    res.status(201).json(savedOrder);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: '注文の保存に失敗しました' });
  }
});

app.put('/api/orders/:orderId/items/:itemId/status', async (req, res) => {
  try {
    const { orderId, itemId } = req.params;
    const { status } = req.body;
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: '注文が見つかりませんでした' });
    }

    const item = order.items.find(i => i.item_id === itemId);
    if (!item) {
      return res.status(404).json({ message: 'アイテムが見つかりませんでした' });
    }

    item.status = status;
    await order.save();

    res.status(200).json({ message: 'アイテムのステータスが更新されました', order });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'アイテムのステータス更新に失敗しました' });
  }
});

//お会計用のエンドポイント
app.post('/api/checkout', async (req, res) => {
  const { seatId } = req.body;
  try {
    // seatId に関連する注文の会計ステータスを更新
    await Order.updateMany({ seatId }, { $set: { kaikei_status: '会計済み' } });

    res.status(200).json({ success: true, message: 'お会計が完了しました' });
  } catch (error) {
    console.error('Error during checkout:', error);
    res.status(500).json({ success: false, message: 'お会計に失敗しました' });
  }
});

app.listen(port, () => {
  console.log(`listening on *:${port}`);
})


