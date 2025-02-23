import express from 'express';
const router = express.Router();
import auth from '../middlewares/auth.js';
import blogController from '../controllers/blogController.js';
import multer from 'multer';

// Multer configuration for storing images in memory
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Route for creating a blog with multiple image uploads
router.post('/create-blog', auth, upload.array('image', 10), blogController.createBlog); 

router.get('/my-blogs', auth ,blogController.getBlogs);
router.get('/my-blog/:id', blogController.getBlogById);
router.put('/update/:id', auth, blogController.updateBlog);
router.delete('/delete-blog/:id', auth, blogController.deleteBlog);

export default router;
