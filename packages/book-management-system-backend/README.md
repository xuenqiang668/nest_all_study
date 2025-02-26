总结
这节我们实现了用户模块的登录、注册功能。

通过读写文件实现了数据存储，封装了一个动态模块，用到时候传入 path，然后模块内的 service 里会读写这个文件的内容，通过 JSON.parse、JSON.stringify 和对象互转。

通过 ValidationPipe + class-validator 实现了 dto 的校验。

然后实现了注册和登录的业务逻辑。

这样，用户模块的功能就完成了。

## link book
[source link](https://juejin.cn/book/7226988578700525605/section/7391332146377392164)