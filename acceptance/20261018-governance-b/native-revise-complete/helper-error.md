# 本阶段辅助准备错误

命令：`node acceptance/20261018-governance-b/native-revise-complete/read-more.mjs`。

首次本阶段helper输入行：

```js
const s=state(branch);
bundle('effective-frozen-inputs',branch,Object.values(s.sources.versions).map(v=>v.object_ref));
```

Node v24.15.0原异常：

```text
TypeError: Cannot read properties of undefined (reading 'versions')
    at .../native-revise-complete/read-more.mjs:4:65
```

实际state字段是`source_versions`，不是`sources.versions`。失败在参数求值阶段，没有执行bundle、产品CLI或作品写入。后续只改本阶段helper字段，再继续。没有改`.writer/state.json`或产品协议；不是产品缺陷或产品调用错误。
