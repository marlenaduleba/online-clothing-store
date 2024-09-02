import request from "supertest";
import app from "../../../src/app.js";
import { query, closeConnection } from "../../../src/utils/db.js";
import path from "path";
import fs from "fs";

// Ścieżki do skryptów SQL
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

// Funkcja resetująca bazę danych
const resetDatabase = async () => {
  const executeScript = async (filePath: string) => {
    try {
      const script = fs.readFileSync(filePath, "utf-8");
      const queries = script.split(";").filter((query) => query.trim() !== "");
      for (const queryText of queries) {
        console.log("Executing query:", queryText); // Logowanie każdego zapytania
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

// Użytkownik `admin` do autoryzacji
const adminCredentials = {
  email: "admin@example.com",
  password: "password123",
};

// Użytkownik `user` do autoryzacji
const userCredentials = {
  email: "user@example.com",
  password: "password123",
};

let adminToken: string;
let userToken: string;

// Logowanie i pobieranie tokenów przed testami
beforeAll(async () => {
  await resetDatabase();

  // Logowanie admina
  const adminLoginResponse = await request(app)
    .post("/api/v1/auth/login")
    .send(adminCredentials);
  adminToken = adminLoginResponse.body.token;

  // Logowanie zwykłego użytkownika
  const userLoginResponse = await request(app)
    .post("/api/v1/auth/login")
    .send(userCredentials);
  userToken = userLoginResponse.body.token;
});

// Resetowanie bazy danych przed każdym testem
beforeEach(async () => {
  await resetDatabase();
});

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
