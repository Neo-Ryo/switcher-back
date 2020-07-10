require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const helmet = require("helmet");

const sequelize = require("./sequelize");

const user = require("./routes/user.route");

const PORT = process.env.PORT || 4545;

app.use(cors());
app.use(helmet());
app.use(express.json());

app.use("/users", user);

app.get("/", function (req, res) {
  res.send("Welcome on Switcher API");
});

async function main() {
  try {
    await sequelize.sync({ force: true });
    await sequelize.authenticate();
    console.log("You've reached switcher DB !");
    app.listen(PORT, (err) => {
      if (err) throw new Error(err.message);
      console.log(`Server is runin on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.log("Unable to join DB", err.message);
  }
}

main();
