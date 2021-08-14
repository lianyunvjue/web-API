const express = require('express');
const app = express();
const port = 3000;

/**
 * 使用JSON中间件
 */
app.use(express.json());

app.listen(port, ()=>{
  console.log('服务已启动!');
})

app.get('/', (resquest, response) => {
  response.send('你好');
})

const data =[
  {
    id:1,
    title: '关山月',
    content:'明月出天山, 苍茫云海间',
  },
  {
    id:2,
    title: '望岳',
    content:'会当凌绝顶,一览众山小',
  },
  {
    id:3,
    title: '忆江南',
    content:'日出江花红胜火, 春来江水绿如蓝',
  }
];

app.get('/posts', (resquest, response) => {
  response.send(data);
})

app.get('/posts/:postId', (resquest, response) => {
  // 获取内容 ID
  const { postId } = resquest.params;

  // 查找具体内容
  const posts = data.filter(item => item.id == postId);

  // 做出响应
  response.send(posts[0])
});

/**
 * 创建内容
 */
app.post('/posts', (request, response) => {
  //获取请求里的数据
  const { content } = request.body;

  // 设置响应状态码
  response.status(201);

  // 输出请求头部数据
  console.log(request.headers['sing-along']);

  //设置响应头部数据
  response.set('Sing-Along', 'How I wonder what you are')

  // 做出响应
  response.send({
    message:`成功创建了内容:${content}`
  });
});