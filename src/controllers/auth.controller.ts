import { NextFunction, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { LoginRequest, RegisterRequest } from '../types/auth';
import ErrorHandler from '../utils/ErrorHandler';
import { PrismaClient } from '@prisma/client';

const userClient = new PrismaClient().user;

export const register = async (
	req: RegisterRequest,
	res: Response,
	next: NextFunction
) => {
	const { email, password, name } = req.body;

	if (!email || !password || !name) {
		return res.status(400).json({ message: 'All fields are required.' });
	}

	const hashedPassword = await bcrypt.hash(password, 10);
	try {
		const user = await userClient.create({
			data: { email, password: hashedPassword, name },
		});
		return res.status(200).json({
			success: true,
			data: user,
		});
	} catch (error: any) {
		return next(new ErrorHandler(error.message, 500));
	}
};

export const login = async (
	req: LoginRequest,
	res: Response,
	next: NextFunction
) => {
	try {
		const { email, password } = req.body;

		const user = await userClient.findUnique({ where: { email } });
		if (!user) return next(new ErrorHandler('Invalid credentials.', 401));

		const isValidPassword = await bcrypt.compare(password, user.password);
		if (!isValidPassword)
			return next(new ErrorHandler('Invalid credentials.', 401));

		const token = jwt.sign(
			{ userId: user.id },
			process.env.ACCESS_TOKEN_SECRET as string,
			{ expiresIn: '5h' }
		);

		return res
			.status(200)
			.json({ success: true, data: user, accessToken: token });
	} catch (error: any) {
		return next(new ErrorHandler(error.message, 500));
	}
};

export const accountInfo = async (req: any, res: Response, next: NextFunction) => {
	return res.json({ success: true, data: req.user });
};
