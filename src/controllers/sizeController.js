import Size from "../models/SizeModel.js";
import Product from '../models/productModel.js'
const addSize = async (req, res) => {

    const { capacity, unit, stock, productId } = req.body
    let productName;
    if (!capacity || !unit || !stock || !productId) {
        res.status(400).json({ message: "all field are required" })
    }


    try {
        const product = await Product.findById(productId)
        productName = product.name
    } catch (error) {
        console.log(error)
        return res.status(500).json(error)
    }


    //check if size already exist
    const existingSize = await Size.findOne({ capacity, productId });

    if (existingSize) {
        return res.status(409).json({ message: `Size with capacity ${capacity} already exists for ${productName}` });
    }


    try {
        const addedSize = await Size.create({ capacity, unit, stock, productId })
        await Product.findByIdAndUpdate(productId, { $push: { sizes: addedSize._id } })
        res.status(200).json({ message: `size added succ to ${productName}`, data: addedSize })
    } catch (error) {
        console.log(error)
        return res.status(500).json(error)
    }
}


export { addSize }