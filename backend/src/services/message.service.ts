import { PrismaClient, Message } from "@prisma/client";

const prisma = new PrismaClient();

export type SendMessageInput = {
  senderId: string;
  receiverId: string;
  content: string;
};

export async function createMessage(input: SendMessageInput): Promise<Message> {
  const { senderId, receiverId, content } = input;
  const message = await prisma.message.create({
    data: { senderId, receiverId, content },
  });
  return message;
}

export async function getConversation(userA: string, userB: string): Promise<Message[]> {
  const messages = await prisma.message.findMany({
    where: {
      OR: [
        { senderId: String(userA), receiverId: String(userB) },
        { senderId: String(userB), receiverId: String(userA) },
      ],
    },
    orderBy: { createdAt: "asc" },
  });
  return messages;
}

