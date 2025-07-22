import { Request, Response, NextFunction, Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import {
  getAllPosts,
  createPost,
  getPostByUserId,
  getPostById,
  updatePost,
  searchPosts,
} from "../controllers/post.controller";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Post
 *   description: Post endpoints
 */
/**
 * @swagger
 * /post/search:
 *   get:
 *     summary: Search posts by caption
 *     tags: [Post]
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         description: Caption to search for
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Posts fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     format: uuid
 *                   caption:
 *                     type: string
 *                   media_url:
 *                     type: string
 *                   ownerId:
 *                     type: string
 *                     format: uuid
 */
router.get("/search",
  (req: Request, res: Response, next: NextFunction) => {
    authenticate(req, res, next);
  },
  async (req: Request, res: Response) => {
    await searchPosts(req, res);
  }
)

/**
 * @swagger
 * /post:
 *   get:
 *     summary: Get all posts by self/logged in user
 *     tags: [Post]
 *     responses:
 *       200:
 *         description: Posts fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     format: uuid
 *                   caption:
 *                     type: string
 *                   media_url:
 *                     type: string
 *                   ownerId:
 *                     type: string
 *                     format: uuid
 *       500:
 *         description: Internal server error
 */
router.get(
  "/",
  (req: Request, res: Response, next: NextFunction) => {
    authenticate(req, res, next);
  },
  async (req: Request, res: Response) => {
    await getAllPosts(req, res);
  }
);
/**
 * @swagger
 * /post:
 *   post:
 *     summary: Create a new post
 *     tags: [Post]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               caption:
 *                 type: string
 *               media_url:
 *                 type: string
 *     responses:
 *       201:
 *         description: Post created successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */

router.post(
  "/",
  (req: Request, res: Response, next: NextFunction) => {
    authenticate(req, res, next);
  },
  async (req: Request, res: Response) => {
    await createPost(req, res);
  }
);


/**
 * @swagger
 * /post/{id}:
 *   get:
 *     summary: Get a post by post id
 *     tags: [Post]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Post ID
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Post fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   format: uuid
 *                 caption:
 *                   type: string
 *                 media_url:
 *                   type: string
 *                 ownerId:
 *                   type: string
 *                   format: uuid
 *       400:
 *         description: Bad request
 *       404:
 *         description: Post not found 
 *       500:
 *         description: Internal server error
 */

router.get(
  "/:id",
  (req: Request, res: Response, next: NextFunction) => {
    authenticate(req, res, next);
  },
  async (req: Request, res: Response) => {
    await getPostById(req, res);
  }
);


/**
 * @swagger
 * /post/{postId}:
 *   put:
 *     summary: Update a post by post id
 *     tags: [Post]
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         description: Post ID
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               caption:
 *                 type: string
 *               media_url:
 *                 type: string
 *     responses:
 *       200:
 *         description: Post updated successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */

router.put(
  "/:id",
  (req: Request, res: Response, next: NextFunction) => {
    authenticate(req, res, next);
  },
  async (req: Request, res: Response) => {
    await updatePost(req, res);
  }
);

/**
 * @swagger
 * /post/{postId}:
 *   delete:
 *     summary: Delete a post by post id
 *     tags: [Post]
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         description: Post ID
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Post deleted successfully
 *       500:
 *         description: Internal server error
 */

router.delete(
  "/:postId",
  (req: Request, res: Response, next: NextFunction) => {
    authenticate(req, res, next);
  },
  async (req: Request, res: Response) => {
    await getPostByUserId(req, res);
  }
);
export default router;