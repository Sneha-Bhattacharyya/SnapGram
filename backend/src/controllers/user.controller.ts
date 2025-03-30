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

export const likeComment = async (req: Request, res: Response) => {
    try {
        const { id, userId } = req.body;
  
        const commentExists = await prisma.comment.findUnique({ where: { id } });
  
        if (!commentExists) {
            return res.status(404).json({ error: "Comment not found" });
        }
  
        const comment = await prisma.comment.update({
            where: { id },
            data: {
            liked_by: {
            connect: { id: userId },
            },
            },
        });
  
        return res.status(200).json(comment);
    } catch (error) {
        return res.status(500).json({ error: "Internal server error" });
    }
  };
  
  export const likePost = async (req: Request, res: Response) => {
    try {
        const { id, userId } = req.body;
        const postExists = await prisma.post.findUnique({ where: { id } });
  
        if (!postExists) {
            return res.status(404).json({ error: "Post not found" });
        }
  
        const post = await prisma.post.update({
            where: { id },
            data: {
                liked_by: {
                    connect: { id: userId },
                },
            },
        });
  
        return res.status(200).json(post);
    } catch (error) {
        return res.status(500).json({ error: "Internal server error" });
    }
  };
  
  export const savePost = async (req: Request, res: Response) => {
    try {
        const { id, userId } = req.body;
        const postExists = await prisma.post.findUnique({ where: { id } });
  
        if (!postExists) {
            return res.status(404).json({ error: "Post not found" });
        }
        const post = await prisma.post.update({
            where: { id },
            data: {
                saved_by: {
                    connect: { id: userId },
                },
            },
        });
  
        return res.status(200).json(post);
    } catch (error) {
        return res.status(500).json({ error: "Internal server error" });
    }
  };