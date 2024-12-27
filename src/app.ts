import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import authRouter from './routes/auth.route';
import productRouter from './routes/product.route';
import userRouter from './routes/user.route';
import { isAuthenticated } from './middleware/auth';
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
app.use('/api/storage', express.static(__dirname + '/upload'));

/* ROUTES */
app.use(`${API}`, authRouter);
app.use(`${API}`, isAuthenticated, productRouter);
app.use(`${API}/user`, isAuthenticated, userRouter);
/* ROUTES */

// ***** MIDDLEWARES ***** //
app.use(errorMiddleware);
app.use(notFoundHandler);
// ***** MIDDLEWARES ***** //

export default app;
