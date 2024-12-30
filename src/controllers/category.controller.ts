import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import ErrorHandler from '../utils/ErrorHandler';

const categoryPrisma = new PrismaClient().category;

export const getCategories = async (
	_: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const categories = await categoryPrisma.findMany({
			include: { products: true },
		});

		return res.status(200).json({
			success: true,
			data: categories,
		});
	} catch (error: any) {
		return next(new ErrorHandler(error.message, 500));
	}
};

export const createCategory = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const { name } = req.body;
	try {
		const category = await categoryPrisma.create({
			data: { name },
		});
		return res.status(201).json({
			success: true,
			data: category,
		});
	} catch (error: any) {
		return next(new ErrorHandler(error.message, 500));
	}
};
