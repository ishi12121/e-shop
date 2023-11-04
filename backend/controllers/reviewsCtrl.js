import asyncHandler from "express-async-handler";
import Review from "../model/Review.js";
import Product from "../model/Product.js";

// @desc Create new review
// @route POST /api/v1/reviews
// @access Private/Admin
export const createReview = asyncHandler(async (req, res) => {
    const { product, message, rating } = req.body;
    //1. Find the product
    const { productId } = req.params;
    //product exists
    const productExists = await Product.findById(productId).populate("reviews");
    if (!productExists) {
        throw new Error("Product not found");
    }
    //check if user already reviewed this product
    const hasReviewed = productExists?.reviews?.find((review) => {
        return review?.user?.toString() === req?.userAuthId?.toString();
    });
    if (hasReviewed) {
        throw new Error("You have already reviewed this product");
   }
    // create the review
    const review = await Review.create({
        message,
        rating,
        product: productExists?._id,
        user:req.userAuthId,

    });
    // push the review into product
    productExists.reviews.push(review?._id);
    //re save the product
    await productExists.save();
    // send response
    res.json({
        status: "success",
        message: "Review created successfully",
        review,
    });
}
);
