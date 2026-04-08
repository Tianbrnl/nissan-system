import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const dbName = process.env.MYSQLDATABASE || process.env.DB_NAME;
const dbUser = process.env.MYSQLUSER || process.env.DB_USER;
const dbPassword = process.env.MYSQLPASSWORD || process.env.DB_PASSWORD;
const dbHost = process.env.MYSQLHOST || process.env.DB_HOST;
const dbPort = Number(process.env.MYSQLPORT || process.env.DB_PORT || 3306);

const sequelize = new Sequelize(dbName, dbUser, dbPassword, {
  host: dbHost,
  port: dbPort,
  dialect: "mysql",
  logging: false,
});

const connectToDatabase = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    console.log("Database connection has been established successfully. Models are synced.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

export { sequelize, connectToDatabase };
