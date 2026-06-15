# Blog 发布流程与内容标准

适用于 ai-toolbox（AI 工具站）和 online-tools（免费工具站）两个站的博客维护。

---

## 一、两个站的 Blog 定位

| | AI 工具站 | 免费工具站 |
|---|---|---|
| **域名** | ai.toolboxonline.club | toolboxonline.club |
| **目标** | 转化：展示 AI 工具效果 → 注册 → 付费 | 抢量：大搜索量关键词 → 导流到 AI 站 |
| **内容类型** | 教程转化 + 对比榜单 + 行业技巧 | 教程抢量 + 概念解释 + 对比榜单 |
| **关键词策略** | "without photoshop", "AI restore", "free AI" | "how to", "what is", "online free", "without installing" |

---

## 二、三种内容类型

### 类型 A：工具教程 / 场景指南（主力，每站 50%）

**目标**：捕获 "how to do X" 类搜索，直接导流到工具页。

**选题格式**：
- How to [Do Something] Without [Expensive/Complex Alternative]
- How to [Do Something] Online Free — Step by Step
- [具体场景] 的完整工作流指南

**写法公式**：
1. 具体痛点切入（个人经历或常见场景，1 段）
2. 为什么不用传统方法（1 段）
3. 实操步骤（3-5 步，每步可操作）
4. 技巧和常见坑（2-3 条）
5. 自然引出工具 + 软 CTA（1 段）

### 类型 B：对比 / 榜单（流量最大，每站 30%）

**目标**：抢 "best/top/vs/alternatives" 流量，建立品类权威。

**选题格式**：
- Best X [Tool Type] in 2026 — Tested and Compared
- [Tool A] vs [Tool B]: Which One Actually Works?
- Top 5 Free [Tool Category] — No Signup Required
- [竞品] Alternatives: 3 Better Options for [Use Case]

**写法公式**：
1. 快速说清对比维度（价格/速度/质量/易用性，1 段）
2. 逐款列出，每款包含：优点 / 缺点 / 适合谁（3-5 款）
3. 总结对比表或一句话推荐
4. 自然引导到自家工具

**重要**：对比类文章需要真实验证。不能只靠搜索资料写，要用过再说。

### 类型 C：行业技巧 / FAQ / 知识科普（每站 20%）

**目标**：长尾关键词覆盖 + 建立 E-E-A-T 权威感。

**选题格式**：
- What Is [Technical Concept]? A Simple Guide
- X Common [Problem] and How AI Fixes Them
- Why [Technical Thing] Happens (and How to Deal With It)

**写法公式**：
1. 一个常见的困惑场景
2. 通俗解释（不要教科书式）
3. 实际应用场景
4. 提及相关工具

---

## 三、文章质量标准

### 字数

- 最低 500 字，目标 800-1500 字
- 少于 500 字对 SEO 几乎无效
- 超过 1500 字需要确认内容确实值得这个长度

### 结构

- 有且只有 1 个 H1（标题）
- 用 H2 分大段（3-5 个 H2）
- 段落短（2-4 句），每段只有 1 个核心点
- 需要列表的地方用 `<ul>` / `<ol>`

### 内容格式化标准

用户体验第一。读者扫一眼就能找到想要的信息。

**标题层次**：
- H1：文章主标题（1 个）
- H2：大章节标题（3-5 个），每个 H2 之间逻辑递进
- 如果某个 H2 下面内容特别多，可以用 H3 再拆一层

**段落**：
- 每段 2-4 句，不超过 5 句
- 每个段落只讲一个点
- 段落之间有空行，视觉上明显分隔
- 重点内容用 `<strong>` 标记，方便扫读

**代码**：
- 命令行、代码片段、JSON 示例、URL 编码样本 → 全部用 `<code>` 或 `<pre><code>` 包裹
- 多行代码用 `<pre><code>` 块，单行用 `<code>` 内联
- 代码块要加语言标识（`language-json`、`language-bash` 等）方便语法高亮
- 例：`<pre><code class="language-json">{"key": "value"}</code></pre>`

