import express from "express";
import { createProductCtrl } from "../controllers/ProductCtrl.js";
import { isLoggedIn } from "../middlewares/isLoggedIn.js";


const productsRouter = express.Router();

productsRouter.post("/",isLoggedIn, createProductCtrl);

export default productsRouter;