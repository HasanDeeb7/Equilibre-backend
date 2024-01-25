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



export const getByFilter = async (req, res) => {
  try {
    const { categories, priceRange } = req.body;
    const conditions = [];

    if (categories && categories.length > 0) {
      conditions.push({ "category": { $in: categories } });
    }

    if (priceRange && priceRange.length > 0) {
      const priceConditions = [];

      priceRange.forEach(range => {
        if (Number(range) === 1) {
          priceConditions.push({ "price": { $gt: 0, $lte: 15 } });
        } else if (Number(range) === 2) {
          priceConditions.push({ "price": { $gt: 15, $lte: 30 } });
        } else if (Number(range) === 3) {
          priceConditions.push({ "price": { $gt: 30, $lte: 45 } });
        } else if (Number(range) === 4) {
          priceConditions.push({ "price": { $gt: 45 } });
        }
      });

      conditions.push({ $or: priceConditions });
    }

    const products = await Product.find({
      $and: conditions
    });

    res.status(200).json(products);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
}