**列表**：
- 并列要点用 `<ul><li>`
- 步骤序列用 `<ol><li>`
- 列表项简短（一行），不嵌套超过两层

**强调与链接**：
- 工具名和关键术语用 `<strong>` 或直接加粗
- 内链用描述性锚文本（"our background remover" 不是 "click here"）
- 链接自然嵌入句子中，不单独成行

### 写作风格

**要的**：
- 短句。主谓宾。15-25 词一句。
- 具体数字和例子。不是 "many people" 而是 "I tested 5 tools on 20 photos"
- 缩写：it's, don't, can't, what's, we've
- 诚实说局限性：什么情况不适用，什么场景效果差
- 像朋友聊天，不像营销文案

**不要的**：
- "unleash your creativity"
- "in today's digital landscape"
- "furthermore" / "moreover" / "in conclusion"
- "firstly, secondly, thirdly"
- "it is worth noting that"
- " revolutionize" / "game-changer" / "unprecedented"

### SEO 要求

- 主关键词出现在：标题、第一个 H2、首段、最后一个 H2 附近的段落
- 每篇 1 个主关键词 + 2-3 个长尾关键词
- 内链 2-3 个工具页 + 1 个旧博客
- `<title>` 和 `<meta description>` 自然含关键词，160 字符以内
- 如果有图片：ALT 文本包含关键词

### 内链规则

- 第一次提到工具时链接到工具页
- "用我们的 [tool name](link)" 比 "点击这里" 好
- 每篇至少 1 个跨站链接（AI 站 ↔ 免费站）
- 链到至少 1 篇相关旧博客

### 场景驱动（每篇必有）

借鉴 DungeonPath v3 内容标准。每篇博客不只是"怎么用"，必须让读者感觉"我遇到过这个问题"。

- 每个 H2 章节至少嵌入 **1 个具体场景**："你看到 X → 做 Y → 结果是什么"
- 至少 **1 处翻车复盘**：常见错误操作 + 为什么错 + 怎么恢复
- 至少 **1 处反直觉建议**："常识会告诉你 X，但在这个工具上实际该做 Y"
- 至少 **1 处两难决策**："如果你只有 X，应该先做 A 还是 B"

### 标题变体（5 种轮换，禁止连续重复）

| 类型 | 格式 | 示例 |
|------|------|------|
| 问题型 | Why X Happens and How to Fix It | "Why Your JSON Is Always Broken and How to Fix It" |
| 对比型 | A vs B: When to Use Which | "Base64 vs SHA-256: When to Use Each" |
| 痛点型 | I Did X So You Don't Have To | "I Spent 4 Hours Debugging One Trailing Comma" |
| 结果型 | How to Achieve X in Y Steps | "How to Generate 100 Strong Passwords in 10 Seconds" |
| 场景型 | What to Do When X Happens | "What to Do When Your CSV Has 50,000 Rows" |

### 写作自检清单（每篇发布前执行）

- [ ] 有没有至少 1 个"你遇到 X → 做 Y"的具体场景？
- [ ] 有没有指出至少 1 个常见错误 + 恢复策略？
- [ ] 有没有至少 1 处反直觉/颠覆常识的建议？
- [ ] 标题是否避免了与上一篇同一类型？
- [ ] FAQ 有没有回答"工具不好使的时候怎么办"？
- [ ] 有没有至少 2 个内链到工具页？
- [ ] 可以朗读一遍而不听起来像 AI 吗？
- [ ] 有没有 "unleash" / "furthermore" / "in conclusion" 等禁词？

### 转化引导（软 CTA）

结尾用一句话引导，不过度推销：

- 教程类："If you don't want to mess with [traditional method], [our tool](link) handles this automatically."
- 对比类："We built [tool] because the alternatives were either expensive or limited. [Try it](link)."
- 科普类：无 CTA，纯知识。

