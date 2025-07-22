import { Request, Response, NextFunction, Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import {
  getUserById,
  getAllUsers,
  likeComment,
  likePost,
  updateUser,
  deleteSavedPost,
  deleteLikePost,
  savePost,
} from "../controllers/user.controller";
import { getPostByUserId } from "../controllers/post.controller";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: User
 *   description: User endpoints
 */

/**
 * @swagger
 * /user/{id}:
 *   get:
 *     summary: Get user details by ID
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: UUID of the user to fetch
 *     responses:
 *       200:
 *         description: User fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   format: uuid
 *                 username:
 *                   type: string
 *                 email:
 *                   type: string
 *                 name:
 *                   type: string
 *                 bio:
 *                   type: string
 *                 phone_number:
 *                   type: string
 *                 dp_url:
 *                   type: string
 *       500:
 *         description: Internal server error
 */
router.get(
  "/:id",
  (req: Request, res: Response, next: NextFunction) => {
    authenticate(req, res, next);
  },
  async (req: Request, res: Response) => {
    await getUserById(req, res);
  }
);

/**
 * @swagger
 * /user:
 *   get:
 *     summary: Register a new user
 *     tags: [User]
 *     responses:
 *       200:
 *         description: Users fetched successfully
 *         content:
 *          application/json:
 *           schema:
 *            type: array
 *            items:
 *             type: object
 *             properties:
 *              id:
 *               type: integer
 *              username:
 *               type: string
 *              email:
 *               type: string
 *              name:
 *               type: string
 *              bio:
 *               type: string
 *              phone_number:
 *               type: string
 *              dp_url:
 *               type: string
 *
 *       500:
 *         description: Internal server error
 */
router.get(
  "/",
  async (req: Request, res: Response, next: NextFunction) => {
    authenticate(req, res, next);
  },
  async (req: Request, res: Response) => {
    await getAllUsers(req, res);
  }
);

/**
 * @swagger
 * /user/like/comment:
 *   post:
 *     summary: Like a comment
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 format: uuid
 *               userId:
 *                 type: string
 *                 format: uuid
 *     responses:
 *       200:
 *         description: Comment liked successfully
 *       404:
 *         description: Comment not found
 *       500:
 *         description: Internal server error
 */
router.post(
  "/like/comment",
  (req: Request, res: Response, next: NextFunction) => {
    authenticate(req, res, next);
  },
  async (req: Request, res: Response) => {
    await likeComment(req, res);
  }
);

/**
 * @swagger
 * /user/like/post:
 *   post:
 *     summary: Like a post
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 format: uuid
 *               userId:
 *                 type: string
 *                 format: uuid
 *     responses:
 *       200:
 *         description: Post liked successfully
 *       404:
 *         description: Post not found
 *       500:
 *         description: Internal server error
 */
router.post(
  "/like/post",
  (req: Request, res: Response, next: NextFunction) => {
    authenticate(req, res, next);
  },
  async (req: Request, res: Response) => {
    await likePost(req, res);
  }
);

/**
 * @swagger
 * /user/save/post:
 *   post:
 *     summary: Like a post
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 format: uuid
 *               userId:
 *                 type: string
 *                 format: uuid
 *     responses:
 *       200:
 *         description: Post liked successfully
 *       404:
 *         description: Post not found
 *       500:
 *         description: Internal server error
 */
router.post(
  "/save/post",
  (req: Request, res: Response, next: NextFunction) => {
    authenticate(req, res, next);
  },
  async (req: Request, res: Response) => {
    await savePost(req, res);
  }
);

/**
 * @swagger
 * /user:
 *   put:
 *     summary: Update user details
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 format: uuid
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               name:
 *                 type: string
 *               bio:
 *                 type: string
 *               phone_number:
 *                 type: string
 *               dp_url:
 *                 type: string
 *     responses:
 *       200:
 *         description: User updated successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */

router.put(
  "/",
  (req: Request, res: Response, next: NextFunction) => {
    authenticate(req, res, next);
  },
  async (req: Request, res: Response) => {
    await updateUser(req, res);
  }
);

/**
 * @swagger
 * /user/unsave/post:
 *   post:
 *     summary: Unsave a post
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 format: uuid
 *               userId:
 *                 type: string
 *                 format: uuid
 *     responses:
 *       200:
 *         description: Post unsaved successfully
 *       404:
 *         description: Post not found
 *       500:
 *         description: Internal server error
 */

router.post(
  "/unsave/post",
  (req: Request, res: Response, next: NextFunction) => {
    authenticate(req, res, next);
  },
  async (req: Request, res: Response) => {
    await deleteSavedPost(req, res);
  }
);

/**
 * @swagger
 * /user/unlike/post:
 *   post:
 *     summary: Unlike a post
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 format: uuid
 *               userId:
 *                 type: string
 *                 format: uuid
 *     responses:
 *       200:
 *         description: Post unliked successfully
 *       404:
 *         description: Post not found
 *       500:
 *         description: Internal server error 
 */

router.post(
  "/unlike/post",
  (req: Request, res: Response, next: NextFunction) => {
    authenticate(req, res, next);
  }
  , async (req: Request, res: Response) => {
    await deleteLikePost(req, res);
  }
);

router.get(
  "/:id/posts",
  (req: Request, res: Response, next: NextFunction) => {
    authenticate(req, res, next);
  },
  async (req: Request, res: Response) => {
    await getPostByUserId(req, res);
  }
);

export default router;
