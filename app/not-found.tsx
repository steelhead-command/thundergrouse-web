import Link from 'next/link';

export default function NotFound() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6"
      style={{ backgroundColor: 'var(--cream)' }}
    >
      <div className="text-center max-w-md">
        <div
          className="w-24 h-24 rounded-full mx-auto mb-8 flex items-center justify-center text-5xl"
          style={{ backgroundColor: 'var(--warm-tan)' }}
        >
          🐓
        </div>
        <h1
          className="text-6xl md:text-7xl font-bold mb-4"
          style={{ color: 'var(--deep-brown)' }}
        >
          404
        </h1>
        <h2
          className="text-2xl md:text-3xl font-semibold mb-4"
          style={{ color: 'var(--auburn)' }}
        >
          Page not found
        </h2>
        <p
          className="text-lg mb-8"
          style={{ color: 'var(--deep-brown)', opacity: 0.7 }}
        >
          This grouse has flown the coop. The page you&apos;re looking for doesn&apos;t exist.
        </p>
        <Link
          href="/"
          className="inline-block px-6 py-3 rounded-lg font-medium transition-all hover:scale-105"
          style={{ backgroundColor: 'var(--auburn)', color: 'var(--cream)' }}
        >
          Back to Home
        </Link>
      </div>
      <footer
        className="absolute bottom-8 text-center"
        style={{ color: 'var(--deep-brown)', opacity: 0.5 }}
      >
        <p className="text-sm">Thundergrouse LLC</p>
      </footer>
    </div>
  );
}
