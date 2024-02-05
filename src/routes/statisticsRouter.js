import { Router } from "express";
import {getTotalOrders,getSalesByCategory,getTotalProductsSold,getTotalIncome,getTotalOrdersByAdress,getOverviewSales,getTopSellerProduct,getTotalUsers} from '../controllers/statisticsController.js'

export const statisticsRoutes = Router();


statisticsRoutes.get('/total-products-sold', getTotalProductsSold);
statisticsRoutes.get('/total-orders', getTotalOrders);
statisticsRoutes.get('/total-income', getTotalIncome);
statisticsRoutes.get('/sales-overview',getOverviewSales );
statisticsRoutes.get('/top-seller-product',getTopSellerProduct);
statisticsRoutes.get('/sales-by-category',getSalesByCategory);
statisticsRoutes.get('/orders-by-address', getTotalOrdersByAdress);
statisticsRoutes.get('/total-user', getTotalUsers);