---

## 四、发布流程

### 第 1 步：选题（每批次 5-10 篇）

1. 针对每个站列出 10 个候选标题
2. 检查关键词搜索量和竞争度（GSC / Ahrefs / 谷歌搜索联想）
3. 标记类型（A/B/C），确保比例符合 50/30/20
4. 最终确认本批次选题列表

### 第 2 步：写作

1. AI 辅助生成初稿（基于选题 + 内容类型模板）
2. 人工审查和修改：
   - 删掉所有 AI 套话（"unleash", "furthermore", "in conclusion"...）
   - 加入具体数字、真实场景、个人口吻
   - 确认内链完整（2-3 工具页 + 1 旧博客）
   - 确认 CTA 自然不硬
3. 终稿检查：朗读一遍，看是否像人写的

### 第 3 步：翻译（可选）

- 优先级：英文 > 阿拉伯语 > 西班牙语
- AR 和 ES 版本可以延后 1-2 周发布
- 翻译后需要母语者复核（或至少用工具反向翻译验证）

### 第 4 步：发布

**AI 工具站**：
- `DATABASE_PUBLIC_URL` 直连 PostgreSQL 写入 `blog_posts` 表
- 或通过 Admin API (`POST /api/admin/blog`) 创建
- 前端 ISR 5 分钟自动刷新

**免费工具站**：
- 编辑 `src/lib/blog.ts`，插入新文章到 `blogPosts` 数组
- 更新 `scripts/generate-sitemap.mjs`（如果新增 slug）
- `git push` + Vercel 部署

### 第 5 步：验证

- 访问 `/{locale}/blog/{slug}` 确认页面正常渲染
- 检查 JSON-LD schema 正确
- 检查 sitemap 包含新 URL
- 提交到 Google Search Console（新站重要）

---

## 五、发布节奏

由人工根据实际情况决定。建议保持稳定更新，不追求单次数量。Google 看的是持续活跃度，不是爆发式更新。

---

## 六、两站交叉引流策略

**免费站 → AI 站**：
- 在免费工具教程中自然提及 AI 替代方案
- 例："This free JSON formatter works instantly. Need something more advanced? [AI ToolBox](link) has 15 AI-powered tools for image editing, writing, and design."

**AI 站 → 免费站**：
- 在 AI 工具教程中提及前置步骤的免费工具
- 例："Before restoring your photo, you might want to [convert it to a standard format](free-tools-link) first."

**避免**：不要每篇都做硬性导流。只在相关场景下自然提及。

---

## 七、内容日历模板

每批次选题按此模板整理：

| # | 站 | 类型 | 标题 | 主关键词 | 目标工具 | 目标字数 |
|---|-----|------|------|----------|----------|----------|
| 1 | AI | A | How to... | xxx | background-remover | 1000 |
| 2 | AI | B | Best 5... | xxx | ai-image-generator | 1200 |
| 3 | Free | A | How to... | xxx | json-formatter | 800 |
| ... | ... | ... | ... | ... | ... | ... |

---

## 八、禁止事项

- **禁止抄袭**：不复制竞品博客内容，不用翻译软件直译英文博客冒充原创。Google 能识别重复内容，轻则降权重则除名
- **禁止堆砌关键词**：不要在主站关键词密度过高。关键词自然出现在标题、H2、首段、结尾即可，不要硬塞
- **禁止夸大承诺**：不写 "100% perfect results"、"guaranteed to work"、"best tool ever"。诚实说明工具的适用范围和局限性，用户信任比一次点击值钱
- **禁止 AI 直接发布**：AI 生成的初稿必须人工修改后才能发布。不改直接发 = 低质量内容 = Google 惩罚
- **禁止孤立页面**：每篇博客至少内链 2 个工具页 + 1 篇旧博客，否则 SEO 效果极差
- **禁止硬推销**：科普类文章 0 CTA，教程类文章 1 个软 CTA，只有对比类可以稍微直接一点
