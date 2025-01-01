import { PrismaClient } from "@prisma/client";
import { NextFunction, Response } from "express";
import ErrorHandler from "../utils/ErrorHandler";

const userClient = new PrismaClient().user;

export const accountInfo = async (req: any, res: Response, next: NextFunction) => {
	return res.json({ success: true, data: req.user });
};

export const updateUserData = async (
	req: any,
	res: Response,
	next: NextFunction
) => {
	try {
		const file = req.file as Express.Multer.File;
    if (file) {
			req.body.image = file.filename;
		}
    const { name } = req.body
    if (name) {
      req.body.name = name;
    }
    const updatedUserData = await userClient.update({
      where: { id: req.user.id },
      data: req.body,
    });
		return res.status(201).json({
			success: true,
			data: updatedUserData,
		});
	} catch (error: any) {
		return next(new ErrorHandler(error.message, 500));
	}
};