"use client";

import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";

type NavItem = [string, string];

type Article = {
  title: string;
  summary: string;
  date: string;
  href: string;
  tags: string[];
};

const navItems: NavItem[] = [
  ["home", "首页"],
  ["snapshot", "30 秒"],
  ["skills", "技能"],
  ["projects", "项目"],
  ["articles", "文章"],
  ["contact", "联系"],
];

const quickStats = [
  ["22", "CSDN 原创文章"],
  ["6 年", "CSDN 码龄"],
  ["718", "CSDN 粉丝"],
  ["电子行业", "求职方向"],
];

const roleTargets = ["嵌入式软件工程师", "数字电源控制工程师", "电力电子控制工程师", "硬件调试 / 应用工程师"];

const skillGroups = [
  {
    title: "MCU / DSP 控制",
    items: ["TI C2000", "F280049C / F2800137", "SysConfig", "C2000Ware", "中断 / Timer / SCI FIFO"],
  },
  {
    title: "电力电子与电源",
    items: ["H 桥逆变器", "CBC 逐波限流", "SiC MOSFET 驱动", "电子保险丝", "PFC / DAB 基础"],
  },
  {
    title: "控制算法与外设",
    items: ["EPWM / HRPWM", "CMPSS + Trip Zone", "SOGI-PLL", "SFO / CLA / SFRA", "DAC / ADC 调试"],
  },
  {
    title: "工程工具",
    items: ["Embedded C", "MATLAB", "Python 自动化", "示波器调试思路", "技术文档沉淀"],
  },
];

const projects = [
  {
    name: "C2000 SCI + FIFO 工业通信移植",
    status: "技术文章已沉淀",
    summary:
      "基于 SysConfig 快速生成 F2800137 SCI 配置，梳理 115200 8-N-1、GPIO 复用、FIFO 水位中断、ISR 读取和异常帧处理策略。",
    proof: "可展示：初始化代码、FIFO 中断处理、残留字节与错位处理方案",
  },
  {
    name: "H 桥逆变器短路保护与 CBC 逐波限流",
    status: "电子行业重点项目表达",
    summary:
      "分析短路工况下电流上升、母线扰动和器件风险，对比外部比较器、CMPSS + DAC、ePWM Trip Zone 等硬件级保护路径。",
    proof: "可展示：保护链路、故障关断、周期复位、自动恢复逻辑",
  },
  {
    name: "F280049C 高分辨率 PWM / SFO / 同步链路调试",
    status: "可作为面试深挖主题",
    summary:
      "围绕 EPWM 同步、HRPWM、DBREDHR / DBFEDHR、MEP_ScaleFactor 校准等问题，整理底层寄存器和库移植经验。",
    proof: "可展示：同步架构理解、SFO 移植、HRPWM 死区控制注意事项",
  },
  {
    name: "SOGI-PLL 与逆变器正弦参考信号生成",
    status: "控制算法方向",
    summary:
      "整理 SOGI 正交信号、Park 变换、PI 锁相、查表法与实时计算法的取舍，面向单相逆变器同步与调制场景。",
    proof: "可展示：算法框图、离散化思路、RampGen / 正弦参考实现",
  },
];

const experienceItems = [
  {
    title: "工作 / 实习经历待补充",
    meta: "建议填入：公司/实验室、岗位、时间、项目职责",
    bullets: ["我已预留正式经历模块。你提供真实经历后，我会改成 HR 能直接阅读的 STAR 结构。", "电子行业简历建议优先写：负责模块、使用芯片、调试工具、问题闭环、量化结果。"],
  },
  {
    title: "电子行业简历优化重点",
    meta: "比泛泛写技术栈更有效",
    bullets: ["突出 C2000、数字电源、逆变器保护、PWM、控制算法和硬件调试证据。", "每个项目都要能回答：电路/控制目标是什么，问题是什么，你如何定位，结果如何验证。"],
  },
];

