
# AiDangJian UI

本项目基于 Next.js（App Router 架构）+ React + TypeScript + TailwindCSS + DaisyUI，支持现代化前后端分离开发。  
前端与后端通过 Next.js API 路由实现安全代理，适合内外网混合部署场景。  
**本项目采用 Next.js 新一代 App Router 架构，所有页面、布局和 API 路由均集中在 `app/` 目录下，结构清晰，易于维护。**

## 目录结构说明

- `app/`：新一代 Next.js 应用入口，包含所有页面、布局和 API 路由
  - `app/page.tsx`：根页面（首页）
  - `app/layout.tsx`：全局布局
  - `app/api/`：API 路由（仅在 Node.js 服务器端运行，不会被打包到前端）
    - `app/api/proxy/route.ts`：代理转发后端接口的 API 路由
  - 其他子目录：如 `app/dashboard/`、`app/xxx/`，分别对应不同的页面和子路由
- `components/`：可复用的 React 组件
- `lib/`：工具函数、服务端逻辑等
- `public/`：静态资源（如图片、favicon 等）
- `styles/`：全局样式文件
- 其他配置文件：如 `next.config.mjs`、`tailwind.config.js`、`postcss.config.js`、`tsconfig.json` 等

## 前后端代码区分

- `app/` 目录下的页面组件（如 `page.tsx`、`layout.tsx`）和 `components/` 下的组件，属于前端代码，会被打包到浏览器端执行。
- `app/api/` 目录下的所有文件（如 `app/api/proxy/route.ts`），属于后端（服务端）代码，只在 Node.js 服务器上运行，不会被打包到前端。

## 先决条件

1. 安装 [Node.js](https://nodejs.org/)
2. 全局安装 pnpm  
   ```bash
   npm install -g pnpm
   ```

## 启动和运行
pnpm  install  
pnpm  run dev
