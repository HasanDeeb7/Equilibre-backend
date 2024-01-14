import Offer from "../models/offerModel.js";
import Product from '../models/productModel.js'


const addOffer = async (req, res) => {
    const { discountRate, startDate, endDate, productNames } = req.body
    if (!discountRate || !startDate || !endDate || productNames == []) {
        return res.status(400).json({ message: "all field are required" })
    }

    const addedOffer = await Offer.create({ discountRate, startDate, endDate })
    try {
        await Promise.all(productNames.map(async (productName, i) => {
            const product = await Product.findOne({ name: productName });

            if (product) {
                await Product.findByIdAndUpdate(product._id, { $push: { offers: addedOffer._id } });
                await Offer.findByIdAndUpdate(addedOffer._id, { $push: { products: product._id } });
            }

        }));
        const updatedOffer = await Offer.findById(addedOffer._id);
        return res.status(200).json({ message: `offer added succ `, data: updatedOffer })
    } catch (error) {
        console.log(error)
        return res.status(500).json(error)
    }

}

export { addOffer } 