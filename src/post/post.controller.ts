import { Request, Response, NextFunction } from 'express';
import _ from 'lodash';
import {
  getPosts,
  createPost,
  updatePost,
  deletePost,
  createPostTag,
  postHasTag,
  deletePostTag,
  getPostsTotalCount,
  getPostById,
  PostStatus,
} from './post.service';
import { TagModel } from '../tag/tag.model';
import { getTagByName, createTag } from '../tag/tag.service';
import { deletePostFiles, getPostFiles } from '../file/file.service';
import { PostModel } from './post.model';
import { getAuditLogByResource } from '../audit-log/audit-log.service';
import { AuditLogStatus } from '../audit-log/audit-log.model';

/**
 * 内容列表
 */
export const index = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  // 解构查询符
  const { status = '' as any, auditStatus = '' as any } = request.query;

  try {
    // 统计内容数量
    const toatlCount = await getPostsTotalCount({
      filter: request.filter,
      status,
      auditStatus,
    });

    //设置响应头部
    response.header('X-Total-Count', toatlCount);
  } catch (error) {
    next(error);
  }

  try {
    const posts = await getPosts({
      sort: request.sort,
      filter: request.filter,
      pagination: request.pagination,
      currentUser: request.user,
      status,
      auditStatus,
    });
    response.send(posts);
  } catch (error) {
    next(error);
  }
};

/**
 * 创建内容
 */
export const store = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  //准备数据
  const { title, content, status = PostStatus.draft } = request.body;
  const { id: userId } = request.user;

  const post: PostModel = {
    title,
    content,
    userId,
    status,
  };

  // 创建内容
  try {
    const data = await createPost(post);
    response.status(201).send(data);
  } catch (error) {
    next(error);
  }
};

/**
 * 更新内容
 */
export const update = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  //获取内容ID
  const { postId } = request.params;

  //准备数据
  const post = _.pick(request.body, ['title', 'content', 'status']);

  //更新
  try {
    const data = await updatePost(parseInt(postId, 10), post);
    response.send(data);
  } catch (error) {
    next(error);
  }
};

/**
 * 删除内容
 */
export const destory = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  //获取内容ID
  const { postId } = request.params;

  //删除内容
  try {
    const files = await getPostFiles(parseInt(postId, 10));

    if (files.length) {
      await deletePostFiles(files);
    }

    const data = await deletePost(parseInt(postId, 10));
    response.send(data);
  } catch (error) {
    next(error);
  }
};

/**
 * 添加内容标签
 */
export const storePostTag = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  //准备数据
  const { postId } = request.params;
  const { name } = request.body;

  let tag: TagModel;

  //查找标签
  try {
    tag = await getTagByName(name);
  } catch (error) {
    return next(error);
  }

  //找到标签,验证内容标签
  if (tag) {
    try {
      const postTag = await postHasTag(parseInt(postId, 10), tag.id);
      if (postTag) return next(new Error('POST_ALREADY_HAS_THIS_TAG'));
    } catch (error) {
      return next(error);
    }
  }

  // 没找到标签, 创建这个标签
  if (!tag) {
    try {
      const data = await createTag({ name });
      tag = { id: data.insertId };
    } catch (error) {
      return next(error);
    }
  }

  // 给内容打上标签
  try {
    await createPostTag(parseInt(postId, 10), tag.id);
    response.sendStatus(201);
  } catch (error) {
    return next(error);
  }
};

/**
 * 移除内容标签
 */
export const destoryPostTag = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  //准备数据
  const { postId } = request.params;
  const { tagId } = request.body;

  // 移除内容标签
  try {
    await deletePostTag(parseInt(postId, 10), tagId);
    response.sendStatus(200);
  } catch (error) {
    return next(error);
  }
};

/**
 * 单个内容
 */
export const show = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  // 准备数据
  const { postId } = request.params;
  const { user: currentUser } = request;

  //调取内容
  try {
    const post = await getPostById(parseInt(postId, 10), {
      currentUser,
    });

    //审核日志
    const [auditLog] = await getAuditLogByResource({
      resourceId: parseInt(postId, 10),
      resourceType: 'post',
    });

    //检查权限
    const ownPost = post.user.id === currentUser.id;
    const isAdmin = currentUser.id === 1;
    const isPublished = post.status === PostStatus.published;
    const isApproved = auditLog && auditLog.status === AuditLogStatus.approved;
    const canAccess = isAdmin || ownPost || (isPublished && isApproved);

    if (!canAccess) {
      throw new Error('FORBIDDEN');
    }
    // 做出响应
    response.send(post);
  } catch (error) {
    next(error);
  }
};
