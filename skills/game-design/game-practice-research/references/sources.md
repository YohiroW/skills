# 游戏技术资料来源与检索路线

此目录提供检索入口，不承诺永久可用、免费访问或某主题一定有结果。应在使用时核实当前入口与具体材料；最终引用指向演讲或文章本身，而非站点首页。

## 大会与课程

| 来源 | 入口 | 适用范围及使用方式 |
|---|---|---|
| GDC Vault | https://www.gdcvault.com/ | 编程、渲染、动画、AI、网络、工具、音频和制作经验。查演讲标题、作者、年份；部分内容需订阅，继续查作者公开讲稿。 |
| CEDEC / CEDiL | https://cedec.cesa.or.jp/ · https://cedil.cesa.or.jp/ | 日本游戏项目、引擎和制作流程。年度会议信息与 CEDiL 资料互查；注册或访问规则以页面为准，并非所有演讲都有资料。 |
| Advances in Real-Time Rendering | https://advances.realtimerendering.com/ | SIGGRAPH 实时渲染课程，适合生产案例与算法机制；按年份找 PDF、讲者备注和录像。 |
| SIGGRAPH 课程索引 / Rendering Engine Architecture | https://www.realtimerendering.com/siggraph.html | 查渲染器架构及其他课程的具体年度入口；Rendering Engine Architecture 是课程系列，不应当成独立会议。 |
| High-Performance Graphics | https://www.highperformancegraphics.org/ | GPU 算法、光追、采样、压缩和性能研究。查看年度 program、论文和作者公开版本。 |
| I3D | https://i3dsymposium.org/ | 实时与交互图形算法，查论文、项目页和演示；研究结果不自动代表商业项目采用。 |
| Digital Dragons | https://digitaldragons.pl/ | 综合游戏开发分享，沿官网进入官方视频频道或历年议程；频道与栏目位置可能变化。 |

## 工作室及日本制作资料

| 来源 | 入口 | 适用范围及使用方式 |
|---|---|---|
| Activision Research | https://research.activision.com/ | 渲染、人脸、角色、几何和机器学习；查 publication、项目页与补充材料。 |
| EA SEED | https://www.ea.com/seed | 图形、仿真、动画及 AI 研究；明确原型与已投入生产的区别。 |
| Guerrilla Games | https://www.guerrilla-games.com/read | Horizon / Decima 的渲染、世界构建及技术演讲。此入口混合新闻，使用站内关键词或域名检索筛选技术内容。 |
| CAPCOM Open Conference | https://www.capcom-games.com/coc/ | RE ENGINE、动画、工具链、优化和制作流程；日文关键词可提高召回。 |
| CGWORLD.jp | https://cgworld.jp/ | 角色、TA、DCC 及制作案例。区分开发者直接解释、采访转述和编辑概括；工程结论尽可能追溯原始资料。 |

## 专项资料及发现渠道

| 来源 | 入口 | 适用范围及使用方式 |
|---|---|---|
| AMD GPUOpen | https://gpuopen.com/ | GPU 优化、FidelityFX、代码、工具与演讲。区分通用算法与 AMD 特定硬件建议。 |
| NVIDIA Developer / GTC | https://developer.nvidia.com/ | 图形、SDK、Nsight 与 GTC；区分通用方法、硬件特性及厂商基准，录像可能需要账号。 |
| Unreal Engine Developer Community / Unreal Fest | https://dev.epicgames.com/community/unreal-engine/learning | 引擎系统、动画、PCG、工具和性能。区分 Epic 官方与社区投稿，注明引擎版本。 |
| Game AI Pro | https://www.gameaipro.com/ | 导航、决策、行为、战术和群体 AI；找作者章节、项目背景与适用条件。 |
| Graphics Programming Weekly | https://www.jendrikillner.com/ | 发现论文、博客、演讲和代码；沿原文链接取证，不用周报摘要代替原文。 |
| Real-Time Rendering | https://www.realtimerendering.com/ | 图形学资源与课程索引，用于术语扩展和寻找原始资料。 |

## 按主题选源

- **渲染与 GPU**：GDC、CEDEC → Advances / 渲染架构课程 → 相关工作室 → HPG / I3D 与 GPU 厂商。
- **动画、角色、TA、资产管线**：GDC、CEDEC → CAPCOM / CGWORLD → Unreal Fest，以及相关工作室论文与演讲。
- **游戏 AI 与导航**：GDC、CEDEC → Game AI Pro → 章节作者、具体游戏团队的公开实现与后续演讲。
- **引擎架构、工具与性能**：GDC、CEDEC → CAPCOM / Unreal Fest → 对应工作室与平台厂商。
- **网络、物理、音频等其他方向**：以 GDC、CEDEC 的相关分会及作者资料为起点，向该领域的官方文档或专题会议扩展；不要为了覆盖目录而塞入无关图形资料。

这些路线用于选源，不限制用户指定的资料或目录外更直接的一手来源。

## 查询方式

按问题替换关键词，不机械执行所有变体：

```text
site:gdcvault.com "<technique or game>"
site:cedec.cesa.or.jp <日本語キーワード>
site:cedil.cesa.or.jp <技術名 or ゲーム名>
"<exact talk title>" slides OR pdf
"<speaker name>" "<technique>"
site:advances.realtimerendering.com <technique>
"<game or engine>" "<technique>" presentation
```

例如研究虚拟几何时同时考虑 virtualized geometry、cluster culling、mesh streaming、Nanite 等相关词，但先区分通用问题与具体产品；日文可试「仮想化ジオメトリ」「メッシュ」「カリング」并依据实际资料修正术语。避免把品牌名、近义词和不同算法直接视作等价。
