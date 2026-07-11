# AnimalZoo

> 大学生期末项目 — 基于 Vue 3 + Vite 的动物信息展示与交互演示

AnimalZoo 是一个面向教学与演示的小型前端项目，使用 Vue 3 + Vite 开发，展示常见的前端开发技能：组件化、路由、状态管理（可选）、样式与响应式布局。该仓库适合作为课程期末项目演示或小组作业提交模板。


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


## 开发说明

- 代码风格：使用一致的缩进与命名规范
- 组件：每个组件放在独立文件夹，包含 .vue、样式与测试
- 静态数据：测试阶段可将数据放在 src/assets/data 或直接在组件中模拟
- 图片资源：尽量放入 public/ 或 assets/ 并使用相对路径引用
