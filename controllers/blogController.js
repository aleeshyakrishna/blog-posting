import Blog from '../model/blogSchema.js';
import { v2 as cloudinary } from "cloudinary";
import { validationResult } from "express-validator";
import AppError from "../utils/AppError.js";
import configKeys from '../config/configKeys.js';

cloudinary.config({
  cloud_name: configKeys.CLOUDINARY_CLOUD_NAME,
  api_key: configKeys.CLOUDINARY_API_KEY,
  api_secret: configKeys.CLOUDINARY_API_SECRET,
});


// Create new blog

export const createBlog = async (req, res,next) => {
  try {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(new AppError(errors.array().map(e => e.msg).join(", "), 400));
    }

    // console.log(req.body, req.files, req.user.userId, "datas......>>>>");
    const{title,content,category} = req.body;

    if (!req.files || req.files.length === 0) {
      return next(new AppError("At least one image is required", 400));
    }

    const uploadedFiles = [];

    for (let i = 0; i < req.files.length; i++) {
      const file = req.files[i];
      const imageBuffer = file.buffer;

      const imageResult = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          { folder: "blog/image" },
          (error, result) => {
            if (error) {
              console.error("Cloudinary upload error:", error);
              return reject(`Image upload failed: ${error.message}`);
            }
            resolve(result.secure_url);
          }
        ).end(imageBuffer);
      });

      uploadedFiles.push(imageResult);
    }

    const blog = new Blog({
     
      title:title,
      content:content,
      category:category,
      author: req.user.userId,
      image: uploadedFiles, 

    });

    await blog.save();
    res.status(201).json({ message: "Blog posted successfully", blog });

  } catch (error) {
    console.error("Error creating blog:", error);
    next(error)
  }
};


// Get all blogs with pagination and filtering

export const getAllBlogs = async (req, res) => {
  try {
    const { page = 1, limit = 10, category } = req.query;
    const query = {};

    if (category) query.category = category;
    

    const blogs = await Blog.find(query)
      .populate('author', 'username email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Blog.countDocuments(query);

    res.json({
      blogs,
      totalPages: Math.ceil(total / limit),
      currentPage: page
    });

  } catch (error) {
    next(error)
  }
};


// get my blogs
export const getBlogs = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, category } = req.query;
    
    console.log(req.user,"------->>");
    
    if (!req.user || !req.user.userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Construct query to fetch only the logged-in user's blogs
    const query = { author: req.user.userId };
    if (category) query.category = category;

    const blogs = await Blog.find(query)
      .populate('author', 'username email') // Optional: Remove this if not needed
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await Blog.countDocuments(query);

    res.json({
      blogs,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
    });

  } catch (error) {
    next(error);
  }
};


// Get blog by ID
export const getBlogById = async (req, res, next) => {
  try {

    const blog = await Blog.findById(req.params.id)
      .populate('author',  'username email')

     console.log(blog);
     
    if (!blog) return next(new AppError("Blog not found", 404));

    res.json({message:"blog fetched successfully",blog});

  } catch (error) {
    next(error)
  }
};


// Update blog

export const updateBlog = async (req, res,next) => {
  try {
    const { id } = req.params;
    const newData = req.body;
    const userId = req.user.userId;

    const blog = await Blog.findOneAndUpdate(
      { _id: id, author: userId }, 
      { $set: newData }, 
      { new: true } 
    );
    
    if (!blog) return next(new AppError("Blog not found or unauthorized", 404));


    console.log("blog updated successfully!!");
    res.status(200).json({ message: "Blog updated successfully", blog });

  } catch (error) {
    next(error)
  }
};

// Delete blog

export const deleteBlog = async (req, res,next) => {
  try {
    const blog = await Blog.findOneAndDelete({
      _id: req.params.id,
      author: req.user.userId
    });

    if (!blog) {
        return next(new AppError("Blog not found or unauthorized", 404));

    }

    res.json({ message: 'Blog deleted successfully' });
  } catch (error) {
    next(error)
  }
};

export default { createBlog, getBlogs, getBlogById, getAllBlogs, updateBlog, deleteBlog };