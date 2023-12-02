import express from "express";
import {
  createCouponCtrl,
  getAllCouponsCtrl,
  getCouponCtrl,
  updateCouponCtrl,
  deleteCouponCtrl,
} from "../controllers/couponsCtrl.js";
import { isLoggedIn } from "../middlewares/isLoggedIn.js";

const couponsRouter = express.Router();

couponsRouter.post("/", isLoggedIn, createCouponCtrl);

couponsRouter.get("/", getAllCouponsCtrl);
couponsRouter.put("/update/:id", isLoggedIn, updateCouponCtrl);
couponsRouter.delete("/delete/:id", isLoggedIn, deleteCouponCtrl);
couponsRouter.get("/single", getCouponCtrl);
export default couponsRouter;