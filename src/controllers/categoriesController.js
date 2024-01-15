import Category from "../models/categoriesModel.js";

export async function getCategories(req, res) {
  try {
    const categories = await Category.find();
    if (categories) {
      res.json(categories);
    }
  } catch (error) {
    console.log(error);
  }
}
export async function createCategory(req, res) {
  try {
    const { name } = req.body;
    const data = await Category.create({ name: name });
    if (data) {
      res.json(data);
    }
  } catch (error) {
    console.log(error);
  }
}

export async function updateCategory(req, res) {
  try {
    const { id, name } = req.body;
    if (!id || !name) {
      return res
        .status(400)
        .json({ error: "An id and a new name should be provided!" });
    }
    const data = await Category.findOneAndUpdate(
      { _id: id },
      { name: name },
      { new: true }
    );
    if (data) {
      return res.json(data);
    }
  } catch (error) {
    console.log(error);
  }
}
export async function deleteCategory(req, res) {
  try {
    const { id } = req.query;
    const response = await Category.findOneAndDelete({ _id: id });
    if (response) {
      return res.json({ success: "Category deleted!" });
    } else {
      return res.status(404).json({ error: "Category not found!" });
    }
  } catch (error) {
    console.log(error);
  }
}
