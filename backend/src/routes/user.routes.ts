import { Request, Response, NextFunction, Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import { getUserById, getAllUsers } from "../controllers/user.controller";

const router = Router();

router.get(
  "/:id",
  (req: Request, res: Response, next: NextFunction) => {
    authenticate(req, res, next);
  },
  async (req: Request, res: Response) => {
    await getUserById(req, res);
  }
);

router.get(
  "/",
  async (req: Request, res: Response, next: NextFunction) => {
    authenticate(req, res, next);
  },
  async (req: Request, res: Response) => {
    await getAllUsers(req, res);
  }
);

export default router;