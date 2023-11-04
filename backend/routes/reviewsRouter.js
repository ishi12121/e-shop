import express from "express";
import { isLoggedIn } from "../middlewares/isLoggedIn.js";
import { createReview } from "../controllers/reviewsCtrl.js";

const reviewRouter = express.Router();

reviewRouter.post("/:productId", isLoggedIn, createReview);

export default reviewRouter;