import Order from "../models/orderModel.js"
import Product from "../models/productModel.js"
import Size from "../models/SizeModel.js"

//function to update product counter
const updateProductQuantities = async (products, increment) => {
    await Promise.all(products.map(async (productElt) => {
        await Product.findByIdAndUpdate(productElt.product,
            { $inc: { soldQuantityCounter: increment * productElt.quantity } });
    }));
};

//function to update stock for each product size
const updateSizeStock = async (products, increment) => {
    await Promise.all(products.map(async (productElt) => {
        await Size.findByIdAndUpdate(productElt.size,
            { $inc: { stock: increment * productElt.quantity } });
    }));
};

export const addOrder = async (req, res) => {
    const { shippingAddress, status, city, country, totalAmount, deliveryDate, products, userId } = req.body;
    let deliveryFee, isFreeDelivery;

    if (totalAmount >= 50) {
        isFreeDelivery = true;
        deliveryFee = 0;
    } else {
        deliveryFee = 3;
    }

    // Check for required fields
    if (!shippingAddress || !status || !totalAmount || !city || !country || !userId || !products || products.length === 0) {
        return res.status(400).json({ message: "Missing required field" });
    }

    try {
        const newOrder = await Order.create({
            shippingAddress,
            status: status || "processing",
            totalAmount,
            city,
            country,
            deliveryDate,
            deliveryFee,
            isFreeDelivery,
            userId,
            products,
        });

        // Update product counter and sizes
        await updateProductQuantities(products, 1);
        await updateSizeStock(products, -1);

        return res.status(201).json({ message: 'Order created successfully', data: newOrder });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error creating order" });
    }
};

export const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find();
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: "Error fetching Orders" });
    }
};

export const updateOrder = async (req, res) => {
    const { id, status, products } = req.body;

    try {
        const oldOrder = await Order.findById(id);

        if (oldOrder.status === "cancelled" || oldOrder.status === "completed") {
            return res.json({ message: `You can't change the status, order already ${oldOrder.status}`});
        }

        if (status === "cancelled") {
            // Update product counter and sizes for the old order
            await updateProductQuantities(oldOrder.products, -1);
            await updateSizeStock(oldOrder.products, 1);
        }

        if (oldOrder.status === "on-way" || oldOrder.status === "processing") {
            const order = await Order.findByIdAndUpdate(id, { status, products });
            return res.status(200).json({ message: 'Order updated successfully'});
        }
    } catch (error) {
        res.status(500).json({ message: "Error updating order" });
    }
};

export const getOneOrderById = async (req, res) => {
    const { id } = req.params;

    try {
        const order = await Order.findById(id);
        res.status(200).json({ message: "Successfully fetched order", data: order });
    } catch (error) {
        res.status(500).json({ message: "Error fetching an Order" });
    }
};

export const deleteOrder = async (req, res) => {
    const { id } = req.params;
    const { products } = req.body;

    try {
        // Update product counter and stock for the order being deleted
        await updateProductQuantities(products, -1);
        await updateSizeStock(products, 1);

        // Delete the order
        await Order.findByIdAndDelete(id);

        res.status(200).json({ message: "Order is deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting an Order" });
    }
};




