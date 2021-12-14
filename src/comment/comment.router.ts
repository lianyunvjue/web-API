import express from 'express';
import { authGuard, acessControl } from '../auth/auth.middleware';
import * as commentController from './comment.controller';
import { filter } from './comment.middleware';
import { paginate } from '../post/post.middleware';
import { COMMENTS_PER_PAGE } from '../app/app.config';

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
 * 删除评论
 */
router.delete(
  '/comments/:commentId',
  authGuard,
  acessControl({ possession: true }),
  commentController.destroy,
);

/**
 * 评论列表
 */
router.get(
  '/comments',
  filter,
  paginate(COMMENTS_PER_PAGE),
  commentController.index,
);

/**
 * 回复列表
 */
router.get('/comments/:commentId/replies', commentController.indexReplies);

/**
 * 导出路由
 */
export default router;
