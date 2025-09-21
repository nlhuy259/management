import { PrismaClient, User } from "@prisma/client";
import { hashPassword, comparePassword } from "../utils/bcrypt";
import { generateToken } from "../utils/jwt";
const prisma = new PrismaClient();

export type RegisterInput = {
  name: string;
  email: string;
  password: string;
};
export type LoginInput = {
  email: string;
  password: string;
};

export async function register(input: RegisterInput): Promise<User> {
  const { name, email, password } = input;
  const existing = await prisma.user.findUnique({ where: { email } });

  if (existing) throw new Error("Email already exists");
  const hashed = await hashPassword(password);

  const user = await prisma.user.create({ data: { name, email, password: hashed } });

  return user;
}
export async function login(input: LoginInput): Promise<User> {
  const { email, password } = input;
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) throw new Error("User not found");
  if (!user.password) throw new Error("Password not found");

  const isMatch = await comparePassword(password, user.password);

  if (!isMatch) throw new Error("Invalid password");
  const token = generateToken({ id: user.id, role: user.role });

  return { ...user, token } as User;

}
