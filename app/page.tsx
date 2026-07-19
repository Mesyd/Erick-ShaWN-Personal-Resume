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
  ["snapshot", "概览"],
  ["skills", "技能"],
  ["projects", "项目"],
  ["experience", "实习"],
  ["education", "教育"],
  ["articles", "文章"],
  ["contact", "联系"],
];

const quickStats = [
  ["2027", "硕士应届生"],
  ["Top 2%", "本科专业排名"],
  ["2 项", "发明专利"],
  ["22 篇", "CSDN 原创文章"],
];

const roleTargets = ["数字电源工程师", "嵌入式软硬件工程师", "电力电子控制工程师", "硬件调试 / 应用工程师"];

const skillGroups = [
  {
    title: "数字电源与控制算法",
    items: ["电压电流双闭环", "PI 参数整定", "扰动观测器 DOB", "DOMC 复合控制", "SFRA 频域验证"],
  },
  {
    title: "DSP / MCU 底层开发",
    items: ["TI C2000 F280049C", "STM32 H7/F4/F1", "EPWM / HRPWM", "ADC 同步采样", "CAN / SPI / UART"],
  },
  {
    title: "功率硬件与电力电子",
    items: ["DAB 双有源桥", "全桥逆变", "SiC / GaN 器件", "高频磁件设计", "4 层功率 PCB Layout"],
  },
  {
    title: "调试与工程工具",
    items: ["PLECS / Matlab", "示波器 / 逻辑分析仪", "RCA 根因分析", "LVGL 图形界面", "Python 上位机"],
  },
];

const educationItems = [
  {
    degree: "硕士 · 新一代电子信息技术",
    school: "常州大学 · 2027 届",
    detail: "专业排名 9/42；获校一等奖学金、校二等奖学金。",
  },
  {
    degree: "本科 · 电子信息工程",
    school: "常州大学 · 2024 届",
    detail: "专业排名 2/82，前 2%；获校一等奖学金、院三好学生、优秀毕业生。",
  },
];

const projects = [
  {
    name: "1000W 基于 SiC 的 Cyclo 转换器单相离网逆变数字电源研发",
    status: "数字电源研发实习",
    summary:
      "在常州市红光电能科技股份有限公司实习联培期间，参与 1000W 单相离网逆变数字电源研发，覆盖 PLECS 仿真、磁件设计、DSP 驱动算法与功率硬件研发。",
    bullets: [
      "使用 PLECS 搭建功率拓扑与闭环控制系统仿真，复现文献控制策略，为 DSP 底层驱动和控制律整定提供依据。",
      "基于 TI C2000 F280049C 完成 8 个开关管复杂 EPWM 驱动时序、移相及频率调制代码编写。",
      "主导原理图、4 层功率 PCB Layout、SiC 负压关断与驱动回路优化，降低高频开关下的寄生电感风险。",
    ],
  },
  {
    name: "200W 高效率 DAB 变换器复合控制策略研究与实现",
    status: "科研项目 · 核心研发 / 第一作者",
    summary:
      "研制 200W 双有源桥 DAB 变换器样机，基于自主提出的 DOMC 复合控制策略，实现峰值效率 95%，负载阶跃恢复时间缩短至 400μs。",
    bullets: [
      "针对 MCSO 调制的非线性增益问题，构建二阶降阶扰动观测器，将内部增益波动和负载突变等效为集总扰动并前馈补偿。",
      "在 PLECS 中完成系统建模与频域验证，将连续域观测器离散化并部署到 TI C2000 F280049C。",
      "独立完成 SiC MOS 选型、驱动设计、4 层功率板 Layout 和 AP 法高频变压器参数计算与绕制。",
    ],
  },
  {
    name: "信号调制方式识别与参数估计装置",
    status: "全国大学生电子设计竞赛 · 队长",
    summary:
      "面向 AM/FM/CW、ASK/FSK/PSK 调制信号完成解调、AGC 幅值控制、调制类型识别、参数估计和 LCD 波形显示。",
    bullets: [
      "使用 Tina-TI / Multisim 完成硬件解调电路仿真与原理图设计，搭建放大、衰减、跟随、比较、有源滤波等模拟电路。",
      "基于 STM32F407 编写可控采样频率算法和信号处理代码，通过 FFT、寻峰算法和 THD 判断实现小信号测频与波形识别。",
      "基于 LVGL8 实现 LCD 触摸屏波形频谱和数据显示，提升系统交互性与现场可展示性。",
    ],
  },
];

