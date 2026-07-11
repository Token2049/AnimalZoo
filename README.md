# AnimalZoo

> 大学生期末项目 — 基于 Vue 3 + Vite 的动物信息展示与交互演示

AnimalZoo 是一个面向教学与演示的小型前端项目，使用 Vue 3 + Vite 开发，展示常见的前端开发技能：组件化、路由、状态管理（可选）、样式与响应式布局。该仓库适合作为课程期末项目演示或小组作业提交模板。

## 目录（Table of Contents）
- [演示](#演示)
- [项目简介](#项目简介)
- [主要特性](#主要特性)
- [技术栈](#技术栈)
- [安装与运行](#安装与运行)
- [项目结构](#项目结构)
- [开发说明](#开发说明)
- [部署](#部署)
- [测试](#测试)
- [项目成员 / 贡献者](#项目成员--贡献者)
- [项目展示材料](#项目展示材料)
- [许可](#许可)
- [联系方式](#联系方式)

## 演示
（可选）在此处放置演示链接、GitHub Pages 地址或短视频/屏幕录制链接。

示例：
- 演示站点（若已部署）：https://<your-username>.github.io/AnimalZoo
- 演示视频：链接到云盘或作业提交平台

## 项目简介

AnimalZoo 提供一个动物列表视图与详情页，支持按类别/关键字过滤、查看图片与动物信息。界面简洁、交互流畅，便于展示前端工程化流程和组件拆分。

该项目为大学课程期末作品，重点展示：
- 页面布局与响应式设计
- Vue 组件拆分、Props 与事件处理
- 路由与单页应用（SPA）导航
- 数据展示与简单过滤/搜索

## 主要特性

- 动物卡片列表与详情页
- 图片展示（本地或远程）
- 按类别/关键字筛选与排序
- 响应式布局（移动端/桌面端适配）
- 简单可扩展的组件目录结构

## 技术栈

- Vue 3（Composition API / <script setup>）
- Vite（构建工具）
- 可选：Vue Router、Pinia（或 Vuex）、Axios/Fetch
- HTML / CSS（可选 Tailwind / SCSS）

## 安装与运行

1. 克隆仓库：

   git clone https://github.com/Token2049/AnimalZoo.git
   cd AnimalZoo

2. 安装依赖（推荐 Node.js 18+）：

   npm install
   # 或者使用 yarn

3. 启动开发服务器：

   npm run dev

   打开浏览器并访问 http://localhost:5173（默认端口，Vite 会在终端显示）

4. 构建生产包：

   npm run build

5. 本地预览构建结果（可选）：

   npm run preview

## 项目结构（示例）

- public/ — 静态资源（图片、favicon）
- src/
  - assets/ — 图片与静态资源
  - components/ — 可复用组件（AnimalCard、FilterBar 等）
  - views/ — 页面级视图（Home、Detail）
  - router/ — 路由配置（如果使用 Vue Router）
  - store/ — 状态管理（可选）
  - App.vue
  - main.js / main.ts
- index.html — 入口模板
- vite.config.js — Vite 配置
- package.json — 依赖与脚本

> 如果你的实际代码结构与上面不同，请根据项目真实文件夹调整此部分说明。

## 开发说明

- 代码风格：使用一致的缩进与命名规范（建议开启 .editorconfig）
- 组件：每个组件放在独立文件夹，包含 .vue、样式与测试（如果有）
- 静态数据：测试阶段可将数据放在 src/assets/data 或直接在组件中模拟
- 图片资源：尽量放入 public/ 或 assets/ 并使用相对路径引用

## 部署

可将构建产物部署到 GitHub Pages、Netlify 或 Vercel：

- GitHub Pages：在构建后将 dist/ 下的文件发布到 gh-pages 分支或使用 actions 自动化部署
- Netlify / Vercel：连接仓库并设置构建命令为 `npm run build`，发布目录 `dist`

## 测试

该项目为前端展示型作业，测试为可选项。若添加测试框架（例如 Vitest 或 Jest），请在 package.json 中配置测试脚本：

- npm test

## 项目成员 / 贡献者

- 学生姓名 A（学号：XXXXXX） — 主要开发者
- 学生姓名 B（学号：YYYYYY） — UI 设计与文档

（请替换为实际项目成员信息，并在提交 PR 或最终报告中注明分工）

## 项目展示材料

为便于期末答辩，请准备以下材料并放置在仓库：
- 项目报告（report.pdf 或 README 附加章节）
- 演示视频或 GIF（放在 docs/ 或 public/demo/）
- 运行截图（放在 docs/screenshots/）

## 许可

本项目采用 MIT 许可，详见 LICENSE 文件。

## 联系方式

如需联系项目组，请通过仓库 Issues 或邮件联系：your-email@example.com

---

如果你愿意，我可以：
- 将 README 中的“项目成员”替换为你提供的真实名单和分工；
- 插入徽章（Build、License、Demo 链接）；
- 添加截图占位并在仓库中创建 docs/ 目录并上传示例图片（你需要上传图片或提供外部链接）。

是否现在把这个优化后的 README 写入仓库？