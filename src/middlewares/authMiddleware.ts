import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
    user?: {
        id: string;
        email: string;
    };
}

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction): void => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        res.status(401).json({ error: "Access denied. No token provided." });
        return;
    }

    try {
        const defaultSecret = "default_secret";
        const secret = process.env.SECRET_KEY || defaultSecret;

        const decoded = jwt.verify(token, secret) as { id: string; email: string };

        req.user = decoded;
        next();
    } catch (err) {
        res.status(403).json({ error: "Invalid or expired token." });
    }
};
