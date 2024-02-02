import SizeModel from "../models/SizeModel.js";
import Size from "../models/SizeModel.js";
import Product from "../models/productModel.js";
const addSize = async (req, res) => {
  const { sizes } = req.body;
  const ids = [];

  //check if size already exist
  try {
    await Promise.all(
      sizes.map(async (item) => {
        const size = await SizeModel.create(item);
        ids.push(size._id);
      })
    );
    res.status(200).json({ sizes: ids });
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

const deleteSize = async (req, res) => {
  const sizeId = req.body.sizeId;
  try {
    const size = await Size.findById(sizeId);
    if (!size) {
      return req.status(404).json({ message: "there is no size with this id" });
    }

    await Product.findByIdAndUpdate(size.productId, {
      $pull: { sizes: sizeId },
    });
    await Size.findOneAndDelete(sizeId);
    return res.status(200).json({ message: "size deleted succ" });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

const getSizes = async (req, res) => {
  try {
    const sizes = await Size.find();
    res.status(200).json({ data: sizes });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

const getSize = async (req, res) => {
  const sizeId = req.body.sizeId;
  try {
    const size = await Size.findById(sizeId);
    if (!size) {
      return res.status(404).json({ message: "No size found" });
    }
    res.status(200).json({ data: size });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

const editSize = async (req, res) => {
  const { sizes } = req.body;
  try {
    await Promise.all(
      sizes.map(async (item) => {
        const size = await SizeModel.findOneAndUpdate({_id: item._id}, {capacity: item.capacity, price: item.price, unit: item.unit, stock: item.stock });
      })
    );
    // await Size.findByIdAndUpdate(sizeId, { capacity, unit, stock });
    // const updatedSize = await Size.findById(sizeId);
    res
      .status(200)
      .json({ message: "Size Info edited succ" });
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};
export { addSize, deleteSize, getSizes, getSize, editSize };
