const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);
const User = require("../models/userModel");
const Inventory = require("../models/inventoryModel");
const inventories = [
  {
    name: "Inventory Sample",
    description: "Simple Simple",
    quantity: "1",
    price: "50",
  },
  {
    name: "Inventory Sample 2",
    description: "Simple Simple 2",
    quantity: "2",
    price: "100",
  },
];

let token = null;

beforeAll(async () => {
  await User.deleteMany({});
  const result = await api
    .post("/api/users/signup")
    .send({ email: "mattiv@matti.fi", password: "R3g5T7#gh" });
  token = result.body.token;
});

describe("Given there are initially some inventory saved", () => {
  beforeEach(async () => {
    await Inventory.deleteMany({});
    await api
      .post("/api/inventory")
      .set("Authorization", "bearer " + token)
      .send(inventories[0])
      .send(inventories[1]);
  });

  it("should return all inventory as JSON when GET /api/inventory is called", async () => {
    await api
      .get("/api/inventory")
      .set("Authorization", "bearer " + token)
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });

  it("should create one inventory when POST /api/inventory is called", async () => {
    const newInventory = {
      name: "Latest test Sample",
      description: "Simple Sample the latest",
      quantity: "25",
      price: "30",
    };
    await api
      .post("/api/inventory")
      .set("Authorization", "bearer " + token)
      .send(newInventory)
      .expect(201);
  });

  it("should return one inventory by ID when GET /api/inventory/:id is called", async () => {
    const inventory = await Inventory.findOne();
    await api
      .get("/api/inventory/" + inventory._id)
      .set("Authorization", "bearer " + token)
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });

  it("should update one inventory by ID when PUT /api/inventory/:id is called", async () => {
    const inventory = await Inventory.findOne();
    const updatedInventory = {
      name: "Latest updated test Sample",
      description: "Simple Sample the latest updated",
      quantity: "2",
      price: "1569",
    };
    await api
      .put("/api/inventory/" + inventory._id)
      .set("Authorization", "bearer " + token)
      .send(updatedInventory)
      .expect(200);
    const updatedInventoryCheck = await Inventory.findById(inventory._id);
    expect(updatedInventoryCheck.toJSON()).toEqual(
      expect.objectContaining(updatedInventory)
    );
  });

  it("should delete one inventory  by ID when DELETE /api/inventory/:id is called", async () => {
    const inventory = await Inventory.findOne();
    await api
      .delete("/api/inventory/" + inventory._id)
      .set("Authorization", "bearer " + token)
      .expect(200);
    const inventoryCheck = await Inventory.findById(inventory._id);
    expect(inventoryCheck).toBeNull();
  });
});

afterAll(() => {
  mongoose.connection.close();
});
