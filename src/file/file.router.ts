import express from 'express';
import { authGuard } from '../auth/auth.middleware';
import * as fileController from './file.controller';
import { fileInterceptor, fileProcessor } from './file.middleware';
import { accessLog } from '../access-log/access-log.middleware';
const router = express.Router();

/**
 * 上传文件
 */
router.post(
  '/files',
  authGuard,
  fileInterceptor,
  fileProcessor,
  accessLog({
    action: 'createFile',
    resourceType: 'file',
  }),
  fileController.store,
);

/**
 * 文件服务
 */
router.get(
  '/files/:fileId/serve',
  accessLog({
    action: 'getFileMetadata',
    resourceType: 'file',
    resourceParamName: 'fileId',
  }),
  fileController.serve,
);

/**
 * 文件信息
 */
router.get('/files/:fieId/metadata', fileController.metadata);

/**
 * 导出路由
 */
export default router;
