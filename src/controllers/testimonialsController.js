 import testimonialsModel from "../models/testimonialsModel.js";
import mongoose from "mongoose";
import { deleteImage } from "../services.js";

const createTestimonial = async (req, res) => {
  try {
    const { author, content} = req.body;
    if (!author || !content || !req.file) {
      return res.status(400).json({
        error:
          "Incomplete data. Please provide the author's name, content, and the image.",
      });
    }
    if (content.length > 50) {
      return res.status(400).json({
        error: `Content exceeds the maximum character limit of 50 characters.`,
      });
    }
    if (author.length > 20) {
      return res.status(400).json({
        error: `Author's name exceeds the maximum character limit of 50 characters.`,
      });
    }
    const image = req.file.location
    const testimonial = await testimonialsModel.create({
        image,
        author,
        content
    });
    res.status(200).json(testimonial);
  } catch (error) {
    if(req.file){
        deleteImage(req.file.location)
    }
    res.status(500).json({ message: "Error while creating an testimonial" });
  }
};

const deleteTestimonial = async (req, res) => {
  try {
    const { id } = req.body;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ error: "no such testimonial" });
    }
    const testimonial = await testimonialsModel.findOneAndDelete({ _id: id });
    if (!testimonial) {
      return res.status(404).json({ error: "no such testimonial" });
    }
    deleteImage(testimonial.image)
    res.status(200).json("testimonial deleted successfully");
  } catch (error) {
    res.status(500).json({ message: "Error while deleting a testimonial" });
  }
};

  const getTestimonials = async (req, res) => {
    try {
      const testimonials = await testimonialsModel.find({}).sort({ createdAt: -1 });
      if (!testimonials) {
        return res.status(404).json({ error: "no testimonials found" });
      }
      res.status(200).json(testimonials);
    } catch (error) {
      res.status(500).json({ message: "Error while geting an testimonials" });
    }
  };

const updateTestimonial = async (req, res) => {
  try {
    const { id, author, content} = req.body;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ error: "no such testimonial" });
    }
    if (!author && !content && !req.file) {
      return res.status(400).json({
        error:
          "No update data provided. Please provide start Date, end Date, or rate.",
      });
    }
    const oldTestimonial = await testimonialsModel.findById(id);
    const testimonial = await testimonialsModel.findByIdAndUpdate(
      { _id: id },
      {
        author: author ? author : undefined,
        content: content ? content : undefined,
        image: req.file ? req.file.location : undefined,
      },
      { new: true }
    );
    if (!testimonial) {
      return res.status(404).json({ error: "no such testimonial" });
    }
    if(req.file){
      deleteImage(oldTestimonial.image)
    }
    res.status(200).json("testimonial updated successfully");
  } catch (error) {
    if(req.file){
        deleteImage(req.file.location)
    }
    res.status(500).json({ message: "Error while updating an testimonial" });
  }
};

export { createTestimonial, deleteTestimonial, updateTestimonial,getTestimonials };
