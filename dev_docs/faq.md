## 移动端代码需要单独生成么

是的，需要单独生成，在桌面端后台选择功能页生成就可以。

## 为什么有的时候生成的代码接口访问错误

如果模块名是多个单词的大小写分隔，有时候接口地址会出错，一般情况下，模块的路径不会错，这个时候需要检查Controller的路径和Api路径是否一致。

找到common/api/模块分类/模块名/index.js，看看这里的page、list、info3个接口的大小写是否和后端一致。

## 为什么找不到对应的表单页面

如果不是直接后端指向app目录，而是自己拷贝代码，很容易丢文件，除了pages和common/api这两个目录的对应文件，还需要检查一下内容：

- 找到pages.json的路由部分，一般来说会有pages/分类/模块名/list和"pages/分类/模块名/container这两个路由
- 找到pages.json的easycom部分，这里是批量模块映射，表示模块目录和缩写的对应关系，需要和下一条一致
```
{
	"^sys-dev-(.*)": "@/pages/dev/$1/form.vue",
	"^sys-jianyi-(.*)": "@/pages/jianyi/$1/form.vue"
}
```
- 打开components/systemform/index，在上面的view加入对应的模块，如sys-dev-bizoutapply，对应的就是pages/dev/bizoutapply这个模块
- 使用hbuilder打开的浏览器是有缓存的，如果上述改动还是不能打开页面，需要在调试工具-网络中，选择禁用缓存

## 如何让表单支持流程关联

打开模块对应的list文件，在SimpleList上增加属性:schemaId="流程的schemaId"，此时列表的新建、详情会直接跳转到对应的流程页面。

这个ID可以在PC端新建流程时在URL里取到。