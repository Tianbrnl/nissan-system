import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const isUnresolvedRailwayReference = (value) =>
  typeof value === "string" && /^\$\{\{.+\}\}$/.test(value.trim());

const readEnv = (...keys) => {
  for (const key of keys) {
    const value = process.env[key];
    if (!value) {
      continue;
    }

    if (isUnresolvedRailwayReference(value)) {
      throw new Error(
        `Environment variable ${key} contains an unresolved Railway reference (${value}). ` +
          "Create it as a Railway variable reference in the backend service, for example DB_HOST=${{MySQL.MYSQLHOST}}."
      );
    }

    return value;
  }

  return undefined;
};

const dbName = readEnv("MYSQLDATABASE", "DB_NAME");
const dbUser = readEnv("MYSQLUSER", "DB_USER");
const dbPassword = readEnv("MYSQLPASSWORD", "DB_PASSWORD");
const dbHost = readEnv("MYSQLHOST", "DB_HOST");
const dbPort = Number(readEnv("MYSQLPORT", "DB_PORT") || 3306);

if (!dbName || !dbUser || !dbHost) {
  throw new Error(
    "Missing database configuration. Set MYSQL* variables from Railway or provide DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, and DB_NAME."
  );
}

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
