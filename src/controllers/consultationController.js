import Consultation from "../models/consultationModel.js";

export async function getConsultations(req, res) {
  try {
    const consultations = await Consultation.find();
    if (consultations) {
      return res.json(consultations);
    }
    return res.status(404).json({ message: "No consultations found!" });
  } catch (error) {
    console.log(error);
  }
}
export async function createConsultation(req, res) {
  try {
    const { name, price, description } = req.body;
    if ([name, price, description].some((item) => !item || item === "")) {
      return res.status(400).josn({ message: "All fields are required!" });
    }
    const newConsultation = await Consultation.create({
      name: name,
      price: price,
      description: description,
    });
    if (newConsultation) {
      return res.json(newConsultation);
    }
    return res.status(500).json({ message: "Error creating Consultation" });
  } catch (error) {
    console.log(error);
  }
}

export async function updateConsultation(req, res) {
  const { id } = req.body;
  if (!id) {
    return res.status(400).json({ message: "No id provided!" });
  }
  try {
    const updatedConsultation = await Consultation.findOneAndUpdate(
      {
        _id: id,
      },
      req.body,
      { new: true }
    );
    if (updateConsultation) {
      return res.json(updateConsultation);
    }
    return res.status(500).json({ message: "Error updating consultation" });
  } catch (error) {
    console.log(error);
  }
}
export async function deleteConsultation(req, res) {
  const { id } = req.body;
  if (!id) {
    return res.status(400).json({ message: "No id provided!" });
  }
  try {
    const deletedConsultation = await Consultation.findOneAndDelete({
      _id: id,
    });
    if (deleteConsultation) {
      return res.json({ message: "Consultation deleted successfully!" });
    }
    return res.status(500).json({ message: "Error updating consultation" });
  } catch (error) {
    console.log(error);
  }
}
