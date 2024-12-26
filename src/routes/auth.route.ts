import { Router } from "express";
import { accountInfo, login, register } from "../controllers/auth.controller";
import { isAuthenticated } from "../middleware/auth";

const authRouter = Router();

authRouter.post('/register', register);
authRouter.post('/login', login);
authRouter.get('/account-info', isAuthenticated, accountInfo);

export default authRouter;