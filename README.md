## structure copy helper

如果你希望快速建立与源代码项目一致结构的md文件便于对照源码做笔记，可以尝试采用本项目进行快速结构复制。
test
例如：
A.js => A.md

用法参考：
```js
// your js file
const StructureCopyHelper = require('/path/structure-copy-helper');
const params = {
  oriPath: '/path/oriPath', // 源代码仓库在你设备本地的绝对路径
  targetPath: '/path/targetPath', // 目标复制目录绝对路径
  ignoreFolders: [], // Array<string> 根据具体项目屏蔽目录列表，如果希望屏蔽example文件夹，则将'example'加入列表
}
const myCopyHelper = new StructureCopyHelper(params);
myCopyHelper.launch();
```