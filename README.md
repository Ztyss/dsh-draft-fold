# dsh-draft-fold

`@ztyss/dsh-draft-fold` —— 输入草稿自动折叠：当发送框草稿超过阈值时，收起原输入区并展示一张附件式摘要卡，不改变 DSH 的草稿状态、消息格式与发送路径。

## 安装

```bash
dsh plugin add --profile web "github:Ztyss/dsh-draft-fold"
```

- profile 依赖：`"@ztyss/dsh-draft-fold": "github:Ztyss/dsh-draft-fold#<commit>"`
- 预构建产物直接安装，无构建脚本、无 prepare

## 配置

0.2.0 起折叠阈值不再走 loader 条目配置（profile patch 层已废除），改为插件自有的持久设置文档：

- 入口：设置 → 插件 → **插件配置** → **草稿折叠**
- 折叠阈值（字符），默认 **300**
- 摘要预览长度（字符），默认 **120**
- 保存即对当前页签热生效，无需重启；字段级「恢复默认」回到内置默认

## 开发

直接改 `lib/`（改完 `node --check` 验证），`pnpm install --ignore-scripts` 后 `pnpm test`（vitest，见 `tests/`）。

License: MIT（见 LICENSE）。
