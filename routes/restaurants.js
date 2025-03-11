const express = require("express");
const router = express.Router();
const { Restaurant } = require("../models/index");

router.get("/restaurants", async (req, res) => {
  const restaurants = await Restaurant.findAll();
  res.json(restaurants);
});

router.get("/restaurants/:id", async (req, res) => {
  const restaurant = await Restaurant.findByPk(req.params.id);
  res.json(restaurant);
});

router.post("/restaurants", async (req, res) => {
  try {
    const { name, location, cuisine } = req.body;
    const newRestaurant = await Restaurant.create({
      name,
      location,
      cuisine,
    });
    res.status(201).json(newRestaurant);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put("/restaurants/:id", async (req, res) => {
  try {
    const restaurant = await Restaurant.findByPk(req.params.id);
    if (restaurant) {
      await restaurant.update(req.body);
      res.json(restaurant);
    } else {
      res.status(404).json({ message: "Restaurant not found" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
});

router.delete("/restaurants/:id", async (req, res) => {
  try {
    const restaurant = await Restaurant.findByPk(req.params.id);
    if (restaurant) {
      await restaurant.destroy();
      res.status(204).send();
    } else {
      res.status(404).json({ message: "Restaurant not found" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;