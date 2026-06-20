# IntelliGit 剩余功能任务分工

> **基准**：`docs/progress-report.md` 未完成清单  
> **分工原则**：按历史技术栈匹配，尽量减少跨人依赖

---

## 依赖关系说明

```
lxy: 影子合并 Sidecar 端
       └─ czl: 分支热力图数据接入（可先用 mock 并行开发）
lxy: Tree-sitter WASM 框架
       └─ zm:  Python / Go grammar
       └─ koishi: Java / C / C++ grammar
```

除以上两条外，其余各人任务相互独立，可完全并行。

---

## lxy

> **方向**：Go Sidecar 后端 + 基础设施

### 1. 影子合并预检（完整实现） 🔴 复杂

| 任务 | 说明 |
|------|------|
| Sidecar 内存级 merge 模拟 | `sidecar/internal/git/` 下新增 shadow merge 函数，调用 go-git `MergeTree()` 接收冲突索引；**绝对不调用 Checkout，不写磁盘** |
| 新增 `shadow.merge` JSON-RPC 命令 | `sidecar/internal/handler/` 注册命令，返回冲突文件列表 + 冲突区域行范围 |
| IPC 通道打通 | Main 进程新增 IPC handler，Renderer 可调用 `invokeGit('shadow.merge', ...)` |
| 前端触发逻辑 | 用户切换分支 / 打开合并面板时自动触发，带防抖（建议 800ms） |
| 预检结果状态存储 | 新增 `shadowMergeStore`，存储各分支的预检结果供热力图读取 |

### 2. Tree-sitter WASM 集成框架 🔴 复杂

| 任务 | 说明 |
|------|------|
| 在 Renderer 侧引入 `web-tree-sitter` | 统一封装 `TreeSitterParser` 类，对外暴露 `parse(code, language)` 接口 |
| 语言注册机制 | 支持懒加载 `.wasm` grammar 文件（按需加载，不阻塞启动） |
| 与 `astChangeAnalyzer.ts` 对接 | 当文件语言为 Python/Go/Java/C 时路由到 Tree-sitter，JS/TS 仍走现有 Babel 路径 |

### 3. 日志收集系统 🟡 中等

| 任务 | 说明 |
|------|------|
| 引入 `electron-log` | 配置日志存储至 `~/.intelligit/logs/`，单文件上限 10MB，保留最近 5 个 |
| Sidecar 端日志 | stderr 输出接入 Main 进程日志，区分 DEBUG / INFO / WARN / ERROR |
| JSON-RPC 通信记录 | DEBUG 级别记录所有收发消息（脱敏 API Key） |

---

## czl

> **方向**：前端 UI 实现（你做了所有原型，来落地）

### 1. 分支拓扑风险热力图 🟡 中等

| 任务 | 说明 |
|------|------|
| 分支节点颜色光晕渲染 | 在 `CommitGraph.tsx` Canvas 绘制层叠加光晕：🟢 可安全合并 / 🔴 文本冲突 / 🟡 语义风险 |
| 接入 `shadowMergeStore` 数据 | lxy 的 store 就绪后替换 mock；开发阶段先用本地 mock 数据并行推进 |
| 分支活跃度热力 | 从 commit log 计算各分支最近提交的时间衰减值，映射到节点颜色深浅 |
| 长期不活跃分支降调 | 超过 30 天无提交的分支：节点以虚线边框 + 灰色文字渲染 |

参考原型：`docs/czl/intelligit_branch_graph.html`

### 2. NLP 命令中心完整视图 🟢 简单

| 任务 | 说明 |
|------|------|
| 新增独立主视图 `NlpView` | 在 `src/renderer/src/views/` 下新建，ActivityRail 添加入口图标 |
| 将 ChatPanel 核心逻辑迁移/复用 | 不必重写，拆分 UI 层和逻辑层，视图直接复用 `nlCommandService` |
| 历史执行记录持久化 | 使用 `electron-store` 存储 NLP 操作历史（时间戳 + 输入文本 + 转译命令 + 结果） |
| 常用操作快捷标签 | 预设 6–8 个高频场景标签（如「撤销上一次提交」「推送到远程」），点击填入输入框 |
| 极高危历史条目标注「已阻止」 | 根据 `riskLevel === 'extreme'` 显示红色 Tag，不展示执行按钮 |

参考原型：`docs/czl/intelligit_nlp_center.html`

### 3. 前端错误处理友好提示 🟡 中等

| 任务 | 说明 |
|------|------|
| 建立错误码 → 提示文案映射表 | 配合 koishi 定义的错误码枚举，每类错误配置一条人类可读提示 + 「建议操作」 |
| 改造 `NotificationBar` | 支持展开详情（底层错误信息折叠），普通用户看提示，调试时可展开原始栈 |
| ConflictPanel 一键采纳直接写文件 | 通过 IPC 调用 `fs.writeFile` 写入冲突文件，写完后触发 `staging.status` 刷新 |

---

## zm

> **方向**：AI / 知识库 + AST 多语言扩展

### 1. 本地 RAG 知识库 ⚫ 极复杂（最重任务）

