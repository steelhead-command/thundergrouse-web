// The home page's two three.js scenes: the flowing current behind the hero and
// the floating app shelf in Apps. effects.tsx loads this file (and three.js) on
// the client only, after the page has rendered and only where WebGL 2 works.
// Ported from the approved demo (thundergrouse-3d-ideas.html, three.js r128).

import {
  BoxGeometry,
  BufferAttribute,
  BufferGeometry,
  CanvasTexture,
  Color,
  DirectionalLight,
  ExtrudeGeometry,
  Group,
  HemisphereLight,
  LineSegments,
  MathUtils,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  OrthographicCamera,
  PerspectiveCamera,
  PlaneGeometry,
  Scene,
  ShaderMaterial,
  Shape,
  SphereGeometry,
  SRGBColorSpace,
  TextureLoader,
  WebGLRenderer,
  type Camera,
  type Material,
  type Texture,
} from "three";

export type ShelfItem = { kind: "utility" | "game" } & (
  | { image: string }
  | { letter: string; color: string }
);

type Pointer = { x: number; y: number; tx: number; ty: number; inside: boolean };

type Kit = { ptr: Pointer; redraw: () => void; ready: () => void; still: () => boolean; signal: AbortSignal };

type Parts = {
  scene: Scene;
  camera: Camera;
  resize(w: number, h: number): void;
  theme(dark: boolean, accent: string): void;
  frame(dt: number, t: number): void;
};

// Share of the remaining gap to close this frame, the same at any frame rate (all of it on a still frame).
const ease = (dt: number, perFrameAt60: number) =>
  dt > 0 ? 1 - Math.pow(1 - perFrameAt60, dt * 60) : 1;

// Shared shell: renderer, sizing, pointer, theme, and drawing only while on screen
// with the tab visible. Reduced motion gets single still frames. Returns the cleanup.
// The canvas is marked data-drawn once build calls ready() and while it has its
// WebGL context; until then the page's flat stand-ins show.
function run(canvas: HTMLCanvasElement, build: (kit: Kit) => Parts) {
  const host = canvas.parentElement!;
  const motion = matchMedia("(prefers-reduced-motion: reduce)");
  let still = motion.matches;
  const dark = matchMedia("(prefers-color-scheme: dark)");
  const ac = new AbortController();
  const on = { signal: ac.signal };
  let renderer: WebGLRenderer;
  try {
    renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true });
  } catch {
    // The WebGL 2 probe passed but this context failed (GPU lost, memory pressure): leave the page as it is.
    return () => {};
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setClearColor(0x000000, 0);
  const ptr = { x: 0, y: 0, tx: 0, ty: 0, inside: false };
  let t = still ? 6 : 0;
  let last = 0;
  let visible = false;
  let raf = 0;
  let ready = false;
  let lost = false;
  const p = build({ ptr, redraw, ready: markReady, still: () => still, signal: ac.signal });

  function markReady() {
    ready = true;
    show();
    kick();
  }
  function show() {
    canvas.toggleAttribute("data-drawn", ready && !lost);
  }
  function running() {
    return visible && ready && !lost && !still && !document.hidden;
  }
  function draw(dt: number) {
    const k = ease(dt, 0.08);
    ptr.x += (ptr.tx - ptr.x) * k;
    ptr.y += (ptr.ty - ptr.y) * k;
    p.frame(dt, t);
    renderer.render(p.scene, p.camera);
  }
  function redraw() {
    if (!ac.signal.aborted && !running()) draw(0);
  }
  function loop(now: number) {
    raf = 0;
    if (!running()) return;
    const dt = last ? Math.min(0.05, (now - last) / 1000) : 0.016;
    last = now;
    t += dt;
    draw(dt);
    raf = requestAnimationFrame(loop);
  }
  function kick() {
    if (running() && !raf) {
      last = 0;
      raf = requestAnimationFrame(loop);
    }
  }
  function theme() {
    p.theme(dark.matches, getComputedStyle(canvas).getPropertyValue("--accent").trim());
    redraw();
  }
  function point(e: PointerEvent) {
    const r = canvas.getBoundingClientRect();
    ptr.tx = ((e.clientX - r.left) / r.width) * 2 - 1;
    ptr.ty = 1 - ((e.clientY - r.top) / r.height) * 2;
    ptr.inside = true;
  }

  theme();
  const ro = new ResizeObserver(() => {
    const w = Math.max(1, canvas.clientWidth);
    const h = Math.max(1, canvas.clientHeight);
    renderer.setSize(w, h, false);
    p.resize(w, h);
    redraw();
  });
  ro.observe(canvas);
  const io = new IntersectionObserver((es) => {
    visible = es[es.length - 1].isIntersecting;
    kick();
  });
  io.observe(canvas);
  document.addEventListener("visibilitychange", kick, on);
  motion.addEventListener(
    "change",
    () => {
      still = motion.matches;
      kick();
      redraw();
    },
    on,
  );
  // A lost context (iOS Safari after backgrounding) brings back the flat stand-ins until it is restored.
  canvas.addEventListener(
    "webglcontextlost",
    () => {
      lost = true;
      show();
    },
    on,
  );
  // three.js's own restore handler (added in its constructor) runs first and re-uploads; then paint.
  canvas.addEventListener(
    "webglcontextrestored",
    () => {
      lost = false;
      show();
      kick();
      redraw();
    },
    on,
  );
  dark.addEventListener("change", theme, on);
  host.addEventListener("pointermove", point, on);
  host.addEventListener("pointerdown", point, on);
  host.addEventListener(
    "pointerleave",
    () => {
      ptr.tx = ptr.ty = 0;
      ptr.inside = false;
    },
    on,
  );

  return () => {
    ac.abort();
    cancelAnimationFrame(raf);
    ro.disconnect();
    io.disconnect();
    p.scene.traverse((o) => {
      if (!(o instanceof Mesh || o instanceof LineSegments)) return;
      o.geometry.dispose();
      for (const m of [o.material].flat() as Material[]) {
        (m as { map?: Texture | null }).map?.dispose();
        m.dispose();
      }
    });
    renderer.dispose();
  };
}

