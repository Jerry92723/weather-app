# 学林阁 · 大学学习工作台

面向大学生的学期制学习知识库与 Pre 工作台。每门课一座独立书斋：先立知识框架，每周沉淀课件与教材，临到老师布置演讲时，一键调用全部资料生成提纲与讲稿。

## 功能

- **课程知识库**：一门课一个独立知识库，含课程信息、色标标识、简介。
- **知识框架**：以「章节 → 知识点」树状结构先搭建课程骨架，后续资料与笔记都挂载到对应节点。
- **周度沉淀**：每周上传课件 / 教材 / 笔记，可标记周次并挂载到知识点。
- **资料库**：跨课程检索全部沉淀，按课程、类型、周次、关键词筛选。
- **Pre 工作台**：挑选要引用的资料 → 自动生成演讲提纲与讲稿草稿 → 导出材料引用清单（.md）与提纲 / 讲稿（.txt）。
- **学院学术风**：纸张米白背景、墨绿主色、衬线标题，专注耐看。

## 快速开始

### 环境要求

- Node.js 18.18+（推荐 20+）
- npm

### 安装与运行

```bash
# 1. 安装依赖（会自动生成 Prisma Client）
npm install

# 2. 初始化本地数据库（首次运行必须执行一次）
npx prisma db push

# 3. 启动
npm run dev          # 开发模式，访问 http://localhost:3000
# 或生产模式
# npm run build && npm start
```

数据库文件保存在 `prisma/dev.db`，上传的课件 / 教材保存在 `data/uploads/`。二者都在项目目录内，**请定期备份这两个位置**（或整个项目文件夹），即可长期沉淀不丢失。

### 切换到真正的云端数据库（可选）

本项目通过 Prisma 访问数据库，默认使用 SQLite 本地文件。若想实现多设备云同步，只需：

1. 在 [Vercel](https://vercel.com) / [Neon](https://neon.tech) / [Supabase](https://supabase.com) 创建托管 PostgreSQL 数据库；
2. 修改 `prisma/schema.prisma` 中 `datasource db` 的 `provider` 为 `postgresql`；
3. 将 `.env` 中的 `DATABASE_URL` 改为云端连接串；
4. 重新 `npx prisma db push`。

业务代码无需任何改动。

## 目录结构

```
study-hub/
├── prisma/
│   └── schema.prisma        # 数据模型（课程/知识点/资料/笔记/Pre）
├── data/uploads/            # 上传的课件、教材等文件
├── src/
│   ├── app/
│   │   ├── page.tsx             # 学园总览 Dashboard
│   │   ├── courses/page.tsx     # 课程知识库总览
│   │   ├── courses/[id]/page.tsx# 课程详情（框架树+上传+笔记）
│   │   ├── materials/page.tsx   # 资料库（跨课程筛选）
│   │   ├── prep/page.tsx        # Pre 工作台
│   │   └── api/                 # 后端接口
│   ├── components/          # 布局、课程、资料、Pre、UI 组件
│   ├── lib/                 # Prisma 客户端、上传、工具函数
│   └── app/globals.css      # 学院学术风设计令牌
└── package.json
```

## 技术栈

- **框架**：Next.js 15 (App Router) + React 19
- **样式**：Tailwind CSS v4 + 自定义学院风 Design Tokens
- **数据库**：Prisma + SQLite（可切云端 PostgreSQL）
- **文件存储**：本地 `data/uploads` 目录
