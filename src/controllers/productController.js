import Product from "../models/productModel.js";

const AddProduct = async (req,res) => {
    const {
        name,
        description,
        nutritionalInfo,
        slug,
    } = req.body

    const price = parseInt(req.body.price)

    if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }
  
    const image = req.file.path;
    try {
        const newProduct = await Product.create({
            name,
            description,
            nutritionalInfo,
            price,
            image,
            slug,
        })

        res.status(200).json({ message: 'product added succ', data: newProduct })
    } catch (error) {
        res.status(500).json(error)
    }
}

export { AddProduct }