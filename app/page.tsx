import Image, { getImageProps } from "next/image";
import { chop, products, studio, waterflow } from "./_home/content";
import { AppShelf, FlowingCurrent } from "./_home/effects";
import s from "./_home/home.module.css";
import { AppTile, Entry, ExternalIcon, ExternalLink, type EntryData } from "./_home/parts";
import type { ShelfItem } from "./_home/scenes";

type Product = (typeof products)[number];

const kinds = [
  { key: "utility", group: "Utilities" },
  { key: "game", group: "Games" },
] as const;

// Map each product in content.ts onto the shared entry anatomy.
function entryFor(p: Product): EntryData {
  if (p.kind === "utility") {
    return {
      id: "waterflow",
      name: p.name,
      status: p.status,
      live: true,
      tile: { type: "image", src: p.icon.src, alt: p.icon.alt },
      summary: p.summary,
      detail: p.detail,
      facts: p.facts,
      primary: p.links.appStore,
      secondary: [p.links.support, p.links.privacy],
    };
  }
  return {
    id: "chop",
    name: p.name,
    status: p.status,
    live: false,
    tone: "warm",
    tile: { type: "letter", letter: p.name.charAt(0), color: p.color },
    summary: p.summary,
    facts: [],
    primary: p.links.github,
  };
}

// One floating 3D tile per product, in the same order as the shelf's links.
const shelf: ShelfItem[] = products.map((p) => {
  const { tile } = entryFor(p);
  return tile.type === "image"
    ? // width 192 asks the image optimizer for a 384px (2x) texture, not the 1024px file.
      { kind: p.kind, image: getImageProps({ src: tile.src, alt: "", width: 192 }).props.src }
    : { kind: p.kind, letter: tile.letter, color: tile.color };
});

const groups = kinds
  .map((k) => ({ ...k, items: products.filter((p) => p.kind === k.key) }))
  .filter((g) => g.items.length > 0);

// Desktop leads with four features, phone with two; the rest sit in a native
// disclosure (no JavaScript). "wide" features move into the disclosure on phone.
const keyNames = ["Home Screen widget", "Map", "Station Detail", "Flow Alerts"];
const wideNames = ["Map", "Flow Alerts"];
const byName = (names: string[]) =>
  names.flatMap((n) => waterflow.features.filter((f) => f.name === n));
const keyFeatures = byName(keyNames);
const moreFeatures = waterflow.features.filter((f) => !keyNames.includes(f.name));

type Feature = { name: string; body: string };

function FeatureList({
  items,
  className,
}: {
  items: readonly Feature[];
  className?: (f: Feature) => string;
}) {
  return (
    <ul className={s.featureGrid}>
      {items.map((f) => (
        <li key={f.name} className={`${s.feature} ${className ? className(f) : ""}`}>
          <strong className={s.featureName}>{f.name}</strong>
          <p className={s.featureBody}>{f.body}</p>
        </li>
      ))}
    </ul>
  );
}

// Five calm screenshots; the Station Detail card swaps to its dark-mode shot in dark mode.
const shotOrder = ["widget", "favorites", "detail", "detailDark", "byState", "map"] as const;
const shots = shotOrder.flatMap((key) => waterflow.screenshots.filter((x) => x.key === key));
const shotTheme = (key: string) =>
  key === "detail" ? s.lightOnly : key === "detailDark" ? s.darkOnly : "";

