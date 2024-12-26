import { Request, Response, NextFunction } from 'express';
import ErrorHandler from '../utils/ErrorHandler';

export const notFoundHandler = (
	_: Request,
	res: Response,
	__: NextFunction
) => {
	res.status(404).json({
		status: 'error',
		message: `Not Found!`,
	});
};

export const errorMiddleware = (
	err: ErrorHandler | any,
	_: Request,
	res: Response,
	__: NextFunction
) => {
	err.message = err.message || 'Internal Server Error';
	err.statusCode = err.statusCode || 500;

	if (err.message.includes('Cast to ObjectId failed')) {
		const message = `Invalid Cast to Id`;
		err = new ErrorHandler(message, 400);
	}

	if (err.message.includes('Unique constraint failed on the fields: (`email`)')) {
		const message = `User already exists`;
		err = new ErrorHandler(message, 400);
	}

	if (err.name === 'JsonWebTokenError') {
		const message = `Json Web Token is invalid, Try again!`;
		err = new ErrorHandler(message, 400);
	}

	if (err.name === 'TokenExpiredError') {
		const message = `Token is expired, Try again!`;
		err = new ErrorHandler(message, 500);
	}

	if (err.name === 'CastError') {
		const message = `Invalid ${err.path}`;
		err = new ErrorHandler(message, 400);
	}

	const errorMessage = err.errors
		? Object.values(err.errors)
				.map((error: any) => error.message)
				.join(' ')
		: err.message;

	return res.status(err.statusCode).json({
		success: false,
		message: errorMessage,
	});
};
