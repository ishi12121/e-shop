import Category from "../model/Category.js";
import Product from "../model/Product.js";
import asyncHandler from "express-async-handler";
// @desc Create new product
// @route POST /api/v1/products
// @access Private/Admin

export const createProductCtrl = asyncHandler(async (req, res) => {
      
    const { name, description, category, sizes, colors, user, price, totalQty, brand } =
        req.body;
    //product exists
    const productExists = await Product.findOne({ name });
    if (productExists) {
        throw new Error("Product Already Exists");
    }
    //find the category
    const categoryFound = await Category.findOne({
        name: category,
    });
    //if category not found
    if (!categoryFound) { 
        throw new Error("Category not found");
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
    categoryFound.products.push(product._id);
    //re save the category
    await categoryFound.save();

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

export const getProductsCtrl = asyncHandler(async (req, res) => {
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
    //filter by brand
    if (req.query.brand) {
        productQuery = productQuery.find({
            brand: {
                $regex: req.query.brand,
                $options: "i",
            },
        });
    }
    //filter by category
    if (req.query.category) {
        productQuery = productQuery.find({
            category: {
                $regex: req.query.category,
                $options: "i",
            },
        });
    }
        //filter by color
        if (req.query.colors) {
            productQuery = productQuery.find({
                colors: {
                    $regex: req.query.colors,
                    $options: "i",
                },
            });
    }
            //filter by size
            if (req.query.size) {
                productQuery = productQuery.find({
                    size: {
                        $regex: req.query.size,
                        $options: "i",
                    },
                });
    }
    //filter by price range
    if (req.query.price) {
        const priceRange = req.query.price.split("-");
        //gte: greater than or equal to
        //lte: less than or equal to
        productQuery = productQuery.find({
            price: { $gte: priceRange[0], $lte: priceRange[1] },
            
        })
    }
    //pagination
    //page
    const page = parseInt(req.query.page) ? parseInt(req.query.page) : 1;
    //limits
    const limit = parseInt(req.query.limit) ? parseInt(req.query.limit) : 10; 
    //startIdx
    const startIndex = (page - 1) * limit;
    //endIdx
    const endIndex = page * limit;
    //total
    const total = await Product.countDocuments();


    productQuery = productQuery.skip(startIndex).limit(limit);
    //pagination results
    const pagination = {}
    if(endIndex < total){
        pagination.next = {
            page: page + 1,
            limit
        }
    }
    if (startIndex > 0) {
        pagination.prev = {
            page: page - 1,
            limit
        }
    }



     //await the query
     const products = await productQuery;
   
    res.json({
        status: "success",
        total,
        results: products.length,
        pagination,
        message:"products fetched successfully",
        products,
    });
});

// @desc Get single product
// @route GET /api/products/:id
// @access Public
export const getProductCtrl = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (!product) {
        throw new Error("Product not found");
    }
    res.json({
        status: "success",
        message: "product fetched successfully",
        product,
    });
});

// @desc  update product
// @route PUT /api/products/:id/update
// @access Private/Admin

//added by ai
export const updateProductCtrl = asyncHandler(async (req, res) => {
    //update
    const product = await Product.findById(req.params.id);
    //update the product
    product.name = req.body.name || product.name;
    product.description = req.body.description || product.description;
    product.category = req.body.category || product.category;
    product.sizes = req.body.sizes || product.sizes;
    product.colors = req.body.colors || product.colors;
    product.price = req.body.price || product.price;
    product.totalQty = req.body.totalQty || product.totalQty;
    product.brand = req.body.brand || product.brand;
    //save the product
    const updatedProduct = await product.save();
    //send response
    res.json({
        status: "success",
        message: "product updated successfully",
        updatedProduct,
    });
    
});

// @desc  delete product
// @route DELETE /api/products/:id/delete
// @access Private/Admin
export const deleteProductCtrl = asyncHandler(async (req, res) => {
    const product = await Product.findByIdAndDelete(req.params.id);
    res.json({
        status: "success",
        message: "product deleted successfully",
    });
});