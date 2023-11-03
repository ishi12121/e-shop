import express from "express";
import { createBrandCtrl, deleteBrandCtrl, getAllBrandCtrl, getSingleBrandCtrl, updateBrandCtrl } from "../controllers/brandsCtrl.js";
import { isLoggedIn } from "../middlewares/isLoggedIn.js";

const brandsRouter = express.Router();

brandsRouter.post("/",isLoggedIn, createBrandCtrl);
brandsRouter.get("/", getAllBrandCtrl);
brandsRouter.get("/:id", getSingleBrandCtrl);
brandsRouter.delete("/:id", deleteBrandCtrl);
brandsRouter.put("/:id", updateBrandCtrl);
export default brandsRouter;