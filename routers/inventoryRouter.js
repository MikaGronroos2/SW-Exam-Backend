const express = require("express");
const router = express.Router();
const {
  createInventory,
  getInventoryById,
  getInventory,
  deleteInventory,
  updateInventory,
} = require("../controllers/inventoryController");
const requireAuth = require("../middleware/requireAuth");

// require auth for all workout routes
router.use(requireAuth);

// GET all Inventory
router.get("/", getInventory);

// POST a new Inventory
router.post("/", createInventory);

// GET a single Inventory
router.get("/:id", getInventoryById);

// DELETE a Inventory
router.delete("/:id", deleteInventory);

// Update Inventory using PUT
router.put("/:id", updateInventory);

module.exports = router;
