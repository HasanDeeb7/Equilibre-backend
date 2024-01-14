import Product from "../models/productModel.js";

const AddProduct = async (req, res) => {
    const {
        name,
        description,
        nutritionalInfo,
        slug,
        isDeleted,
        soldQuantityCounter,
        categoryId,
        sizes,
        offers

    } = req.body

    const price = parseInt(req.body.price)

    if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
    }

    const image = req.file.path;
    // if (categoryName) {
    //     try {
    //         const categoryId = await Category.findOne({ where: { name: categoryName } })
    //     } catch (error) {
    //         console.log(error)
    //         res.status(500).json(error)
    //     }
    // }
    try {
        const newProduct = await Product.create({
            name,
            description,
            nutritionalInfo,
            price,
            image,
            slug,
            isDeleted,
            soldQuantityCounter,
            categoryId,
            sizes,
            offers
        })

        res.status(200).json({ message: 'product added succ', data: newProduct })
    } catch (error) {
        res.status(500).json(error)
    }
}

export { AddProduct }