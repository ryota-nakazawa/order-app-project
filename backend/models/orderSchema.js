const mongoose = require("mongoose");
const { v4: uuidv4 } = require('uuid');

const orderSchema = new mongoose.Schema({
  seatId: {
    type: String,
    required: true,
  },
  sessionId: {
    type: String,
    required: true,
    //default: uuidv4 // 各セッションごとに一意のIDを生成
  },
  items: [
    {
      name: String,
      price: Number,
      description: String,
      status: {
        type: String,
        default: '準備中'
      },
      item_id: {
        type: String,
        default: uuidv4 // UUIDをデフォルト値として設定
      },
      quantity: {
        type: Number,
        default: 1 // デフォルトの個数を1に設定
      }
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  kaikei_status: {
    type: String,
    default: '未会計'
  }
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;


