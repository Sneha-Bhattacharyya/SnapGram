import { Request, Response } from "express";
import prisma from "../utils/prisma";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

export const getAllPosts = async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { cursor, limit = 10, all } = req.query;
    const take = parseInt(limit as string, 10);

    const include = {
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
          bio: true,
        },
      },
      shared_by: {
        select: {
          id: true,
          name: true,
          username: true,
          dp_url: true,
          bio: true,
        },
      },
      saved_by: {
        select: {
          id: true,
          name: true,
          username: true,
          dp_url: true,
          bio: true,
        },
      },
      comments: {
        include: {
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
          replies: {
            include: {
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
            },
          },
        },
      },
    };

    // If `all=true`, return all posts
    if (all === "true") {
      const posts = await prisma.post.findMany({
        orderBy: {
          timestamp: "desc",
        },
        include,
      });
      return res.status(200).json({ posts });
    }

    // Paginated mode using cursor
    const posts = await prisma.post.findMany({
      take,
      skip: cursor ? 1 : 0,
      ...(cursor && {
        cursor: {
          id: cursor as string,
        },
      }),
      orderBy: {
        timestamp: "desc",
      },
      include,
    });

    const nextCursor =
      posts.length === take ? posts[posts.length - 1].id : null;

    return res.status(200).json({ posts, nextCursor });

  } catch (error) {
    console.error("Error fetching posts:", error);
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
    console.log(id);
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
    const posts = await prisma.post.findMany({
      where: { ownerId: userId },
      include: {
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
            bio: true,
          },
        },
        shared_by: {
          select: {
            id: true,
            name: true,
            username: true,
            dp_url: true,
            bio: true,
          },
        },
        saved_by: {
          select: {
            id: true,
            name: true,
            username: true,
            dp_url: true,
            bio: true,
          },
        },
        comments: {
          include: {
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
            replies: {
              include: {
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
              },
            },
          },
        },
      },
    });

    return res.status(200).json(posts);
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const deletePost = async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const token = authHeader.split(" ")[1];
    const decodedToken: any = jwt.verify(token, JWT_SECRET);
    const owner_id = decodedToken.id;

    const { id } = req.params;
    const post = await prisma.post.delete({ where: { id, ownerId: owner_id } });

    return res.status(200).json(post);
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const updatePost = async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const token = authHeader.split(" ")[1];
    const decodedToken: any = jwt.verify(token, JWT_SECRET);
    const owner_id = decodedToken.id;
    const { id } = req.params;

    const { caption, media_url } = req.body;
    const post = await prisma.post.update({
      where: { id: id, ownerId: owner_id },
      data: { caption, media_url },
    });

    return res.status(200).json(post);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error });
  }
};

export const getPostById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const post = await prisma.post.findUnique({
      where: { id },
      include: {
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
            bio: true,
          },
        },
        shared_by: {
          select: {
            id: true,
            name: true,
            username: true,
            dp_url: true,
            bio: true,
          },
        },
        saved_by: {
          select: {
            id: true,
            name: true,
            username: true,
            dp_url: true,
            bio: true,
          },
        },
        comments: {
          include: {
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
            replies: {
              include: {
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
              },
            },
          },
        },
      },
    });
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }
    return res.status(200).json(post);
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const searchPosts = async (req: Request, res: Response) => {
  try {
    const { q, cursor, limit = 10 } = req.query;
    const take = parseInt(limit as string, 10);

    console.log(q, cursor, take);

    if (!q || typeof q !== "string" || q.trim() === "") {
      return res.status(400).json({ error: "Search query `q` is required" });
    }

    const posts = await prisma.post.findMany({
      where: {
        caption: {
          contains: q,
          mode: "insensitive", // makes it case-insensitive
        },
      },
      take,
      skip: cursor ? 1 : 0,
      ...(cursor && {
        cursor: {
          id: cursor as string,
        },
      }),
      orderBy: {
        timestamp: "desc",
      },
      include: {
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
            bio: true,
          },
        },
        shared_by: {
          select: {
            id: true,
            name: true,
            username: true,
            dp_url: true,
            bio: true,
          },
        },
        saved_by: {
          select: {
            id: true,
            name: true,
            username: true,
            dp_url: true,
            bio: true,
          },
        },
        comments: {
          include: {
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
            replies: {
              include: {
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
              },
            },
          },
        },
      },
    });

    const nextCursor =
      posts.length === take ? posts[posts.length - 1].id : null;

    return res.status(200).json({ posts, nextCursor });
  } catch (error) {
    console.error("Error searching posts:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};