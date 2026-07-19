"use client";

import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";

const posts = [
  {
    tag: "Frontend Architecture",
    title: "从交互细节看前端工程的长期价值",
    summary:
      "把动效、状态、性能和可维护性放到同一张设计图里，页面体验才不会只停留在视觉层。",
    time: "8 min read",
  },
  {
    tag: "AI Engineering",
    title: "用 AI 工作流提高研发决策密度",
    summary:
      "记录如何把代码生成、评审、自动化验证和知识沉淀串成稳定的个人工程系统。",
    time: "12 min read",
  },
  {
    tag: "Performance",
    title: "让复杂页面保持 60fps 的几个原则",
    summary:
      "从渲染成本、滚动监听、合成层和资源加载四个角度拆解高质感页面的性能边界。",
    time: "10 min read",
  },
];

const projects = [
  {
    name: "Signal Desk",
    type: "数据面板",
    description: "用于跟踪技术趋势、项目状态和个人知识资产的实时工作台。",
    metric: "24",
    label: "自动化信号",
  },
  {
    name: "Motion Notes",
    type: "交互实验",
    description: "沉淀滚动、鼠标、视差和玻璃拟态控件的前端实验集合。",
    metric: "60fps",
    label: "目标帧率",
  },
  {
    name: "Build Log",
    type: "工程笔记",
    description: "把真实项目中的技术判断、踩坑复盘和架构取舍整理成公开文章。",
    metric: "128",
    label: "知识片段",
  },
];

const skills = [
  "React / Next.js",
  "TypeScript",
  "Design Systems",
  "Web Performance",
  "AI Tooling",
  "Cloudflare",
  "Data Visualization",
  "Automation",
];

export default function Home() {
  const shellRef = useRef<HTMLDivElement>(null);
  const [activeSection, setActiveSection] = useState("home");
  const [copied, setCopied] = useState(false);

  const nav = useMemo(
    () => [
      ["home", "首页"],
      ["posts", "文章"],
      ["projects", "项目"],
      ["about", "关于"],
      ["contact", "联系"],
    ],
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
      root.style.setProperty("--tilt-x", `${(event.clientY / window.innerHeight - 0.5) * -8}deg`);
      root.style.setProperty("--tilt-y", `${(event.clientX / window.innerWidth - 0.5) * 8}deg`);
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

  const copyEmail = async () => {
    await navigator.clipboard.writeText("hello@erick.dev");
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };

  return (
    <main className="site-shell" ref={shellRef}>
      <div className="cursor-light" aria-hidden="true" />
      <header className="floating-nav" aria-label="主导航">
        <a className="brand" href="#home" aria-label="返回首页">
          <span className="brand-mark">E</span>
          <span>Erick.dev</span>
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
          <p className="eyebrow">Personal Tech Blog / Frontend / AI Workflow</p>
          <h1>记录工程判断，构建有质感的前端体验。</h1>
          <p className="hero-lede">
            这是我的个人技术博客，关注前端架构、交互设计、AI 工程化、性能优化和产品化思维。
            我把真实项目里的技术选择、复盘和实验整理成可复用的文章与案例。
          </p>
          <div className="hero-actions">
            <a className="primary-button magnetic" href="#posts">
              阅读文章
              <span>→</span>
            </a>
            <a className="ghost-button magnetic" href="#projects">
              查看项目
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
            <div className="code-panel">
              <p>
                <span>const</span> craft = &#123;
              </p>
              <p>  taste: "minimal",</p>
              <p>  motion: "subtle",</p>
              <p>  quality: "production"</p>
              <p>&#125;</p>
            </div>
            <div className="signal-grid">
              <div>
                <strong>60fps</strong>
                <span>交互目标</span>
              </div>
              <div>
                <strong>8+</strong>
                <span>技术主题</span>
              </div>
              <div>
                <strong>Weekly</strong>
                <span>更新节奏</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-wrap feature-strip" aria-label="博客功能" data-reveal>
        <article>
          <span>01</span>
          <h2>技术文章</h2>
          <p>沉淀前端、AI、工程效率、性能优化相关的系统性文章。</p>
        </article>
        <article>
          <span>02</span>
          <h2>项目档案</h2>
          <p>展示个人项目、交互实验、数据工具和长期维护的工程实践。</p>
        </article>
        <article>
          <span>03</span>
          <h2>知识索引</h2>
          <p>按技术栈和问题域组织内容，方便快速回溯关键结论。</p>
        </article>
      </section>

      <section className="section-wrap content-section" id="posts" data-section="posts">
        <div className="section-heading" data-reveal>
          <p className="eyebrow">Featured Writing</p>
          <h2>精选文章</h2>
          <p>每篇文章都围绕一个具体工程问题展开：背景、取舍、实现、验证和复盘。</p>
        </div>
        <div className="post-grid">
          {posts.map((post, index) => (
            <article className="post-card magnetic" data-reveal key={post.title} style={{ "--delay": `${index * 90}ms` } as CSSProperties}>
              <div>
                <span className="tag">{post.tag}</span>
                <h3>{post.title}</h3>
                <p>{post.summary}</p>
              </div>
              <footer>
                <span>{post.time}</span>
                <button aria-label={`打开文章：${post.title}`}>阅读全文</button>
              </footer>
            </article>
          ))}
        </div>
      </section>

      <section className="section-wrap content-section" id="projects" data-section="projects">
        <div className="section-heading" data-reveal>
          <p className="eyebrow">Selected Projects</p>
          <h2>项目与实验</h2>
          <p>用小而完整的项目验证想法，保留可复用的模式，而不是只留下截图。</p>
        </div>
        <div className="project-lane">
          {projects.map((project, index) => (
            <article className="project-card" data-reveal key={project.name} style={{ "--delay": `${index * 120}ms` } as CSSProperties}>
              <div className="project-meta">
                <span>{project.type}</span>
                <strong>{project.metric}</strong>
              </div>
              <h3>{project.name}</h3>
              <p>{project.description}</p>
              <small>{project.label}</small>
            </article>
          ))}
        </div>
      </section>

      <section className="section-wrap about-grid" id="about" data-section="about">
        <div className="about-copy" data-reveal>
          <p className="eyebrow">About Me</p>
          <h2>我是 Erick，一个关注工程质量和产品体验的技术创作者。</h2>
          <p>
            我长期关注如何把复杂系统做得清晰、稳定且具备高级感。这个博客会记录我的技术研究、
            项目复盘、前端交互实验，以及 AI 工具如何进入真实研发流程。
          </p>
          <p>
            我偏好的工作方式是：先定义问题，再拆解约束，用可验证的实现推进，而不是停留在概念讨论。
          </p>
        </div>
        <div className="skill-cloud" data-reveal>
          {skills.map((skill) => (
            <span className="magnetic" key={skill}>
              {skill}
            </span>
          ))}
        </div>
      </section>

      <section className="section-wrap contact-card" id="contact" data-section="contact" data-reveal>
        <div>
          <p className="eyebrow">Contact / Subscribe</p>
          <h2>如果你也关注高质量工程实践，可以从这里开始交流。</h2>
          <p>后续可以接入 newsletter、RSS、Markdown 文章目录或后台 CMS。</p>
        </div>
        <div className="contact-actions">
          <button className="primary-button magnetic" onClick={copyEmail} type="button">
            {copied ? "邮箱已复制" : "复制邮箱"}
          </button>
          <a className="ghost-button magnetic" href="mailto:hello@erick.dev">
            hello@erick.dev
          </a>
        </div>
      </section>
    </main>
  );
}
