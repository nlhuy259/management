import { Request, Response } from "express";
import { createTask, getTasks, updateTask, deleteTask, getTaskByUserId, getTaskById } from "../services/task.service";


//  Tạo task mới
export const assignTask = async (req: Request, res: Response) => {
  try {
    const { title, description, assignedToId, createdById } = req.body;
    console.log(req.body)
    const task = await createTask({ title, description, assignedToId, createdById });

    res.status(201).json({ message: "Task created successfully", task });
  } catch (error) {
    res.status(500).json({ message: "Error creating task", error });
  }
};

//  Lấy tất cả task
export const getAllTasks = async (req: Request, res: Response) => {
  try {
    const tasks = await getTasks();
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Error fetching tasks", error });
  }
};

//  Update task
export const updateTaskStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description, status } = req.body;

    const task = await updateTask(id, { title, description, status });

    res.json({ message: "Task updated", task });
  } catch (error) {
    res.status(500).json({ message: "Error updating task", error });
  }
};

//  Delete task
export const deleteTaskById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await deleteTask(id);

    res.json({ message: "Task deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting task", error });
  }
};
// Get Task by userId
export const GetTaskByUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const tasks = await getTaskByUserId(userId);
    res.json({ message: "Task updated", tasks });
  } catch (error) {
    res.status(500).json({ message: "Error updating task", error });
  }
};

//Get task by taskId
export const GetTaskByTaskId = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const task = await getTaskById(id);
    res.json({ message: "Get task successfully", task });
  } catch (error) {
    res.status(500).json({ message: "Error updating task", error });
  }
};
