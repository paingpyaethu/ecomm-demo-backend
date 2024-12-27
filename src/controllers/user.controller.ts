import { PrismaClient } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import ErrorHandler from "../utils/ErrorHandler";

const addressClient = new PrismaClient().address;
const userClient = new PrismaClient().user;

export const addAddress = async (
	req: any,
	res: Response,
	next: NextFunction
) => {
	try {
		const address = await addressClient.create({
			data: {
				...req.body,
				userId: req.user.id
			},
		});
		return res.status(201).json({
			success: true,
			data: address,
		});
	} catch (error: any) {
		return next(new ErrorHandler(error.message, 500));
	}
};

export const getAllAddresses = async (_: Request, res: Response, next: NextFunction) => {
  try {
    const addresses = await addressClient.findMany({
      include: { user: true },
    });

    return res.status(200).json({
      success: true,
      data: addresses,
    });
  } catch (error: any) {
    return next(new ErrorHandler(error.message, 500));
  }
};

export const deleteAddress = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const existingAddress = await addressClient.findUnique({
      where: { id: +id },
    });
    if (!existingAddress) {
      return next(new ErrorHandler('Address not found', 404));
    }

    await addressClient.delete({
      where: { id: +id },
    });

    return res.status(200).json({
      success: true,
      message: 'Address deleted successfully',
    });
  } catch (error: any) {
    return next(new ErrorHandler(error.message, 500));
  }
};

export const updateDefaultShippingAddress = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const { defaultShippingAddressId } = req.body;

    const shippingAddress = await addressClient.findFirst({
      where: { id: defaultShippingAddressId, userId: req.user.id },
    });

		if (!shippingAddress) {
      return next(new ErrorHandler('Address not found or user mismatch', 404));
    }

		const updatedData = await userClient.update({
      where: { id: req.user.id },
      data: { defaultShippingAddressId },
    });

    return res.status(200).json({
      success: true,
			data: updatedData,
    });
  } catch (error: any) {
    return next(new ErrorHandler(error.message, 500));
  }
};

