import express from 'express';
const router = express.Router();
import auth from '../middlewares/auth.js';
import blogController from '../controllers/blogController.js';
import multer from 'multer';
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// blog posting api
router.post('/create-blog', auth, upload.array('image', 10), blogController.createBlog); 

//get all posted blogs
router.get('/my-blogs', auth ,blogController.getBlogs);

//view one particular blog by id
router.get('/my-blog/:id', blogController.getBlogById);

//update blog by id
router.put('/update/:id', auth, blogController.updateBlog);

//delete blog by id
router.delete('/delete-blog/:id', auth, blogController.deleteBlog);

export default router;
