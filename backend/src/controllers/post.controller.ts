import { Request, Response } from "express";
import prisma from "../utils/prisma";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

export const getAllPostsByUser = async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const token = authHeader.split(" ")[1];
    const decodedToken: any = jwt.verify(token, JWT_SECRET);
    const id = decodedToken.id;
    const posts = await prisma.post.findMany({ where: { ownerId: id } });

    return res.status(200).json(posts);
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const createPost = async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const token = authHeader.split(" ")[1];
    const decodedToken: any = jwt.verify(token, JWT_SECRET);
    const id = decodedToken.id;

    const { caption, media_url } = req.body;
    const post = await prisma.post.create({
      data: { caption, media_url, ownerId: id },
    });

    return res.status(201).json(post);
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const getPostByUserId = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const posts = await prisma.post.findMany({ where: { ownerId: userId } });

    return res.status(200).json(posts);
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
}