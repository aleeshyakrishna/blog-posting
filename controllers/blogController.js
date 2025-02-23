import Blog from '../model/blogSchema.js';
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Create new blog
// export const createBlog = async (req, res) => {
//   try {

//     console.log(req.body,req.files,req.user.userId,"datas......>>>");

//  const uploadedFiles = {};

      
//       if (req.files.image && req.files.image[0]) {
//         const imageBuffer = req.files.image[0].buffer;
//         const imageResult = await new Promise((resolve, reject) => {
//           cloudinary.uploader
//             .upload_stream(
//               { folder: "blog/image" },
//               (error, result) => {
//                 if (error)
//                   return reject(`image upload failed: ${error.message}`);
//                 resolve(result);
//               }
//             )
//             .end(imageBuffer);
//         });
//         uploadedFiles.image = imageResult.secure_url;
//       }
//     console.log(imageResult,"------------->>>>>>.");
    
//     // const blog = new Blog({
//     //   ...req.body,
//     //   author: req.user.userId
      
      
//     // });



//     // await blog.save();
//     res.status(201).json({message:"blog posted successful",blog});
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// };
export const createBlog = async (req, res) => {
  try {
    // console.log(req.body, req.files, req.user.userId, "datas......>>>>");
    const{title,content,category} = req.body;

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "At least one image is required" });
    }

    const uploadedFiles = [];

    for (const file of req.files) {
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
    res.status(400).json({ error: error.message });
  }
};


// Get all blogs with pagination and filtering
export const getBlogs = async (req, res) => {
  try {
    const { page = 1, limit = 10, category, tag, status } = req.query;
    const query = {};

    if (category) query.category = category;
    if (tag) query.tags = tag;
    if (status) query.status = status;

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
    res.status(500).json({ error: error.message });
  }
};

// Get blog by ID
export const getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id)
      .populate('author', 'username email')
      .populate('comments.user', 'username');

    if (!blog) {
      return res.status(404).json({ error: 'Blog not found' });
    }

    // Increment views
    blog.views += 1;
    await blog.save();

    res.json(blog);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update blog
export const updateBlog = async (req, res) => {
  try {
    const blog = await Blog.findOne({
      _id: req.params.id,
      author: req.user.userId
    });

    if (!blog) {
      return res.status(404).json({ error: 'Blog not found or unauthorized' });
    }

    Object.assign(blog, req.body);
    await blog.save();

    res.json(blog);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete blog
export const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findOneAndDelete({
      _id: req.params.id,
      author: req.user.userId
    });

    if (!blog) {
      return res.status(404).json({ error: 'Blog not found or unauthorized' });
    }

    res.json({ message: 'Blog deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
export default { createBlog };