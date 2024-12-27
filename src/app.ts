import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import authRouter from './routes/auth.route';
import { errorMiddleware, notFoundHandler } from './middleware/error';
import productRouter from './routes/product.route';
import { isAuthenticated } from './middleware/auth';

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
app.use('/api/storage', express.static(__dirname + '/upload'));

/* ROUTES */
app.use(`${API}`, authRouter);
app.use(`${API}`, isAuthenticated, productRouter);
/* ROUTES */

// ***** MIDDLEWARES ***** //
app.use(errorMiddleware);
app.use(notFoundHandler);
// ***** MIDDLEWARES ***** //

export default app;
