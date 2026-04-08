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
import releaseRouter from "./routes/releaseRoutes.js";
import applicationsApprovalsRouter from './routes/applicationsApprovalsRoutes.js';
import { ensureTeamManagementSchema } from './utils/teamSchema.js';
import seeds from './seeds/seeds.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 8001;

const allowedOrigins = [
  'http://localhost:5173',
  'https://nissan-system.vercel.app',
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    if (/^https:\/\/nissan-system.*\.vercel\.app$/.test(origin)) {
      return callback(null, true);
    }

    return callback(new Error(`CORS not allowed for origin: ${origin}`));
  },
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

// TEST
app.get('/', (req, res) => {
  res.send("API Working");
});

app.use('/api/user', userRouter);
app.use('/api/team', teamRouter);
app.use('/api/pipeline', pipelineRouter);
app.use('/api/variant', variantRouter);
app.use('/api/vehicleSales', vehicleSalesRouter);
app.use('/api/dashboard', dashboardRouter);
app.use('/api/release', releaseRouter);
app.use('/api/applicationsApprovals', applicationsApprovalsRouter);

// START SERVER
const startServer = async () => {
  try {
    await connectToDatabase();

    if (process.env.SEED_DATA === 'true') {
      console.log('🌱 Running seed data...');
      await seeds();
    }

    await ensureTeamManagementSchema();

    app.listen(port, () => {
      console.log(`Server running on PORT: ${port}`);
    });
  } catch (error) {
    console.error("Error connecting to the database:", error);
  }
};

startServer();