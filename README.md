# 密码工具箱 · Password Toolbox

> 生成、检测、存储一站式密码安全工具 —— 纯前端实现，数据存本地。

## 快速开始

```bash
# 安装依赖
npm install

# 启动开发服务器（端口 3000）
npm run dev

# 构建生产版本
npm run build

# 类型检查
npm run typecheck

# 运行测试
npm test
```

启动后浏览器访问 `http://localhost:3000` 即可使用。

## 功能列表

| 功能 | 状态 | 说明 |
|------|------|------|
| 🔐 **密码生成器** | ✅ 已上线 | 可配置长度（8-64 位）、大小写/数字/特殊符号四种字符集；保证每种勾选字符集至少出现一次；滑块实时预览；一键复制 |
| 🛡️ **强度检测** | ✅ 已上线 | 实时检测，0-10 分五级评分（弱/一般/良好/强/极强）；可视化进度条；个性化改进建议；识别常见弱口令、连续字符、重复模式 |
| 📝 **Passphrase 生成** | ⏳ 即将上线 | 基于单词表的易记强密码短语生成 |
| 🔒 **加密保险箱** | ⏳ 即将上线 | 本地加密存储账号密码，主密码保护 |

## 技术栈

- **React 19** — 最新版 React，函数组件 + Hooks
- **TypeScript 6** — 全链路类型安全
- **webpack 5** — 模块打包 + 开发服务器
- **CSS Modules** — 组件级样式隔离
- **自定义测试框架** — 手写 `describe`/`it`/`expect`，`tsx` 直接运行，无额外依赖

## 目录结构

```
src/
├── components/          # React 组件
│   ├── App.tsx          # 根组件，视图路由
│   ├── Home.tsx         # 首页卡片导航
│   ├── PasswordGenerator.tsx   # 密码生成器
│   ├── StrengthChecker.tsx     # 强度检测器
│   ├── PageLayout.tsx   # 统一页面布局（导航栏、返回按钮）
│   ├── Card.tsx         # 通用卡片组件
│   └── Placeholder.tsx  # 未上线功能占位页
├── hooks/               # 自定义 Hooks
│   ├── useView.ts       # 视图状态 + hash 路由同步
│   ├── useCopy.ts       # 剪贴板复制状态管理
│   └── index.ts         # Hook 统一导出
├── utils/               # 纯函数工具库（全部可测试）
│   └── index.ts         # generatePassword / checkPasswordStrength / calcSliderPct 等
├── types/               # TypeScript 类型定义
│   ├── password.ts      # PasswordConfig / PasswordStrengthResult 等
│   └── view.ts          # ViewName 路由类型
├── styles/              # 全局样式
│   └── global.css       # CSS 变量、主题、重置样式
└── index.tsx            # 应用入口
```

```
test/                    # 测试套件（38 个用例）
├── runner.ts            # 轻量级测试框架（describe/it/expect）
├── utils.test.ts        # utils 模块测试（生成器、强度检测、滑块计算）
├── useView.test.ts      # useView hook 纯逻辑测试（hash 解析）
└── index.ts             # 测试入口
```

## 测试

项目自带零依赖轻量级测试框架，共 **38 个测试用例**，覆盖所有核心纯函数逻辑：

```bash
npm test
```

内部通过 `npx tsx` 直接执行 TypeScript 测试文件，无需编译步骤。

**测试覆盖模块：**

- ✅ `calcSliderPct` — 滑块百分比计算（边界值、夹紧、除零保护）
- ✅ `generateId` — 唯一 ID 生成
- ✅ `generatePassword` — 密码生成（15 个用例：空配置、单字符集、长度边界、四种字符必各出现一次、随机性等）
- ✅ `checkPasswordStrength` — 强度检测（12 个用例：弱密码、中等密码、强密码、减分项、保底逻辑等）
- ✅ `parseHash` / `VALID_VIEWS` — hash 路由解析（11 个用例：空 hash、各种格式、大小写、未知值回退等）

## 数据安全

本项目为 **纯前端应用**：
- 所有数据仅存储在浏览器本地（`localStorage` / `sessionStorage`）
- 不需要后端服务器
- 不上传任何密码或个人数据
- 关闭浏览器后数据不会发送到任何外部服务

## License

ISC
