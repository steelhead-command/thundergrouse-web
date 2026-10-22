import Image, { type StaticImageData } from "next/image";
import type { ReactNode } from "react";
import s from "./home.module.css";

/* Small building blocks for the home page. Every entry in the catalogue uses the
   same anatomy: tile, name, status, description, facts, links. */

export type Tile =
  | { type: "image"; src: StaticImageData; alt: string }
  | { type: "letter"; letter: string; color: string };

export type EntryLink = { label: string; href: string };

export type EntryData = {
  id: string;
  name: string;
  status: string;
  live: boolean;
  /* "warm" gives a game its own mood inside the blue field-guide frame. */
  tone?: "warm";
  tile: Tile;
  summary: string;
  detail?: string;
  facts: readonly { label: string; value: string }[];
  primary: EntryLink;
  secondary?: readonly EntryLink[];
};

export function ExternalIcon({ size = 12 }: { size?: number }) {
  return (
    <svg
      className={s.icon}
      width={size}
      height={size}
      viewBox="0 0 12 12"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M4.5 2.5h5v5" />
      <path d="M9.25 2.75 2.75 9.25" />
    </svg>
  );
}

export function ExternalLink({
  href,
  className,
  children,
}: {
  href: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <a href={href} className={className} target="_blank" rel="noopener noreferrer">
      {children}
      <span className={s.srOnly}> (opens in a new tab)</span>
    </a>
  );
}

export function AppTile({ tile, priority = false }: { tile: Tile; priority?: boolean }) {
  if (tile.type === "image") {
    return (
      <span className={`${s.tile} ${s.tileLg}`}>
        <Image
          src={tile.src}
          alt={tile.alt}
          className={s.tileImg}
          sizes="(min-width: 1024px) 88px, 64px"
          priority={priority}
        />
      </span>
    );
  }
  return (
    <span
      className={`${s.tile} ${s.tileLg} ${s.letterTile}`}
      style={{ backgroundColor: tile.color }}
      aria-hidden="true"
    >
      {tile.letter}
    </span>
  );
}

export function Status({ live, children }: { live: boolean; children: ReactNode }) {
  return (
    <span className={s.status}>
      <span className={`${s.dot} ${live ? "" : s.dotOpen}`} aria-hidden="true" />
      {children}
    </span>
  );
}

export function Entry({
  entry,
  priority = false,
  children,
}: {
  entry: EntryData;
  priority?: boolean;
  children?: ReactNode;
}) {
  const headingId = `${entry.id}-name`;
  const warm = entry.tone === "warm";
  const hasFacts = entry.facts.length > 0;
  return (
    <article
      id={entry.id}
      className={`${s.card} ${s.entry} ${warm ? s.warm : ""}`}
      aria-labelledby={headingId}
    >
      <div className={s.entryHead}>
        <AppTile tile={entry.tile} priority={priority} />
        <div>
          <h4 id={headingId} className={s.h4}>
            {entry.name}
          </h4>
          <p className={s.entryStatus}>
            <Status live={entry.live}>{entry.status}</Status>
          </p>
        </div>
        <div className={s.entryActions}>
          <ExternalLink
            href={entry.primary.href}
            className={`${s.button} ${entry.live ? s.buttonPrimary : s.buttonQuiet}`}
          >
            {entry.primary.label}
            <ExternalIcon />
          </ExternalLink>
          {entry.secondary && entry.secondary.length > 0 ? (
            <ul className={s.linkRow}>
              {entry.secondary.map((l) => (
                <li key={l.href}>
                  <ExternalLink href={l.href} className={s.link}>
                    {l.label}
                    <ExternalIcon size={10} />
                  </ExternalLink>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>

      <div className={`${s.entryBody} ${hasFacts ? "" : s.entryBodySolo}`}>
        <div>
          <p className={s.lead}>{entry.summary}</p>
          {entry.detail ? <p className={s.detail}>{entry.detail}</p> : null}
        </div>
        {hasFacts ? (
          <dl className={`${s.well} ${s.facts}`}>
            {entry.facts.map((f) => (
              <div key={f.label} className={s.factRow}>
                <dt className={s.factLabel}>{f.label}</dt>
                <dd className={s.factValue}>{f.value}</dd>
              </div>
            ))}
          </dl>
        ) : null}
      </div>

      {children}
    </article>
  );
}
