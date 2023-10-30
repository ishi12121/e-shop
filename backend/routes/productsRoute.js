import express from "express";
import { createProductCtrl, getProductCtrl, getProductsCtrl } from "../controllers/ProductCtrl.js";
import { isLoggedIn } from "../middlewares/isLoggedIn.js";


const productsRouter = express.Router();

productsRouter.post("/",isLoggedIn, createProductCtrl);
productsRouter.get("/", getProductsCtrl);
productsRouter.get("/:id", getProductCtrl);
export default productsRouter;