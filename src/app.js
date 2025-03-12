const express = require("express");
const app = express();
const restaurantRoutes = require("../routes/restaurants");
const menuRoutes = require("../routes/menus");
const itemRoutes = require("../routes/items");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/restaurants", restaurantRoutes);
app.use("/menus", menuRoutes);
app.use("/items", itemRoutes);

module.exports = app;