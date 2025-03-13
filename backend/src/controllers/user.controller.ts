import { NextFunction, Request, Response } from "express";
import prisma from "../utils/prisma";

export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const users = await prisma.user.findMany();
        return res.status(200).json(users);
    } catch (error) {
        return res.status(500).json({ error: "Internal server error" });
    }
}

export const getUserById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const user = await prisma.user.findUnique({ where: { id: id } });

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        return res.status(200).json(user);
    } catch (error) {
        return res.status(500).json({ error: "Internal server error" });
    }
}