import { sequelize } from "../db.js";

// Get all products
export const getAllProducts = async (req, res) => {
  try {
    const [products] = await sequelize.query(
      "SELECT * FROM products ORDER BY \"createdAt\" DESC"
    );
    res.json({
      message: "Products retrieved successfully",
      products,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get products by category
export const getProductsByCategory = async (req, res) => {
  const { category } = req.params;

  try {
    const [products] = await sequelize.query(
      "SELECT * FROM products WHERE category = :category ORDER BY \"createdAt\" DESC",
      { replacements: { category } }
    );
    res.json({
      message: "Products retrieved successfully",
      products,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get single product
export const getProductById = async (req, res) => {
  const { id } = req.params;

  try {
    const [product] = await sequelize.query(
      "SELECT * FROM products WHERE id = :id",
      { replacements: { id } }
    );

    if (product.length === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({
      message: "Product retrieved successfully",
      product: product[0],
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Create product (admin only)
export const createProduct = async (req, res) => {
  const { name, description, category, price, image, inStock, rating } = req.body;

  if (!name) {
    return res.status(400).json({ message: "Product name is required" });
  }

  try {
    const [result] = await sequelize.query(
      `INSERT INTO products (name, description, category, price, image, "inStock", rating)
       VALUES (:name, :description, :category, :price, :image, :inStock, :rating)
       RETURNING *`,
      {
        replacements: {
          name,
          description,
          category,
          price: price || null,
          image: image || null,
          inStock: inStock !== undefined ? inStock : true,
          rating: rating || 0,
        },
      }
    );

    res.status(201).json({
      message: "Product created successfully",
      product: result[0],
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Update product (admin only)
export const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, description, category, price, image, inStock, rating } = req.body;

  try {
    const [product] = await sequelize.query(
      "SELECT id FROM products WHERE id = :id",
      { replacements: { id } }
    );

    if (product.length === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    const [result] = await sequelize.query(
      `UPDATE products 
       SET name = :name, description = :description, category = :category, 
           price = :price, image = :image, "inStock" = :inStock, rating = :rating, "updatedAt" = NOW()
       WHERE id = :id
       RETURNING *`,
      {
        replacements: {
          id,
          name: name || product[0].name,
          description: description || product[0].description,
          category: category || product[0].category,
          price: price !== undefined ? price : product[0].price,
          image: image || product[0].image,
          inStock: inStock !== undefined ? inStock : product[0].inStock,
          rating: rating !== undefined ? rating : product[0].rating,
        },
      }
    );

    res.json({
      message: "Product updated successfully",
      product: result[0],
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete product (admin only)
export const deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const [product] = await sequelize.query(
      "SELECT id FROM products WHERE id = :id",
      { replacements: { id } }
    );

    if (product.length === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    await sequelize.query(
      "DELETE FROM products WHERE id = :id",
      { replacements: { id } }
    );

    res.json({
      message: "Product deleted successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
