import express from 'express';
const router = express.Router();
import userController from "../controllers/userController.js";
import auth from '../middlewares/auth.js';

// import auth from '../middleware/auth';

router.post('/register', userController.register);
router.post('/login', userController.login);
router.post('/logout', auth, userController.logout);
// router.post('/refresh-token', refreshAccessToken);

export default router;