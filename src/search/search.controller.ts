import { Request, Response, NextFunction } from 'express';
import {
  searchTags,
  searchUsers,
  searchCameras,
  searchLens,
} from './search.service';

/**
 * 搜索标签
 */
export const tags = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  try {
    // 准备关键词
    const { name } = request.query;

    //查询标签
    const tags = await searchTags({ name });

    // 做出响应
    response.send(tags);
  } catch (error) {
    next(error);
  }
};

/**
 * 搜索用户
 */
export const users = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  try {
    // 准备关键词
    const { name } = request.query;

    //查询用户
    const users = await searchUsers({ name });

    // 做出响应
    response.send(users);
  } catch (error) {
    next(error);
  }
};

/**
 * 搜索相机
 */
export const cameras = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  try {
    // 准备关键词
    const { makeModel } = request.query;

    //查询相机
    const cameras = await searchCameras({ makeModel });

    // 做出响应
    response.send(cameras);
  } catch (error) {
    next(error);
  }
};

/**
 * 搜索相机
 */
export const lens = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  try {
    // 准备关键词
    const { makeModel } = request.query;

    //查询相机
    const lens = await searchLens({ makeModel });

    // 做出响应
    response.send(lens);
  } catch (error) {
    next(error);
  }
};
