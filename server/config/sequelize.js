import { Sequelize } from "sequelize";
import dotenv from "dotenv";

// Load .env only for local development, never on Railway
if (!process.env.RAILWAY_ENVIRONMENT_NAME && !process.env.RAILWAY_SERVICE_NAME) {
  dotenv.config();
}

const databaseUrl = process.env.MYSQL_URL || process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("Missing MYSQL_URL or DATABASE_URL");
}

const sequelize = new Sequelize(databaseUrl, {
  dialect: "mysql",
  logging: false,
  dialectOptions: {
    connectTimeout: 10000,
  },
});

const connectToDatabase = async () => {
  try {
    console.log("MYSQL_URL loaded:", Boolean(databaseUrl));
    console.log("Using Railway runtime:", Boolean(process.env.RAILWAY_ENVIRONMENT_NAME || process.env.RAILWAY_SERVICE_NAME));

    await sequelize.authenticate();
    console.log("Database connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
    throw error;
  }
};

export { sequelize, connectToDatabase };