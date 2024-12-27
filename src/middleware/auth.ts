import { NextFunction, Response } from 'express';
import ErrorHandler from '../utils/ErrorHandler';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const userClient = new PrismaClient().user;

export const isAuthenticated = async (
	req: any,
	res: Response,
	next: NextFunction
) => {
	const authHeader = req.headers.authorization;

	if (!authHeader || !authHeader.startsWith('Bearer ')) {
		return res.status(401).json({ error: 'Authorization header missing' });
	}

	const accessToken = authHeader.split(' ')[1];
	if (!accessToken) {
		return next(new ErrorHandler('Unauthorized.', 401));
	}

	try {
		const decoded = jwt.verify(
			accessToken,
			process.env.ACCESS_TOKEN_SECRET as string
		) as JwtPayload;

		const user = await userClient.findFirst({ where: { id: decoded.userId } });
		if (!user) {
			return next(new ErrorHandler('Invalid User.', 401));
		}
		req.user = user;
		next();
	} catch (error) {
		return res.status(401).json({ message: 'Unauthorized.' });
	}
};

export const authorizeRole = (req: any, _: Response, next: NextFunction) => {
	const user = req.user;
	if (user.role === 'admin') {
		next();
	} else {
		return next(
			new ErrorHandler(
				'You do not have the necessary permissions to access this resource.',
				403
			)
		);
	}
};
