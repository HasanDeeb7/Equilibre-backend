import express from 'express';
import {
  getTotalProductsSold,
  getTotalOrders,
  getTotalIncome,
  getSalesByCategory,
  getTotalOrdersByAdress,
  getTopSellerProduct,
  getOverviewSales
} from './statisticsRouter.js'

const router = express.Router();


router.get('/total-products-sold', getTotalProductsSold);
router.get('/total-orders', getTotalOrders);
router.get('/total-income', getTotalIncome);
router.get('/sales-overview',getOverviewSales );
router.get('/top-seller-product',getTopSellerProduct);
router.get('/sales-by-category',getSalesByCategory);
router.get('/orders-by-address', getTotalOrdersByAdress);

export default router;