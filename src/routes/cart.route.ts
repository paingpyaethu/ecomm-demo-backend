import { Router } from 'express';
import {
	addItemToCart,
	changeQuantity,
	getCartItems,
	removeCartItem,
} from '../controllers/cart.controller';

const cartRouter = Router();

cartRouter.get('/carts', getCartItems);
cartRouter.post('/cart', addItemToCart);
cartRouter.put('/cart/change-quantity/:cartItemId', changeQuantity);
cartRouter.delete('/cart/:cartItemId', removeCartItem);

export default cartRouter;
