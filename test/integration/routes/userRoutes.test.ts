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

// Function to reset the database by executing SQL scripts
const resetDatabase = async () => {
  const executeScript = async (filePath: string) => {
    try {
      const script = fs.readFileSync(filePath, "utf-8");
      const queries = script.split(";").filter((query) => query.trim() !== "");
      for (const queryText of queries) {
        await query(queryText); // Execute each SQL query in the script
      }
    } catch (err) {
      console.error("Error executing script", err);
    }
  };

  await executeScript(dropTablesScript);
  await executeScript(schemaScript);
  await executeScript(dataScript);
};

// Admin user credentials for authorization
const adminCredentials = {
  email: "admin@example.com",
  password: "password123",
};

// Regular user credentials for authorization
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

  // Regular user login
  const userLoginResponse = await request(app)
    .post("/api/v1/auth/login")
    .send(userCredentials);
  userToken = userLoginResponse.body.token;
});

// Reset the database before each test
beforeEach(async () => {
  await resetDatabase();
});

// Close the database connection after all tests
afterAll(async () => {
  await closeConnection();
});

describe("User Routes - Integration Tests", () => {
  describe("POST /admin/users", () => {
    it("should create a new user when authorized as admin", async () => {
      const response = await request(app)
        .post("/api/v1/admin/users")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          email: "newuser@example.com",
          password: "newpassword123",
          first_name: "New",
          last_name: "User",
          role: "user",
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty(
        "message",
        "User created successfully"
      );
    });

    it("should return 403 when not authorized as admin", async () => {
      const response = await request(app)
        .post("/api/v1/admin/users")
        .set("Authorization", `Bearer ${userToken}`)
        .send({
          email: "newuser@example.com",
          password: "newpassword123",
          first_name: "New",
          last_name: "User",
          role: "user",
        });

      expect(response.status).toBe(403);
      expect(response.body).toHaveProperty(
        "message",
        "Forbidden - Admins only"
      );
    });

    it("should return 400 if validation fails", async () => {
      const response = await request(app)
        .post("/api/v1/admin/users")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          email: "invalid-email",
          password: "",
          first_name: "",
          last_name: "",
          role: "user",
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("message", "Validation Error");
    });
  });

  describe("GET /admin/users", () => {
    it("should return all users when authorized as admin", async () => {
      const response = await request(app)
        .get("/api/v1/admin/users")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.length).toBeGreaterThan(0);
    });

    it("should return 403 when not authorized as admin", async () => {
      const response = await request(app)
        .get("/api/v1/admin/users")
        .set("Authorization", `Bearer ${userToken}`);

      expect(response.status).toBe(403);
      expect(response.body).toHaveProperty(
        "message",
        "Forbidden - Admins only"
      );
    });
  });

  describe("GET /admin/users/:id", () => {
    it("should return a user by ID when authorized as admin", async () => {
      const response = await request(app)
        .get("/api/v1/admin/users/1")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("id", 1);
    });

    it("should return 404 if user is not found", async () => {
      const response = await request(app)
        .get("/api/v1/admin/users/999")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty("message", "User not found");
    });

    it("should return 403 when not authorized as admin", async () => {
      const response = await request(app)
        .get("/api/v1/admin/users/1")
        .set("Authorization", `Bearer ${userToken}`);

      expect(response.status).toBe(403);
      expect(response.body).toHaveProperty(
        "message",
        "Forbidden - Admins only"
      );
    });
  });

  describe("PUT /admin/users/:id", () => {
    it("should update a user by ID when authorized as admin", async () => {
      const response = await request(app)
        .put("/api/v1/admin/users/1")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          first_name: "Updated",
          last_name: "User",
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty(
        "message",
        "User updated successfully"
      );
      expect(response.body.user).toHaveProperty("first_name", "Updated");
    });

    it("should return 403 when not authorized as admin", async () => {
      const response = await request(app)
        .put("/api/v1/admin/users/1")
        .set("Authorization", `Bearer ${userToken}`)
        .send({
          first_name: "Updated",
          last_name: "User",
        });

      expect(response.status).toBe(403);
      expect(response.body).toHaveProperty(
        "message",
        "Forbidden - Admins only"
      );
    });

    it("should return 404 if user is not found", async () => {
      const response = await request(app)
        .put("/api/v1/admin/users/999")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          first_name: "Updated",
          last_name: "User",
        });

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty("message", "User not found");
    });
  });

  describe("DELETE /admin/users/:id", () => {
    it("should delete a user by ID when authorized as admin", async () => {
      const response = await request(app)
        .delete("/api/v1/admin/users/1")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty(
        "message",
        "User deleted successfully"
      );
    });

    it("should return 403 when not authorized as admin", async () => {
      const response = await request(app)
        .delete("/api/v1/admin/users/1")
        .set("Authorization", `Bearer ${userToken}`);

      expect(response.status).toBe(403);
      expect(response.body).toHaveProperty(
        "message",
        "Forbidden - Admins only"
      );
    });

    it("should return 404 if user is not found", async () => {
      const response = await request(app)
        .delete("/api/v1/admin/users/999")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty("message", "User not found");
    });
  });
});
