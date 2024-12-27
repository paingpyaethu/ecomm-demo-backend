import { PrismaClient } from '@prisma/client';
import { NextFunction, Request, Response } from 'express';
import ErrorHandler from '../utils/ErrorHandler';

const productClient = new PrismaClient().product;

export const createProduct = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const file = req.file as Express.Multer.File;
		const product = await productClient.create({
			data: {
				...req.body,
				image: file.filename,
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
    const { page = 1, limit = 10 } = req.query;

    const pageNumber = parseInt(page as string, 10);
    const limitNumber = parseInt(limit as string, 10);

    if (isNaN(pageNumber) || isNaN(limitNumber) || pageNumber <= 0 || limitNumber <= 0) {
      return next(new ErrorHandler('Invalid pagination parameters', 400));
    }

    const skip = (pageNumber - 1) * limitNumber;

    const products = await productClient.findMany({
      skip,
      take: limitNumber,
    });

    const totalCount = await productClient.count();

    return res.status(200).json({
      success: true,
      data: products,
      meta: {
        total: totalCount,
        page: pageNumber,
        limit: limitNumber,
        totalPages: Math.ceil(totalCount / limitNumber),
      },
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


