import multer from 'multer';
import path from 'path';
import fs from 'fs';

const ALLOWED_EXTENSIONS: { [key: string]: string } = {
	'image/png': 'png',
	'image/jpeg': 'jpeg',
	'image/jpg': 'jpg',
};

const storage = multer.diskStorage({
	destination: function (_, __, cb) {
		const uploadDir = path.join(__dirname, '..', 'upload', 'images');

		if (!fs.existsSync(uploadDir)) {
			fs.mkdirSync(uploadDir, { recursive: true });
		}

		cb(null, uploadDir);
	},
	filename: function (_, file, cb) {
		const extension =
			ALLOWED_EXTENSIONS[file.mimetype as keyof typeof ALLOWED_EXTENSIONS];
		cb(null, `image_${Date.now()}.${extension}`);
	},
});

// Multer upload setup
const fileUpload = multer({
	storage: storage,
  limits: { fileSize: 1024 * 1024 * 2 }, // 2MB limit
	fileFilter(_, file, callback) {
		const isValid =
			ALLOWED_EXTENSIONS[file.mimetype as keyof typeof ALLOWED_EXTENSIONS];
		const uploadError = new Error(
			`Invalid image type\n${file.mimetype} is not allowed`
		);
		if (!isValid) return callback(uploadError);
		callback(null, true);
	}
});

export { fileUpload }