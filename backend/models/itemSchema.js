const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  price: {
    type: Number,
    required: true,
    default: 0,
    validate(value) {
      if (value < 0) throw new Error("マイナスの値です")
    }
  },
  description: {
    type: String,
    required: true,
  }
});

const Item = mongoose.model('Item', itemSchema);

module.exports = Item;
