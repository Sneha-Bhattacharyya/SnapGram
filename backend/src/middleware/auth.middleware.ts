import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.header("Authorization");
    const token = authHeader && authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;

    if (!token) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        (req as any).user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ error: "Invalid token" });
    }
};