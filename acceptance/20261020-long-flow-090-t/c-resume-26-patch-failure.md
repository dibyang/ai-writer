# 保存失败记录

发生于26最终正文读毕后、登记文件尚未创建前。apply_patch 返回：

apply_patch verification failed: invalid patch: The last line of the patch must be '*** End Patch'

原动作试图同一补丁创建交接/T-登记-0026.json及审查/T-0026-纲文回对.md；补丁校验失败，没有对作品状态或正文写入。修复为两次独立 apply_patch，成功后再运行 preview/record；不把这次失败计作产品保护失败。
