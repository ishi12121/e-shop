import express from "express";
import { createProductCtrl, getProductCtrl } from "../controllers/ProductCtrl.js";
import { isLoggedIn } from "../middlewares/isLoggedIn.js";


const productsRouter = express.Router();

productsRouter.post("/",isLoggedIn, createProductCtrl);
productsRouter.get("/", getProductCtrl);
export default productsRouter;