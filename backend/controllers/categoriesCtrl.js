import asyncHandler from "express-async-handler";
import Category from "../model/Category.js";
//@desc Create new category
//@route POST /api/v1/categories
//@access Private/Admin
export const createCategoryCtrl = asyncHandler(async (req, res) => {
  const { name, image } = req.body;
  //category exists
  const categoryExists = await Category.findOne({ name });
  if (categoryExists) {
    throw new Error("Category Already Exists");
  }
  // create the category
  const category = await Category.create({
    name: name.toLowerCase(),
    image,
    user: req.userAuthId,
  });
  // send response
  res.json({
    status: "success",
    message: "Category created successfully",
    category,
  });
}); 

//@desc   Create all categories
//@route   GET  /api/v1/categories
//@access  Public
export const getAllCategoriesCtrl = asyncHandler(async (req, res) => {
    const categories = await Category.find();
    res.json({
        status: "success",
        message: "All categories",
        categories,
    });
}); 
//@desc   Get single category
//@route  GET  /api/v1/categories/:id
//@access   Public
export const getSingleCategoryCtrl = asyncHandler(async (req, res) => {
    const category = await Category.findById(req.params.id);
    if (!category) {
        throw new Error("Category not found");
    }
    res.json({
        status: "success",
        message: "category fetched successfully",
        category,
    });
});
//@desc   Update category
//@route  PUT /api/v1/categories/:id
//@access  Private/Admin
export const updateCategoryCtrl = asyncHandler(async (req, res) => {
    const { name } = req.body;

    //update
    const category = await Category.findByIdAndUpdate(
        req.params.id,
        { name },
        { new: true, runValidators: true }
    );
    if (!category) {
        throw new Error("Category not found");
    }
    res.json({
        status: "success",
        message: "category updated successfully",
        category,
    });
});
//@desc delete category
//@route DELETE /api/v1/categories/:id
//@access Private/Admin
export const deleteCategoryCtrl = asyncHandler(async (req, res) => {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) {
        throw new Error("Category not found");
    }
    res.json({
        status: "success",
        message: "category deleted successfully",
    });
});
