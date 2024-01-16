import Order from "../models/orderModel.js"

export const addOrder = async (req, res) => {
    const { shippingAddress, status, city, country, totalAmount, orderDate, deliveryFee, isFreeDelivery, deliveryDate, products, userId } = req.body
    // const userId = req.user._id
    try {

        const newOrder = await Order.create({
            shippingAddress,
            status: status || "pending",
            totalAmount,
            city, country,
            orderDate,
            deliveryDate,
            deliveryFee,
            isFreeDelivery,
            userId,
            products
        })
        return res.status(201).json({ success: true, order: newOrder })

    } catch (error) {
        res.status(500).json({ message: "Error create order" });
    }
}
export const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find();
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: "Error fetching Orders" });
    }
};

export const updateOrder = async (req, res) => {
    const { id, status, products } = req.body
    try {
        const oldOrder = await Order.findById(id)
        if (oldOrder.status === "cancelled" || oldOrder.status === "completed") {
            return res.json({ message: "you can't change the status" })
        }
        if (oldOrder.status === "on-way" || oldOrder.status === "processing") {

            const order = await Order.findByIdAndUpdate(id, { status, products })
            return res.status(200).json(order)
        }
    }
    catch (error) {
        res.status(500).json({ message: "Error update Order" });

    }
}
export const getOneOrderById = async (req, res) => {
    const { id } = req.body
    try {
        const order = await Order.findById(id)
        res.status(200).json({ success: true, order: order })
    } catch (error) {
        res.status(500).json({ message: "Error fetchinh an Order" });

    }
}
export const deleteOrder = async (req, res) => {
    const { id } = req.body
    try {
        await Order.findOneAndDelete(id)
        res.status(200).json({ message: "order is deleted successfully" })
    } catch (error) {
        res.status(500).json({ message: "Error delete an Order" });

    }
}
