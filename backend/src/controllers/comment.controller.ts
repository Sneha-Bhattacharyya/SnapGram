import { Request, Response } from "express";
import prisma from "../utils/prisma";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

export const getAllCommentsByPost = async (req: Request, res: Response) => {
  try {
    const { postId, parentCommentId } = req.query;
    if (!postId || typeof postId !== "string") {
      return res.status(400).json({ error: "Invalid post ID" });
    }
    const comments = await prisma.comment.findMany({
      where: { postId, parentCommentId: null },
      select: {
        id: true,
        body: true,
        postId: true,
        timestamp: true,
        parentCommentId: true,
        author: {
          select: {
            id: true,
            name: true,
            username: true,
            dp_url: true,
            bio: true,
          },
        },
        liked_by: {
          select: {
            id: true,
            name: true,
            username: true,
            dp_url: true,
            bio: true,
          },
        },
        _count: {
          select: {
            replies: true,
            liked_by: true,
          },
        },
      },
      orderBy: {
        timestamp: "desc",
      },
    });

    if (!parentCommentId) {
      return res.status(200).json(comments);
    } else {
      const replies = await prisma.comment.findMany({
        where: { parentCommentId: parentCommentId as string },
        orderBy: { timestamp: "asc" },
        select: {
          id: true,
          body: true,
          postId: true,
          timestamp: true,
          parentCommentId: true,
          author: {
            select: {
              id: true,
              name: true,
              username: true,
              dp_url: true,
            },
          },
          liked_by: {
            select: {
              id: true,
              name: true,
              username: true,
              dp_url: true,
              bio: true,
            },
          },
          _count: {
            select: {
              replies: true,
              liked_by: true,
            },
          },
        },
      });

      return res.status(200).json(replies);
    }
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const createComment = async (req: Request, res: Response) => {
  try {
    const { postId, body, authorId, parentCommentId } = req.body;
    if (!postId || !body || !authorId) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const token = authHeader.split(" ")[1];
    const decodedToken: any = jwt.verify(token, JWT_SECRET);
    if (decodedToken.id !== authorId) {
      return res.status(403).json({ error: "Forbidden" });
    }

    if (parentCommentId && typeof parentCommentId !== "string") {
      return res.status(400).json({ error: "Invalid parent comment ID" });
    }

    const post = await prisma.post.findUnique({ where: { id: postId } });
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }
    const author = await prisma.user.findUnique({ where: { id: authorId } });
    if (!author) {
      return res.status(404).json({ error: "Author not found" });
    }
    if (parentCommentId) {
      const parentComment = await prisma.comment.findUnique({
        where: { id: parentCommentId },
      });
      if (!parentComment) {
        return res.status(404).json({ error: "Parent comment not found" });
      }
    }
    // Create the comment

    const comment = await prisma.comment.create({
      data: {
        body,
        postId,
        authorId,
        // Only set parentCommentId if provided and not an empty string
        ...(parentCommentId ? { parentCommentId } : {}),
      },
    });

    return res.status(201).json(comment);
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

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
};

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
};

// This function is related to user actions, so it might make more sense to move it to user.controller.ts
