import { NextFunction, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import ErrorHandler from '../utils/ErrorHandler';

const prisma = new PrismaClient();

/**
 * Get Cart Items for the authenticated user
 */
export const getCartItems = async (
	req: any,
	res: Response,
	next: NextFunction
) => {
	try {
		const userId = req.user.id;

		const cartItems = await prisma.cartItem.findMany({
			where: { userId },
			include: { product: true },
		});

		return res.status(200).json({
			success: true,
			data: cartItems,
		});
	} catch (error: any) {
		return next(new ErrorHandler(error.message, 500));
	}
};

/**
 * Add Item to Cart
 */
export const addItemToCart = async (
	req: any,
	res: Response,
	next: NextFunction
) => {
	try {
		const userId = req.user.id;
		const { productId, quantity } = req.body;

		if (!productId) {
			return next(new ErrorHandler('Product ID is required', 400));
		}
		if (quantity <= 0) {
			return next(new ErrorHandler('Quantity must be greater than zero', 400));
		}
		const product = await prisma.product.findFirst({
			where: { id: productId },
		});
		if (!product) {
			return next(new ErrorHandler('Product not found', 404));
		}

		const cartItem = await prisma.cartItem.create({
			data: { userId, productId, quantity },
		});

		return res.status(200).json({
			success: true,
			data: cartItem,
		});
	} catch (error: any) {
		return next(new ErrorHandler(error.message, 500));
	}
};

/**
 * Change Quantity of cart item
 */
export const changeQuantity = async (
	req: any,
	res: Response,
	next: NextFunction
) => {
	try {
		const { quantity } = req.body;
    const { cartItemId } = req.params;

		if (!cartItemId) {
			return next(new ErrorHandler('Cart item ID is required', 400));
		}

		if (quantity <= 0) {
			return next(new ErrorHandler('Quantity must be greater than zero', 400));
		}

		const cartItemIdInt = parseInt(cartItemId, 10);
		if (isNaN(cartItemIdInt)) {
			return next(
				new ErrorHandler('Cart item ID must be a valid integer', 400)
			);
		}

		const cartItem = await prisma.cartItem.findUnique({
			where: { id: cartItemIdInt },
		});

		if (!cartItem) {
			return next(new ErrorHandler('Cart item not found', 404));
		}

		if (cartItem.userId !== req.user.id) {
			return next(
				new ErrorHandler('You are not authorized to modify this cart item', 403)
			);
		}

		const updatedCartItem = await prisma.cartItem.update({
			where: { id: cartItemIdInt },
			data: { quantity },
		});

		return res.status(200).json({
			success: true,
			data: updatedCartItem,
		});
	} catch (error: any) {
		return next(new ErrorHandler(error.message, 500));
	}
};

/**
 * Remove Item from Cart
 */
export const removeCartItem = async (
	req: any,
	res: Response,
	next: NextFunction
) => {
	try {
		const userId = req.user.id;
		const { cartItemId } = req.params;

		// Validate the cart item belongs to the user
		const cartItem = await prisma.cartItem.findFirst({
			where: { id: +cartItemId, userId },
		});

		if (!cartItem) {
			return next(new ErrorHandler('Cart item not found', 404));
		}

		// Delete the cart item
		await prisma.cartItem.delete({ where: { id: +cartItemId } });

		return res.status(200).json({
			success: true,
			message: 'Cart item removed successfully',
		});
	} catch (error: any) {
		return next(new ErrorHandler(error.message, 500));
	}
};
