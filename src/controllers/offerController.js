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

const deleteOffer = async (req, res) => {
    const offerId = req.body.offerId
    try {
        const offer = await Offer.findById(offerId)
        if (!offer) {
            return req.status(404).json({ message: "there is no offer with this id" })
        }

        if(offer.products && offer.products.length > 0){
            await Promise.all(offer.products.map(async (productId) => {
            await Product.findByIdAndUpdate(productId, { $pull: { offers: offerId } })
        }
        ))}
        await Offer.findOneAndDelete(offerId)
        return res.status(200).json({ message: "offer deleted succ" })
    } catch (error) {
        console.log(error)
        res.status(500).json(error)
    }
}


const getOffers = async (req, res) => {
    try {
        const offers = await Offer.find()
        res.status(200).json({ data: offers })

    } catch (error) {
        console.log(error)
        res.status(500).json(error)
    }
}


const getOffer = async (req, res) => {
    const offerId=req.body.offerId
    try {
        const offer = await Offer.findById(offerId)
        if(!offer){
       return res.status(404).json({message:"No offer found"})

        }
        res.status(200).json({ data:offer})

    } catch (error) {
        console.log(error)
        res.status(500).json(error)
    }
}

export { addOffer,deleteOffer,getOffer,getOffers } 