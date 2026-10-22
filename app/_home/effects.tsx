"use client";

import { useEffect, useRef, useState } from "react";
import s from "./home.module.css";
import type { ShelfItem } from "./scenes";

type Scenes = typeof import("./scenes");

// Loads three.js after the page has rendered, and only where WebGL 2 works.
// Until it arrives, or if it never does, these render nothing: the page stays as it was.
// Both effects share one check and one download; the test context is released at once.
let loading: Promise<Scenes | null> | undefined;
function loadScenes() {
  loading ??= (() => {
    const gl = document.createElement("canvas").getContext("webgl2");
    if (!gl) return Promise.resolve(null);
    gl.getExtension("WEBGL_lose_context")?.loseContext();
    return import("./scenes").catch(() => null);
  })();
  return loading;
}

function useScenes() {
  const [scenes, setScenes] = useState<Scenes | null>(null);
  useEffect(() => {
    let live = true;
    loadScenes().then((m) => live && setScenes(m));
    return () => {
      live = false;
    };
  }, []);
  return scenes;
}

/* Flowing current behind the hero text. Decorative. */
export function FlowingCurrent() {
  const scenes = useScenes();
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => (scenes && ref.current ? scenes.startCurrent(ref.current) : undefined), [scenes]);
  return scenes ? <canvas ref={ref} className={s.current} aria-hidden="true" /> : null;
}

/* Floating app shelf: decorative 3D tiles over the shelf's links (page.tsx). */
export function AppShelf({ items }: { items: ShelfItem[] }) {
  const scenes = useScenes();
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(
    () => (scenes && ref.current ? scenes.startShelf(ref.current, items) : undefined),
    [scenes, items],
  );
  return scenes ? <canvas ref={ref} className={s.shelfCanvas} aria-hidden="true" /> : null;
}