const experienceItems = [
  {
    title: "常州市红光电能科技股份有限公司（实习联培）",
    meta: "数字电源研发工程师 · 2025.10 - 2026.5",
    bullets: [
      "参与 1000W 基于碳化硅的 Cyclo 转换器单相离网逆变数字电源研发。",
      "承担仿真验证、磁件设计、DSP 驱动算法、功率硬件研发与样机调试相关工作。",
      "形成数字电源控制、C2000 底层驱动、SiC 高频开关硬件和软硬件联调闭环经验。",
    ],
  },
];

const achievements = [
  "2023 年江苏省大学生电子设计大赛二等奖：信号调制方式识别与参数估计装置",
  "2023 年常州大学电子设计大赛校赛一等奖（个人参赛）",
  "2021 年江苏省大学生电子设计大赛二等奖：周期信号波形识别及参数测量装置",
  "2020 年江苏省大学生电子设计大赛二等奖：放大器非线性失真研究装置",
  "2020 年江苏省大学生机器人大赛三等奖：机器人阵地攻防项目",
  "发明专利：一种基于 LVGL 的便携式多功能数字示波器（公开审查中）",
  "发明专利：一种多自由度调制下双有源桥变换器的动态前馈补偿控制方法（实质审查中）",
  "证书：嵌入式系统设计师、AUTO-CAD、中级技工、英语 CET-4",
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
    () => ["常州大学硕士", "数字电源", "C2000", "DAB", "SiC / GaN", "PLECS", "Matlab", "LVGL"],
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
          <span className="brand-mark">SYD</span>
          <span>沙宇栋</span>
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
          <p className="eyebrow">Resume Landing / Digital Power / Embedded Hardware</p>
          <h1>沙宇栋，面向电子行业的数字电源与嵌入式控制工程师。</h1>
          <p className="hero-lede">
            常州大学新一代电子信息技术硕士，2027 届应届生。求职方向聚焦数字电源、嵌入式软硬件、电力电子控制与功率硬件调试。
            项目经历覆盖控制算法、DSP 底层驱动、功率硬件、磁件设计与样机调试。
          </p>
          <div className="hero-actions">
            <a className="primary-button magnetic" href="#snapshot">
              核心概览
              <span>→</span>
            </a>
            <a className="ghost-button magnetic" href="/resume-shayudong.pdf" target="_blank" rel="noreferrer">
              下载 PDF 简历
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
            <div className="signal-panel">
              <p className="panel-kicker">Engineering Profile</p>
              <h2>Power Control Stack</h2>
              <div className="tech-orbit" aria-hidden="true">
                <span className="orbit-core">C2000</span>
                <span className="orbit-chip chip-a">PLECS</span>
                <span className="orbit-chip chip-b">DAB</span>
                <span className="orbit-chip chip-c">SiC</span>
                <span className="orbit-chip chip-d">EPWM</span>
              </div>
              <div className="signal-lines">
                <div className="signal-line">
                  <span>目标岗位</span>
                  <strong>数字电源 / 嵌入式软硬件</strong>
                </div>
                <div className="signal-line">
                  <span>核心平台</span>
                  <strong>TI C2000 · STM32</strong>
                </div>
                <div className="signal-line">
                  <span>项目关键词</span>
                  <strong>DAB · SiC · 逆变控制</strong>
                </div>
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
          <h2>核心概览</h2>
        </div>

        <article className="snapshot-card primary" data-reveal>
          <span>候选人定位</span>
          <h3>数字电源研发 + 嵌入式软硬件</h3>
          <p>具备 C2000/STM32 底层开发、EPWM/ADC 同步、功率拓扑仿真、SiC 驱动和功率板 Layout 的综合经验。</p>
        </article>
        <article className="snapshot-card" data-reveal>
          <span>最强项目证据</span>
          <h3>200W DAB 复合控制与 1000W SiC 离网逆变</h3>
          <p>从 PLECS/Matlab 控制验证，到 TI C2000 部署，再到磁件、功率 PCB、样机调试，形成完整工程链路。</p>
        </article>
        <article className="snapshot-card" data-reveal>
          <span>公开技术沉淀</span>
          <h3>22 篇 CSDN 原创文章</h3>
          <p>文章覆盖 C2000、DSP、EPWM/HRPWM、CLA/SFRA、SOGI-PLL、短路保护、电源硬件计算等主题。</p>
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
          <p>控制算法、DSP 底层开发、功率硬件、样机调试与工程工具。</p>
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
        </div>
        <div className="project-list">
          {projects.map((project, index) => (
            <article className="project-card magnetic" data-reveal key={project.name} style={{ "--delay": `${index * 75}ms` } as CSSProperties}>
              <div>
                <span className="project-status">{project.status}</span>
                <h3>{project.name}</h3>
                <p>{project.summary}</p>
              </div>
              <ul className="project-bullets">
                {project.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="section-wrap experience-section" id="experience" data-section="experience">
        <div className="section-heading" data-reveal>
          <p className="eyebrow">Internship</p>
          <h2>实习经历</h2>
        </div>
        <div className="internship-list">
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

      <section className="section-wrap education-section" id="education" data-section="education">
        <div className="section-heading" data-reveal>
          <p className="eyebrow">Education / Awards</p>
          <h2>教育背景、竞赛、专利与证书</h2>
        </div>
        <div className="education-achievement-grid">
          <article className="experience-card education-card" data-reveal>
            <p className="experience-meta">Education</p>
            <h3>教育背景</h3>
            <div className="education-list">
              {educationItems.map((item) => (
                <div key={item.degree}>
                  <strong>{item.degree}</strong>
                  <span>{item.school}</span>
                  <p>{item.detail}</p>
                </div>
              ))}
            </div>
          </article>

          <div className="achievement-card" data-reveal>
            <p className="experience-meta">Awards / Patents / Certificates</p>
            <h3>竞赛、专利与证书</h3>
            <div className="achievement-list">
              {achievements.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section-wrap content-section" id="articles" data-section="articles">
        <div className="section-heading" data-reveal>
          <p className="eyebrow">Technical Articles</p>
          <h2>技术文章入口</h2>
          <p>
            这里作为 CSDN 技术文章索引。每篇文章保留主题摘要、技术标签和原文链接。
          </p>
        </div>
        <div className="article-grid">
          {articles.map((article, index) => (
            <article className="article-card magnetic" data-reveal key={article.href} style={{ "--delay": `${index * 60}ms` } as CSSProperties}>
              <div className="article-meta">
                <span>{article.date}</span>
                <strong>来自 CSDN</strong>
              </div>
              <div className="article-main">
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
      </section>

      <section className="section-wrap contact-grid" id="contact" data-section="contact">
        <div className="contact-card" data-reveal>
          <p className="eyebrow">Resume PDF</p>
          <h2>PDF 简历下载</h2>
          <p>PDF 简历已放入站点。当前网站保持 private。公开前建议确认邮箱、GitHub、Gitee 和 PDF 简历中的个人信息是否按你的预期展示。</p>
          <a className="primary-button magnetic" href="/resume-shayudong.pdf" target="_blank" rel="noreferrer">
            打开 / 下载 PDF 简历
            <span>↗</span>
          </a>
        </div>
        <div className="contact-card" data-reveal>
          <p className="eyebrow">Contact</p>
          <h2>联系方式与可信入口</h2>
          <div className="link-list">
            <a href="mailto:2290864133@qq.com">邮箱：2290864133@qq.com</a>
            <a href="https://gitee.com/Erick_ShaWn" target="_blank" rel="noreferrer">
              Gitee：gitee.com/Erick_ShaWn（项目沉淀更多）
            </a>
            <a href="https://github.com/Mesyd" target="_blank" rel="noreferrer">
              GitHub：github.com/Mesyd
            </a>
            <a href="https://blog.csdn.net/qq_46560315" target="_blank" rel="noreferrer">
              CSDN：blog.csdn.net/qq_46560315
            </a>
            <span>所在地：江苏常州</span>
          </div>
        </div>
      </section>
    </main>
  );
}
