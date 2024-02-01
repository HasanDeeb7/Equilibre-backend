import Category from "../models/categoriesModel.js";
import Product from "../models/productModel.js";
import Order from "../models/orderModel.js";
import User from '../models/userModel.js'



const getTotalProductsSold= async (req, res) => {
    try {
   
      const result = await Order.aggregate([
        {
          $unwind: "$products",
        },
        {
          $group: {
            _id: null,
            totalProductsSold: { $sum: "$products.quantity" },
          },
        },
      ]);
  
      const totalProductsSold = result.length > 0 ? result[0].totalProductsSold : 0;
  
      res.status(200).json({ totalProductsSold });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };
  

const getTotalOrders=async (req, res) => {
    try {
 
      const totalOrders = await Order.countDocuments();
      res.status(200).json({ data:totalOrders });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };
  
  const getTotalUsers=async (req, res) => {
    try {
 
      const totalUsers = await User.countDocuments();
      res.status(200).json({ data: totalUsers});
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };
  
 const getTotalIncome=async (req, res) => {
    try {
      const result = await Order.aggregate([
        {
          $group: {
            _id: null,
            totalIncome: { $sum: "$totalAmount" },
          },
        },
      ]);
  
      const totalIncome = result.length > 0 ? result[0].totalIncome : 0;
  
      res.status(200).json({ data:totalIncome });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
  

  const getSalesByCategory=async (req, res) => {
    try {
      const categories = await Category.find();
 
      const salesByCategory = await Promise.all(categories.map(async (category) => {
        const products = await Product.find({ _id: { $in: category.products } });
  
        // Calculate total sales for each product in the category
        const totalSalesByCategory = products.reduce((total, product) => {
          const productSales = product.soldQuantityCounter || 0;
          return total + productSales;
        }, 0);
  
        return {
          category: category.name,
          totalSales: totalSalesByCategory,
        };
      }));
  
      res.status(200).json({ salesByCategory });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
  

  const getTotalOrdersByAdress=async (req, res) => {
    try {
      const allOrders=await Order.countDocuments({ country: "lebanon" });
      const ordersByAddress = await Order.aggregate([
        { $match: { country: "lebanon", city: { $ne: null } } },
        { $group: { _id: "$city", totalOrders: { $sum: 1 } } },
        { $sort: { totalOrders: -1 } },
        { $limit: 5 },
        { $group: { _id: null, topCities: { $push: { city: "$_id", totalOrders: "$totalOrders" } } } },
        {
          $project: {
            _id: 0,
            ordersByAddress: {
              $concatArrays: [
                "$topCities",
                [
                  {
                    city: "Others",
                    totalOrders: {
                      $subtract: [allOrders, { $sum: "$topCities.totalOrders" }],
                    },
                  },
                ],
              ],
            },
          },
        },
      ]);
  
      if (ordersByAddress.length > 0) {
        res.status(200).json({ ordersByAddress: ordersByAddress[0].ordersByAddress });
      } else {
        res.status(404).json({ message: "No orders found for Lebanon" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }



  const getOverviewSales = async (req, res) => {
    try {
      const currentDate = new Date();
  
      const result = await Order.aggregate([
        {
          $match: {
            orderDate: {
              $gte: new Date(currentDate.getFullYear() - 1, currentDate.getMonth(), 1), // Start of the month, 12 months ago
              $lt: new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1), // Start of the current month
            },
          },
        },
        {
          $unwind: '$products',
        },
        {
          $group: {
            _id: {
              month: { $month: '$orderDate' },
            },
            totalQuantity: { $sum: '$products.quantity' },
          },
        },
        {
          $project: {
            month: '$_id.month',
            totalQuantity: 1,
            _id: 0,
          },
        },
      ]);
  
      res.status(200).json({ overviewSales: result });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  
  const getTopSellerProduct = async (req, res) => {
    try {
      const topSellerProducts = await Product.find({})
        .sort({ soldQuantityCounter: -1 })
        .limit(5)
        .select('name image soldQuantityCounter slug');
  
      if (topSellerProducts.length > 0) {
        res.status(200).json({ topSellerProducts });
      } else {
        res.status(404).json({ message: 'No products found' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

  export {getTotalOrders,getSalesByCategory,getTotalProductsSold,getTotalIncome,getTotalOrdersByAdress,getOverviewSales,getTopSellerProduct,getTotalUsers}