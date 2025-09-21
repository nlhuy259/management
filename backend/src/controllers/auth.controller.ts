import { Request, Response } from "express";
import { register, login } from "../services/auth.service";


export const userRegister = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body; 
    const user = await register({ name, email, password });

    return res.status(201).json({ message: "Register successful", name, email });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error " + error });
  }
};

export const userLogin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await login({ email, password });
    return res.status(200).json({ message: "Login successful", user});
  } catch (error) {
    return res.status(500).json({ message: "Internal server error " + error });
  }
};
