const express = require("express");
const router = express.Router();
const { Menu } = require("../models/index");

router.get("/", async (req, res) => {
  const menus = await Menu.findAll();
  res.json(menus);
});

module.exports = router;