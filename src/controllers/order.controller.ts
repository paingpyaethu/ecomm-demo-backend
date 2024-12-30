import { PrismaClient } from '@prisma/client';
import { NextFunction, Request, Response } from 'express';
import ErrorHandler from '../utils/ErrorHandler';

const prismaClient = new PrismaClient();

export const createOrder = async (req: any, res: Response, next: NextFunction) => {
  try {
    const { address, netAmount, products } = req.body;

    if (!products || products.length === 0) {
      return next(new ErrorHandler("No products in the order", 400));
    }

    const userId = req.user.id;

    const order = await prismaClient.order.create({
      data: {
        userId,
        address,
        netAmount,
        orderProduct: {
          create: products.map((product: { productId: number; quantity: number }) => ({
            productId: product.productId,
            quantity: product.quantity,
          })),
        },
        orderEvent: {
          create: { status: "Pending" },
        },
      },
      include: {
        orderProduct: true,
        orderEvent: true,
      },
    });

    res.status(201).json({
      success: true,
      data: order,
    });
  } catch (error: any) {
    return next(new ErrorHandler(error.message, 500));
  }
};

// export const createOrder = async (
// 	req: any,
// 	res: Response,
// 	next: NextFunction
// ) => {
// 	return await prismaClient.$transaction(async (tx) => {
// 		const cartItems = await tx.cartItem.findMany({
// 			where: { userId: req.user.id },
// 			include: { product: true },
// 		});
// 		if (cartItems.length === 0) {
// 			return next(new ErrorHandler('Cart is empty', 400));
// 		}
// 		const price = cartItems.reduce((prev, current) => {
// 			return prev + current.quantity * +current.product.price;
// 		}, 0);
// 		const address = await tx.address.findFirst({
// 			where: { id: req.user.defaultShippingAddressId },
// 		});
// 		const order = await tx.order.create({
// 			data: {
// 				userId: req.user.id,
// 				netAmount: price,
// 				address: `${address?.street}, ${address?.city}, ${address?.country}`,
// 				orderProduct: {
// 					create: cartItems.map((cart) => {
// 						return {
// 							productId: cart.productId,
// 							quantity: cart.quantity,
// 						};
// 					}),
// 				},
// 			},
// 		});
// 		await tx.orderEvent.create({
// 			data: {
// 				orderId: order.id,
// 			},
// 		});
// 		await tx.cartItem.deleteMany({
// 			where: { userId: req.user.id },
// 		});
// 		return res.status(201).json({
// 			success: true,
// 			data: order,
// 		});
// 	});
// };

// export const getOrders = async (
// 	req: Request,
// 	res: Response,
// 	next: NextFunction
// ) => {
// 	try {
// 		const { page = 1, limit = 10 } = req.query;

// 		const pageNumber = parseInt(page as string, 10);
// 		const limitNumber = parseInt(limit as string, 10);
// 		const skip = (pageNumber - 1) * limitNumber;

// 		const orders = await prisma.order.findMany({
// 			skip,
// 			take: limitNumber,
// 		});

// 		const totalOrders = await prisma.order.count();

// 		return res.status(200).json({
// 			success: true,
// 			data: orders,
// 			meta: {
// 				total: totalOrders,
// 				page: pageNumber,
// 				limit: limitNumber,
// 				totalPages: Math.ceil(totalOrders / limitNumber),
// 			},
// 		});
// 	} catch (error: any) {
// 		return next(new ErrorHandler(error.message, 500));
// 	}
// };
