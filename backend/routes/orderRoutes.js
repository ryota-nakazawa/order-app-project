const express = require('express');
const app = express();
const orderMOdel = require("../models/Order");

app.get("/order", async (req, res) => {
  const order = await orderMOdel.find({});

  try {
    res.send(order);
  } catch (err) {
    res.status(500).send(err);
  }
})

module.exports = app;
