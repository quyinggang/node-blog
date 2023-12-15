# node-blog
学习Node.js以及后端知识，本仓库是一个简单博客项目，packages下存放着web端和node端代码仓库

- web：blog前端页面仓库
  - 技术栈：采用Vue3 + Vue Router + Pinia + Acro design UI
  - 功能点：
    - 文章：使用bytemd编辑器
    - 多级评论
    - 消息通知
    - 私信聊天
    - 关注功能


- service: blog后端服务仓库
  - 技术栈：Koa + mongodb + redis
  - 知识点：
    - node项目结构实践、中间件实践、错误处理机制、接口CORS、XSS处理、接口参数校验、gzip相关压缩等
    - 登录验证：JWT、Redis Token黑名单机制、双Token优化机制
    - 文章评论：实践文章以及评论系统的功能设计
    - 消息通知
    - 聊天私信：应用WebSocket
