const express = require("express");
const app = express();
const { Restaurant } = require("../models/index");
const { db } = require("../db/connection");
const restaurantRoutes = require("../routes/restaurants");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(restaurantRoutes); 

module.exports = app;