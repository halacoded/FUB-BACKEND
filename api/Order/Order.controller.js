const Order = require("../../models/Order");
const Customer = require("../../models/Customer");
const MenuItem = require("../../models/MenuItem");
exports.createOrder = async (req, res) => {
  try {
    const {
      phone,
      items,
      restaurantId,
      notes,
      channel = "whatsapp",
      preferredLanguage,
      accessibilityPrefs,
    } = req.body;

    if (!phone || !items || items.length === 0 || !restaurantId) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Find or create customer
    const customer = await Customer.findOneAndUpdate(
      { phone },
      {
        $set: {
          preferredLanguage,
          accessibilityPrefs,
          lastOrderAt: new Date(),
        },
        $setOnInsert: { createdAt: new Date() },
      },
      { upsert: true, new: true }
    );

    // 🧠 Fetch prices from DB
    const populatedItems = await Promise.all(
      items.map(async (item) => {
        const menuDoc = await MenuItem.findById(item.menuItem);
        if (!menuDoc) throw new Error(`Menu item not found: ${item.menuItem}`);
        return {
          menuItem: item.menuItem,
          quantity: item.quantity || 1,
          price: menuDoc.price,
        };
      })
    );

    // 💰 Calculate total
    const totalPrice = populatedItems.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );

    // Create order
    const newOrder = await Order.create({
      customer: customer._id,
      restaurant: restaurantId,
      items: populatedItems.map(({ menuItem, quantity }) => ({
        menuItem,
        quantity,
      })),
      totalPrice,
      notes,
      channel,
    });

    res.status(201).json({ message: "Order placed", order: newOrder });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error placing order", error: err.message });
  }
};

exports.getOrdersByRestaurant = async (req, res) => {
  try {
    const orders = await Order.find({ restaurant: req.user._id })
      .populate("customer", "phone preferredLanguage")
      .populate("items.menuItem", "name price");

    res.status(200).json({ orders });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching orders", error: err.message });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const allowedStatuses = [
      "pending",
      "confirmed",
      "preparing",
      "delivered",
      "cancelled",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const order = await Order.findOneAndUpdate(
      { _id: req.params.id, restaurant: req.user._id },
      { status },
      { new: true }
    );

    if (!order) return res.status(404).json({ message: "Order not found" });

    res.status(200).json({ message: "Order updated", order });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error updating order", error: err.message });
  }
};
