#Moreii-express

 - 基础配置      /core/configure.js
 - app开关     /core/applist.js
 - 数据库设置     /core/cinfig.js

##页面访问与ajax请求

ajax请求需在末尾追加**?ajax=true**,程序依靠**req.query.ajax==='true'**来区分请求类型。

跳转方法：引入config.js后使用**config.resError(req,res,descriptionForJson,redirectUrl);**

##模块的添加与命名

 - 英文名尽量为名字，全部小写
 - 模块信息添加至core/config.js
 - 模块控制台路径统一为： 模块路径/console

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
 - 后台作者统计页面。
  - 活跃度：本月文章+3，之前文章+1。

 更新进度：

 - 文章分页逻辑
 - 数据库模型优化

------

##Notice模块*

*系统必备模块* 主要负责承载消息业务。

 - 发送消息：*noticeModel.send(uid,name,from,content,type,link,callback)*

------

##Statistics模块*

*系统必备模块* 主要负责站点统计。

 - 记录UA，解析后记录用户操作系统、浏览器、设备等信息。
 - 基础ip记录。
 - 按访问模块归类。
 - 记录用户加载速度。

------
######更新列表

 - *消息盒子*
  - 显示样式优化
 - *blog模块*
  - 分享功能 ==
  - 更新模板
 - *statistics模块*
  - 数据结构设计
  - 前端基础代码
  - 后台统计面板 30%
 - *面料预览模块*(定制)
  - 数据结构设计 ==
  - 后端交互 ==
  - 前段交互 ==
 - 调整模块载入方式，增加模块中文名称。
 - 调整并统一后台样式。
