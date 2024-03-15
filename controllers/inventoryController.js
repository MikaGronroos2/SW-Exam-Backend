const Inventory = require("../models/inventoryModel");

// create a new inventory record
const createInventory = async (req, res) => {
  try {
    const { name, description, quantity, price } = req.body;
    const inventory = await Inventory.create({
      name,
      description,
      quantity,
      price,
    });
    res.status(201).json(inventory);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server error" });
  }
};

// get all inventory records
const getInventory = async (req, res) => {
  try {
    const inventory = await Inventory.find();
    res.status(200).json(inventory);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server error" });
  }
};

// get a single inventory record by Id
const getInventoryById = async (req, res) => {
  try {
    const inventory = await Inventory.find({ user_id: req.params.user_id });
    res.status(200).json(inventory);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server error" });
  }
};

// update a inventory record (PATCH)
const updateInventory = async (req, res) => {
  const id = req.params.id;
  try {
    const inventory = await Inventory.findByIdAndUpdate(
      id,
      { ...req.body },
      { new: true }
    );

    if (inventory) {
      res.status(200).json(inventory);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server error" });
  }
};

// delete a inventory record
const deleteInventory = async (req, res) => {
  try {
    const inventory = await Inventory.findByIdAndDelete(req.params.id);
    res.status(200).json(inventory);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = {
  createInventory,
  getInventory,
  getInventoryById,
  updateInventory,
  deleteInventory,
};
