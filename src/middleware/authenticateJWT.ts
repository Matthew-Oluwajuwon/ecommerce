import jwt from "jsonwebtoken";
import { Response, NextFunction } from "express";
import { secretKey } from "../utils/envConfig";

// Middleware to validate JWT token
const authenticateJWT = (req: any, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];

    jwt.verify(token, secretKey as string, (err: any, user: any) => {
      if (err) {
        return res.status(403).json({
          responseCode: 403,
          responseMessage: "Forbidden request",
          data: null,
        });
      }

      // Token is valid, store user info for further use
      req.user = user;
      next();
    });
  } else {
    return res.status(401).json({
      responseCode: 401,
      responseMessage: "Unauthorized request",
      data: null,
    });
  }
};

export default authenticateJWT;
