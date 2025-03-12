const express = require("express");
const { check, validationResult } = require("express-validator")
const router = express.Router();
const { Restaurant } = require("../models/index");
const { Menu } = require("../models/index");
const { Item } = require("../models/index");

router.get("/", async (req, res) => {
  const restaurants = await Restaurant.findAll({
    include: [{
      model: Menu,
      include: [{
        model: Item
      }]
    }]
  });
  res.json(restaurants);
});

router.get("/:id", async (req, res) => {
  const restaurant = await Restaurant.findByPk(req.params.id, {
    include: [{
      model: Menu,
      include: [{
        model: Item
      }]
    }]
  });
  res.json(restaurant);
});

router.post("/", 
  [ 
    check("name").not().isEmpty().trim(), 
    check("location").not().isEmpty().trim(), 
    check("cuisine").not().isEmpty().trim()
  ], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.json({ error: errors.array() });
    } else {
      const { name, location, cuisine } = req.body;
      const newRestaurant = await Restaurant.create({
        name,
        location,
        cuisine,
      });
      res.status(201).json(newRestaurant);
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put("/:id", async (req, res) => {
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

router.delete("/:id", async (req, res) => {
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