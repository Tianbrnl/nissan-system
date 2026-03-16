import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { connectToDatabase } from './config/sequelize.js';
import userRouter from './routes/userRoutes.js';
import teamRouter from './routes/teamRoutes.js';
import pipelineRouter from './routes/pipelineRoutes.js';
import variantRouter from './routes/variantRoutes.js';
import vehicleSalesRouter from './routes/vehicleSalesRoutes.js';
import dashboardRouter from './routes/dashboardRoutes.js';

dotenv.config();

const app = express();

const port = process.env.PORT || 8001;

app.use(express.json());
app.use(cors());

app.use(cookieParser());

// TEST
app.get('/', (req, res) => {
    res.send("API Working")
})

app.use('/api/user', userRouter);
app.use('/api/team', teamRouter);
app.use('/api/pipeline', pipelineRouter);
app.use('/api/variant', variantRouter);
app.use('/api/vehicleSales', vehicleSalesRouter);
app.use('/api/dashboard', dashboardRouter);

// START SERVER
const startServer = async () => {
    try {
        await connectToDatabase();
        app.listen(port, () => {
            console.log(`Server running on PORT: ${port}`);
        });
    } catch (error) {
        console.error("Error connecting to the database:", error);
    }
}

startServer();


app.listen(3000);