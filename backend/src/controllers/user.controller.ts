import { NextFunction, Request, Response } from "express";
import prisma from "../utils/prisma";

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany();
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await prisma.user.findUnique({
      where: { id: id },
      include: {
        posts: {
          select: {
            id: true,
            caption: true,
            media_url: true,
            timestamp: true,
            owner: {
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
              },
            },
            shared_by: {
              select: {
                id: true,
                name: true,
                username: true,
                dp_url: true,
              }
            },
            saved_by: {
              select: {
                id: true,
                name: true,
                username: true,
                dp_url: true,
              }
            }
          },
        },
        liked_posts: {
          select: {
            id: true,
            caption: true,
            media_url: true,
            timestamp: true,
            owner: {
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
              },
            },
            shared_by: {
              select: {
                id: true,
                name: true,
                username: true,
                dp_url: true,
              }
            },
            saved_by: {
              select: {
                id: true,
                name: true,
                username: true,
                dp_url: true,
              }
            }
          },
        },
        saved_posts: {
          select: {
            id: true,
            caption: true,
            media_url: true,
            timestamp: true,
            owner: {
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
              },
            },
            shared_by: {
              select: {
                id: true,
                name: true,
                username: true,
                dp_url: true,
              }
            },
            saved_by: {
              select: {
                id: true,
                name: true,
                username: true,
                dp_url: true,
              }
            }
          },
        },
        liked_comments: {
          select: {
            id: true,
            body: true,
            timestamp: true,
            post: {
              select: {
                id: true,
                caption: true,
                media_url: true,
                timestamp: true,
              },
            },
          },
        },
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

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
      include: {
        saved_by: {
          select: {
            id: true,
            name: true,
            username: true,
            dp_url: true,
          },
        },
      },
    });

    return res.status(200).json(post);
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const { id, data } = req.body;
    const userExists = await prisma.user.findUnique({ where: { id } });
    if (!userExists) {
      return res.status(404).json({ error: "User not found" });
    }
    const user = await prisma.user.update({
      where: { id },
      data,
    });
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error });
  }
};

export const deleteSavedPost = async (req: Request, res: Response) => {
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
          disconnect: { id: userId },
        },
      },
    });

    return res.status(200).json(post);
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteLikePost = async (req: Request, res: Response) => {
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
          disconnect: { id: userId },
        },
      },
    });

    return res.status(200).json(post);
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};
export const deleteLikeComment = async (req: Request, res: Response) => {
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
          disconnect: { id: userId },
        },
      },
    });

    return res.status(200).json(comment);
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};
