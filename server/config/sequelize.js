import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const sequelize = new Sequelize(
    process.env.MYSQLDATABASE,
    process.env.MYSQLUSER,
    process.env.MYSQLPASSWOR,
    {
        host: process.env.MYSQLHOST,
        port: process.env.MYSQLPORT,
        dialect: 'mysql'
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
        await sequelize.authenticate();
        await sequelize.sync();
        console.log('Database connection has been established successfully. Models are synced.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}

export { sequelize, connectToDatabase };
