import Product from "../model/Product.js";
import asyncHandler from "express-async-handler";
// @desc Create new product
// @route POST /api/v1/products
// @access Private/Admin

export const createProductCtrl = asyncHandler(async (req, res) => {
      
    const { name, description, category, sizes, colors, user, price, totalQty,brand } =
        req.body;
    //product exists
    const productExists = await Product.findOne({ name });
    if (productExists) {
        throw new Error("Product Already Exists");
    }
    // create the product
    const product = await Product.create({
        name,
        description,
        category,
        sizes,
        colors,
        user: req.userAuthId,
        price,
        totalQty,
        brand,
    
    });
    // push the product into category
    // send response
    res.json({
        status: "success",
        message: "Product created successfully",
        product,
    });
    
});

// @desc Get all products
// @route GET /api/v1/products
// @access Public

export const getProductCtrl = asyncHandler(async (req, res) => {
    console.log(req.query);
    //query
    let productQuery = Product.find();
    
    //search by name
    if (req.query.name) {
        productQuery = productQuery.find({
            name: {
                $regex: req.query.name,
                $options: "i",
            },
        });
    }
     //await the query
     const products = await productQuery;
   
    res.json({
        status: "success",
        products,
    });
});
