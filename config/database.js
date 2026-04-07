import { Sequelize } from "sequelize";
import {
  DB_NAME,
  DB_HOST,
  DB_PORT,
  DB_DIALECT,
  DB_USERNAME,
  DB_PASSWORD,
} from "./ENV.js";

const sequelize = new Sequelize(DB_NAME, DB_USERNAME, DB_PASSWORD, {
  host: DB_HOST,
  port: DB_PORT,
  dialect: "postgres",
  logging: false,
  dialectOptions: {
    ssl: { require: true, rejectUnauthorized: false },
  },
});

export default sequelize;