function WaterFlowExtras() {
  return (
    <>
      <div className={s.block}>
        <div className={s.blockHead}>
          <h5 className={s.h5}>Screenshots</h5>
          <span className={s.swipeHint} aria-hidden="true">
            Swipe for more
          </span>
        </div>
        <ul className={s.shots} tabIndex={0} aria-label="WaterFlow screenshots">
          {shots.map((shot) => (
            <li key={shot.key} className={`${s.shot} ${shotTheme(shot.key)}`}>
              <figure>
                <Image
                  src={shot.src}
                  alt={shot.alt}
                  className={s.shotImg}
                  sizes="(min-width: 1184px) 200px, (min-width: 1024px) 18vw, 196px"
                />
                <figcaption className={s.shotCaption}>{shot.caption}</figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>

      <div className={s.block}>
        <div className={s.blockHead}>
          <h5 className={s.h5}>Features</h5>
        </div>
        <FeatureList
          items={keyFeatures}
          className={(f) => (wideNames.includes(f.name) ? s.wideOnly : "")}
        />
        <details className={s.more}>
          <summary className={s.moreSummary}>
            <span>More features</span>
            <svg
              className={s.moreChevron}
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
              focusable="false"
            >
              <path d="M2.5 4.5 6 8l3.5-3.5" />
            </svg>
          </summary>
          <div className={s.moreBody}>
            <FeatureList
              items={[...byName(wideNames), ...moreFeatures]}
              className={(f) => (wideNames.includes(f.name) ? s.narrowOnly : "")}
            />
          </div>
        </details>
      </div>

      <div className={s.smallPrint}>
        <p>{waterflow.privacy}</p>
        <p>{waterflow.dataNote}</p>
      </div>
    </>
  );
}

export default function Home() {
  return (
    <div className={s.page} id="top">
      <div className={s.washes} aria-hidden="true">
        <span className={`${s.wash} ${s.washA}`} />
        <span className={`${s.wash} ${s.washB}`} />
        <span className={`${s.wash} ${s.washC}`} />
      </div>

      <header className={s.masthead}>
        <div className={s.container}>
          <div className={s.mastheadInner}>
            <a href="#top" className={s.wordmark}>
              {studio.name}
            </a>
            <nav aria-label="Sections">
              <ul className={s.navList}>
                <li>
                  <a href="#apps" className={s.navLink}>
                    Apps
                  </a>
                </li>
                <li>
                  <a href="#about" className={s.navLink}>
                    About
                  </a>
                </li>
                <li>
                  <a href="#open-source" className={s.navLink}>
                    Open Source
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </header>

      <main className={s.layer}>
        {/* Hero: tagline and intro */}
        <section className={s.hero} aria-labelledby="hero-title">
          <FlowingCurrent />
          <div className={`${s.container} ${s.heroGrid}`}>
            <p className={s.eyebrow}>
              <span>{studio.legalName}</span>
              <span className={s.eyebrowSep} aria-hidden="true" />
              <span>{studio.location}</span>
            </p>
            <h1 id="hero-title" className={s.h1}>
              {studio.tagline}
            </h1>
            <p className={s.intro}>{studio.intro}</p>
          </div>
        </section>

        {/* Catalogue */}
        <section id="apps" className={`${s.section} ${s.sectionTight} ${s.sectionFlushEnd}`} aria-labelledby="apps-title">
          <div className={`${s.container} ${s.layer}`}>
            <div className={s.sectionHead}>
              <h2 id="apps-title" className={s.h2}>
                Apps
              </h2>
            </div>

            {/* App shelf: a link to each entry below. Flat icons hold the 3D tiles' place
                until they are drawn, and stay where there is no WebGL. */}
            <div className={s.shelf}>
              <AppShelf items={shelf} />
              <ul className={s.shelfLinks}>
                {products.map(entryFor).map((e) => (
                  <li key={e.id}>
                    <a href={`#${e.id}`} className={s.shelfLink}>
                      {/* The name follows in the link, so the icon needs no alt text. */}
                      <AppTile
                        tile={e.tile.type === "image" ? { ...e.tile, alt: "" } : e.tile}
                        sizes="(min-width: 1024px) 162px, 116px"
                      />
                      {e.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {groups.map((g) => (
              <section
                key={g.key}
                className={`${s.group} ${g.key === "game" ? s.warm : ""}`}
                aria-labelledby={`group-${g.key}`}
              >
                <div className={s.groupHead}>
                  <h3 id={`group-${g.key}`} className={s.h3}>
                    {g.group}
                  </h3>
                  <span className={s.groupRule} aria-hidden="true" />
                </div>
                <ul className={s.entryList}>
                  {g.items.map((p, i) => {
                    const e = entryFor(p);
                    return (
                      <li key={e.id}>
                        <Entry entry={e} priority={g.key === "utility" && i === 0}>
                          {p.kind === "utility" ? <WaterFlowExtras /> : null}
                        </Entry>
                      </li>
                    );
                  })}
                </ul>
              </section>
            ))}
          </div>
        </section>

        {/* About Us */}
        <section id="about" className={s.section} aria-labelledby="about-title">
          <div className={s.washes} aria-hidden="true">
            <span className={`${s.wash} ${s.washD}`} />
            <span className={`${s.wash} ${s.washE}`} />
          </div>
          <div className={`${s.container} ${s.layer}`}>
            <div className={s.sectionHead}>
              <h2 id="about-title" className={s.h2}>
                {studio.about.heading}
              </h2>
            </div>
            <div className={s.note}>
              <div className={s.noteCol}>
                <h3 className={s.noteHeading}>{studio.about.who.heading}</h3>
                <p className={s.noteBody}>{studio.about.who.body}</p>
              </div>
              <div className={s.noteCol}>
                <h3 className={s.noteHeading}>{studio.about.philosophy.heading}</h3>
                <p className={s.noteBody}>{studio.about.philosophy.body}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Open Source */}
        <section
          id="open-source"
          className={`${s.section} ${s.sectionTight}`}
          aria-labelledby="open-source-title"
        >
          <div className={`${s.container} ${s.layer}`}>
            <div className={s.sectionHead}>
              <div>
                <h2 id="open-source-title" className={s.h2}>
                  {studio.openSource.heading}
                </h2>
                <p className={s.sectionLede}>{studio.openSource.body}</p>
              </div>
            </div>
            <ul className={s.repoGrid}>
              {studio.openSource.links.map((l) => (
                <li key={l.href}>
                  <ExternalLink href={l.href} className={`${s.card} ${s.repoCard}`}>
                    <span className={s.repoText}>
                      <span className={s.repoHost}>GitHub</span>
                      <span className={s.repoHandle}>{l.label}</span>
                    </span>
                    <span className={s.repoGo} aria-hidden="true">
                      <ExternalIcon size={13} />
                    </span>
                  </ExternalLink>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>

      <footer className={s.footer}>
        <div className={s.container}>
          <div className={s.footerInner}>
            <div className={s.footerGrid}>
              <div className={s.footerBrand}>
                <p className={s.footerName}>{studio.legalName}</p>
                <p className={s.footerPlace}>{studio.location}</p>
              </div>
              <div>
                <p className={`${s.label} ${s.footerLabel}`}>{waterflow.shortName}</p>
                <ul className={s.footerLinks}>
                  <li>
                    <ExternalLink href={waterflow.links.appStore.href} className={s.link}>
                      App Store
                    </ExternalLink>
                  </li>
                  <li>
                    <ExternalLink href={waterflow.links.support.href} className={s.link}>
                      {waterflow.links.support.label}
                    </ExternalLink>
                  </li>
                  <li>
                    <ExternalLink href={waterflow.links.privacy.href} className={s.link}>
                      {waterflow.links.privacy.label}
                    </ExternalLink>
                  </li>
                </ul>
              </div>
              <div>
                <p className={`${s.label} ${s.footerLabel}`}>{chop.name}</p>
                <ul className={s.footerLinks}>
                  <li>
                    <ExternalLink href={chop.links.github.href} className={s.link}>
                      GitHub
                    </ExternalLink>
                  </li>
                </ul>
              </div>
            </div>
            <p className={s.copyright}>{studio.copyright}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
