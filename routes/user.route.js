const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const user = express.Router();

const regExIntChck = require("../middleware/regexCheck");
const { uuidv4RegExp } = require("../middleware/regexCheck");
const auth = require("../middleware/auth");

const User = require("../model/User");

user.get("/", async (req, res) => {
  try {
    const user = await User.findAll({ attributes: { exclude: ["password"] } });
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json(error);
  }
});

user.get("/:uuid", regExIntChck(uuidv4RegExp), async (req, res) => {
  const { uuid } = req.params;
  try {
    const user = await User.findByPk(uuid, {
      attributes: { exclude: ["password"] },
    });
    res.status(200).json(user);
  } catch (error) {
    res.status(404).json(error);
  }
});

user.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (user.validatePassword(password)) {
      const token = jwt.sign(
        {
          id: user.dataValues.uuid,
          email: user.dataValues.email,
        },
        process.env.SECRET,
        { expiresIn: "2h" }
      );
      const uuid = user.uuid;
      res.status(201).json({ token, uuid });
    }
  } catch (error) {
    res.status(400).json(error);
  }
});

user.post("/:uuid/level", regExIntChck(uuidv4RegExp), async (req, res) => {
  const { uuid } = req.params;
  try {
    const user = await User.update({ level: level + 1 });
  } catch (error) {
    res.status(204).end();
  }
});
module.exports = user;
