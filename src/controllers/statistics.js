import Category from "../models/categoriesModel.js";
import Product from "../models/productModel.js";
import Order from "../models/orderModel.js";




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
      // Fetch all categories
      const categories = await Category.find();
  
      // map on categories
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
      const ordersByAddress = await Order.aggregate([
        { $match: { country: "Lebanon", city: { $ne: null } } },
        { $group: { _id: "$city", totalOrders: { $sum: 1 } } },
        { $sort: { totalOrders: -1 } },
        { $limit: 5 },
        { $group: { _id: null, topCities: { $push: { city: "$_id", totalOrders: "$totalOrders" } } } },
        {
          $project: {
            _id: 0,
            ordersByAddress: {
              $concatArrays: ["$topCities", [{ city: "Others", totalOrders: { $sum: "$topCities.totalOrders" } }]],
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
      const currentMonth = currentDate.getMonth() + 1; // Month is zero-based
  
      const result = await Order.aggregate([
        {
          $match: {
            createdAt: {
              $gte: new Date(currentDate.getFullYear(), currentMonth - 1, 1), // Start of the current month
              $lt: new Date(currentDate.getFullYear(), currentMonth, 1), // Start of the next month
            },
          },
        },
        {
          $unwind: '$products',
        },
        {
          $group: {
            _id: '$products.product',
            totalQuantity: { $sum: '$products.quantity' },
          },
        },
        {
          $lookup: {
            from: 'products', // Update with the correct collection name for products
            localField: '_id',
            foreignField: '_id',
            as: 'productInfo',
          },
        },
        {
          $unwind: '$productInfo',
        },
        {
          $project: {
            productName: '$productInfo.name',
            totalQuantity: 1,
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
      const topSellerProduct = await Product.findOne({})
        .sort('-soldQuantityCounter') 
        .select('name soldQuantityCounter') // Select only the necessary fields to be returned
  
      if (topSellerProduct) {
        res.status(200).json({ topSellerProduct });
      } else {
        res.status(404).json({ message: 'No products found' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

  export {getTotalOrders,getSalesByCategory,getTotalProductsSold,getTotalIncome,getTotalOrdersByAdress,getOverviewSales,getTopSellerProduct}