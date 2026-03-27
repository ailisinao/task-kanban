一个基于 Vue 3 开发的拖拽式任务管理工具，支持任务的创建、拖拽、删除和本地持久化。

**线上预览：** https://ailisinao.github.io/task-kanban/

## 功能特性

- 三列看板：待办 / 进行中 / 已完成
- 任务卡片：标题、描述、优先级（高/中/低）、截止日期
- 拖拽功能：在列间拖拽任务卡片，状态自动更新
- 新增任务：点击 + 按钮通过弹窗创建任务
- 删除任务：点击卡片右上角删除按钮
- 数据持久化：基于 localStorage，刷新页面数据不丢失
- 空状态提示：列为空时显示占位提示
- 响应式布局：支持移动端访问

## 技术栈

- **框架：** Vue 3 + Composition API
- **构建工具：** Vite
- **语言：** JavaScript
- **样式：** 纯 CSS，无 UI 库
- **数据存储：** localStorage
- **部署：** GitHub Actions + GitHub Pages

## 本地运行

```bash
# 克隆项目
git clone https://github.com/ailisinao/task-kanban.git
cd task-kanban

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

浏览器访问 http://localhost:5173

## 构建部署

```bash
# 打包生产版本
npm run build

# 本地预览打包结果
npm run preview
```

## 项目结构

```
src/
├── main.js                 # 入口文件
├── App.vue                 # 根组件，核心状态管理
├── style.css               # 全局样式
└── components/
    ├── TaskCard.vue        # 任务卡片组件
    ├── KanbanColumn.vue    # 看板列组件
    └── AddTaskModal.vue    # 新建任务弹窗
```

## 核心实现

**拖拽：** 基于 HTML5 原生 Drag & Drop API，`dragstart` 存储任务 ID，`drop` 触发跨列移动逻辑。

**持久化：** 使用 Vue 3 `watch` 深度监听数据变化，实时同步至 localStorage。

**组件通信：** 父子组件通过 `props` / `emit` 单向数据流通信，状态集中在 App.vue 管理。

## License

MIT
