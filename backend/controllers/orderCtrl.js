
import asyncHandler from "express-async-handler";
import Order from "../model/Order.js";
import User from "../model/User.js";
import Product from "../model/Product.js";
import Stripe from "Stripe";
import dotenv from "dotenv";
dotenv.config();
//@desc create orders
//@route POST /api/v1/orders
//@access private

//stripe INSTANCE
const stripe = new Stripe(process.env.STRIPE_KEY);

export const createOrderCtrl = asyncHandler(async (req, res) => {
  //Get the payload(customer, orderItems,shippingAddress,totalPrice);
  const { customer, orderItems, shippingAddress, totalPrice } = req.body;
 
  //find the user
  const user = await User.findById(req.userAuthId);
  //check if user has shipping address
  if (!user?.hasShippingAddress) {
    throw new Error("User has no shipping address");
  }
  //Check if order is not empty
  if (orderItems?.length <= 0) {
    throw new Error("No Order Items");
  }
  //Place/create order - save into DB
  const order = await Order.create({
    user: user?._id,
    orderItems,
    shippingAddress,
    totalPrice,

  });


  //update the product qty
  const products = await Product.find({ _id: { $in: orderItems } }) //finding product by id 
  orderItems?.map(async (order) => {
    const product = products?.find((product) => {
      return product?._id?.toString() === order?._id?.toString()
    });
    if (product) {
      product.totalSold += order.qty;
    }
    await product.save();
  });
  //push order into user
  user.orders.push(order?._id);
  await user.save();
  //convert order items to have same structure that stripe need
  const convertedOrders = orderItems.map((item) => {
    return {
      price_data: {
        currency: "usd",
        product_data: {
          name: item?.name,
          description: item?.description,
        },
        unit_amount: item?.price * 100,
      },
      quantity: item?.qty,
    };
  });
  //make payment (stripe)
  const session = await stripe.checkout.sessions.create({
    line_items: convertedOrders,
    mode: 'payment',
    success_url: 'http://localhost:3000/success',
    cancel_url:'http://localhost:3000/cancel',
  });
  res.send({ url: session.url });
  
  //payment webhook

  //update the user webhook
 // res.json({
   // success: true,
  //  message: "order created",
  //  order,
  //  user,
    
 // });
});