const express = require("express");
const jwt = require("jsonwebtoken");

const user = express.Router();

const regExIntChck = require("../middleware/regexCheck");
const { uuidv4RegExp } = require("../middleware/regexCheck");

const User = require("../model/User.model");

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

user.post("/", async (req, res) => {
  const { pseudo, password } = req.body;
  try {
    const user = await User.create({
      pseudo,
      password,
      level: 0,
    });
    const token = jwt.sign(
      {
        id: user.dataValues.uuid,
        pseudo: user.dataValues.pseudo,
      },
      process.env.SECRET,
      { expiresIn: "1h" }
    );
    const uuid = user.uuid;
    res.status(201).json({ token, uuid });
  } catch (error) {}
});

user.post("/login", async (req, res) => {
  const { pseudo, password } = req.body;
  try {
    const user = await User.findOne({ where: { pseudo } });
    if (user.validatePassword(password)) {
      const token = jwt.sign(
        {
          id: user.dataValues.uuid,
          pseudo: user.dataValues.pseudo,
        },
        process.env.SECRET,
        { expiresIn: "2h" }
      );
      const uuid = user.uuid;
      res.status(200).json({ token, uuid });
    }
  } catch (error) {
    res.status(400).json(error);
  }
});

user.post("/:uuid/level", regExIntChck(uuidv4RegExp), async (req, res) => {
  const { uuid } = req.params;
  try {
    const user = await User.increment({ level: 1 }, { where: { uuid } });
    res.status(204).end();
  } catch (error) {
    res.status(400).json(error);
  }
});
module.exports = user;
