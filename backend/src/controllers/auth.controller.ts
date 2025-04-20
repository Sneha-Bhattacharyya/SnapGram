import { NextFunction, Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../utils/prisma";

const JWT_SECRET = process.env.JWT_SECRET!;

export const register = async (req: Request, res: Response) => {
    try {
        const { username, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: { username, email, password: hashedPassword, name: "", bio: "",phone_number: "", dp_url: "",gender: "" }
        });

        const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "30D" });

        res.status(201).json({ message: "User registered", token });
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const user = await prisma.user.findUnique({ where: { email } });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "30D" });

        return res.status(200).json({ message: "Login successful", token });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error });
    }
};

export const getCurrentUser = async (req: Request, res: Response) => {
    try {
      const token = req.headers["authorization"]?.split(" ")[1];
      if (!token) return res.status(401).json({ message: "Unauthorized" });
  
      const decoded: any = jwt.verify(token, JWT_SECRET);
      const user = await prisma.user.findUnique({
        where: { id: decoded.id },
      });
  
      if (!user) return res.status(404).json({ message: "User not found" });
  
      return res.status(200).json(user);
    } catch (error) {
      return res.status(500).json({ message: "Internal server error", error });
    }
  }