// 1. Flowing current: thin streaks follow a meandering channel with a real velocity
// profile (fastest mid-channel, slow at the banks); the pointer is a rock they split around.
export function startCurrent(canvas: HTMLCanvasElement) {
  return run(canvas, ({ ptr, ready }) => {
    ready();
    const scene = new Scene();
    const camera = new OrthographicCamera(-1, 1, 1, -1, -1, 1);
    // Fewer streaks on narrow screens.
    const N = window.innerWidth < 700 ? 1000 : 3200;
    const pos = new Float32Array(N * 6);
    const alp = new Float32Array(N * 2);
    const geo = new BufferGeometry();
    geo.setAttribute("position", new BufferAttribute(pos, 3));
    geo.setAttribute("alpha", new BufferAttribute(alp, 1));
    const color = new Color();
    const mat = new ShaderMaterial({
      uniforms: { uColor: { value: color } },
      vertexShader:
        "attribute float alpha; varying float vA;\n" +
        "void main() { vA = alpha; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }",
      fragmentShader:
        "uniform vec3 uColor; varying float vA;\n" +
        "void main() {\n  gl_FragColor = vec4(uColor, vA);\n  #include <colorspace_fragment>\n}",
      transparent: true,
      depthWrite: false,
      depthTest: false,
    });
    scene.add(new LineSegments(geo, mat));
    const X = new Float32Array(N);
    const OFF = new Float32Array(N);
    const PH = new Float32Array(N);
    const DY = new Float32Array(N);
    let halfW = 1;
    let halfH = 1;
    let seeded = false;

    function seed(i: number, anywhere: boolean) {
      X[i] = anywhere
        ? -halfW - 0.2 + Math.random() * (2 * halfW + 0.4)
        : -halfW - 0.15 - Math.random() * 0.4;
      const o = Math.random() * 2 - 1;
      OFF[i] = (o < 0 ? -1 : 1) * Math.pow(Math.abs(o), 0.85);
      PH[i] = Math.random() * 6.283;
      DY[i] = 0;
    }
    function centre(x: number, t: number) {
      const u = x / halfW;
      return -0.12 + 0.2 * Math.sin(u * 2.4 + 0.6) + 0.14 * u + 0.05 * Math.sin(u * 5 - t * 0.2);
    }
    function halfWidth(x: number) {
      return 0.3 + 0.08 * Math.sin((x / halfW) * 1.7 + 1.3);
    }
    function yAt(i: number, x: number, t: number) {
      return centre(x, t) + OFF[i] * halfWidth(x) + 0.012 * Math.sin(t * 1.7 + PH[i] + x * 4) + DY[i];
    }

    return {
      scene,
      camera,
      resize(w, h) {
        // One scene unit is 300 CSS px, as on the demo's 600px stage, so streak length,
        // speed and the rock match it whatever the hero's size; the channel runs mid-hero.
        const nw = w / 600;
        if (seeded) for (let q = 0; q < N; q++) X[q] *= nw / halfW;
        halfW = nw;
        halfH = h / 600;
        camera.left = -halfW;
        camera.right = halfW;
        camera.top = halfH;
        camera.bottom = -halfH;
        camera.updateProjectionMatrix();
        if (!seeded) for (let i = 0; i < N; i++) seed(i, true);
        seeded = true;
      },
      theme(_dark, accent) {
        color.set(accent);
      },
      frame(dt, t) {
        const R = 0.2;
        const px = ptr.tx * halfW;
        const py = ptr.ty * halfH;
        const speedScale = 0.55 + (0.45 * Math.min(halfW, 1.8)) / 1.8;
        for (let i = 0; i < N; i++) {
          const core = 1 - OFF[i] * OFF[i];
          const spd = (0.12 + 0.3 * core) * speedScale;
          X[i] += spd * dt;
          if (X[i] > halfW + 0.3) seed(i, false);
          const x = X[i];
          const y = yAt(i, x, t);
          if (ptr.inside && dt > 0) {
            const dx = x - px;
            const dy = y - py;
            const d2 = dx * dx + dy * dy;
            if (d2 < R * R) DY[i] += ((dy >= 0 ? 1 : -1) * (R - (Math.sqrt(d2) || 0.0001))) / R * 0.02;
          }
          DY[i] *= 0.985;
          const L = spd * 0.22;
          const j = i * 6;
          pos[j] = x - L;
          pos[j + 1] = yAt(i, x - L, t);
          pos[j + 2] = 0;
          pos[j + 3] = x;
          pos[j + 4] = y;
          pos[j + 5] = 0;
          const fadeIn = Math.min(1, (x + halfW + 0.1) / 0.35);
          alp[i * 2] = 0;
          // Half the demo's strength: the headline and intro sit on top.
          alp[i * 2 + 1] = Math.max(0, (0.08 + 0.25 * core) * fadeIn);
        }
        geo.attributes.position.needsUpdate = true;
        geo.attributes.alpha.needsUpdate = true;
      },
    };
  });
}

