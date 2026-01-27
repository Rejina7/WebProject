import { Sequelize } from "sequelize";

export const sequelize = new Sequelize(
  "webproject_individual", // database name
  "postgres",              // username
  "Admin12",               // password
  {
    host: "localhost",
    dialect: "postgres",
    logging: false,         // cleaner console
  }
);
