import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import authRouter from './routes/auth.route';
import { errorMiddleware, notFoundHandler } from './middleware/error';

/* CONFIGURATIONS */
dotenv.config();
const app = express();
const API = process.env.API_URL;
/* CONFIGURATIONS */

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(
	cors({
		origin: process.env.ORIGIN,
		credentials: true,
	})
);

/* ROUTES */
app.use(`${API}`, authRouter);
/* ROUTES */

// ***** MIDDLEWARES ***** //
app.use(errorMiddleware);
app.use(notFoundHandler);
// ***** MIDDLEWARES ***** //

export default app;
