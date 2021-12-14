import express from 'express';
import * as userController from './user.controller';
import { validaUserData, hashPassword } from './user.middleware';

const router = express.Router();
/**
 * 创建用户
 */
router.post('/users', validaUserData, hashPassword, userController.store);

/**
 * 用户账户
 */
router.get('/users/:userId', userController.show);

/**
 * 导出路由
 */
export default router;
