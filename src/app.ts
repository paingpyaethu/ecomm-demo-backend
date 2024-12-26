import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';

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

export default app;
