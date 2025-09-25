import { PrismaClient, Status, Task } from "@prisma/client";

const prisma = new PrismaClient();

export type CreateTaskInput = {
  title: string;
  description: string;
  assignedToId: string;
  createdById: string;
};
export type UpdateTaskInput = {
  title: string;
  description: string;
  status: Status;
};

export async function createTask(input: CreateTaskInput): Promise<Task> {

	const { title, description, assignedToId, createdById } = input;
	const task = await prisma.task.create({
		data: { title, description, assignedToId, createdById },
	});
	return task;
}
export async function getTasks(): Promise<Task[]> {
	const tasks = await prisma.task.findMany();
	return tasks;
}
export async function updateTask(id: string, input: UpdateTaskInput): Promise<Task> {
	const { title, description, status } = input;
	const task = await prisma.task.update({ where: { id }, data: { title, description, status } });
	return task;
}
export async function getTaskById(id: string): Promise<Task> {
	const task = await prisma.task.findUnique({
		where: { id },
		include: {
		  assignedTo: {
			select: {  name: true, email: true },
		  },
		  createdBy: {
			select: { name: true, email: true },
		  },
		},});
	if (!task) throw new Error("Task not found");
	return task;
}
export async function getTaskByUserId(userId: string): Promise<Task[]> {
	return await prisma.task.findMany({
	  where: { assignedToId: userId }
	});
  }
export async function deleteTask(id: string): Promise<void> {
	await prisma.task.delete({ where: { id } });
}
