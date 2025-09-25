import { PrismaClient, User, Role } from "@prisma/client";

const prisma = new PrismaClient();

export type UserInput = {
  name: string;
  email: string;
  role: Role;
};

export async function getUsers(){
  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      name: true,
      createdAt: true,
      updatedAt: true,
    },
  })
  return users;
}

export async function getUserById(id: string): Promise<User> {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) throw new Error("User not found");
  return user;
}

export async function updateUser(id: string, input: UserInput): Promise<User> {
  const { name, email, role } = input;
  const user = await prisma.user.update({ where: { id }, data: { name, email, role } });
  return user;
}

export async function deleteUser(id: string): Promise<void> {
  await prisma.user.delete({ where: { id } });
}