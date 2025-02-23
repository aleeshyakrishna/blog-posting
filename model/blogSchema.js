import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema({

  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    minlength: [5, 'Title must be at least 5 characters'],
    maxlength: [100, 'Title cannot exceed 100 characters']
  },

  content: {
    type: String,
    required: [true, 'Content is required'],
    minlength: [15, 'Content must be at least 10 characters'] ,
    maxlength: [1500, 'Title cannot exceed 100 characters']

  },

  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  category: {
    type: String,
    required: true,
    enum: ['Technology', 'Lifestyle', 'Travel', 'Food', 'Other']
  },

  image: {
    type: [String]
  },

  createdAt: {
    type: Date,
    default: Date.now
  },

  updatedAt: {
    type: Date,
    default: Date.now
  }

});


blogSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.model('Blog', blogSchema);