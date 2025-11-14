import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { validateMiddleware } from '../middlewares/validate.middleware';
import { CreateUserDto } from '../_shared/dtos/create-user.dto';
import { LoginUserDto } from '../_shared/dtos/login-user.dto';

const router = Router();
const authController = new AuthController(); // You would create this controller

router.post(
  '/user/register',
  validateMiddleware(CreateUserDto),
  authController.register
);
router.post(
  '/auth/login',
  validateMiddleware(LoginUserDto),
  authController.login
);

export const userRoutes = router;