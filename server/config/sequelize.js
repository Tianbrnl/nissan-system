import { Sequelize } from "sequelize";

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
    await sequelize.authenticate();
    console.log("Database connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
    throw error;
  }
};

export { sequelize, connectToDatabase };