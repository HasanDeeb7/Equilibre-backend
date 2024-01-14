import Size from "../models/SizeModel.js";
import Product from '../models/productModel.js'
const addSize = async (req, res) => {

    const { capacity, unit, stock, productId } = req.body
    const price = parseInt(req.body.price)
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
        const addedSize = await Size.create({ capacity, unit, stock, price, productId })
        await Product.findByIdAndUpdate(productId, { $push: { sizes: addedSize._id } })
        res.status(200).json({ message: `size added succ to ${productName}`, data: addedSize })
    } catch (error) {
        console.log(error)
        return res.status(500).json(error)
    }
}

const deleteSize = async (req, res) => {
    const sizeId = req.body.sizeId
    try {
        const size = await Size.findById(sizeId)
        if (!size) {
            return req.status(404).json({ message: "there is no size with this id" })
        }

        await Product.findByIdAndUpdate(size.productId, { $pull: { sizes: sizeId } })
        await Size.findOneAndDelete(sizeId)
        return res.status(200).json({ message: "size deleted succ" })
    } catch (error) {
        console.log(error)
        res.status(500).json(error)
    }
}


const getSizes = async (req, res) => {
    try {
        const sizes = await Size.find()
        res.status(200).json({ data: sizes })

    } catch (error) {
        console.log(error)
        res.status(500).json(error)
    }
}


const getSize = async (req, res) => {
    const sizeId=req.body.sizeId
    try {
        const size = await Size.findById(sizeId)
        if(!size){
       return res.status(404).json({message:"No size found"})

        }
        res.status(200).json({ data:size})

    } catch (error) {
        console.log(error)
        res.status(500).json(error)
    }
}


export { addSize, deleteSize ,getSizes,getSize}