import express from 'express';
import cors from 'cors';
import postRouter from '../post/post.router';
import userRouter from '../user/user.router';
import authRouter from '../auth/auth.router';
import fileRouter from '../file/file.router';
import tagRouter from '../tag/tag.router';
import commentRouter from '../comment/comment.router';
import avatarRouter from '../avatart/avatar.router';
import likeRouter from '../like/like.router';
import searchRouter from '../search/search.router';
import audiLogRouter from '../audit-log/audit-log.router';
import dashboardRouter from '../dashboard/dashboard.router';
import appRouter from './app.router';
import { defaultErrorHandler } from './app.middleware';
import { currentUser } from '../auth/auth.middleware';
import { ALLOW_ORIGIN } from './app.config';

/**
 * 创建应用
 */
const app = express();

/**
 * 跨域资源共享
 */
app.use(
  cors({
    origin: ALLOW_ORIGIN,
    exposedHeaders: 'X-Total-Count',
  }),
);

/**
 * 处理JSON
 */
app.use(express.json());

/**
 * 处理JSON
 */
app.use(currentUser);

/**
 * 路由
 */
app.use(
  postRouter,
  userRouter,
  authRouter,
  fileRouter,
  tagRouter,
  avatarRouter,
  likeRouter,
  searchRouter,
  commentRouter,
  appRouter,
  audiLogRouter,
  dashboardRouter,
);

/**
 * 默认异常处理器
 */
app.use(defaultErrorHandler);

/**
 * 导出应用
 */
export default app;
