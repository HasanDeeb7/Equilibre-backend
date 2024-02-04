import Offer from "../models/offerModel.js";
import Product from "../models/productModel.js";

const addOffer = async (req, res) => {
  const { discountRate, startDate, endDate, products } = req.body;

  try {
    if (!discountRate || !startDate || !endDate || !products || products.length === 0) {
      return res.status(400).json({ message: "All fields are required, and at least one product must be provided." });
    }

    // Check for an existing offer with the same date range (if needed)
    // const existingOffer = await Offer.findOne({
    //   startDate: { $lte: new Date(endDate) },
    //   endDate: { $gte: new Date(startDate) },
    // });

    // if (existingOffer) {
    //   return res.status(400).json({ error: "An offer with the same date range already exists." });
    // }

    const addedOffer = await Offer.create({ discountRate, startDate, endDate });

    // Update associated products
    await Promise.all(
      products.map(async (product) => {
        if (product) {
          await Product.findByIdAndUpdate(product._id, { offerId: addedOffer._id });
          await Offer.findByIdAndUpdate(addedOffer._id, { $push: { products: product._id } });
        }
      })
    );

    return res.status(200).json({ message: "Offer added successfully." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error." });
  }
};

const deleteOffer = async (req, res) => {
  const offerId = req.query.id;
  try {
    const offer = await Offer.findById(offerId);
    if (!offer) {
      return res
        .status(404)
        .json({ message: "there is no offer with this id" });
    }

    if (offer.products && offer.products.length > 0) {
      await Promise.all(
        offer.products.map(async (productId) => {
          await Product.findByIdAndUpdate(productId, {
            $set: { offerId: null },
          }, {
            condition: { offerId: offerId }
          });
        })
      );
    }
    
    await Offer.findByIdAndDelete(offerId);
    return res.status(200).json({ message: "offer deleted succ" });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

const getOffers = async (req, res) => {
  try {
    const offers = await Offer.find().populate("products");
    res.status(200).json({ data: offers });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

const getOffer = async (req, res) => {
  const offerId = req.body.offerId;
  try {
    const offer = await Offer.findById(offerId);
    if (!offer) {
      return res.status(404).json({ message: "No offer found" });
    }
    res.status(200).json({ data: offer });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

const editOffer = async (req, res) => {
  const { id, discountRate, startDate, endDate, products } = req.body;

  try {
    // Update offer information
    const updatedOffer = await Offer.findByIdAndUpdate(id, {
      discountRate,
      startDate,
      endDate,
      products
    });

    if (!updatedOffer) {
      return res.status(404).json({ message: "Offer not found" });
    }

    // Update associated products
    if (products && products.length > 0) {
      const productUpdatePromises = products.map((productId) => {
        return Product.findByIdAndUpdate(productId, { offerId: updatedOffer._id });
      });

      await Promise.all(productUpdatePromises);
    }

    return res.status(200).json({
      message: "Offer info edited successfully",
      data: updatedOffer
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export { addOffer, deleteOffer, getOffer, getOffers, editOffer };
