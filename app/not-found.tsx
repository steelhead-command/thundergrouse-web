import Link from 'next/link';
import s from './_home/home.module.css';

export default function NotFound() {
  return (
    <div className={`${s.page} ${s.notice}`}>
      <div className={s.washes} aria-hidden="true">
        <span className={`${s.wash} ${s.washA}`} />
        <span className={`${s.wash} ${s.washB}`} />
      </div>
      <main className={`${s.container} ${s.layer}`}>
        <p className={s.label}>404</p>
        <h1 className={s.h1}>Page not found</h1>
        <p className={s.intro}>
          This grouse has flown the coop. The page you&apos;re looking for doesn&apos;t exist.
        </p>
        <div className={s.block}>
          <Link href="/" className={`${s.button} ${s.buttonPrimary}`}>
            Back to Home
          </Link>
        </div>
      </main>
      <footer className={s.footer}>
        <p className={`${s.container} ${s.footerPlace}`}>Thundergrouse LLC</p>
      </footer>
    </div>
  );
}
