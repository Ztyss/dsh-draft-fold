# dsh-draft-fold

`@ztyss/dsh-draft-fold` —— 输入草稿自动折叠：当发送框草稿超过阈值（默认 2000 字符）时，收起原输入区并展示一张附件式摘要卡，不改变 DSH 的草稿状态、消息格式与发送路径。

## 安装

```bash
dsh plugin add --profile web "github:Ztyss/dsh-draft-fold"
```

- profile 依赖：`"@ztyss/dsh-draft-fold": "github:Ztyss/dsh-draft-fold#<commit>"`
- 预构建产物直接安装，无构建脚本、无 prepare

## 配置

| 键 | 默认 | 说明 |
|---|---|---|
| threshold | 2000 | 触发折叠的草稿字符数 |
| previewChars | 120 | 摘要卡预览长度 |

## 改动

直接改 `lib/`（改完 `node --check` 验证），commit/push 后在 profile 重跑 `pnpm install` 重启生效。

License: MIT（见 LICENSE）。
