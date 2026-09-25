# dsh-draft-fold

`@ztyss/dsh-draft-fold` —— 输入草稿自动折叠：当发送框草稿超过阈值时，收起原输入区并展示一张附件式摘要卡，不改变 DSH 的草稿状态、消息格式与发送路径。

## 安装

```bash
dsh plugin add --profile web "github:Ztyss/dsh-draft-fold"
```

- profile 依赖：`"@ztyss/dsh-draft-fold": "github:Ztyss/dsh-draft-fold#<commit>"`
- 预构建产物直接安装，无构建脚本、无 prepare

## 配置

折叠阈值走插件自有的持久设置文档，保存即对当前页签热生效，无需重启；字段级「恢复默认」回到内置默认：

- 入口：设置 → 插件 → **插件配置** → **草稿折叠**
- 折叠阈值（字符），默认 **300**
- 摘要预览长度（字符），默认 **120**

## 内核兼容性（0.3.0）

同一份产物双内核自适应，启动期零静态依赖设置服务（boot 门不再被 settingsScope 卡死）：

| 内核 | 设置来源 | 浏览器侧读取 | 设置页形态 |
|---|---|---|---|
| ≤0.1.5（settingsScope） | 显式 `settings.register("draft-fold")` | `ctx.settingsScope.bind()` | `settings.plugin.item` 卡 |
| 0.1.7+（Config 投影） | loader entry 的 `Config` 导出（volatile 字段，namespace == entry id） | `ctx.configForms.get(entryId)` | `settings.plugins.tab` 页 |

两个 defer 注入按内核二选一触发；服务都缺席时折叠功能以默认值运行（300/120），不崩、不阻塞加载。

## 开发

直接改 `lib/`（改完 `node --check` 验证），`npm install` 后 `npm test`（vitest，见 `tests/`；`tests/dual-kernel-wiring.test.js` 覆盖双内核 wiring）。

License: MIT（见 LICENSE）。
