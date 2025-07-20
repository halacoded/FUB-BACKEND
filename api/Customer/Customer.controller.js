const Customer = require("../../models/Customer");

exports.createOrUpdateCustomer = async (req, res) => {
  try {
    const { phone, preferredLanguage, accessibilityPrefs } = req.body;

    if (!phone) {
      return res.status(400).json({ message: "Phone number is required" });
    }

    const updatedCustomer = await Customer.findOneAndUpdate(
      { phone },
      {
        $set: {
          preferredLanguage,
          accessibilityPrefs,
          lastOrderAt: new Date(),
        },
        $setOnInsert: {
          createdAt: new Date(),
        },
      },
      { upsert: true, new: true }
    );

    res.status(200).json({ customer: updatedCustomer });
  } catch (err) {
    console.error("Customer update error:", err);
    res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
};
exports.getCustomerByPhone = async (req, res) => {
  try {
    const customer = await Customer.findOne({ phone: req.params.phone });
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    res.status(200).json({ customer });
  } catch (err) {
    console.error("Get customer error:", err);
    res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
};
