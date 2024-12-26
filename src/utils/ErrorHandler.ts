class ErrorHandler extends Error {
	statusCode: number;

	constructor(message: string, statusCode: number) {
		super(message);
		this.statusCode = statusCode;

		// Capture the stack trace (excluding the constructor call)
		Error.captureStackTrace(this, this.constructor);
	}
}

export default ErrorHandler;