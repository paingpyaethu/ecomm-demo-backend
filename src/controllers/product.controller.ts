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
		const product = await productClient.create({
			data: {
				...req.body,
				image: file.filename,
				categoryId: categoryId,
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

		const existingProduct = await productClient.findUnique({
			where: { id: +id },
		});
		if (!existingProduct) {
			return next(new ErrorHandler('Product not found', 404));
		}

		const updatedProduct = await productClient.update({
			where: { id: +id },
			data: req.body,
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

export const getProducts = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { skip = 0, limit = 10 } = req.query;

		const pageNumber = parseInt(skip as string, 10);
		const limitNumber = parseInt(limit as string, 10);

		if (
			isNaN(pageNumber) ||
			isNaN(limitNumber) ||
			pageNumber <= 0 ||
			limitNumber <= 0
		) {
			return next(new ErrorHandler('Invalid pagination parameters', 400));
		}

		const page = (pageNumber) * limitNumber;

		const products = await productClient.findMany({
			skip: page,
			take: limitNumber,
		});

		const totalCount = await productClient.count();

		return res.status(200).json({
			success: true,
			data: products,
			meta: {
				total: totalCount,
				page: pageNumber + 1,
				limit: limitNumber,
				totalPages: Math.ceil(totalCount / limitNumber),
			},
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

    if (categoryName === "All") {
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
        return next(new ErrorHandler("Category not found", 404));
      }

      totalProducts = await productClient.count({
        where: { categoryId: category.id },
      });

      products = await productClient.findMany({
        where: { categoryId: category.id },
        skip: (pageNumber - 1) * pageLimit,
        take: pageLimit,
        include: { category: true },
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
