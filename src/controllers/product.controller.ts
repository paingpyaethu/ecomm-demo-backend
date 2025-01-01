import { PrismaClient } from '@prisma/client';
import { NextFunction, Request, Response } from 'express';
import ErrorHandler from '../utils/ErrorHandler';

const productClient = new PrismaClient().product;
const categoryClient = new PrismaClient().category;

export const createProduct = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const categoryId = parseInt(req.body.categoryId, 10);
		if (!categoryId) {
			return next(new ErrorHandler('Category is required', 400));
		}
		const category = await categoryClient.findUnique({
			where: { id: categoryId },
		});

		if (!category) {
			return next(new ErrorHandler('Category not found', 404));
		}
		const file = req.file as Express.Multer.File;

		const colors = JSON.parse(req.body.colors);
		const sizes = JSON.parse(req.body.sizes);

		const product = await productClient.create({
			data: {
				...req.body,
				image: file.filename,
				categoryId: categoryId,
				colors: {
					create: colors.map((colorId: number) => ({
						colorId,
						stock: true,
					})),
				},
				sizes: {
					create: sizes.map((sizeId: number) => ({
						sizeId,
						stock: true,
					})),
				},
			},
			include: {
				category: true,
				colors: { include: { color: true } },
				sizes: { include: { size: true } },
			},
		});
		return res.status(201).json({
			success: true,
			data: product,
		});
	} catch (error: any) {
		return next(new ErrorHandler(error.message, 500));
	}
};

export const updateProduct = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { id } = req.params;

		const file = req.file as Express.Multer.File;
		if (file) {
			req.body.image = file.filename;
		}

		const colors = JSON.parse(req.body.colors);
		const sizes = JSON.parse(req.body.sizes);

		const existingProduct = await productClient.findUnique({
			where: { id: +id },
		});
		if (!existingProduct) {
			return next(new ErrorHandler('Product not found', 404));
		}

		const updatedProduct = await productClient.update({
			where: { id: +id },
			data: {
				...req.body,
				image: file ? file.filename : undefined,
				colors: {
					deleteMany: {}, // Remove all existing associations
					create: colors.map((colorId: number) => ({
						colorId,
						stock: true, // Default stock value
					})),
				},
				sizes: {
					deleteMany: {}, // Remove all existing associations
					create: sizes.map((sizeId: number) => ({
						sizeId,
						stock: true, // Default stock value
					})),
				},
			},
			include: {
				category: true,
				colors: { include: { color: true } },
				sizes: { include: { size: true } },
			},
		});

		return res.status(201).json({
			success: true,
			data: updatedProduct,
		});
	} catch (error: any) {
		return next(new ErrorHandler(error.message, 500));
	}
};

export const deleteProduct = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { id } = req.params;

		const existingProduct = await productClient.findUnique({
			where: { id: +id },
		});
		if (!existingProduct) {
			return next(new ErrorHandler('Product not found', 404));
		}

		await productClient.delete({
			where: { id: +id },
		});

		return res.status(200).json({
			success: true,
			message: 'Product deleted successfully',
		});
	} catch (error: any) {
		return next(new ErrorHandler(error.message, 500));
	}
};

export const getProductsByCategory = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { page = 1, limit = 10 } = req.query;
		const { categoryName } = req.params;

		const pageNumber = parseInt(page as string, 10);
		const pageLimit = parseInt(limit as string, 10);

		let products;
		let totalProducts;

		if (categoryName === 'All') {
			// Fetch all products with pagination
			totalProducts = await productClient.count();
			products = await productClient.findMany({
				skip: (pageNumber - 1) * pageLimit,
				take: pageLimit,
				include: { category: true },
			});
		} else {
			// Fetch products filtered by category with pagination
			const category = await categoryClient.findUnique({
				where: { name: categoryName },
			});

			if (!category) {
				return next(new ErrorHandler('Category not found', 404));
			}

			totalProducts = await productClient.count({
				where: { categoryId: category.id },
			});

			products = await productClient.findMany({
				where: { categoryId: category.id },
				include: {category: true},
				skip: (pageNumber - 1) * pageLimit,
				take: pageLimit,
			});
		}

		return res.status(200).json({
			success: true,
			data: products,
			totalProducts,
			totalPages: Math.ceil(totalProducts / pageLimit),
			currentPage: pageNumber,
		});
	} catch (error: any) {
		return next(new ErrorHandler(error.message, 500));
	}
};

export const getProductById = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { id } = req.params;

		const product = await productClient.findUnique({
			where: { id: +id },
			include: {
				category: true,
				colors: { include: { color: true } },
				sizes: { include: { size: true } },
			},
		});

		if (!product) {
			return next(new ErrorHandler('Product not found', 404));
		}

		return res.status(200).json({
			success: true,
			data: product,
		});
	} catch (error: any) {
		return next(new ErrorHandler(error.message, 500));
	}
};
