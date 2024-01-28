import globalOfferModel from "../models/globalOfferModel.js";
import mongoose from "mongoose";

const createOffer = async (req, res) => {
  try {
    const { title, startDate, endDate, rate, description } = req.body;
    if (!startDate || !endDate || !rate || !description) {
      return res.status(400).json({
        error:
          "Incomplete data. Please provide start Date, end Date, and the rate of the offer.",
      });
    }
    const offer = await globalOfferModel.create({
      title,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      rate: parseFloat(rate),
      description: description,
    });
    res.status(200).json(offer);
  } catch (error) {
    res.status(500).json({ message: "Error while creating an offer" });
  }
};

const deleteOffer = async (req, res) => {
  try {
    const { id } = req.body;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ error: "no such offer" });
    }
    const offer = await globalOfferModel.findOneAndDelete({ _id: id });
    if (!offer) {
      return res.status(404).json({ error: "no such offer" });
    }
    res.status(200).json("Offer deleted successfully");
  } catch (error) {
    res.status(500).json({ message: "Error while deleting an offer" });
  }
};

const getOneOffer = async (req, res) => {
  try {
    const { id } = req.body;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ error: "no such offer" });
    }
    const offer = await globalOfferModel.findById(id);
    if (!offer) {
      return res.status(404).json({ error: "no such offer" });
    }
    res.status(200).json(offer);
  } catch (error) {
    res.status(500).json({ message: "Error while geting an offer" });
  }
};

const getOffers = async (req, res) => {
  try {
    const offers = await globalOfferModel.find({}).sort({ createdAt: -1 });
    if (!offers) {
      return res.status(404).json({ error: "no offers found" });
    }
    res.status(200).json(offers);
  } catch (error) {
    res.status(500).json({ message: "Error while geting an offer" });
  }
};

const updateOffer = async (req, res) => {
  try {
    const { id, title, startDate, endDate, rate, description } = req.body;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ error: "no such offer" });
    }
    if (!startDate && !endDate && !rate && !description) {
      return res.status(400).json({
        error:
          "No update data provided. Please provide start Date, end Date, or rate.",
      });
    }
    const offer = await globalOfferModel.findByIdAndUpdate(
      { _id: id },
      {
        title: title ? title : undefined,
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
        rate: rate ? parseFloat(rate) : undefined,
        description: description ? description : undefined,
      },
      { new: true }
    );
    if (!offer) {
      return res.status(404).json({ error: "no such offer" });
    }    
    res.status(200).json("Offer updated successfully");
  } catch (error) {
    res.status(500).json({ message: "Error while updating an offer" });
  }
};

export { createOffer, deleteOffer, updateOffer, getOffers, getOneOffer };
