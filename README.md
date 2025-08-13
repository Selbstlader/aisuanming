# 天机算命 - 传统八字命理分析平台

一个基于传统八字理论和真太阳时计算的专业命理分析平台，融合AI智能技术，为用户提供精准的命运解读和人生指导。

## ✨ 项目特色

- 🎯 **精准计算**: 基于真太阳时的精确八字排盘
- 🤖 **AI智能**: 结合DeepSeek API的智能命理分析
- 🎨 **古风设计**: 深紫色+金色的传统美学界面
- 📱 **响应式**: 完美适配桌面端和移动端
- 🔐 **用户系统**: 完整的用户认证和数据管理
- 📊 **历史记录**: 保存和管理个人算命记录

## 🛠️ 技术栈

### 前端
- **Next.js 15** - React全栈框架
- **TypeScript** - 类型安全的JavaScript
- **Tailwind CSS** - 原子化CSS框架
- **Framer Motion** - 动画库
- **Lucide React** - 图标库

### 后端
- **Supabase** - 开源Firebase替代方案
- **PostgreSQL** - 关系型数据库
- **Row Level Security** - 数据安全保护

### AI集成
- **DeepSeek API** - 智能命理分析
- **自定义提示词** - 专业命理解读

### 开发工具
- **ESLint** - 代码质量检查
- **Prettier** - 代码格式化
- **pnpm** - 包管理器

## 🚀 快速开始

### 环境要求

- Node.js 18.0+
- pnpm 8.0+

### 安装步骤

1. **克隆项目**
```bash
git clone <repository-url>
cd tianji-suanming
```

2. **安装依赖**
```bash
pnpm install
```

3. **环境配置**
```bash
cp .env.example .env.local
```

编辑 `.env.local` 文件，配置以下环境变量：

```env
# Supabase 配置
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# DeepSeek API 配置
DEEPSEEK_API_KEY=your_deepseek_api_key
DEEPSEEK_API_URL=https://api.deepseek.com

# 应用配置
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

4. **启动开发服务器**
```bash
pnpm dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看应用。

## 📁 项目结构

```
src/
├── app/                    # Next.js App Router
│   ├── auth/              # 用户认证页面
│   ├── bazi/              # 八字排盘页面
│   ├── analysis/          # 命理分析页面
│   ├── history/           # 历史记录页面
│   ├── profile/           # 用户中心页面
│   ├── globals.css        # 全局样式
│   ├── layout.tsx         # 根布局
│   └── page.tsx           # 首页
├── components/            # 可复用组件
│   ├── layout/           # 布局组件
│   ├── ui/               # UI组件
│   └── forms/            # 表单组件
├── hooks/                # 自定义Hooks
├── lib/                  # 工具库
│   ├── supabase.ts       # Supabase客户端
│   └── utils.ts          # 工具函数
├── types/                # TypeScript类型定义
└── styles/               # 样式文件
```

## 🎨 设计系统

### 色彩方案
- **主色调**: 深紫色 (#2D1B69)
- **辅助色**: 金色 (#FFD700)
- **背景色**: 古风纸张色 (#f5f2e8)
- **文字色**: 墨色 (#2c2c2c)

### 字体
- **中文**: SimSun, FangSong
- **标题**: FangSong, KaiTi
- **英文**: Inter

## 🔧 核心功能

### 八字排盘
- 真太阳时计算
- 天干地支推算
- 五行分析
- 四柱展示

### 命理分析
- AI智能解读
- 传统理论结合
- 个性化建议
- 运势预测

### 用户系统
- 邮箱注册登录
- 个人资料管理
- 历史记录保存
- 数据同步

## 📊 数据库设计

### 主要表结构

```sql
-- 用户表
users (
  id uuid PRIMARY KEY,
  email text UNIQUE,
  created_at timestamp,
  updated_at timestamp
);

-- 八字记录表
bazi_records (
  id uuid PRIMARY KEY,
  user_id uuid REFERENCES users(id),
  birth_info jsonb,
  bazi_result jsonb,
  created_at timestamp
);

-- 分析结果表
analysis_results (
  id uuid PRIMARY KEY,
  bazi_record_id uuid REFERENCES bazi_records(id),
  analysis_content text,
  ai_analysis jsonb,
  created_at timestamp
);
```

## 🚀 部署

### Vercel部署

1. 连接GitHub仓库到Vercel
2. 配置环境变量
3. 自动部署

### 自定义部署

```bash
# 构建项目
pnpm build

# 启动生产服务器
pnpm start
```

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🙏 致谢

- 传统易学文化的传承者们
- Next.js 和 React 社区
- Supabase 开源项目
- DeepSeek AI 技术支持

## 📞 联系我们

- 项目主页: [GitHub Repository]
- 问题反馈: [GitHub Issues]
- 邮箱: contact@tianji-suanming.com

---

**天机算命** - 传承千年易学智慧，融合现代AI技术 ✨
