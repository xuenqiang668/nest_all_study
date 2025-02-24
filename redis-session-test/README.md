# 总结

session 是在服务端内存存储会话数据，通过 cookie 中的 session id 关联。

但它不支持分布式，换台机器就不行了。

jwt 是在客户端存储会话数据，所以天然支持分布式。

我们通过 redis 自己实现了分布式的 session。

我们使用的是 hash 的数据结构，封装了 RedisModule 来操作 Redis。

又封装了 SessionModule 来读写 redis 中的 session，以 sid_xxx 为 key。

之后在 ctronller 里就可以读取和设置 session 了，用起来和内置的传统 session 差不多。但是它是支持分布式的。

如果你想在分布式场景下用 session，就自己基于 redis 实现一个吧
