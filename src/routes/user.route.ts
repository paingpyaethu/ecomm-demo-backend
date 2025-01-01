import { Router } from "express";
import { accountInfo, updateUserData } from "../controllers/user.controller";
import { fileUpload } from "../utils/fileUpload";

const userRouter = Router();

userRouter.get('/account-info', accountInfo);
userRouter.put('/update-user-data', fileUpload.single('image') as any, updateUserData);

export default userRouter;