require("dotenv").config();

module.exports = {
  development: {
    username: "root",
    password: process.env.MYSQL_PASSWORD,
    database: "sleact",
    host: "mysql",
    dialect: "mysql",
  },
  test: {
    username: "root",
    password: process.env.MYSQL_PASSWORD,
    database: "sleact",
    host: "mysql",
    dialect: "mysql",
  },
  production: {
    username: "root",
    password: process.env.MYSQL_PASSWORD,
    database: "sleact",
    host: "mysql",
    dialect: "mysql",
  },
};
