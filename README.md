## WEB SERVER

用Vue做前端, Node做服务端, Socket.io 做实时服务,用MySQL提供数据服务.

![image-20210813001453023](C:\Users\mi\AppData\Roaming\Typora\typora-user-images\image-20210813001453023.png)

### 接口

------

调试微信登录接口,使用支付宝与微信支付提供的支付接口.

![image-20210813001629137](C:\Users\mi\AppData\Roaming\Typora\typora-user-images\image-20210813001629137.png)

### 服务

------

熟悉Linux系统,在阿里云部署应用的生产环境,用Ngingx做反向代理, Let's Encrypt签发SSL证书.

![image-20210813001846904](C:\Users\mi\AppData\Roaming\Typora\typora-user-images\image-20210813001846904.png)

## 生成密钥与公钥
```
cd config
oppenssl
genrsa -out private.key 4096
rsa -in private.key -pubout -out public.key
exit
```

