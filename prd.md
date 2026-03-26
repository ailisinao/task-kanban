SmartWorkflow 任务看板系统 - 需求文档
1. 项目概述本项目是一个基于 Vue 3 开发的轻量级任务管理工具。通过直观的“看板”模式，帮助用户通过拖拽交互来管理任务的生命周期（待处理 -> 进行中 -> 已完成），解决传统列表式管理不直观的问题。
2. 核心功能需求
2.1 看板布局 (Board Layout)多列容器： 界面水平排列三个任务列：待处理 (Todo)、进行中 (Doing)、已完成 (Done)。响应式适配： 在不同屏幕宽度下，任务列应保持等宽或自动换行。空状态提示： 当某一列没有任务时，显示“暂无任务”的占位文字。
2.2 任务卡片交互 (Task Interaction)跨列拖拽： 用户可以通过鼠标抓取卡片，在三个列之间自由移动。逻辑要求： 拖拽释放后，该任务的状态（Status）需自动更新。新增任务： 点击每列顶部的“+”号，弹出对话框输入任务标题和详情。任务编辑/删除： 点击卡片上的“详情”进入编辑模式，或点击“删除”图标移除任务。优先级标识： 任务支持设置“紧急”、“普通”、“暂无”，并在卡片左侧显示不同颜色条。
2.3 数据持久化 (Data Persistence)本地存储： 所有任务操作（新增、移动、删除）需实时同步至 localStorage。状态恢复： 用户刷新浏览器后，看板应恢复至上次关闭时的排列状态。
3. 技术实现要点 (面试重点)功能模块技术选型实现逻辑拖拽核心vuedraggable基于 Sortable.js，通过 v-model 直接绑定 Pinia 中的数组。状态管理Pinia定义 useTaskStore，通过 actions 处理跨列移动逻辑。UI 组件Element Plus使用 el-card 展示任务，el-dialog 处理新增/编辑。数据同步watch 深度监听监听任务数组变化，触发 localStorage.setItem。
4. 非功能性需求流畅度： 拖拽过程不能有明显的卡顿，FPS 保持在 60 左右。代码规范： 严格使用 JavaScript，采用 Composition API 编写，逻辑抽离为 Hooks。视觉风格： 采用简约的扁平化设计，使用 Element Plus 的默认色彩体系。
5. 任务数据结构 (Schema)这是给 Cursor 读的核心结构，确保代码生成时字段一致：JavaScript{
  id: "uuid-123",        // 唯一标识
  title: "设计 PRD",      // 任务标题
  content: "完成 Vue3 看板的需求文档编写", // 详情
  status: "todo",        // 状态: todo, doing, done
  priority: "high",      // 优先级: high, medium, low
  createTime: "2026-03-26"