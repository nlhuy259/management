import { Request, Response } from "express";
import { getUserById, getUsers, updateUser, deleteUser } from "../services/user.service";


//  Lấy tất cả user
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await getUsers();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error });
  }
};

//  Lấy chi tiết user
export const getUserDetail = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await getUserById(id);

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user", error });
  }
};

//  Update user (profile)
export const updateUserProfile = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, email, role } = req.body;

    const user = await updateUser(id,  {name, email, role});

    res.json({ message: "User updated", user });
  } catch (error) {
    res.status(500).json({ message: "Error updating user", error });
  }
};

//  Xoá user (chỉ manager)
export const deleteUserById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await deleteUser(id);
    res.json({ message: "User deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting user", error });
  }
};
