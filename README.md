# node-blog

学习 Node.js 以及后端知识，本仓库是一个简单博客项目，packages 下存放着 web 端和 node 端代码仓库

- web：blog 前端页面仓库

  - 技术栈：采用 Vue3 + Vue Router + Pinia + Acro design UI
  - 功能点：
    - 文章：使用 bytemd 编辑器
    - 多级评论
    - 消息通知
    - 私信聊天
    - 关注功能

- service: blog 后端服务仓库
  - 技术栈：Koa + mongodb + redis
  - 知识点：
    - node 项目结构实践、中间件实践、错误处理机制、接口 CORS、XSS 处理、接口参数校验、gzip 相关压缩等
    - 登录验证：JWT、Redis Token 黑名单机制、双 Token 优化机制
    - 文章评论：实践文章以及评论系统的功能设计
    - 消息通知
    - 聊天私信：应用 WebSocket、Mongodb Change Stream机制