// 2. Floating app shelf: one thick glossy tile per product, centred over its link.
// Tiles lean toward the pointer and bob; a link click spins its tile, then follows the link.
export function startShelf(canvas: HTMLCanvasElement, items: readonly ShelfItem[]) {
  return run(canvas, ({ ptr, redraw, ready, still, signal }) => {
    const links = [...canvas.parentElement!.querySelectorAll("a")];
    const scene = new Scene();
    const camera = new PerspectiveCamera(35, 1, 0.1, 100);
    camera.position.set(0, 0, 9);
    // The demo's r128 light levels, times pi for today's physical light units.
    const hemi = new HemisphereLight(0xffffff, 0xbfd6e2, 0.85 * Math.PI);
    const key = new DirectionalLight(0xffffff, 0.9 * Math.PI);
    key.position.set(-3, 4, 6);
    const rim = new DirectionalLight(0xbfe4ff, 0.5 * Math.PI);
    rim.position.set(4, -2, -3);
    scene.add(hemi, key, rim);

    const SIZE = 1.6;
    const tileGeo = new ExtrudeGeometry(rounded(SIZE, SIZE * 0.225), {
      depth: 0.16,
      bevelEnabled: true,
      bevelThickness: 0.05,
      bevelSize: 0.05,
      bevelSegments: 5,
      curveSegments: 16,
    });
    tileGeo.center();
    const shadowGeo = new PlaneGeometry(1.9, 0.42);
    const shadowMat = new MeshBasicMaterial({ map: new CanvasTexture(blob()), transparent: true, depthWrite: false });
    const dropGeo = new SphereGeometry(1, 20, 14);
    const dropMat = new MeshStandardMaterial({ roughness: 0.12, metalness: 0.1, transparent: true, opacity: 0.85 });
    const chipGeo = new BoxGeometry(0.16, 0.07, 0.05);
    const chipMat = new MeshStandardMaterial({ color: "#c98a52", emissive: "#7a2e0a", emissiveIntensity: 0.35, roughness: 0.7 });
    let hovered = -1;
    // Ready once every face has its picture; until then the page's flat icons show.
    let waiting = items.filter((it) => "image" in it).length;

    const tiles = items.map((it, i) => {
      const side = new MeshStandardMaterial({ roughness: 0.45, metalness: 0.05 });
      const map =
        "image" in it
          ? new TextureLoader().load(it.image, (tex) => {
              side.color.copy(edge(tex.image as HTMLImageElement));
              if (!--waiting) ready();
              redraw();
            })
          : new CanvasTexture(letterFace(it.letter, it.color));
      if (!("image" in it)) side.color.copy(edge(map.image as HTMLCanvasElement));
      map.colorSpace = SRGBColorSpace;
      map.repeat.set(1 / SIZE, 1 / SIZE);
      map.offset.set(0.5, 0.5);
      const face = new MeshStandardMaterial({ map, emissive: 0xffffff, emissiveMap: map, emissiveIntensity: 0.38, roughness: 0.3, metalness: 0 });
      const group = new Group();
      group.add(new Mesh(tileGeo, [face, side]));
      const shadow = new Mesh(shadowGeo, shadowMat);
      scene.add(group, shadow);
      // Water droplets orbit a utility; wood chips tumble around a game.
      const drop = it.kind === "utility";
      const n = drop ? 11 : 9;
      const bits = Array.from({ length: n }, (_, j) => {
        const m = new Mesh(drop ? dropGeo : chipGeo, drop ? dropMat : chipMat);
        scene.add(m);
        return {
          m,
          size: drop ? 0.05 + Math.random() * 0.09 : 1,
          rad: drop ? 1.15 + Math.random() * 0.55 : 1.1 + Math.random() * 0.5,
          a: (j / n) * 6.28 + i, // evenly spaced, so a still frame is balanced
          sp: drop ? 0.25 + Math.random() * 0.35 : -(0.3 + Math.random() * 0.4),
          yo: (Math.random() - 0.5) * 1.4,
          zo: (Math.random() - 0.5) * 1.2,
          rx: Math.random() * 3,
          ry: Math.random() * 3,
          tumble: !drop,
        };
      });

      const a = links[i];
      let go = false;
      const enter = () => (hovered = i);
      const leave = () => (hovered = -1);
      a.addEventListener("pointerenter", enter, { signal });
      a.addEventListener("focus", enter, { signal });
      a.addEventListener("pointerleave", leave, { signal });
      a.addEventListener("blur", leave, { signal });
      a.addEventListener(
        "click",
        (e) => {
          // Modifier clicks (new tab), reduced motion and undrawn tiles follow the link at once.
          const plain = !(e.metaKey || e.ctrlKey || e.shiftKey || e.altKey);
          if (still() || go || !plain || !canvas.hasAttribute("data-drawn")) {
            go = false;
            return;
          }
          e.preventDefault();
          tiles[i].spin += Math.PI * 2;
          setTimeout(() => {
            if (signal.aborted) return;
            go = true;
            a.click();
          }, 650);
        },
        { signal },
      );

      return { group, shadow, bits, ph: i * 1.9, spin: 0, hover: 1, x: 0, orbit: 1 };
    });
    if (!waiting) ready();

    // Half the view height at the tiles' depth, from the 35 degree field of view.
    const hh = Math.tan(MathUtils.degToRad(17.5)) * 9;
    let s = 1;
    let y = 0;

    return {
      scene,
      camera,
      resize(w, h) {
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        const unit = (2 * hh) / h; // world units per CSS pixel
        const box = canvas.getBoundingClientRect();
        let col = w;
        links.forEach((a, i) => {
          const r = a.getBoundingClientRect();
          tiles[i].x = (r.left + r.width / 2 - box.left - w / 2) * unit;
          col = Math.min(col, r.width);
        });
        s = (Math.min(col * 0.6, h * 0.5) * unit) / SIZE;
        // Orbits shrink near the canvas sides so droplets and chips are not cut off on phones.
        for (const tl of tiles) tl.orbit = MathUtils.clamp(((w / 2) * unit - Math.abs(tl.x)) / (2 * s), 0.8, 1);
        y = hh * 0.12; // a little above centre, leaving room for the names below
      },
      theme(dark, accent) {
        hemi.groundColor.set(dark ? 0x0b1116 : 0xbfd6e2);
        hemi.intensity = (dark ? 0.6 : 0.85) * Math.PI;
        dropMat.color.set(accent);
        shadowMat.opacity = dark ? 0.9 : 0.6;
      },
      frame(dt, t) {
        const k = ease(dt, 0.07);
        const kh = ease(dt, 0.15);
        tiles.forEach((tl, i) => {
          const g = tl.group;
          const bob = Math.sin(t * 1.1 + tl.ph) * 0.09 * s;
          g.position.set(tl.x, y + bob, 0);
          g.rotation.y += (ptr.x * 0.55 + Math.sin(t * 0.45 + tl.ph) * 0.14 + tl.spin - g.rotation.y) * k;
          g.rotation.x += (-ptr.y * 0.35 + Math.sin(t * 0.6 + tl.ph) * 0.05 - g.rotation.x) * k;
          tl.hover += ((hovered === i ? 1.08 : 1) - tl.hover) * kh;
          g.scale.setScalar(s * tl.hover);
          tl.shadow.position.set(tl.x, y - 1.12 * s, -0.6);
          tl.shadow.scale.setScalar(s * (1 - bob * 0.8));
          for (const b of tl.bits) {
            const a = b.a + t * b.sp;
            b.m.position.set(
              tl.x + Math.cos(a) * b.rad * s * tl.orbit,
              y + b.yo * s + Math.sin(t * 0.8 + b.a) * 0.08 * s,
              Math.sin(a) * b.rad * s * tl.orbit + b.zo * 0.3,
            );
            b.m.scale.setScalar(b.size * s);
            if (b.tumble) b.m.rotation.set(b.rx + t * 1.3, b.ry + t * 0.9, 0);
          }
        });
      },
    };
  });
}

