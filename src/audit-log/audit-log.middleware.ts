import { Request, Response, NextFunction } from 'express';

/**
 * 审核日志守卫
 */
export const auditLogGuard = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  // 准备用户
  const { id: userId, name: userName } = request.user;

  //准备数据
  const { resourceId, resourceType, note, status } = request.body;

  //验证资源类型
  const isValidResourceType = ['post', 'comment'].includes(resourceType);

  if (!isValidResourceType) {
    return next(new Error('BAD_REQUEUST'));
  }

  //下一步
  next();
};
