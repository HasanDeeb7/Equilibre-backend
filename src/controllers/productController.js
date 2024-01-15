import Offer from "../models/offerModel.js";
import Product from "../models/productModel.js";
import Size from "../models/SizeModel.js";
import Category from "../models/categoriesModel.js";
import slugify from "slugify";

const AddProduct = async (req, res) => {
    const {
        name,
        description,
        nutritionalInfo,
        isDeleted,
        soldQuantityCounter,
        categoryName,
        sizes,
        offers

    } = req.body

    // if (!req.file) {
    //     return res.status(400).json({ error: "No file uploaded" });
    // }

    // const image = req.file.path;
    const image = "hhhhhhhhhhh";

    const slug = slugify(name, { lower: true, replacement: '-' })
    let categoryId;

    if (categoryName) {
        try {

            const category = await Category.findOne({ name: categoryName })
            categoryId = category._id
        } catch (error) {
            console.log(error)
            return res.status(500).json(error)
        }
    }
    try {
        const newProduct = await Product.create({
            name,
            description,
            nutritionalInfo,
            image,
            slug,
            isDeleted,
            soldQuantityCounter,
            categoryId,
            sizes,
            offers
        })

        return res.status(200).json({ message: 'product added succ', data: newProduct })
    } catch (error) {
        return res.status(500).json(error)
    }
}

const deleteProduct = async (req, res) => {

    const productId = req.body.productId;
    try {
        const product = await Product.findById(productId)

        if (product) {//remove the id of product from the offer docs
            if (product.offers && product.offers.length > 0) {
                await Promise.all(product.offers.map(async (offerId) => {
                    await Offer.findByIdAndUpdate(offerId, { $pull: { products: productId } })
                }
                ))
            }

            // //delete sizes related to this product
            // if (product.sizes && product.sizes.length > 0) {
            //     await Promise.all(product.sizes.map(async (sizeId) => {
            //         await Size.findByIdAndDelete(sizeId)
            //     }

            //     ))
            // }
            await Product.findByIdAndUpdate(productId,{isDeleted:true})

            return res.status(200).json({ message: `"${product.name}" product had been deleted succ` })
        } else { return res.status(404).json({ message: `no such a product with this id` }) }


    } catch (error) {
        console.log(error)
        return res.status(500).json(error)
    }

}


const getProducts = async (req, res) => {
    try {
        const products = await Product.find()
        res.status(200).json({ data: products })

    } catch (error) {
        console.log(error)
        res.status(500).json(error)
    }
}


const getProduct = async (req, res) => {
    const productId = req.body.productId
    try {
        const product = await Product.findById(productId)
        if (!product) {
            return res.status(404).json({ message: "No product found" })

        }
        res.status(200).json({ data: product })

    } catch (error) {
        console.log(error)
        res.status(500).json(error)
    }
}



const editProduct = async (req, res) => {
    const {
        productId,
        name,
        description,
        nutritionalInfo,
        isDeleted,
        soldQuantityCounter,
        categoryId } = req.body

    const image = req.file.path;
    let slug;
    if (name) { slug = slugify(name, { lower: true, replacement: '-' }) }

    try {
        await Product.findByIdAndUpdate(productId, {
            name,
            description,
            nutritionalInfo,
            image,
            slug,
            isDeleted,
            soldQuantityCounter,
            categoryId
        })
        const updatedproduct = await Product.findById(productId)
        res.status(200).json({ message: "product Info edited succ", data: updatedproduct })
    } catch (error) {
        console.log(error)
        return res.status(500).json(error)
    }
}

export { AddProduct, deleteProduct, getProducts, getProduct, editProduct }