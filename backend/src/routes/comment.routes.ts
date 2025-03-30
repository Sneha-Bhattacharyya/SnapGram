import express from 'express';
import {
createComment,
getAllCommentsByPost,
updateComment,
deleteComment,
} from '../controllers/comment.controller';
import { authenticate } from '../middleware/auth.middleware';
import { Request, Response, NextFunction } from 'express';

const router = express.Router();

router.post('/', 
    (req: Request, res: Response, next: NextFunction) => {
        authenticate(req, res, next);
    },
    async (req: Request, res: Response) => {
        await createComment(req, res);
    });

router.get('/', 
    (req: Request, res: Response, next: NextFunction) => {
        authenticate(req, res, next);
    },
    async (req: Request, res: Response) => {
        await getAllCommentsByPost(req, res);
    });

router.put('/:id',
    (req: Request, res: Response, next: NextFunction) => {
        authenticate(req, res, next);
    },
    async (req: Request, res: Response) => {
        await updateComment(req, res);
    });

router.delete('/:id', 
    (req: Request, res: Response, next: NextFunction) => {
        authenticate(req, res, next);
    },
    async (req: Request, res: Response) => {
        await deleteComment(req, res);
    }
);

export default router;