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

// router.get('/list-blog', getBlogs);
// router.get('/display/:id', getBlogById);
// router.put('/update/:id', auth, updateBlog);
// router.delete('/delete/:id', auth, deleteBlog);

export default router;