// A rounded square, the shape of an app icon.
function rounded(size: number, r: number) {
  const s = new Shape();
  const x = -size / 2;
  const y = -size / 2;
  s.moveTo(x + r, y);
  s.lineTo(x + size - r, y);
  s.quadraticCurveTo(x + size, y, x + size, y + r);
  s.lineTo(x + size, y + size - r);
  s.quadraticCurveTo(x + size, y + size, x + size - r, y + size);
  s.lineTo(x + r, y + size);
  s.quadraticCurveTo(x, y + size, x, y + size - r);
  s.lineTo(x, y + r);
  s.quadraticCurveTo(x, y, x + r, y);
  return s;
}

// A lettered face, like CHOP's tile on the page: the letter in white on the product's colour.
function letterFace(letter: string, color: string) {
  const c = document.createElement("canvas");
  c.width = c.height = 256;
  const ctx = c.getContext("2d")!;
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, 256, 256);
  ctx.fillStyle = "#ffffff";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = "700 150px -apple-system, BlinkMacSystemFont, system-ui, sans-serif";
  ctx.fillText(letter, 128, 138);
  return c;
}

// A soft round shadow for under each tile.
function blob() {
  const c = document.createElement("canvas");
  c.width = c.height = 128;
  const ctx = c.getContext("2d")!;
  const g = ctx.createRadialGradient(64, 64, 4, 64, 64, 64);
  g.addColorStop(0, "rgba(0,30,55,0.55)");
  g.addColorStop(1, "rgba(0,30,55,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 128, 128);
  return c;
}

// Tile sides take the colour of the face's top-left corner, darkened, so any icon gets matching sides.
function edge(img: HTMLImageElement | HTMLCanvasElement) {
  const ctx = document.createElement("canvas").getContext("2d")!;
  ctx.drawImage(img, 0, 0, 8, 8);
  const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
  return new Color().setRGB((r / 255) * 0.68, (g / 255) * 0.68, (b / 255) * 0.68, SRGBColorSpace);
}