| 任务 | 说明 |
|------|------|
| Embedding 模型选型与集成 | 推荐 `@xenova/transformers` 在 Renderer/Worker 线程运行 `all-MiniLM-L6-v2`（纯 JS，无 native 依赖），先跑通单条文本的向量化 |
| 向量数据库集成 | 推荐 `lancedb`（支持 Node.js 嵌入式运行）；存储路径 `<repo>/.intelligit/vectors/` |
| Commit 历史向量化 | 初始化仓库时批量向量化最近 500 条 Commit Message + Diff 摘要；新 Commit 后增量追加 |
| RAG 检索管线 | `buildRagContext(query)` → Top-5 相似度检索 → 拼装到 Prompt 上下文，注入 `agentRuntime.ts` 调用链 |
| 接入智能提交 | `generateSmartCommitMessage` 调用前先走 RAG，让生成结果符合项目历史风格 |
| `.gitattributes` 配置 | 将 `.intelligit/vectors/` 标记为 binary，冲突时触发全量重建 |

> ⚠️ **建议分阶段**：先跑通「向量化 + 检索」最小闭环，再接入 agentRuntime，最后做增量更新。

### 2. 多语言 AST —— Python + Go grammar 🟡 中等

> 前置：等 lxy 的 Tree-sitter WASM 框架合并后开始

| 任务 | 说明 |
|------|------|
| Python grammar 接入 | 加载 `tree-sitter-python.wasm`，提取函数 / 类 / 方法节点，映射为 `AstSymbolInfo` |
| Go grammar 接入 | 加载 `tree-sitter-go.wasm`，提取函数定义 / 接口声明节点 |
| 测试 | 在 `astChangeAnalyzer.ts` 中用真实 Python/Go diff 文件验证 hunk → 节点映射正确性 |

---

## koishi

> **方向**：独立完整 Feature + 代码质量

### 1. Docker 沙箱验证（完整功能） 🔴 复杂

| 任务 | 说明 |
|------|------|
| Docker 环境检测 | 应用启动时执行 `docker info`，结果写入全局 store；不可用时沙箱入口置灰 + 安装引导链接 |
| 沙箱配置界面 | 新增 `SandboxView`；支持配置镜像、工作目录、安装命令、测试命令、超时、触发时机（提交前 / 推送前） |
| `.intelligit/sandbox.json` 读写 | Main 进程提供 IPC 接口读写配置文件 |
| 容器调用与流式日志 | 使用 `dockerode` 调用 Docker Engine API；容器日志通过 Sidecar Notification 机制实时推流到前端 |
| 提交/推送前置拦截 | 在 `gitWorkflowService` 的 commit / push 流程中注入沙箱检查钩子 |
| 结果展示界面 | 统计卡片（总测试 / 通过 / 失败 / 用时）+ 终端风格日志（PASS 绿 / FAIL 红） |
| 状态栏指示灯 | StatusBar 新增「沙箱」状态项 |

参考原型：`docs/czl/intelligit_sandbox.html`

### 2. 统一错误码体系 🟡 中等

| 任务 | 说明 |
|------|------|
| 定义错误码枚举 | 在 `src/shared/errors.ts` 定义 `1xxx`（引擎）/ `2xxx`（Git）/ `3xxx`（AI）/ `4xxx`（沙箱）/ `5xxx`（用户输入）/ `9xxx`（未知） |
| Sidecar 端对齐 | 与 lxy 协商在 Go 端用相同数字，Sidecar 返回的 error 对象带 `code` 字段 |
| 前端错误解析 | `gitHandlers.ts` 拦截响应，将 code 映射后透传给 czl 的提示文案系统 |

### 3. 多语言 AST —— Java / C / C++ grammar 🟡 中等

> 前置：等 lxy 的 Tree-sitter WASM 框架合并后开始

| 任务 | 说明 |
|------|------|
| Java grammar 接入 | 加载 `tree-sitter-java.wasm`，提取类 / 方法声明 |
| C / C++ grammar 接入 | 加载 `tree-sitter-c.wasm` + `tree-sitter-cpp.wasm`，提取函数 / 结构体声明 |

---

## 整体时间线参考

```
Week 1-2
  lxy:   影子合并 Sidecar 端 + Tree-sitter 框架
  czl:   分支热力图（mock数据）+ NLP 视图
  zm:    RAG Embedding 模型选型 + 向量化最小闭环
  koishi: Docker 环境检测 + 配置界面 + 错误码定义

Week 3-4
  lxy:   影子合并前端接入 + 日志系统
  czl:   热力图接入真实数据 + 错误提示改造 + ConflictPanel写文件
  zm:    RAG 检索管线 + 接入 agentRuntime + Python/Go grammar
  koishi: Docker 容器调用 + 流式日志 + 前置拦截钩子

Week 5+（按完成情况）
  lxy:   review + 稳定性
  czl:   收尾小缺口
  zm:    RAG 增量更新 + 调优
  koishi: Docker 结果界面 + Java/C/C++ grammar
```

---

## 接口约定（跨人协作节点）

| 接口 | 提供方 | 消费方 | 说明 |
|------|--------|--------|------|
| `shadowMergeStore` + `shadow.merge` RPC | lxy | czl | czl 用 mock 先行，等 lxy 合并后替换 |
| Tree-sitter `parse(code, lang)` 接口 | lxy | zm / koishi | 框架就绪后通知，各自接入对应 grammar |
| 错误码枚举 `src/shared/errors.ts` | koishi | czl / lxy | koishi 先定义文件，其他人填充各模块 code |
| Docker 前置拦截钩子位置 | koishi | — | 在 `gitWorkflowService.ts` commit/push 处预留 |
