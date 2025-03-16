import { Request, Response, NextFunction, Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import { getAllPostsByUser, createPost } from "../controllers/post.controller";

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
  