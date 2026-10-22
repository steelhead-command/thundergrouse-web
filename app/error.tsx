'use client';

import { useEffect } from 'react';
import s from './_home/home.module.css';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className={`${s.page} ${s.notice}`}>
      <div className={s.washes} aria-hidden="true">
        <span className={`${s.wash} ${s.washA}`} />
        <span className={`${s.wash} ${s.washB}`} />
      </div>
      <main className={`${s.container} ${s.layer}`}>
        <h1 className={s.h1}>Something went wrong</h1>
        <p className={s.intro}>The grouse got a little ruffled. Let&apos;s try that again.</p>
        <div className={s.block}>
          <button type="button" onClick={reset} className={`${s.button} ${s.buttonPrimary}`}>
            Try again
          </button>
        </div>
      </main>
      <footer className={s.footer}>
        <p className={`${s.container} ${s.footerPlace}`}>Thundergrouse LLC</p>
      </footer>
    </div>
  );
}
