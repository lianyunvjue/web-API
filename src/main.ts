import app from './app';
import { APP_PORT } from './app/app.config';
import { connection } from './app/database/mysql';

app.listen(APP_PORT, () => {
  console.log('服务已启动');
});

/**
 * 测试使用数据服务连接
 */
connection.connect((error) => {
  if (error) {
    console.log('opp,连接服务器失败:', error.message);
    return;
  }

  console.log('ohyear,连接数据服务成功~~');
});
