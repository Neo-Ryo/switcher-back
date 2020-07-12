require("dotenv").config();
const Sequelize = require("sequelize");

const {
  DB_DATABASE,
  DB_USER,
  DB_PASSWORD,
  NODE_ENV,
  DB_DIALECT,
  DB_TEST,
  DB_HOST,
  DATABASE_URL,
} = process.env;

if (process.env.DATABASE_URL) {
  module.exports = new Sequelize(process.env.DATABASE_URL, {
    dialect: "postgres",
  });
} else {
  module.exports = new Sequelize(DATABASE_URL, {
    host: DB_HOST,
    username: DB_USER,
    password: DB_PASSWORD,
    database: NODE_ENV !== "test" ? DB_DATABASE : DB_TEST,
    dialect: DB_DIALECT,
    logging: false,
  });
}
