"use client";

import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";

type Article = {
  id: string;
  title: string;
  summary: string;
  date: string;
  url: string;
  tags: string[];
  featured?: boolean;
};

const articles: Article[] = [
  {
    id: "162493090",
    title: "[C2000实战] 利用 SysConfig 快速生成并移植 DSP F2800137 串口 SCI+FIFO 中断代码",
    summary:
      "从 SCI 参数、GPIO 复用、FIFO 中断水位到 ISR 处理，整理 C2000 串口 FIFO 在工业控制项目中的完整移植路径。",
    date: "2026-07-01",
    url: "https://blog.csdn.net/qq_46560315/article/details/162493090",
    tags: ["C2000", "DSP", "SysConfig"],
    featured: true,
  },
  {
    id: "162459824",
    title: "H 桥逆变器输出短路保护：CBC 逐波限流原理及 DSP 应用",
    summary:
      "分析短路对功率器件的影响，并比较外部硬件比较、内部 CMPSS+DAC 与 ePWM Trip Zone 联动的保护方案。",
    date: "2026-07-01",
    url: "https://blog.csdn.net/qq_46560315/article/details/162459824",
    tags: ["逆变器", "保护", "DSP"],
    featured: true,
  },
  {
    id: "162056773",
    title: "SysCtl_setSyncInputConfig 没有 EPWM2/3 与 EPWM1 同步源配置的问题",
    summary:
      "解释 F28004x EPWM 菊花链同步架构：链首模块具备同步输入源选择，中间模块同步输入固定来自前级模块。",
    date: "2026-06-17",
    url: "https://blog.csdn.net/qq_46560315/article/details/162056773",
    tags: ["F28004x", "EPWM", "同步"],
    featured: true,
  },
  {
    id: "161831057",
    title: "电源硬件设计：PNP 三极管加速 MOS 管关断电路分析",
    summary:
      "拆解 PFC Boost 栅极驱动中二极管快速开通、PNP 主动抽取栅极电荷实现快速关断的电流路径与设计注意点。",
    date: "2026-06-09",
    url: "https://blog.csdn.net/qq_46560315/article/details/161831057",
    tags: ["电源硬件", "MOSFET", "驱动"],
  },
  {
    id: "155282595",
    title: "[C2000实战] 利用 SysConfig 快速生成并移植 DSP F280049C DAC 初始化代码",
    summary:
      "整理 F28004x DAC 模块配置、参考电平、影子寄存器、输出使能与上电延迟等关键注意事项。",
    date: "2025-11-27",
    url: "https://blog.csdn.net/qq_46560315/article/details/155282595",
    tags: ["F280049C", "DAC", "SysConfig"],
  },
  {
    id: "155276992",
    title: "DSP F280049C 逆变器正弦波参考信号生成：查表法 vs 实时计算法",
    summary:
      "对比查表法与 RampGen 实时计算法，说明 50kHz 中断下生成 50Hz 正弦参考信号的实现思路。",
    date: "2025-11-26",
    url: "https://blog.csdn.net/qq_46560315/article/details/155276992",
    tags: ["F280049C", "逆变器", "控制算法"],
  },
  {
    id: "155262343",
    title: "DSPF280049C 中断定时器快速使用记录",
    summary:
      "记录 CPUTIMER0、INT_TIMER0、中断函数声明、注册、初始化和使能流程。",
    date: "2025-11-26",
    url: "https://blog.csdn.net/qq_46560315/article/details/155262343",
    tags: ["F280049C", "Timer", "中断"],
  },
  {
    id: "155051472",
    title: "GD32F103Rx PB3 引脚无法正常 IO 操作问题记录",
    summary:
      "PB3 默认 JTDO 调试功能导致普通 IO 异常，通过开启复用时钟并配置 SWJ/SWDP 重映射解决。",
    date: "2025-11-20",
    url: "https://blog.csdn.net/qq_46560315/article/details/155051472",
    tags: ["GD32", "GPIO", "调试"],
  },
  {
    id: "155011826",
    title: "SOGI-PLL（二阶广义积分器锁相环设计）学习记录",
    summary:
      "从 SOGI 正交信号、Park 变换、PI 锁相、参数 k 与离散化方法梳理单相逆变器并网同步方案。",
    date: "2025-11-19",
    url: "https://blog.csdn.net/qq_46560315/article/details/155011826",
    tags: ["PLL", "SOGI", "控制算法"],
    featured: true,
  },
  {
    id: "149308976",
    title: "DSP + F280049C + SFRA 扫频软件添加到工程文件：SFRA GUI 连接问题",
    summary:
      "记录 SFRA 库、头文件、定时中断、LSPCLK、CMD 文件和 GUI 连接异常的排查路径。",
    date: "2025-07-13",
    url: "https://blog.csdn.net/qq_46560315/article/details/149308976",
    tags: ["F280049C", "SFRA", "调试"],
  },
  {
    id: "149114856",
    title: "DSPF280049C CLAmath 数学库添加到工程文件记录",
    summary:
      "整理 CLA 数学库文件、头文件、Lib 添加方式以及 CLAsin 调用验证流程。",
    date: "2025-07-04",
    url: "https://blog.csdn.net/qq_46560315/article/details/149114856",
    tags: ["F280049C", "CLA", "CLAmath"],
  },
  {
    id: "146042314",
    title: "TPS259631DDAR 电子保险丝原理图绘制及计算",
    summary:
      "根据输入泄漏电流、OVLO/UVLO 分压与 ILM 电流限制公式选择电阻参数。",
    date: "2025-03-05",
    url: "https://blog.csdn.net/qq_46560315/article/details/146042314",
    tags: ["电源硬件", "电子保险丝", "计算"],
  },
  {
    id: "145798892",
    title: "QA123C + SiC MOSFET + DC-DC 模块电源",
    summary:
      "记录 SiC MOSFET 栅极驱动、电源模块和负压偏置方案选型思路。",
    date: "2025-02-22",
    url: "https://blog.csdn.net/qq_46560315/article/details/145798892",
    tags: ["SiC", "MOSFET", "电源硬件"],
  },
  {
    id: "144987192",
    title: "F280049C EPWM 同步问题：EPWM4 与 Master 之间的同步分析及解决",
    summary:
      "围绕 EPWM4 与主同步模块不同步的问题，梳理同步链路和配置分析方法。",
    date: "2025-01-07",
    url: "https://blog.csdn.net/qq_46560315/article/details/144987192",
    tags: ["F280049C", "EPWM", "同步"],
  },
  {
    id: "144425229",
    title: "F280049C DAB HAL：PWMDutyPeriodPhaseShift 函数与移相控制标幺值解析",
    summary:
      "分析 DAB HAL 中 PWM 周期、移相控制和标幺值参数在函数中的计算关系。",
    date: "2025-01-04",
    url: "https://blog.csdn.net/qq_46560315/article/details/144425229",
    tags: ["F280049C", "DAB", "移相控制"],
  },
  {
    id: "144847843",
    title: "DSP F280049C SFO：MEP_ScaleFactor 校准",
    summary:
      "记录 TI EPWM 高分辨率 PWM 中 SFO 库移植、MEP 校准和问题处理步骤。",
    date: "2024-12-31",
    url: "https://blog.csdn.net/qq_46560315/article/details/144847843",
    tags: ["F280049C", "SFO", "HRPWM"],
  },
  {
    id: "144383948",
    title: "F280049C 技术手册：HRPWM_DBREDHR_DBFEDHR",
    summary:
      "梳理 HRPWM、MEP、DBREDHR、DBFEDHR 相关寄存器和死区高分辨率控制注意事项。",
    date: "2024-12-11",
    url: "https://blog.csdn.net/qq_46560315/article/details/144383948",
    tags: ["F280049C", "HRPWM", "寄存器"],
  },
  {
    id: "144170946",
    title: "TI DSP F280039C/F280049C：SysCLK 系统时钟和中断表",
    summary:
      "整理系统时钟、PLL、Timer0/1/2 与中断表在 C2000 应用中的基础关系。",
    date: "2024-12-01",
    url: "https://blog.csdn.net/qq_46560315/article/details/144170946",
    tags: ["F280049C", "F280039C", "时钟"],
  },
  {
    id: "144111814",
    title: "TI DSP F280039C/F280049C：EPWM Phase Shift Control",
    summary:
      "记录 ePWM 相位加载、同步输出源、相移控制相关接口和断言检查。",
    date: "2024-11-28",
    url: "https://blog.csdn.net/qq_46560315/article/details/144111814",
    tags: ["F280049C", "EPWM", "Phase Shift"],
  },
  {
    id: "127095617",
    title: "Ubuntu18.04 + PPPOE 校园网联网配置",
    summary: "记录 Ubuntu18.04 在 PPPOE 有线校园网环境下的主机网络配置。",
    date: "2022-09-28",
    url: "https://blog.csdn.net/qq_46560315/article/details/127095617",
    tags: ["Ubuntu", "网络", "PPPOE"],
  },
  {
    id: "121586143",
    title: "树莓派 4B Selenium + Firefox + Python3 打卡签到脚本",
    summary: "树莓派 4B 上使用 Selenium、Firefox 和 Python3 实现自动打卡签到脚本。",
    date: "2021-11-28",
    url: "https://blog.csdn.net/qq_46560315/article/details/121586143",
    tags: ["树莓派", "Python", "Selenium"],
  },
  {
    id: "120238395",
    title: "MATLAB 制作 MIF 文件（ROM/RAM 内存初始化文件）",
    summary:
      "用 MATLAB 从图片像素提取 RGB 数据并生成 ROM/RAM 初始化所需的 MIF 文件。",
    date: "2021-09-11",
    url: "https://blog.csdn.net/qq_46560315/article/details/120238395",
    tags: ["MATLAB", "MIF", "FPGA"],
  },
];

