import jwt from "jsonwebtoken";
import request from "supertest";
import app from "../src/app";
import * as userService from "../src/services/user.service";

jest.mock("../src/services/user.service");

const managerToken = jwt.sign({ id: "manager-id", role: "MANAGER" }, "secret");

describe("User API", () => {
  const sampleUsers = [
    {
      id: "1",
      email: "alice@example.com",
      name: "Alice",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("should return list of users", async () => {
    (userService.getUsers as jest.Mock).mockResolvedValue(sampleUsers);

    const res = await request(app).get("/api/users");
    console.log('Response status:', res.statusCode);
    console.log('Response body:', res.body);
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ email: "alice@example.com", name: "Alice" }),
      ])
    );
  });

  it("should require auth for user detail", async () => {
    const res = await request(app).get("/api/users/123");

    expect(res.statusCode).toBe(401);
  });

  it("should return user detail for manager token", async () => {
    const mockUser = {
      id: "1",
      name: "Alice",
      email: "alice@example.com",
      password: "hashed",
      role: "MANAGER",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    (userService.getUserById as jest.Mock).mockResolvedValue(mockUser);

    const res = await request(app)
      .get("/api/users/1")
      .set("Authorization", `Bearer ${managerToken}`);

    expect(userService.getUserById).toHaveBeenCalledWith("1");
    expect(res.statusCode).toBe(200);
    expect(res.body).toMatchObject({
      id: "1",
      email: "alice@example.com",
      name: "Alice",
    });
  });
});


