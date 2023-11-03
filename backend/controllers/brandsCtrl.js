import asyncHandler from "express-async-handler";
import Brand from "../model/Brand.js";
//@desc Create new Brand
//@route POST /api/v1/brands
//@access Private/Admin
export const createBrandCtrl = asyncHandler(async (req, res) => {
  const { name} = req.body;
  //category exists
  const brandExists = await Brand.findOne({ name });
  if (brandExists) {
    throw new Error("brand Already Exists");
  }
  // create the category
  const brand = await Brand.create({
    name: name.toLowerCase(),
    user: req.userAuthId,
  });
  // send response
  res.json({
    status: "success",
    message: "Brand created successfully",
    brand,
  });
}); 

//@desc   Create all brands
//@route   GET  /api/v1/brands
//@access  Public
export const getAllBrandCtrl = asyncHandler(async (req, res) => {
    const brand = await Brand.find();
    res.json({
        status: "success",
        message: "All Brands",
        brand,
    });
}); 
//@desc   Get single Brand
//@route  GET  /api/v1/brands/:id
//@access   Public
export const getSingleBrandCtrl = asyncHandler(async (req, res) => {
    const brand = await Brand.findById(req.params.id);
    if (!brand) {
        throw new Error("brand not found");
    }
    res.json({
        status: "success",
        message: "brand fetched successfully",
        brand,
    });
});
//@desc   Update Brand
//@route  PUT /api/v1/brands/:id
//@access  Private/Admin
export const updateBrandCtrl = asyncHandler(async (req, res) => {
    const { name } = req.body;

    //update
    const brand = await Brand.findByIdAndUpdate(
        req.params.id,
        {
            name
        },
        {
            new: true,
            runValidators: true
        }
    );
    if (!brand) {
        throw new Error("Brand not found");
    }
    res.json({
        status: "success",
        message: "brand updated successfully",
        brand,
    });
});
//@desc delete Brand
//@route DELETE /api/v1/brands/:id
//@access Private/Admin
export const deleteBrandCtrl = asyncHandler(async (req, res) => {
    const brand = await Brand.findByIdAndDelete(req.params.id);
    if (!brand) {
        throw new Error("Brand not found");
    }
    res.json({
        status: "success",
        message: "brand deleted successfully",
    });
});
