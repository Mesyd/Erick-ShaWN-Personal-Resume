"use client";

import { useCallback, useEffect, useMemo, useRef, type CSSProperties } from "react";

type ProfileCardProps = {
  avatarUrl: string;
  name: string;
  title: string;
  handle: string;
  status: string;
  contactText: string;
  contactHref: string;
  className?: string;
  innerGradient?: string;
  behindGlowEnabled?: boolean;
};

type ProfileCardStyle = CSSProperties & {
  "--pointer-x"?: string;
  "--pointer-y"?: string;
  "--rotate-x"?: string;
  "--rotate-y"?: string;
  "--card-opacity"?: string | number;
  "--inner-gradient"?: string;
};

const clamp = (value: number, min = 0, max = 100) => Math.min(Math.max(value, min), max);

export default function ProfileCard({
  avatarUrl,
  name,
  title,
  handle,
  status,
  contactText,
  contactHref,
  className = "",
  innerGradient = "linear-gradient(145deg, rgba(96, 73, 110, 0.55) 0%, rgba(113, 196, 255, 0.28) 48%, rgba(0, 255, 209, 0.18) 100%)",
  behindGlowEnabled = true,
}: ProfileCardProps) {
  const shellRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const current = useRef({ x: 50, y: 50 });
  const target = useRef({ x: 50, y: 50 });

  const setCardVars = useCallback((x: number, y: number, opacity = 1) => {
    const shell = shellRef.current;
    if (!shell) return;
    const centerX = x - 50;
    const centerY = y - 50;
    shell.style.setProperty("--pointer-x", `${x}%`);
    shell.style.setProperty("--pointer-y", `${y}%`);
    shell.style.setProperty("--rotate-x", `${clamp(centerY / 4, -12, 12)}deg`);
    shell.style.setProperty("--rotate-y", `${clamp(-centerX / 5, -12, 12)}deg`);
    shell.style.setProperty("--card-opacity", `${opacity}`);
  }, []);

  const animateToTarget = useCallback(() => {
    current.current.x += (target.current.x - current.current.x) * 0.16;
    current.current.y += (target.current.y - current.current.y) * 0.16;
    setCardVars(current.current.x, current.current.y, 1);

    if (Math.abs(target.current.x - current.current.x) > 0.08 || Math.abs(target.current.y - current.current.y) > 0.08) {
      rafRef.current = requestAnimationFrame(animateToTarget);
    } else {
      rafRef.current = null;
    }
  }, [setCardVars]);

  const startAnimation = useCallback(() => {
    if (rafRef.current === null) rafRef.current = requestAnimationFrame(animateToTarget);
  }, [animateToTarget]);

  const handlePointerMove = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      const rect = event.currentTarget.getBoundingClientRect();
      target.current = {
        x: clamp(((event.clientX - rect.left) / rect.width) * 100),
        y: clamp(((event.clientY - rect.top) / rect.height) * 100),
      };
      startAnimation();
    },
    [startAnimation],
  );

  const handlePointerLeave = useCallback(() => {
    target.current = { x: 50, y: 50 };
    startAnimation();
    window.setTimeout(() => {
      if (shellRef.current) shellRef.current.style.setProperty("--card-opacity", "0");
    }, 260);
  }, [startAnimation]);

  useEffect(() => {
    setCardVars(64, 28, 0.85);
    const timer = window.setTimeout(() => {
      target.current = { x: 50, y: 50 };
      startAnimation();
    }, 600);
    return () => {
      window.clearTimeout(timer);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [setCardVars, startAnimation]);

  const style = useMemo<ProfileCardStyle>(
    () => ({
      "--inner-gradient": innerGradient,
    }),
    [innerGradient],
  );

  return (
    <div
      className={`pc-card-wrapper ${className}`.trim()}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      ref={shellRef}
      style={style}
    >
      {behindGlowEnabled && <div className="pc-behind" />}
      <section className="pc-card-shell">
        <div className="pc-card-shine" />
        <div className="pc-avatar-stage">
          <img className="pc-avatar" src={avatarUrl} alt={`${name} avatar`} />
        </div>
        <div className="pc-main-copy">
          <span className="pc-status-pill">{status}</span>
          <h2>{name}</h2>
          <p>{title}</p>
        </div>
        <div className="pc-user-info">
          <div className="pc-mini-profile">
            <img src={avatarUrl} alt="" aria-hidden="true" />
            <div>
              <strong>@{handle}</strong>
              <span>{title}</span>
            </div>
          </div>
          <a className="pc-contact-btn" href={contactHref}>
            {contactText}
          </a>
        </div>
      </section>
    </div>
  );
}
