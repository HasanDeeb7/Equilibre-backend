import express from "express";
import "dotenv/config";
import cors from "cors";
import cookieParser from "cookie-parser";
import dbconnect from "./src/config/db.js";
import { userRoutes } from "./src/routes/userRouter.js";
import categoryRoutes from "./src/routes/categoriesRouter.js";
import {globalofferRoutes} from './src/routes/globaloffer.js'
import { productRoutes } from "./src/routes/productRouter.js";
import { sizeRoutes } from "./src/routes/sizeRouter.js";
import { offerRoutes } from "./src/routes/offerRouter.js"
import { testomonialsRoutes } from "./src/routes/testimonialsRouter.js";
import orderRouter from './src/routes/orderRouter.js'
import { consultationRouter } from "./src/routes/consultationRouter.js";
import {statisticsRoutes} from './src/routes/statisticsRouter.js'
const app = express();
const port = process.env.PORT;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: process.env.FRONTEND_ORIGIN,
    credentials: true,
    optionsSuccessStatus: 200,
  })
);
app.use(cookieParser());
app.use(express.static("public"));
dbconnect();

app.use("/user", userRoutes);
app.use("/category", categoryRoutes);
app.use("/globalOffer",globalofferRoutes)
app.use("/product", productRoutes);
app.use("/product", sizeRoutes);
app.use("/product", offerRoutes);
app.use("/order", orderRouter);
app.use("/testimonial", testomonialsRoutes);
app.use("/consultation", consultationRouter);
app.use("/statistics", statisticsRoutes);
app.get('/user/logout', (req, res)=>{
  res.clearCookie('access_token')
  return res.json({message : 'Logged Out!'})
})


app.listen(port, () => {
  console.log(`Server is listenning on port ${port}`);
});