const articles: Article[] = [
  {
    title: "[C2000实战] SysConfig 生成并移植 F2800137 SCI + FIFO 中断代码",
    summary: "工业控制通信、FIFO 水位中断、ISR 与异常帧处理。",
    date: "2026-07-01",
    href: "https://blog.csdn.net/qq_46560315/article/details/162493090",
    tags: ["C2000", "SCI", "FIFO"],
  },
  {
    title: "H 桥逆变器输出短路保护与 CBC 逐波限流",
    summary: "短路工况、CMPSS、ePWM Trip Zone 与硬件级保护链路。",
    date: "2026-07-01",
    href: "https://blog.csdn.net/qq_46560315/article/details/162459824",
    tags: ["逆变器", "保护", "DSP"],
  },
  {
    title: "SOGI-PLL 二阶广义积分器锁相环设计学习记录",
    summary: "正交信号、Park 变换、PI 锁相与单相逆变器同步。",
    date: "2025-11-19",
    href: "https://blog.csdn.net/qq_46560315/article/details/155011826",
    tags: ["SOGI", "PLL", "控制算法"],
  },
  {
    title: "F280049C HRPWM_DBREDHR_DBFEDHR 技术手册记录",
    summary: "MEP、HRPWM 寄存器和高分辨率死区控制。",
    date: "2024-12-11",
    href: "https://blog.csdn.net/qq_46560315/article/details/144383948",
    tags: ["F280049C", "HRPWM", "寄存器"],
  },
  {
    title: "DSPF280049C CLAmath 数学库添加到工程文件记录",
    summary: "CLA 数学库、头文件、Lib 添加和 CLAsin 调用验证。",
    date: "2025-07-04",
    href: "https://blog.csdn.net/qq_46560315/article/details/149114856",
    tags: ["CLA", "CLAmath", "F280049C"],
  },
  {
    title: "TPS259631DDAR 电子保险丝原理图绘制及计算",
    summary: "OVLO / UVLO 分压、ILM 电流限制和电阻选型。",
    date: "2025-03-05",
    href: "https://blog.csdn.net/qq_46560315/article/details/146042314",
    tags: ["电源硬件", "电子保险丝", "计算"],
  },
];

