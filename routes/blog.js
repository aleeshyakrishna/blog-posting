import express from 'express'
const router = express.Router();
import auth from '../middlewares/auth.js';
import blogController from '../controllers/blogController.js'


router.post('/create-blog', auth, blogController.createBlog);
// router.get('/list-blog', getBlogs);
// router.get('/display/:id', getBlogById);
// router.put('/update/:id', auth, updateBlog);
// router.delete('/delete/:id', auth, deleteBlog);


export default router;