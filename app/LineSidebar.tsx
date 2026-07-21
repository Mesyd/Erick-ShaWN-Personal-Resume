"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties, type PointerEvent } from "react";

type Falloff = "linear" | "smooth" | "sharp";

export type LineSidebarItem = {
  id: string;
  label: string;
};

type LineSidebarProps = {
  items: LineSidebarItem[];
  activeId: string;
  accentColor?: string;
  textColor?: string;
  markerColor?: string;
  showIndex?: boolean;
  showMarker?: boolean;
  proximityRadius?: number;
  maxShift?: number;
  falloff?: Falloff;
  markerLength?: number;
  markerGap?: number;
  tickScale?: number;
  scaleTick?: boolean;
  itemGap?: number;
  fontSize?: number;
  smoothing?: number;
  className?: string;
};

const FALLOFF_CURVES: Record<Falloff, (proximity: number) => number> = {
  linear: (proximity) => proximity,
  smooth: (proximity) => proximity * proximity * (3 - 2 * proximity),
  sharp: (proximity) => proximity * proximity * proximity,
};

export default function LineSidebar({
  items,
  activeId,
  accentColor = "#28f7d1",
  textColor = "rgba(245, 248, 255, 0.72)",
  markerColor = "rgba(245, 248, 255, 0.26)",
  showIndex = true,
  showMarker = true,
  proximityRadius = 110,
  maxShift = 24,
  falloff = "smooth",
  markerLength = 48,
  markerGap = 10,
  tickScale = 0.42,
  scaleTick = true,
  itemGap = 14,
  fontSize = 0.9,
  smoothing = 90,
  className = "",
}: LineSidebarProps) {
  const listRef = useRef<HTMLUListElement | null>(null);
  const itemRefs = useRef<Array<HTMLLIElement | null>>([]);
  const targetsRef = useRef<number[]>([]);
  const currentRef = useRef<number[]>([]);
  const rafRef = useRef<number | null>(null);
  const lastRef = useRef(0);
  const activeRef = useRef(activeId);
  const smoothingRef = useRef(smoothing);
  const [clickedId, setClickedId] = useState<string | null>(null);

  activeRef.current = clickedId ?? activeId;
  smoothingRef.current = smoothing;

  useEffect(() => {
    setClickedId(null);
  }, [activeId]);

  const runFrame = useCallback((now: number) => {
    const dt = Math.min((now - lastRef.current) / 1000, 0.05);
    lastRef.current = now;
    const tau = Math.max(smoothingRef.current, 1) / 1000;
    const k = 1 - Math.exp(-dt / tau);
    let moving = false;

    itemRefs.current.forEach((element, index) => {
      if (!element) return;
      const item = items[index];
      const target = Math.max(targetsRef.current[index] || 0, activeRef.current === item?.id ? 1 : 0);
      const current = currentRef.current[index] || 0;
      const next = current + (target - current) * k;
      const settled = Math.abs(target - next) < 0.0015;
      const value = settled ? target : next;
      currentRef.current[index] = value;
      element.style.setProperty("--effect", value.toFixed(4));
      if (!settled) moving = true;
    });

    rafRef.current = moving ? requestAnimationFrame(runFrame) : null;
  }, [items]);

  const startLoop = useCallback(() => {
    if (rafRef.current !== null) return;
    lastRef.current = performance.now();
    rafRef.current = requestAnimationFrame(runFrame);
  }, [runFrame]);

  const handlePointerMove = useCallback(
    (event: PointerEvent<HTMLUListElement>) => {
      const list = listRef.current;
      if (!list) return;
      const rect = list.getBoundingClientRect();
      const pointerY = event.clientY - rect.top;
      const ease = FALLOFF_CURVES[falloff] ?? FALLOFF_CURVES.linear;

      itemRefs.current.forEach((element, index) => {
        if (!element) return;
        const center = element.offsetTop + element.offsetHeight / 2;
        const distance = Math.abs(pointerY - center);
        targetsRef.current[index] = ease(Math.max(0, 1 - distance / proximityRadius));
      });

      startLoop();
    },
    [falloff, proximityRadius, startLoop],
  );

  const handlePointerLeave = useCallback(() => {
    targetsRef.current = targetsRef.current.map(() => 0);
    startLoop();
  }, [startLoop]);

  const handleClick = useCallback((item: LineSidebarItem) => {
    setClickedId(item.id);
    document.getElementById(item.id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    window.history.replaceState(null, "", `#${item.id}`);
  }, []);

  useEffect(() => {
    startLoop();
  }, [activeId, clickedId, startLoop]);

  useEffect(
    () => () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    },
    [],
  );

  return (
    <nav
      className={`line-sidebar${showMarker ? " line-sidebar--markers" : ""}${scaleTick ? " line-sidebar--scale-tick" : ""}${className ? ` ${className}` : ""}`}
      style={
        {
          "--accent-color": accentColor,
          "--text-color": textColor,
          "--marker-color": markerColor,
          "--marker-length": `${markerLength}px`,
          "--marker-gap": `${markerGap}px`,
          "--tick-scale": tickScale,
          "--max-shift": `${maxShift}px`,
          "--item-gap": `${itemGap}px`,
          "--font-size": `${fontSize}rem`,
          "--smoothing": `${smoothing}ms`,
        } as CSSProperties
      }
      aria-label="章节导航"
    >
      <ul ref={listRef} className="line-sidebar__list" onPointerMove={handlePointerMove} onPointerLeave={handlePointerLeave}>
        {items.map((item, index) => (
          <li
            key={item.id}
            ref={(element) => {
              itemRefs.current[index] = element;
            }}
            className="line-sidebar__item"
            aria-current={(clickedId ?? activeId) === item.id ? "true" : undefined}
            onClick={() => handleClick(item)}
          >
            {showMarker ? <span className="line-sidebar__marker" aria-hidden="true" /> : null}
            <span className="line-sidebar__label">
              {showIndex ? <span className="line-sidebar__index">{String(index + 1).padStart(2, "0")}</span> : null}
              <span className="line-sidebar__text">{item.label}</span>
            </span>
          </li>
        ))}
      </ul>
    </nav>
  );
}
