import { Request, Response, NextFunction, Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import { getAllPostsByUser, createPost, getPostByUserId } from "../controllers/post.controller";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Post
 *   description: Post endpoints
 */

/**
 * @swagger
 * /post:
 *   get:
 *     summary: Get all posts by user
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
    await getAllPostsByUser(req, res);
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
)

/**
 * @swagger
 * /post/{userId}:
 *  get:
 *   summary: Get all posts by user id
 *   tags: [Post]
 *   parameters:
 *    - in: path
 *      name: userId
 *      required: true
 *      description: User ID
 *      schema:
 *       type: string
 *       format: uuid
 *   responses:
 *    200:
 *     description: Posts fetched successfully 
 *     content:
 *      application/json:
 *     schema:
 *      type: array
 *      items:
 *       type: object
 *       properties:
 *        id:
 *         type: string
 *         format: uuid
 *        caption:
 *         type: string
 *        media_url:
 *         type: string 
 *        ownerId: 
 *         type: string
 *         format: uuid
 *    500:
 *     description: Internal server error
 *
 */

router.get(
  "/:userId",
  (req: Request, res: Response, next: NextFunction) => {
    authenticate(req, res, next);
  },
  async (req: Request, res: Response) => {
    await getPostByUserId(req, res);
  }
);