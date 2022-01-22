import express from 'express';
import * as postController from './post.controller';
import { authGuard, acessControl } from '../auth/auth.middleware';
import {
  sort,
  filter,
  paginate,
  validatePostStatus,
  modeSwitch,
} from './post.middleware';
import { POSTS_PER_PAGE } from '../app/app.config';

const router = express.Router();

/**
 * 内容列表
 */
router.get(
  '/posts',
  sort,
  filter,
  paginate(POSTS_PER_PAGE),
  validatePostStatus,
  modeSwitch,
  postController.index,
);

/**
 * 创建内容
 */
router.post('/posts', authGuard, validatePostStatus, postController.store);

/**
 * 更新内容
 */
router.patch(
  '/posts/:postId',
  authGuard,
  acessControl({ possession: true }),
  validatePostStatus,
  postController.update,
);

/**
 * 删除内容
 */
router.delete('/posts/:postId', postController.destory);

/**
 * 添加内容标签
 */
router.post(
  '/posts/:postId/tag',
  authGuard,
  acessControl({ possession: true }),
  postController.storePostTag,
);

/**
 * 移除内容标签
 */
router.delete(
  '/posts/:postId/tag',
  authGuard,
  acessControl({ possession: true }),
  postController.destoryPostTag,
);

/**
 * 单个内容
 */
router.get('/posts/:postId', postController.show);

/**
 * 导出路由
 */
export default router;
