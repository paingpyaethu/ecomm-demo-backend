import { Router } from "express";
import { addAddress, deleteAddress, getAllAddresses, updateDefaultShippingAddress } from "../controllers/user.controller";

const userRouter = Router();

userRouter.post('/address', addAddress);
userRouter.get('/address', getAllAddresses);
userRouter.delete('/address/:id', deleteAddress);
userRouter.put('/default-shipping-address', updateDefaultShippingAddress);

export default userRouter;