import "dotenv/config";
import { Request } from "express";
import jwt from "jsonwebtoken";
import { ERROR_STRING } from "./common/errorHandler.middleware";

const { SECRET_KEY } = process.env;

export const issueToken = (id: number): string => {
  return jwt.sign({ id: id }, SECRET_KEY as string, { expiresIn: "1h" });
};

export const issueExpiredToken = async (id: number): Promise<string> => {
  return new Promise<string>((resolve) => {
    const token = jwt.sign({ id: id }, SECRET_KEY as string, {
      expiresIn: "1s",
    });
    setTimeout(() => resolve(token), 2000);
  });
};

interface DecodedToken {
  id: number;
}

export const verifyToken = (token: string): Promise<DecodedToken> => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, SECRET_KEY as string, (error, decoded) => {
      if (error) {
        reject(error);
      } else resolve(decoded as DecodedToken);
    });
  });
};

export const userIdFromToken = async (
  request: Request
): Promise<number | undefined> => {
  try {
    const token = request.headers.authorization?.split("Bearer ")[1];
    if (!token) throw new Error(ERROR_STRING.NoWebTokenError);
    return (await verifyToken(token))?.id;
  } catch (error: any) {
    if (error.name === "TokenExpiredError") {
      error = new Error(ERROR_STRING.TokenExpiredError);
    }
    if (error.name === "JsonWebTokenError")
      error = new Error(ERROR_STRING.JsonWebTokenError);
    throw error;
  }
};
