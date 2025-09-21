import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "secret";

interface JwtPayload {
  id: string;
  role: string;
}

//  Middleware xác thực token
export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, SECRET) as JwtPayload;

    // Gắn thông tin user vào request để route controller dùng
    (req as any).user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

//  Middleware kiểm tra quyền Manager
export const authorizeManager = (req: Request, res: Response, next: NextFunction) => {
  const user = (req as any).user;

  if (!user) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  if (user.role !== "MANAGER") {
    return res.status(403).json({ message: "Access denied. Manager only." });
  }

  next();
};
