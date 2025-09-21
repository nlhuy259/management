import jwt, { Secret } from "jsonwebtoken";

const SECRET: Secret = process.env.JWT_SECRET || "secret";

export const generateToken = (payload: object) => {
  return jwt.sign(payload, SECRET, { expiresIn: "7d" });
};

export const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, SECRET);
  } catch (err) {
    return null;
  }
};
