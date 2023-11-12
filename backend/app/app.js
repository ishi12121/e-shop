import dotenv from "dotenv";
import Stripe from "Stripe";
dotenv.config();
import express from 'express';
import dbConnect from '../config/dbconnect.js';
import productsRouter from "../routes/productsRoute.js";
import userRoutes from "../routes/usersRoute.js";
import { globalErrhandler, notFound } from "../middlewares/globalErrHandler.js";
import categoriesRouter from "../routes/categoriesRouter.js";
import brandsRouter from "../routes/brandsRouter.js";
import colorRouter from "../routes/colorRouter.js";
import reviewRouter from "../routes/reviewsRouter.js";
import orderRouter from "../routes/ordersRouter.js";


//db connect
dbConnect();
const app = express();
//Stripe webhook

//stripe INSTANCE
const stripe = new Stripe(process.env.STRIPE_KEY);

// This is your Stripe CLI webhook secret for testing your endpoint locally.
const endpointSecret = "whsec_b0fa6962173b9c7332b36d5853da88e6fba50185c4f5c6b11ebc9c1dc0172962";

app.post('/webhook', express.raw({type: 'application/json'}), (request, response) => {
  const sig = request.headers['stripe-signature'];

  let event;
 
  try {
      event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
      console.log("event");
  } catch (err) {
    console.log("err", err.message); 
    response.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntentSucceeded = event.data.object;
      // Then define and call a function to handle the event payment_intent.succeeded
      break;
    // ... handle other event types
    default:
      console.log(`Unhandled event type ${event.type}`);
  }
  // Return a 200 response to acknowledge receipt of the event
  response.send();
}
);
  


//pass incoming data 
app.use(express.json());

//routes
app.use('/api/v1/users/', userRoutes);  
app.use('/api/v1/products/', productsRouter);
app.use('/api/v1/categories/', categoriesRouter);
app.use('/api/v1/brands/', brandsRouter);
app.use('/api/v1/colors/', colorRouter);
app.use('/api/v1/reviews/', reviewRouter);
app.use('/api/v1/orders/', orderRouter);


//err middleware
app.use(notFound);
app.use(globalErrhandler);
export default app;

