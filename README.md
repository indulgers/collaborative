# Next.js + TanStack Router + Hocuspocus 项目

这是一个简化的 Next.js 项目，集成了 TanStack Router 和 Hocuspocus 实时协作功能。

## 功能特点

- ✅ **Next.js 15** - 最新的 React 全栈框架
- ✅ **React 19** - 最新的 React 版本
- ✅ **TanStack Router** - 类型安全的客户端路由
- ✅ **Hocuspocus** - 实时协作编辑
- ✅ **Tailwind CSS** - 实用优先的 CSS 框架
- ✅ **TypeScript** - 全面的类型支持
- ✅ **Y.js** - 协作数据结构

## 快速开始

### 1. 安装依赖

```bash
pnpm install
```

### 2. 启动开发服务器

```bash
pnpm dev
```

### 3. 启动 Hocuspocus 服务器（可选）

为了体验实时协作功能，需要启动 Hocuspocus 服务器：

```bash
npx @hocuspocus/server --port 1234
```

## 项目结构

```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # 根布局
│   ├── page.tsx           # 首页
│   └── api/               # API 路由
├── components/            # React 组件
│   ├── HomePage.tsx       # 首页组件
│   ├── HocuspocusDemo.tsx # Hocuspocus 演示
│   └── RouterDemo.tsx     # Router 演示
├── hooks/                 # 自定义 Hooks
├── store/                 # Zustand 状态管理
├── styles/                # 样式文件
├── types/                 # TypeScript 类型定义
└── constants/             # 常量定义
```

## 主要组件

### HocuspocusDemo
展示了如何使用 Hocuspocus 实现实时协作编辑功能。

### RouterDemo
演示了类似 TanStack Router 的客户端路由功能。

## 开发说明

### 环境要求
- Node.js >= 24.0.0
- pnpm >= 10.0.0

### 可用脚本

```bash
# 开发模式
pnpm dev

# 构建生产版本
pnpm build

# 启动生产服务器
pnpm start

# 代码检查
pnpm lint

# 代码格式化
pnpm format:fix

# 类型检查
pnpm typecheck
```

## 配置

### 环境变量

创建 `.env.local` 文件：

```env
NEXT_PUBLIC_HOCUSPOCUS_URL=ws://localhost:1234
```

## 部署

项目可以部署到任何支持 Next.js 的平台，如 Vercel、Netlify 等。

## 贡献

欢迎提交 Issues 和 Pull Requests！

## 许可证

ISC
