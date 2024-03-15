const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);
const User = require("../models/userModel");

beforeAll(async () => {
  await User.deleteMany({});
});

describe("User Routes", () => {
  describe("POST /api/users/signup", () => {
    it("should signup a new user with valid credentials", async () => {
      // Arrange
      const userData = {
        email: "test@example.com",
        password: "R3g5T7#gh",
      };
      const response = await api.post("/api/users/signup").send(userData);
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("token");
    });

    it("should return an error with invalid credentials", async () => {
      const userData = {
        email: "test@example.com",
        password: "invalidpassword",
      };
      const response = await api.post("/api/users/signup").send(userData);
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("error");
    });
    it("should return an error with an existing email", async () => {
      const userData = {
        email: "test@example.com",
        password: "R3g5T7#gh",
      };
      const response = await api.post("/api/users/signup").send(userData);
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("error");
    });
  });

  describe("POST /api/users/login", () => {
    it("should login a user with valid credentials", async () => {
      const userData = {
        email: "test1@example.com",
        password: "R3g5T7#gh",
      };
      const newUserData = await api.post("/api/users/signup").send(userData);
      console.log(newUserData);
      const response = await api.post("/api/users/login").send(userData);
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("token");
    });

    it("should return an error with invalid credentials", async () => {
      const userData = {
        email: "test@example.com",
        password: "invalidpassword",
      };
      const response = await api.post("/api/users/login").send(userData);
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("error");
    });
    it("should return an error with an unknown email", async () => {
      const userData = {
        email: "unknown@email.fi",
        password: "R3g5T7#gh",
      };
      const response = await api.post("/api/users/login").send(userData);
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty("error");
    });
  });
});

afterAll(() => {
  mongoose.connection.close();
});
