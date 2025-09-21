import { Request, Response } from "express";
import { createMessage, getConversation } from "../services/message.service";

//  Gửi message
export const sendMessage = async (req: Request, res: Response) => {
  try {
    const { senderId, receiverId, content } = req.body;
    const message = await createMessage({ senderId, receiverId, content });
    res.status(201).json({ message: "Message sent", data: message });
  } catch (error) {
    res.status(500).json({ message: "Error sending message", error });
  }
};

//  Lấy message giữa 2 user
export const getMessages = async (req: Request, res: Response) => {
  try {
    const { user1, user2 } = req.query as { user1?: string; user2?: string };
    const messages = await getConversation(String(user1), String(user2));
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: "Error fetching messages", error });
  }
};
