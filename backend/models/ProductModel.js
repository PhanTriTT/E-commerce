const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please enter a name of a product'],
    trim: true,
    maxlength: [20, 'Product name cannot exceed 20 characters'],
  },
  description: {
    type: String,
    required: [true, 'Please add a description of your product'],
    maxlength: [4000, 'Description cannot exceed 4000 characters'],
  },
  price: {
    type: Number,
    required: [true, 'Please enter a price for your product'],
    maxlength: [8, 'Price cannot exceed 8 characters'],
  },
  discountPrice: {
    type: String,
    maxlength: [4, 'Discount price cannot exceed 4 characters'],
  },
  color: {
    type: String,
  },
  size: {
    type: String,
  },
  ratings: {
    type: Number,
    default: 0,
  },
  images: [
    {
      public_id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },
  ],
  category: {
    type: String,
    required: [true, 'Please add a category of your product'],
  },
  Stock: {
    type: Number,
    required: [true, 'Please add some stock for your product'],
    maxlength: [3, 'Stock cannot exceed 3 characters'],
  },
  numOfReviews: {
    type: Number,
    default: 0,
  },
  reviews: [
    {
      user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      rating: {
        type: Number,
        required: true,
      },
      comment: {
        type: String,
        required: true,
      },
      time: {
        type: Date,
        default: Date.now(),
      },
    },
  ],
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
})

module.exports = mongoose.model('Product', productSchema)
