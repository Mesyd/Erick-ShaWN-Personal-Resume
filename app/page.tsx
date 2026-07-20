"use client";

import { lazy, Suspense, useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import ProfileCard from "./ProfileCard";

const Galaxy = lazy(() => import("./Galaxy"));

type NavItem = [string, string];

type Article = {
  title: string;
  summary: string;
  date: string;
  href: string;
  tags: string[];
};

type ProjectImage = {
  label: string;
  caption: string;
  src?: string;
};

type ProjectAlbum = {
  title: string;
  subtitle: string;
  images: ProjectImage[];
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
  ["4 项", "省级竞赛奖项"],
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

const projectImageAlbums: ProjectAlbum[] = [
  {
    title: "DAB 变换器样机",
    subtitle: "后续可放整机、功率板、驱动板和磁件照片",
    images: [
      { label: "样机全貌", caption: "整机结构 / 台架搭建 / 安全间距" },
      { label: "功率 PCB", caption: "4 层 Layout / SiC 回路 / 母线布局" },
      { label: "磁件设计", caption: "高频变压器 / 磁芯 / 绕制工艺" },
    ],
  },
  {
    title: "测试波形与实验数据",
    subtitle: "后续可放示波器截图、效率曲线和阶跃响应",
    images: [
      { label: "驱动波形", caption: "EPWM / 死区 / 相移关系" },
      { label: "负载阶跃", caption: "动态响应 / 恢复时间 / 超调" },
      { label: "效率验证", caption: "输入输出功率 / 热点 / 损耗分析" },
    ],
  },
  {
    title: "1000W SiC 离网逆变",
    subtitle: "后续可放样机照片、PLECS 仿真和调试记录",
    images: [
      { label: "PLECS 仿真", caption: "拓扑建模 / 闭环控制 / 参数扫描" },
      { label: "硬件调试", caption: "SiC 驱动 / 保护链路 / 上电流程" },
      { label: "输出验证", caption: "电压电流波形 / 保护动作 / 稳态质量" },
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
    () => ["数字电源", "硬件设计", "DSP 控制", "功率调试", "控制算法", "磁芯元件设计"],
    [],
  );

  useEffect(() => {
    const sections = Array.from(document.querySelectorAll<HTMLElement>("[data-section]"));
    const revealTargets = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));

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

    revealTargets.forEach((target) => revealObserver.observe(target));

    let frameId = 0;
    const syncActiveSection = () => {
      frameId = 0;
      const documentBottom = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 16;
      if (documentBottom) {
        setActiveSection(sections[sections.length - 1]?.dataset.section ?? "home");
        return;
      }

      const anchorLine = window.innerHeight * 0.42;
      const current = sections.reduce<HTMLElement | null>((active, section) => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= anchorLine && rect.bottom >= 80) return section;
        if (!active && rect.top > anchorLine) return section;
        return active;
      }, null);

      if (current?.dataset.section) setActiveSection(current.dataset.section);
    };

    const requestSync = () => {
      if (frameId === 0) frameId = window.requestAnimationFrame(syncActiveSection);
    };

    syncActiveSection();
    window.addEventListener("scroll", requestSync, { passive: true });
    window.addEventListener("resize", requestSync);

    return () => {
      revealObserver.disconnect();
      window.removeEventListener("scroll", requestSync);
      window.removeEventListener("resize", requestSync);
      if (frameId !== 0) window.cancelAnimationFrame(frameId);
    };
  }, []);

  return (
    <main className="site-shell" ref={shellRef}>
      <Suspense fallback={null}>
        <Galaxy
          className="resume-galaxy"
          mouseInteraction
          mouseRepulsion
          density={1.45}
          glowIntensity={0.34}
          saturation={0.82}
          hueShift={230}
          rotationSpeed={0.045}
          starSpeed={0.36}
          speed={0.92}
          twinkleIntensity={0.42}
          repulsionStrength={2.6}
          transparent
        />
      </Suspense>

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
          <h1 className="hero-title">
            <span className="hero-name">沙宇栋</span>
            <span className="hero-role-row">
              <span className="hero-role">常州大学</span>
              <span className="hero-role">电子信息工程专业 硕士研究生</span>
            </span>
          </h1>
          <div className="hero-actions">
            <a className="primary-button magnetic" href="#projects">
              查看项目证据
              <span>→</span>
            </a>
            <a className="ghost-button magnetic" href="#contact">
              获取联系方式
            </a>
          </div>
          <div className="hero-tags" aria-label="核心方向">
            {featuredTags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
        </div>

        <div className="hero-card" data-reveal>
          <div className="profile-card-stack">
            <ProfileCard
              avatarUrl="/profile/resume-portrait.jpg"
              name="数字电源工程师"
              title="Digital Power Engineer"
              handle="Erick_ShaWn"
              status=""
              miniAvatarUrl="/profile/shayudong.webp"
              contactText="Contact"
              contactHref="mailto:2290864133@qq.com"
              className="resume-profile-card"
              innerGradient="linear-gradient(145deg, rgba(96,73,110,0.62) 0%, rgba(113,196,255,0.26) 44%, rgba(0,255,209,0.18) 100%)"
            />
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
        <div className="proof-flow" data-reveal>
          <div className="proof-flow-head">
            <span>工程闭环图</span>
            <strong>从控制验证到样机调试</strong>
          </div>
          <ol>
            <li>
              <span>01</span>
              <strong>PLECS / Matlab</strong>
              <em>控制策略验证</em>
            </li>
            <li>
              <span>02</span>
              <strong>TI C2000</strong>
              <em>EPWM / ADC / CLA 部署</em>
            </li>
            <li>
              <span>03</span>
              <strong>SiC / DAB</strong>
              <em>功率硬件与磁件设计</em>
            </li>
            <li>
              <span>04</span>
              <strong>样机调试</strong>
              <em>波形、保护与效率验证</em>
            </li>
          </ol>
        </div>
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
        <div className="project-gallery" data-reveal>
          <div className="project-gallery-head">
            <span>Project Media Archive</span>
            <h3>项目图片收录</h3>
            <p>为后续样机照片、测试波形、PCB Layout、磁件和实验台架预留。每个项目可维护一个图片组，图片较多时按“样机 / 测试 / 设计资料”分层展示。</p>
          </div>
          <div className="project-album-grid">
            {projectImageAlbums.map((album) => (
              <article className="project-album-card magnetic" key={album.title}>
                <div className="album-stack" aria-label={`${album.title} 图片组`}>
                  {album.images.map((image, imageIndex) => (
                    <figure
                      className={`album-shot ${image.src ? "has-image" : "is-placeholder"}`}
                      key={image.label}
                      style={{ "--shot-index": imageIndex } as CSSProperties}
                    >
                      {image.src ? <img src={image.src} alt={image.label} /> : <span>{image.label}</span>}
                      <figcaption>{image.caption}</figcaption>
                    </figure>
                  ))}
                </div>
                <div className="album-copy">
                  <strong>{album.title}</strong>
                  <span>{album.subtitle}</span>
                </div>
              </article>
            ))}
          </div>
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
        <div className="contact-card contact-card-wide" data-reveal>
          <p className="eyebrow">Contact</p>
          <h2>公开主页与联系方式</h2>
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
