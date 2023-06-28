const mongoose = require('mongoose');

// Define the category schema separately
const categorySchema = {
  name: {
    type: String,
    required: true,
  },
  children: [Object],
};

// Create a schema for the categories using the defined categorySchema
const CategorySchema = new mongoose.Schema(categorySchema);

// Create the Category model
const Category = mongoose.model('Category', CategorySchema);

module.exports = Category;
