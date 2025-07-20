const MenuItem = require("../../models/MenuItem");

// Create a new menu item
exports.createMenuItem = async (req, res) => {
  try {
    const { name, description, price, category, voiceLabel, tags } = req.body;
    const imageUrl = req.file ? req.file.path : null;

    const newItem = await MenuItem.create({
      restaurant: req.user._id,
      name,
      description,
      price,
      category,
      voiceLabel,
      imageUrl,
      tags,
    });

    res.status(201).json({ message: "Menu item created", item: newItem });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error creating item", error: err.message });
  }
};

// Get all menu items for logged-in user
exports.getMyMenuItems = async (req, res) => {
  try {
    const items = await MenuItem.find({ restaurant: req.user._id });
    res.status(200).json({ items });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching items", error: err.message });
  }
};

// Update a menu item
exports.updateMenuItem = async (req, res) => {
  try {
    const updates = req.body;
    if (req.file) updates.imageUrl = req.file.path;

    const item = await MenuItem.findOneAndUpdate(
      { _id: req.params.id, restaurant: req.user._id },
      { $set: updates },
      { new: true }
    );

    if (!item) return res.status(404).json({ message: "Item not found" });

    res.status(200).json({ message: "Item updated", item });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error updating item", error: err.message });
  }
};

// Delete a menu item
exports.deleteMenuItem = async (req, res) => {
  try {
    const result = await MenuItem.findOneAndDelete({
      _id: req.params.id,
      restaurant: req.user._id,
    });

    if (!result) return res.status(404).json({ message: "Item not found" });

    res.status(200).json({ message: "Item deleted" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error deleting item", error: err.message });
  }
};
