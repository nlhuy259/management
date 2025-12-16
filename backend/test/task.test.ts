import request from "supertest";
import app from "../src/app";
import * as taskService from "../src/services/task.service";

jest.mock("../src/services/task.service");

describe("Task API", () => {
  let consoleSpy: jest.SpyInstance;
  const mockTask = {
    id: "task-1",
    title: "Test Task",
    description: "Test description",
    status: "TODO" as any,
    assignedToId: "user-1",
    createdById: "user-2",
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(() => {
    consoleSpy = jest.spyOn(console, "log").mockImplementation(() => {});
    jest.resetAllMocks();
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  it("should create a task", async () => {
    (taskService.createTask as jest.Mock).mockResolvedValue(mockTask);

    const res = await request(app).post("/api/tasks/create").send({
      title: "Test Task",
      description: "Test description",
      assignedToId: "user-1",
      createdById: "user-2",
    });

    expect(taskService.createTask).toHaveBeenCalledWith({
      title: "Test Task",
      description: "Test description",
      assignedToId: "user-1",
      createdById: "user-2",
    });
    expect(res.statusCode).toBe(201);
    expect(res.body).toMatchObject({
      message: "Task created successfully",
      task: expect.objectContaining({ id: "task-1", title: "Test Task" }),
    });
  });

  it("should return list of tasks", async () => {
    (taskService.getTasks as jest.Mock).mockResolvedValue([mockTask]);

    const res = await request(app).get("/api/tasks/get");

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual([
      expect.objectContaining({ id: "task-1", title: "Test Task" }),
    ]);
  });
});

