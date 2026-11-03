# 团队任务看板 · Team Kanban Board

一个用于管理小组项目进度的极简看板应用：把任务写在卡片上，在「待办 / 进行中 / 已完成」三列之间拖动，就能看清谁在做什么、卡在哪一步。

本项目是《软件工程》课程「使用 Git 和 Pull Request 协作开发」分组作业的产物，同时用于演练 **Fork + Pull Request** 团队协作流程。

## 功能

- 新建任务（标题、描述、优先级）
- 删除任务（二次确认，避免误删）
- 拖拽任务卡片，在待办 / 进行中 / 已完成之间移动
- 按优先级筛选、顶部实时统计任务数量
- 数据保存在浏览器 localStorage 中，刷新、关闭页面后不丢失

## 技术栈

| 层次 | 选型 | 说明 |
| --- | --- | --- |
| 结构 | 原生 HTML5 | 无框架，语义化标签 |
| 样式 | 原生 CSS3 | CSS 变量 + Grid 布局 |
| 逻辑 | 原生 JavaScript (ES5+) | 模块化 IIFE，事件委托 |
| 存储 | localStorage | 无需后端与数据库 |
| 版本控制 | Git + GitHub | Fork / Pull Request 协作 |

## 目录结构

```
team-kanban-board/
├── index.html          # 页面结构：标题栏 + 三列看板 + 新建任务弹窗
├── css/
│   └── style.css       # 全部样式（布局、卡片、弹窗、拖拽状态）
├── js/
│   ├── store.js        # 数据层：localStorage 读写与任务增删改查
│   ├── drag.js         # 拖拽模块：HTML5 Drag and Drop
│   └── app.js          # 应用主逻辑：渲染、新建、删除
└── README.md
```

## 运行方式

无需安装任何依赖，两种方式任选：

1. 直接双击 `index.html`，用浏览器打开；
2. 或者在本目录起一个静态服务器（推荐，避免个别浏览器的本地文件限制）：

```bash
python -m http.server 8000
# 然后访问 http://localhost:8000
```

## 协作流程（Fork + Pull Request）

本仓库是项目负责人创建的**原始仓库**（upstream）。所有成员按下面的流程提交代码，**任何人都不直接向 main 分支 push**。

| 步骤 | 操作 | 执行人 |
| --- | --- | --- |
| 1 | 在 GitHub 上 Fork 本仓库到自己的账号 | 全体成员 |
| 2 | 克隆自己 Fork 后的仓库，并添加上游仓库 | 全体成员 |
| 3 | 从最新的 upstream/main 切出功能分支开发 | 全体成员 |
| 4 | 提交并推送到自己的 fork，向本仓库发起 PR | 全体成员 |
| 5 | 交叉代码审查，提出修改意见 | 除作者外全体 |
| 6 | 审核通过后用 Squash and merge 合并，删除功能分支 | 项目负责人 |

### 分支命名规范

| 前缀 | 用途 | 示例 |
| --- | --- | --- |
| `feature/` | 新功能 | `feature/task-crud` |
| `fix/` | 缺陷修复 | `fix/empty-state` |
| `docs/` | 文档 | `docs/readme` |

### 提交信息规范（Conventional Commits）

```
<type>(<scope>): <subject>
```

- `feat` 新功能、`fix` 修复、`docs` 文档、`style` 样式、`refactor` 重构、`chore` 杂项
- 示例：`feat(task): 支持新建任务并写入 localStorage`

## 成员与分工

| 成员 | 角色 | 负责内容 |
| --- | --- | --- |
| 武彩婷 | 项目负责人 | 创建原始仓库、配置分支保护、审查并合并 PR、协调进度；兼做优先级筛选功能 |
| 成员A | 前端开发 A | 页面布局与任务卡片展示（`index.html`、`css/style.css`） |
| 成员B | 前端开发 B | 新建任务、删除任务（`js/store.js`、`js/app.js`） |
| 成员C | 前端开发 C | 拖拽任务卡片更新状态（`js/drag.js`） |

## 分支保护

`main` 分支已开启保护：禁止直接 push，必须通过 PR 合入，且至少 1 人审查通过（Approve）后才能合并。
本项目由项目负责人统一执行 Squash and merge。

## 常见问题

- **打开页面空白？** 检查浏览器控制台，确认 `js/` 下三个脚本都已加载（顺序为 store → drag → app）。
- **拖拽无效？** 部分浏览器需要页面通过 http 访问（见「运行方式」第 2 种），本地 `file://` 打开时个别版本会限制拖拽。
- **数据串了？** 数据存在 localStorage 的 `team-kanban-board.tasks.v1` 键下，清除该键即可重置。
