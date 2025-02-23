import express from 'express';
const router = express.Router();
import userController from "../controllers/userController.js";
import auth from '../middlewares/auth.js';

// user registration api
router.post('/register', userController.register);

//user login api
router.post('/login', userController.login);

//user logout api
router.post('/logout', auth, userController.logout);

export default router;