import express from 'express';
import { authGuard, acessControl } from '../auth/auth.middeware';
import * as commentController from './comment.controller';

const router = express.Router();

/**
 * 发表评论
 */
router.post('/comments', authGuard, commentController.store);

/**
 * 回复评论
 */
router.post(
  '/comments/:commentId/reply',
  authGuard,
  acessControl({ possession: true }),
  commentController.reply,
);

/**
 * 修改评论
 */
router.patch('/comments/:commentId', authGuard, commentController.update);

/**
 * 修改评论
 */
router.delete(
  '/comments/:commentId',
  authGuard,
  acessControl({ possession: true }),
  commentController.destroy,
);
/**
 * 导出路由
 */
export default router;
