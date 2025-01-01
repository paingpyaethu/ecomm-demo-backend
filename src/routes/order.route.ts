import { Router } from "express";
import { createOrder, getOrders } from "../controllers/order.controller";

const orderRouter = Router();

orderRouter.post('/orders', createOrder);
orderRouter.get('/orders', getOrders);

export default orderRouter;