const stats = [
  ["22", "原创文章"],
  ["212", "累计点赞"],
  ["253", "累计收藏"],
  ["718", "CSDN 粉丝"],
];

const focusAreas = [
  "C2000 / F280049C",
  "数字电源",
  "逆变器控制",
  "EPWM / HRPWM",
  "SFO / CLA / SFRA",
  "硬件保护电路",
  "嵌入式调试",
  "自动化脚本",
];

export default function Home() {
  const shellRef = useRef<HTMLDivElement>(null);
  const [activeSection, setActiveSection] = useState("home");
  const [query, setQuery] = useState("");
  const [activeTag, setActiveTag] = useState("全部");

  const nav = useMemo(
    () => [
      ["home", "首页"],
      ["articles", "文章"],
      ["migration", "迁移"],
      ["about", "关于"],
    ],
    [],
  );

  const tags = useMemo(() => ["全部", ...Array.from(new Set(articles.flatMap((article) => article.tags))).slice(0, 14)], []);

  const filteredArticles = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    return articles.filter((article) => {
      const matchesTag = activeTag === "全部" || article.tags.includes(activeTag);
      const haystack = `${article.title} ${article.summary} ${article.tags.join(" ")}`.toLowerCase();
      return matchesTag && (!keyword || haystack.includes(keyword));
    });
  }, [activeTag, query]);

  useEffect(() => {
    const root = shellRef.current;
    if (!root) return;

    const onPointerMove = (event: PointerEvent) => {
      const x = (event.clientX / window.innerWidth) * 100;
      const y = (event.clientY / window.innerHeight) * 100;
      root.style.setProperty("--cursor-x", `${x}%`);
      root.style.setProperty("--cursor-y", `${y}%`);
      root.style.setProperty("--tilt-x", `${(event.clientY / window.innerHeight - 0.5) * -7}deg`);
      root.style.setProperty("--tilt-y", `${(event.clientX / window.innerWidth - 0.5) * 7}deg`);
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    return () => window.removeEventListener("pointermove", onPointerMove);
  }, []);

  useEffect(() => {
    const sections = Array.from(document.querySelectorAll<HTMLElement>("[data-section]"));
    const revealTargets = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));

    const sectionObserver = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target instanceof HTMLElement) {
          setActiveSection(visible.target.dataset.section ?? "home");
        }
      },
      { rootMargin: "-38% 0px -45% 0px", threshold: [0.15, 0.35, 0.6] },
    );

    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.12 },
    );

    sections.forEach((section) => sectionObserver.observe(section));
    revealTargets.forEach((target) => revealObserver.observe(target));

    return () => {
      sectionObserver.disconnect();
      revealObserver.disconnect();
    };
  }, []);

  return (
    <main className="site-shell" ref={shellRef}>
      <div className="cursor-light" aria-hidden="true" />
      <header className="floating-nav" aria-label="主导航">
        <a className="brand" href="#home" aria-label="返回首页">
          <span className="brand-mark">E</span>
          <span>Erick.ShaWn</span>
        </a>
        <nav>
          {nav.map(([id, label]) => (
            <a className={activeSection === id ? "active" : ""} href={`#${id}`} key={id}>
              {label}
            </a>
          ))}
        </nav>
      </header>

      <section className="hero section-wrap" id="home" data-section="home">
        <div className="hero-copy" data-reveal>
          <p className="eyebrow">CSDN Articles Migration / Embedded Systems / Power Electronics</p>
          <h1>把 CSDN 技术文章迁移成自己的工程知识库。</h1>
          <p className="hero-lede">
            这里将承载 Erick.ShaWn 在 CSDN 上沉淀的嵌入式、DSP、数字电源、逆变器控制和硬件调试文章。
            当前版本先完成文章索引迁移和阅读体验升级，站点仍保持私有，公开访问会在内容迁移完成后再开启。
          </p>
          <div className="hero-actions">
            <a className="primary-button magnetic" href="#articles">
              查看文章索引
              <span>→</span>
            </a>
            <a className="ghost-button magnetic" href="https://blog.csdn.net/qq_46560315" target="_blank" rel="noreferrer">
              CSDN 主页
            </a>
          </div>
        </div>

        <div className="hero-card" data-reveal>
          <div className="device-frame">
            <div className="device-top">
              <span />
              <span />
              <span />
            </div>
            <div className="system-panel">
              <p className="panel-kicker">Migration Status</p>
              <h2>Private Draft</h2>
              <div className="progress-row">
                <span>文章索引</span>
                <strong>完成</strong>
              </div>
              <div className="progress-row">
                <span>正文与图片</span>
                <strong>待导入</strong>
              </div>
              <div className="progress-row">
                <span>公开访问</span>
                <strong>未开启</strong>
              </div>
            </div>
            <div className="signal-grid">
              {stats.map(([value, label]) => (
                <div key={label}>
                  <strong>{value}</strong>
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section-wrap focus-strip" aria-label="技术方向" data-reveal>
        {focusAreas.map((area, index) => (
          <span key={area} style={{ "--delay": `${index * 45}ms` } as CSSProperties}>
            {area}
          </span>
        ))}
      </section>

      <section className="section-wrap content-section" id="articles" data-section="articles">
        <div className="section-heading" data-reveal>
          <p className="eyebrow">Article Index</p>
          <h2>已迁移文章索引</h2>
          <p>
            先把 CSDN 上的 22 篇原创文章整理为站内索引。当前点击“阅读全文”会打开 CSDN 原文；等 Markdown/HTML
            文件导入后，再切换为本站内文章详情页。
          </p>
        </div>

        <div className="article-tools" data-reveal>
          <label>
            <span>搜索文章</span>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="输入 F280049C、EPWM、逆变器、SOGI..."
            />
          </label>
          <div className="tag-filter" aria-label="文章分类筛选">
            {tags.map((tag) => (
              <button className={activeTag === tag ? "active" : ""} key={tag} onClick={() => setActiveTag(tag)} type="button">
                {tag}
              </button>
            ))}
          </div>
        </div>

        <div className="article-grid">
          {filteredArticles.map((article, index) => (
            <article
              className={article.featured ? "article-card featured magnetic" : "article-card magnetic"}
              data-reveal
              key={article.id}
              style={{ "--delay": `${Math.min(index, 8) * 55}ms` } as CSSProperties}
            >
              <div>
                <div className="article-meta">
                  <span>{article.date}</span>
                  {article.featured ? <strong>精选</strong> : null}
                </div>
                <h3>{article.title}</h3>
                <p>{article.summary}</p>
              </div>
              <footer>
                <div>
                  {article.tags.slice(0, 3).map((tag) => (
                    <span className="tag" key={tag}>
                      {tag}
                    </span>
                  ))}
                </div>
                <a href={article.url} target="_blank" rel="noreferrer">
                  阅读全文
                </a>
              </footer>
            </article>
          ))}
        </div>
      </section>

      <section className="section-wrap migration-grid" id="migration" data-section="migration">
        <div className="section-heading" data-reveal>
          <p className="eyebrow">Migration Plan</p>
          <h2>下一步迁移正文和图片</h2>
        </div>
        <article className="migration-card" data-reveal>
          <span>01</span>
          <h3>从 CSDN 导出 Markdown / HTML</h3>
          <p>每篇文章导出后保留正文、代码块和图片引用。最好打包成 ZIP 发给我，迁移会更完整。</p>
        </article>
        <article className="migration-card" data-reveal>
          <span>02</span>
          <h3>图片本地化</h3>
          <p>把 CSDN 图片下载到本站 public 目录，避免以后 CSDN 外链失效或防盗链影响展示。</p>
        </article>
        <article className="migration-card" data-reveal>
          <span>03</span>
          <h3>切换为站内详情页</h3>
          <p>建立文章详情路由、目录、代码高亮、SEO、RSS，再把“阅读全文”从 CSDN 外链改成站内链接。</p>
        </article>
      </section>

      <section className="section-wrap about-grid" id="about" data-section="about">
        <div className="about-copy" data-reveal>
          <p className="eyebrow">About</p>
          <h2>Erick.ShaWn：聚焦嵌入式控制、电源硬件和工程调试。</h2>
          <p>
            你的 CSDN 主页显示当前已有 22 篇原创文章，主要技术方向包括 F280049C、F2800137、SFO、CLA、SFRA、EPWM、
            HRPWM、SOGI-PLL、H 桥逆变器保护和电源硬件设计。
          </p>
          <p>
            当前网站的目标不是简单复制 CSDN，而是把文章重新组织成可持续维护的个人技术博客：结构更清晰、视觉更统一、
            后续可接 Markdown、RSS、搜索和自定义域名。
          </p>
        </div>
        <div className="profile-card" data-reveal>
          <div className="avatar-orb">ES</div>
          <h3>Erick.ShaWn</h3>
          <p>码龄 6 年 · 嵌入式硬件方向 · CSDN 原创作者</p>
          <a className="ghost-button magnetic" href="https://blog.csdn.net/qq_46560315" target="_blank" rel="noreferrer">
            查看 CSDN 主页
          </a>
        </div>
      </section>
    </main>
  );
}
