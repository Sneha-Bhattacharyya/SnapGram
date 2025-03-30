import { Request, Response } from "express";
import prisma from "../utils/prisma";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

export const getAllCommentsByPost = async (req: Request, res: Response) => {
  try {
    const { postId } = req.body;
    const comments = await prisma.comment.findMany({ where: { postId } });

    return res.status(200).json(comments);
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
}

export const createComment = async (req: Request, res: Response) => {
  try {
    const { postId, body, authorId } = req.body;
    const comment = await prisma.comment.create({
      data: { body, postId, authorId },
    });

    return res.status(201).json(comment);
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
}


export const deleteComment = async (req: Request, res: Response) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Unauthorized" });
      }
  
      const token = authHeader.split(" ")[1];
      const decodedToken: any = jwt.verify(token, JWT_SECRET);
      const authorId = decodedToken.id;
  
      const { id } = req.params;
      const comment = await prisma.comment.delete({ where: { id, authorId } });
  
      return res.status(200).json(comment);
    } catch (error) {
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  export const updateComment = async (req: Request, res: Response) => {
  
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Unauthorized" });
      }
  
      const token = authHeader.split(" ")[1];
      const decodedToken: any = jwt.verify(token, JWT_SECRET);
      const authorId = decodedToken.id;
      const { id } = req.params;
  
      const { body } = req.body;
      const comment = await prisma.comment.update({
        where: { id, authorId },
        data: { body },
      });
  
      return res.status(200).json(comment);
    } catch (error) {
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  export const replyComment = async (req: Request, res: Response) => {
    try {
      const { postId, body, authorId, parentCommentId } = req.body;
      const comment = await prisma.comment.create({
        data: { body, postId, authorId, parentCommentId },
      });
  
      return res.status(201).json(comment);
    } catch (error) {
      return res.status(500).json({ error: "Internal server error" });
    }
  }