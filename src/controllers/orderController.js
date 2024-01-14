import Order from "../models/orderModel"

export const addOrder = async (req, res) => {
    const {
        shippingAddress, status, totalAmount, orderDate, deliveryFee, isFreeDelivery, deliveryDate, isAdmin, userId, products: [{ quantity, product }], } = req.body
    try {
        const newOrder = await Order.create({
            shippingAddress,
            status: status || "pending",
            totalAmount,
            orderDate,
            deliveryDate,
            deliveryFee,
            isFreeDelivery,
            isAdmin,
            user: userId,
            products: [{ product, quantity }]
        })
        return res.status(201).json({ success: true, order: newOrder })

    } catch (error) {
        res.status(500).json({ message: "Error create order" });
    }
}