# Windows源码检出

普通使用请下载[专门发行包](https://github.com/dibyang/ai-writer/releases/tag/v0.8.0)中的ai-writer ZIP。GitHub自动生成的Source code归档来自完整标签树，含历史验收数据；其中aux等Windows保留路径会使常规检出或解压失败。这些封存证据保留原始字节。

Windows维护者可先不展开文件，再稀疏检出产品输入。以下命令只对新建仓库设置索引兼容选项；不展开历史验收目录，也不改本机全局配置。目标ai-writer-dev必须是新目录。

```powershell
git clone --no-checkout -c core.protectNTFS=false -c core.longpaths=true https://github.com/dibyang/ai-writer.git ai-writer-dev
cd ai-writer-dev
git sparse-checkout set --no-cone '/*' '!/acceptance/' '!/works/'
git checkout codex/initial
npm test
npm run doctor
npm run test:engine
```

同样的稀疏输入在Windows与Ubuntu的Node20/24四组CI运行。Linux可检出完整历史记录；在Windows不要对该工作树执行sparse-checkout disable，也不要在本机全局关闭保护以展开历史保留路径。源码测试使用tests/fixtures和随源码保存的公开参考索引，不依赖被排除的作品及验收目录。
