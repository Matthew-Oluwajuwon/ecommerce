import jwt from "jsonwebtoken";
import { Response, NextFunction } from "express";
import { secretKey } from "../utils/envConfig";
import { jwtDecode } from "jwt-decode";

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
      const decoded: any = jwtDecode(token);

      if (decoded.is_default_password) {
        return res.status(403).json({
          responseCode: 403,
          responseMessage: "You need to change your password as you cannot use a default password to proceed.",
          data: null,
        });
      }
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
