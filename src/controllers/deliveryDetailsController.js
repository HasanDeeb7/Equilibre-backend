import deliveryDetailsModel from "../models/deliveryDetails.js";

const createDelveryDetails = async (req, res) => {
  try {
    const { inLebanonDeliveryFee, FreeDeliveryAmount } = req.body;
    if (!inLebanonDeliveryFee || !FreeDeliveryAmount) {
      return res.status(400).json({
        message:
          "Missing data,add delivery fee and max amount",
      });
    }

    const newDetails = await deliveryDetailsModel.create({
      inLebanonDeliveryFee,
      FreeDeliveryAmount
    });
    res.status(200).json(newDetails);
  } catch (error) {
    res.status(500).json({ message: "Error while adding deliveryDetails" });
  }
};

const deleteDeliveryDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const details = await deliveryDetailsModel.findOneAndDelete({ _id: id });
    if (!details) {
      return res.status(404).json({ message: "no such details" });
    }
    res.status(200).json("deliver details deleted successfully");
  } catch (error) {
    res.status(500).json({ message: "Error while deleting a details" });
  }
};

const getdeliveryDetails = async (req, res) => {
  try {
    const details = await deliveryDetailsModel.find();
    if (!details) {
      return res.status(404).json({ error: "no details found" });
    }
    res.status(200).json(details);
  } catch (error) {
    res.status(500).json({ message: "Error while geting delivery details" });
  }
};

const updateDeliveryDetails = async (req, res) => {
  try {
    const { id } = req.params
    const { inLebanonDeliveryFee, FreeDeliveryAmount } = req.body;
    if (!inLebanonDeliveryFee && !FreeDeliveryAmount) {
      return res.status(400).json({
        message:
          "No update data provided. Please provide lebanonDeliveryFee, or FreeDeliveryAmount.",
      });
    }
    const oldDetails = await deliveryDetailsModel.findById(id);
    const details = await deliveryDetailsModel.findByIdAndUpdate(
      { _id: id },
      {
        inLebanonDeliveryFee,
        FreeDeliveryAmount
      },
      { new: true }
    );
    if (!oldDetails) {
      return res.status(404).json({ message: "no such details" });
    }



    return res.status(200).json({message:"details updated successfully"});
  } catch (error) {

    return res.status(500).json({ message: "Error while updating details" });
  }
};

export { createDelveryDetails, deleteDeliveryDetails, updateDeliveryDetails, getdeliveryDetails };
