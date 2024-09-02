import request from "supertest";
import app from "../../../src/app.js";
import { query, closeConnection } from "../../../src/utils/db.js";
import path from "path";
import fs from "fs";

// Paths to SQL scripts
const dropTablesScript = path.join(
  __dirname,
  "../../../database/dropTables.sql"
);
const schemaScript = path.join(
  __dirname,
  "../../../database/migrations/01-schema.sql"
);
const dataScript = path.join(
  __dirname,
  "../../../database/migrations/02-initialData.sql"
);

// Function to reset the database
const resetDatabase = async () => {
  const executeScript = async (filePath: string) => {
    try {
      const script = fs.readFileSync(filePath, "utf-8");
      const queries = script.split(";").filter((query) => query.trim() !== "");
      for (const queryText of queries) {
        await query(queryText);
      }
    } catch (err) {
      console.error("Error executing script", err);
    }
  };

  await executeScript(dropTablesScript);
  await executeScript(schemaScript);
  await executeScript(dataScript);
};

// Admin user credentials for authentication
const adminCredentials = {
  email: "admin@example.com",
  password: "password123",
};

// Regular user credentials for authentication
const userCredentials = {
  email: "user@example.com",
  password: "password123",
};

let adminToken: string;
let userToken: string;

// Log in and get tokens before tests
beforeAll(async () => {
  await resetDatabase();

  // Admin login
  const adminLoginResponse = await request(app)
    .post("/api/v1/auth/login")
    .send(adminCredentials);
  adminToken = adminLoginResponse.body.token;

  // User login
  const userLoginResponse = await request(app)
    .post("/api/v1/auth/login")
    .send(userCredentials);
  userToken = userLoginResponse.body.token;
});

// Reset the database before each test
beforeEach(async () => {
  await resetDatabase();
});

afterAll(async () => {
  await closeConnection();
});

describe("Product Routes - Integration Tests", () => {
  describe("POST /api/v1/admin/products", () => {
    it("should create a new product when authorized as admin", async () => {
      const response = await request(app)
        .post("/api/v1/admin/products")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          name: "New Product",
          description: "A new product description",
          price: 99.99,
          brand: "BrandZ",
          category: "Electronics",
          size: "M",
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("id");
      expect(response.body).toMatchObject({
        name: "New Product",
        description: "A new product description",
      });
    });

    it("should return 403 when not authorized as admin", async () => {
      const response = await request(app)
        .post("/api/v1/admin/products")
        .set("Authorization", `Bearer ${userToken}`)
        .send({
          name: "New Product",
          description: "A new product description",
          price: 99.99,
          brand: "BrandZ",
          category: "Electronics",
          size: "M",
        });

      expect(response.status).toBe(403);
      expect(response.body).toHaveProperty(
        "message",
        "Forbidden - Admins only"
      );
    });
  });

  describe("GET /api/v1/products", () => {
    it("should return all products", async () => {
      const response = await request(app)
        .get("/api/v1/products")
        .set("Authorization", `Bearer ${userToken}`); // Authorization may be required

      expect(response.status).toBe(200);
      expect(response.body.length).toBeGreaterThan(0);
    });
  });

  describe("GET /api/v1/products/:id", () => {
    it("should return a product by ID", async () => {
      const response = await request(app)
        .get("/api/v1/products/1")
        .set("Authorization", `Bearer ${userToken}`); // Authorization may be required

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("id", 1);
    });

    it("should return 404 if product is not found", async () => {
      const response = await request(app)
        .get("/api/v1/products/999")
        .set("Authorization", `Bearer ${userToken}`); // Authorization may be required

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty("message", "Product not found");
    });
  });

  describe("GET /api/v1/products/search", () => {
    it("should return products matching the search query", async () => {
      const response = await request(app)
        .get("/api/v1/products/search")
        .set("Authorization", `Bearer ${userToken}`) // Authorization may be required
        .query({ q: "T-Shirt" });

      expect(response.status).toBe(200);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0]).toHaveProperty("name", "Basic T-Shirt");
    });

    it("should return an empty array if no products match the search query", async () => {
      const response = await request(app)
        .get("/api/v1/products/search")
        .set("Authorization", `Bearer ${userToken}`) // Authorization may be required
        .query({ q: "NonExistentProduct" });

      expect(response.status).toBe(200);
      expect(response.body.length).toBe(0);
    });
  });

  describe("PUT /api/v1/admin/products/:id", () => {
    it("should update a product by ID when authorized as admin", async () => {
      const response = await request(app)
        .put("/api/v1/admin/products/1")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          name: "Updated Product",
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("id", 1);
      expect(response.body).toHaveProperty("name", "Updated Product");
    });

    it("should return 403 when not authorized as admin", async () => {
      const response = await request(app)
        .put("/api/v1/admin/products/1")
        .set("Authorization", `Bearer ${userToken}`)
        .send({
          name: "Updated Product",
        });

      expect(response.status).toBe(403);
      expect(response.body).toHaveProperty(
        "message",
        "Forbidden - Admins only"
      );
    });

    it("should return 404 if product is not found", async () => {
      const response = await request(app)
        .put("/api/v1/admin/products/999")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          name: "Updated Product",
        });

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty("message", "Product not found");
    });
  });

  describe("DELETE /api/v1/admin/products/:id", () => {
    it("should delete a product by ID when authorized as admin", async () => {
      const response = await request(app)
        .delete("/api/v1/admin/products/1")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty(
        "message",
        "Product successfully deleted"
      );
    });

    it("should return 403 when not authorized as admin", async () => {
      const response = await request(app)
        .delete("/api/v1/admin/products/1")
        .set("Authorization", `Bearer ${userToken}`);

      expect(response.status).toBe(403);
      expect(response.body).toHaveProperty(
        "message",
        "Forbidden - Admins only"
      );
    });
  });
});
