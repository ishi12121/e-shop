import dotenv from "dotenv";
dotenv.config();
import express from 'express';
import dbConnect from '../config/dbconnect.js';
import userRoutes from "../routes/usersRoute.js";
//db connect
dbConnect();

const app = express();
//pass incoming data 
app.use(express.json());

//routes
app.use('/', userRoutes);  
export default app;
