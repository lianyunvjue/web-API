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
import { accessLog } from '../access-log/access-log.middleware';

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
  accessLog({ action: 'getPosts', resourceType: 'post' }),
  postController.index,
);

/**
 * 创建内容
 */
router.post(
  '/posts',
  authGuard,
  validatePostStatus,
  accessLog({
    action: 'createPost',
    resourceType: 'post',
    payloadParam: 'body.title',
  }),
  postController.store,
);

/**
 * 更新内容
 */
router.patch(
  '/posts/:postId',
  authGuard,
  acessControl({ possession: true }),
  validatePostStatus,
  accessLog({
    action: 'updatePost',
    resourceType: 'post',
    payloadParam: 'postId',
  }),
  postController.update,
);

/**
 * 删除内容
 */
router.delete(
  '/posts/:postId',
  authGuard,
  acessControl({ possession: true }),
  accessLog({
    action: 'deletePost',
    resourceType: 'post',
    payloadParam: 'postId',
  }),
  postController.destory,
);

/**
 * 添加内容标签
 */
router.post(
  '/posts/:postId/tag',
  authGuard,
  acessControl({ possession: true }),
  accessLog({
    action: 'createPostTag',
    resourceType: 'post',
    resourceParamName: 'postId',
    payloadParam: 'body.name',
  }),
  postController.storePostTag,
);

/**
 * 移除内容标签
 */
router.delete(
  '/posts/:postId/tag',
  authGuard,
  acessControl({ possession: true }),
  accessLog({
    action: 'deletePostTag',
    resourceType: 'post',
    resourceParamName: 'postId',
    payloadParam: 'body.tagId',
  }),
  postController.destoryPostTag,
);

/**
 * 单个内容
 */
router.get(
  '/posts/:postId',
  accessLog({
    action: 'getPostById',
    resourceType: 'post',
    resourceParamName: 'postId',
  }),
  postController.show,
);

/**
 * 导出路由
 */
export default router;