export default function Home() {
  const shellRef = useRef<HTMLDivElement>(null);
  const [activeSection, setActiveSection] = useState("home");

  const featuredTags = useMemo(
    () => ["C2000", "DSP", "数字电源", "逆变器", "EPWM", "HRPWM", "SOGI-PLL", "硬件调试"],
    [],
  );

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
          <span className="brand-mark">ES</span>
          <span>Erick.ShaWn</span>
        </a>
        <nav>
          {navItems.map(([id, label]) => (
            <a className={activeSection === id ? "active" : ""} href={`#${id}`} key={id}>
              {label}
            </a>
          ))}
        </nav>
      </header>

      <section className="hero section-wrap" id="home" data-section="home">
        <div className="hero-copy" data-reveal>
          <p className="eyebrow">Resume Landing / Electronics Industry / Embedded Control</p>
          <h1>面向电子行业的嵌入式与电源控制简历网站。</h1>
          <p className="hero-lede">
            我是 Erick.ShaWn，求职方向聚焦电子行业中的嵌入式控制、数字电源、电力电子控制与硬件调试。
            这个网站会同时承担在线简历、项目证据、技术文章入口和后续 PDF 简历下载入口。
          </p>
          <div className="hero-actions">
            <a className="primary-button magnetic" href="#snapshot">
              30 秒了解我
              <span>→</span>
            </a>
            <a className="ghost-button magnetic" href="#articles">
              查看技术文章
            </a>
          </div>
          <div className="hero-tags" aria-label="核心方向">
            {featuredTags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
        </div>

        <div className="hero-card" data-reveal>
          <div className="device-frame">
            <div className="device-top">
              <span />
              <span />
              <span />
            </div>
            <div className="resume-panel">
              <p className="panel-kicker">Candidate Signal</p>
              <h2>Embedded + Power</h2>
              <div className="signal-line">
                <span>目标行业</span>
                <strong>电子 / 电力电子</strong>
              </div>
              <div className="signal-line">
                <span>核心证据</span>
                <strong>项目 + 文章</strong>
              </div>
              <div className="signal-line">
                <span>公开状态</span>
                <strong>Private Draft</strong>
              </div>
            </div>
            <div className="signal-grid">
              {quickStats.map(([value, label]) => (
                <div key={label}>
                  <strong>{value}</strong>
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section-wrap snapshot-grid" id="snapshot" data-section="snapshot">
        <div className="section-heading" data-reveal>
          <p className="eyebrow">30 Seconds</p>
          <h2>30 秒了解我</h2>
          <p>这部分是给 HR 和面试官第一眼看的结论区。公开前只需要补齐真实学校、经历、邮箱和 PDF 简历即可。</p>
        </div>

        <article className="snapshot-card primary" data-reveal>
          <span>目标岗位</span>
          <h3>嵌入式 / 数字电源 / 电力电子控制方向</h3>
          <p>适合电子行业中需要 MCU/DSP 控制、PWM 外设、保护逻辑、硬件调试和技术文档沉淀的岗位。</p>
        </article>
        <article className="snapshot-card" data-reveal>
          <span>技术证据</span>
          <h3>围绕 C2000、F280049C、逆变器和电源硬件持续输出</h3>
          <p>已有 22 篇 CSDN 原创文章，覆盖 SCI FIFO、EPWM/HRPWM、CLA/SFRA、SOGI-PLL、CBC 保护等主题。</p>
        </article>
        <article className="snapshot-card" data-reveal>
          <span>面试表达</span>
          <h3>用项目闭环讲能力，而不是只列技术栈</h3>
          <p>每个项目按“目标 → 问题 → 调试 → 结果 → 复盘”组织，更适合电子行业技术面试追问。</p>
        </article>
      </section>

      <section className="section-wrap role-strip" aria-label="目标岗位" data-reveal>
        {roleTargets.map((role, index) => (
          <span key={role} style={{ "--delay": `${index * 55}ms` } as CSSProperties}>
            {role}
          </span>
        ))}
      </section>

      <section className="section-wrap content-section" id="skills" data-section="skills">
        <div className="section-heading" data-reveal>
          <p className="eyebrow">Core Skills</p>
          <h2>核心技能</h2>
          <p>面向电子行业优化后，技能区优先展示“芯片平台、外设能力、电源/控制理解、调试能力”。</p>
        </div>
        <div className="skills-grid">
          {skillGroups.map((group, index) => (
            <article className="skill-card" data-reveal key={group.title} style={{ "--delay": `${index * 80}ms` } as CSSProperties}>
              <h3>{group.title}</h3>
              <div>
                {group.items.map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section-wrap content-section" id="projects" data-section="projects">
        <div className="section-heading" data-reveal>
          <p className="eyebrow">Projects</p>
          <h2>项目经历</h2>
          <p>当前先基于你已公开文章里的技术主题整理成项目表达。后续你给我真实项目细节后，我会改成正式简历口径。</p>
        </div>
        <div className="project-list">
          {projects.map((project, index) => (
            <article className="project-card magnetic" data-reveal key={project.name} style={{ "--delay": `${index * 75}ms` } as CSSProperties}>
              <div>
                <span className="project-status">{project.status}</span>
                <h3>{project.name}</h3>
                <p>{project.summary}</p>
              </div>
              <footer>{project.proof}</footer>
            </article>
          ))}
        </div>
      </section>

      <section className="section-wrap experience-section">
        <div className="section-heading" data-reveal>
          <p className="eyebrow">Experience</p>
          <h2>工作 / 实习经历</h2>
          <p>这里目前是私有草稿。真实经历补齐后，这一块会成为 HR 判断匹配度的核心区域。</p>
        </div>
        <div className="experience-grid">
          {experienceItems.map((item) => (
            <article className="experience-card" data-reveal key={item.title}>
              <p className="experience-meta">{item.meta}</p>
              <h3>{item.title}</h3>
              <ul>
                {item.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="section-wrap content-section" id="articles" data-section="articles">
        <div className="section-heading" data-reveal>
          <p className="eyebrow">Technical Articles</p>
          <h2>技术文章</h2>
          <p>
            已把“技术文章精选”和“CSDN 文章迁移区”合并。当前展示精选文章和迁移状态，后续导入 Markdown/HTML 后切换为站内详情页。
          </p>
        </div>
        <div className="article-grid">
          {articles.map((article, index) => (
            <article className="article-card magnetic" data-reveal key={article.href} style={{ "--delay": `${index * 60}ms` } as CSSProperties}>
              <div>
                <div className="article-meta">
                  <span>{article.date}</span>
                  <strong>来自 CSDN</strong>
                </div>
                <h3>{article.title}</h3>
                <p>{article.summary}</p>
              </div>
              <footer>
                <div>
                  {article.tags.map((tag) => (
                    <span className="tag" key={tag}>
                      {tag}
                    </span>
                  ))}
                </div>
                <a href={article.href} target="_blank" rel="noreferrer">
                  阅读原文
                </a>
              </footer>
            </article>
          ))}
        </div>
        <div className="migration-note" data-reveal>
          <span>迁移状态</span>
          <p>22 篇文章索引已迁入。正文、图片、代码块待你导出 Markdown/HTML 或 ZIP 后继续本地化。</p>
        </div>
      </section>

      <section className="section-wrap contact-grid" id="contact" data-section="contact">
        <div className="contact-card" data-reveal>
          <p className="eyebrow">Resume PDF</p>
          <h2>PDF 简历下载入口</h2>
          <p>
            当前还没有你的正式 PDF 简历文件，所以我先保留入口但不提供错误下载。你把 PDF 发给我后，我会放到
            <code>/resume.pdf</code>，并把按钮改成直接下载。
          </p>
          <button className="ghost-button" type="button" disabled>
            PDF 简历待上传
          </button>
        </div>
        <div className="contact-card" data-reveal>
          <p className="eyebrow">Contact</p>
          <h2>联系方式与可信入口</h2>
          <div className="link-list">
            <a href="https://blog.csdn.net/qq_46560315" target="_blank" rel="noreferrer">
              CSDN：blog.csdn.net/qq_46560315
            </a>
            <span>GitHub：待补充</span>
            <span>邮箱：待补充</span>
            <span>公开域名：建议后续绑定 erick.dev / resume.erick.dev</span>
          </div>
        </div>
      </section>
    </main>
  );
}
