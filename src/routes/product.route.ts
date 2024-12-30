import { Router } from 'express';
import {
	createProduct,
	deleteProduct,
	getProductById,
	getProductsByCategory,
	updateProduct,
} from '../controllers/product.controller';
import { fileUpload } from '../utils/fileUpload';
import { authorizeRole } from '../middleware/auth';

const productRouter = Router();

productRouter.post(
	'/products',
	fileUpload.single('image') as any,
	authorizeRole,
	createProduct
);
productRouter.put(
	'/products/:id',
	fileUpload.single('image') as any,
	authorizeRole,
	updateProduct
);
productRouter.delete('/products/:id', authorizeRole, deleteProduct);
productRouter.get('/products-by-category/:categoryName', getProductsByCategory);
productRouter.get('/products/:id', getProductById);

export default productRouter;
