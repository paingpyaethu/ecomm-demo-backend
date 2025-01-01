import { PrismaClient } from '@prisma/client';
import { NextFunction, Response } from 'express';
import ErrorHandler from '../utils/ErrorHandler';

const prismaClient = new PrismaClient();

export const createOrder = async (
	req: any,
	res: Response,
	next: NextFunction
) => {
	try {
		const { totalPrice, address, ...orders } = req.body;

		if (!address) {
			return next(new ErrorHandler('User address is required', 400));
		}
		const orderKeys = Object.keys(orders);
		if (orderKeys.length === 0) {
			return next(new ErrorHandler('No orders found!', 400));
		}
		const userId = req.user.id;

		const createdOrders = [];
		for (const key of orderKeys) {
			const { name, price, image, items } = orders[key];

			if (!name || !price || !image || !Array.isArray(items)) {
				return next(
					new ErrorHandler(`Invalid order structure for order: ${key}`, 400)
				);
			}

			const createdOrder = await prismaClient.order.create({
				data: {
					userId,
					name,
					price,
					image,
          address,
          status: "Pending", 
					totalPrice,
					items: {
						create: items.map((item: any) => ({
							color: item.color,
							size: item.size,
							quantity: item.quantity,
						})),
					},
				},
			});

			createdOrders.push(createdOrder);
		}
		res.status(201).json({
			success: true,
			data: createdOrders,
		});
	} catch (error: any) {
		return next(new ErrorHandler(error.message, 500));
	}
};

export const getOrders = async (req: any, res: Response, next: NextFunction) => {
  try {
    const userId = req.user.id; 
    const userRole = req.user.role;

    if (!userId) {
      return next(new ErrorHandler('User is not authenticated', 401));
    }

    // If the user is an admin, they can view all orders
    const orders = userRole === 'admin'
      ? await prismaClient.order.findMany({
          include: {
            items: true, // Include related items
          },
        })
      : await prismaClient.order.findMany({
          where: {
            userId, // Filter orders by userId for regular users
          },
          include: {
            items: true, // Include related items
          },
        });

    return res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (error: any) {
    return next(new ErrorHandler(error.message, 500));
  }
};

