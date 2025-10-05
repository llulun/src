# QZone Praise Automator 浏览器扩展

## 简介

QQ空间自动点赞工具，浏览器扩展版，支持自动点赞、过滤、配置面板、状态栏、日志、统计、多账号、通知、暂停/恢复、测试模式等。

- UI：React + Tailwind CSS，响应式设计，主题切换，现代美观
- 架构：Vite 构建，模块化，TypeScript 可选
- 安全：Manifest V3，权限最小化，chrome.storage
- 兼容：Chrome/Edge

## 目录结构

```
assets/           # 图标文件
src/
  background.js   # 后台脚本
  content.js      # 内容脚本
  manifest.json   # 扩展清单
  popup/
    index.html    # 配置面板入口
    Popup.jsx     # 配置面板 React 组件
package.json      # 依赖与脚本
vite.config.js    # 构建配置
postcss.config.js # CSS 处理
```

## 安装与开发

1. 安装依赖：
   ```bash
   npm install
   ```
2. 开发调试：
   ```bash
   npm run dev
   ```
3. 构建生产包：
   ```bash
   npm run build
   ```
4. 加载扩展：Chrome 扩展管理 > 加载已解压的扩展 > 选择 dist/

## 图标

请在 assets/ 目录下准备 icon16.png、icon48.png、icon128.png。

## 发布

打包 dist/ 目录为 zip，上传 Chrome Web Store。

## 依赖

- react, react-dom
- chart.js, react-chartjs-2
- tailwindcss, postcss, autoprefixer
- @vitejs/plugin-react
- @types/chrome (可选)

## 其他

如需自定义参数或功能，请修改 src/popup/Popup.jsx 和 src/content.js。