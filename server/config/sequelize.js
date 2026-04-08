import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const databaseUrl = process.env.MYSQL_URL;

const connectionSummary = {
    usingUrl: Boolean(databaseUrl),
    host: process.env.MYSQLHOST || null,
    port: process.env.MYSQLPORT || null,
    database: process.env.MYSQLDATABASE || null,
    user: process.env.MYSQLUSER || null,
    hasPassword: Boolean(process.env.MYSQLPASSWORD),
};

const sequelize = databaseUrl
    ? new Sequelize(databaseUrl, {
        dialect: "mysql",
        logging: false,
        dialectOptions: {
            connectTimeout: 10000,
        },
    })
    : new Sequelize(
        process.env.MYSQLDATABASE,
        process.env.MYSQLUSER,
        process.env.MYSQLPASSWORD,
        {
            host: process.env.MYSQLHOST,
            port: Number(process.env.MYSQLPORT || 3306),
            dialect: "mysql",
            logging: false,
            dialectOptions: {
                connectTimeout: 10000,
            },
        }
    );

/*************  ✨ Windsurf Command ⭐  *************/
/**
 * Establishes a connection to the database and syncs the models.
 * Prints a success message if the connection is established and the models are synced.
 * Prints an error message if there is a problem connecting to the database.
 * @async
 */
/*******  70e92675-9fa6-49e1-8a86-29378747aff9  *******/
const connectToDatabase = async () => {
    try {
        console.log("Database env summary:", connectionSummary);
        await sequelize.authenticate();
        console.log("Loaded models:", Object.keys(sequelize.models));
        await sequelize.sync();
        console.log("Database connection has been established successfully. Models are synced.");
    } catch (error) {
        console.error("Unable to connect to the database:", error);
        throw error;
    }
};

export { sequelize, connectToDatabase };
