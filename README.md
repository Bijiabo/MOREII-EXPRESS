#Moreii-express

 - 基础配置      /core/configure.js
 - app开关     /core/applist.js
 - 数据库设置     /core/cinfig.js

##页面访问与ajax请求

ajax请求需在末尾追加**?ajax=true**,程序依靠**req.query.ajax==='true'**来区分请求类型。

跳转方法：引入config.js后使用**config.resError(req,res,descriptionForJson,redirectUrl);**

------

##class模块

 - 课程管理功能。
 - 后台针对用户的学生权限管理功能。
 - 教师分班管理功能。
 - 学生备注功能。
 - 成长记录。
 - 课程及学生成长优化建议。

------

##Blog模块

 - 关于update：新建修订副本，原版本不删除。
 - 内容可由团队成员修订，发布修订版。
 - 默认使用Markdown语法。
 - 企业模板内容定制。

 更新进度：

 - 文章分页逻辑
 - 数据库模型优化

------

##Notice模块*

*系统必备模块* 主要负责承载消息业务。

 - 发送消息：*noticeModel.send(uid,name,from,content,type,link,callback)*