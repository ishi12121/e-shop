import asyncHandler from "express-async-handler";
import Coupon from "../model/Coupon.js";
// @desc  Create new Coupon
// @route POST /api/v1/coupons
// @access Private/Admin

export const createCouponCtrl = asyncHandler(async (req, res) => {
    const { code, startDate, endDate, discount } = req.body;
    //check if admin
    //check if coupon already exists
    const couponsExists = await Coupon.findOne({
        code,
    })
    if (couponsExists) {
        throw new Error("Coupon already exists");
    }
    //check if discount is a number
    if (isNaN(discount)) {
        throw new Error("Discount value must be a number");
    }
    //create coupon
    const coupon = await Coupon.create({
        code,
        startDate,
        endDate,
        discount,
        user: req.userAuthId,
    });
    //send response
    res.status(201).json({
        success: "success",
        message: "Coupon created successfully",
        coupon,
    });
});

// @desc  Get all coupons
// @route GET /api/v1/coupons
// @access Private/Admin
export const getAllCouponsCtrl = asyncHandler(async (req, res) => {
    const coupons = await Coupon.find();
    res.status(200).json({
        success: true,
        message: "All coupons",
        coupons,
    });
})