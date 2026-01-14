'use client';

import { useEffect } from 'react';

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
          className="text-4xl md:text-5xl font-bold mb-4"
          style={{ color: 'var(--deep-brown)' }}
        >
          Something went wrong
        </h1>
        <p
          className="text-lg mb-8"
          style={{ color: 'var(--deep-brown)', opacity: 0.7 }}
        >
          The grouse got a little ruffled. Let&apos;s try that again.
        </p>
        <button
          onClick={reset}
          className="px-6 py-3 rounded-lg font-medium transition-all hover:scale-105"
          style={{ backgroundColor: 'var(--auburn)', color: 'var(--cream)' }}
        >
          Try again
        </button>
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
