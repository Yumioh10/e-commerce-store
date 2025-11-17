import { Router } from 'express';
import AuthController from '../controllers/auth.controller';
import { AuthService } from '../services/auth.service';
import { User } from '../models/user.model';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();
const authController = new AuthController();
const authService = new AuthService();

router.post('/register', authController.register.bind(authController));
router.post('/login', authController.login.bind(authController));
router.get('/me', authenticate, authController.getMe.bind(authController));
router.put('/profile', authenticate, authController.updateProfile.bind(authController));
router.put('/password', authenticate, authController.changePassword.bind(authController));
router.post('/logout', authController.logout.bind(authController));
router.post('/wishlist/:productId', authenticate, authController.addToWishlist.bind(authController));
router.delete('/wishlist/:productId', authenticate, authController.removeFromWishlist.bind(authController));
router.get('/wishlist', authenticate, authController.getWishlist.bind(authController));

// Temporary admin registration - REMOVE IN PRODUCTION
router.post('/register-admin', async (req, res, next) => {
  try {
    const { email, password, firstName, lastName } = req.body;
    const user = new User({ email, password, firstName, lastName, role: 'admin' });
    await user.save();
    const token = authService.generateToken((user._id as any).toString());
    res.status(201).json({ success: true, data: { user, token } });
  } catch (error) {
    next(error);
  }
});

export default router;