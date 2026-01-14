export default function Home() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--cream)' }}>
      {/* Hero Section */}
      <header className="px-6 py-20 md:py-32 text-center">
        <div className="max-w-4xl mx-auto">
          <h1
            className="text-5xl md:text-7xl font-bold tracking-tight mb-6"
            style={{ color: 'var(--deep-brown)' }}
          >
            Thundergrouse
          </h1>
          <p
            className="text-xl md:text-2xl mb-8"
            style={{ color: 'var(--auburn)' }}
          >
            iOS Apps Crafted in the Pacific Northwest
          </p>
          <p
            className="text-lg max-w-2xl mx-auto"
            style={{ color: 'var(--deep-brown)', opacity: 0.8 }}
          >
            We build thoughtful, beautifully designed apps for iPhone and iPad.
          </p>
        </div>
      </header>

      {/* About Section */}
      <section className="px-6 py-20" style={{ backgroundColor: 'var(--charcoal)' }}>
        <div className="max-w-4xl mx-auto">
          <h2
            className="text-3xl md:text-4xl font-bold mb-8 text-center"
            style={{ color: 'var(--cream)' }}
          >
            About Us
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div
              className="p-6 rounded-lg"
              style={{ backgroundColor: 'var(--deep-brown)' }}
            >
              <h3 className="text-xl font-semibold mb-3" style={{ color: 'var(--warm-tan)' }}>
                Who We Are
              </h3>
              <p style={{ color: 'var(--cream)', opacity: 0.9 }}>
                Thundergrouse is a two-person studio founded by brothers Luke and John Stanley.
                Based in Washington State, we create iOS applications that respect your time and attention.
              </p>
            </div>
            <div
              className="p-6 rounded-lg"
              style={{ backgroundColor: 'var(--deep-brown)' }}
            >
              <h3 className="text-xl font-semibold mb-3" style={{ color: 'var(--warm-tan)' }}>
                Our Philosophy
              </h3>
              <p style={{ color: 'var(--cream)', opacity: 0.9 }}>
                We believe apps should enhance your life, not consume it.
                Every feature we build is intentional, every interaction considered.
                Quality over quantity, always.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Apps Section */}
      <section className="px-6 py-20" style={{ backgroundColor: 'var(--cream)' }}>
        <div className="max-w-4xl mx-auto">
          <h2
            className="text-3xl md:text-4xl font-bold mb-12 text-center"
            style={{ color: 'var(--deep-brown)' }}
          >
            Our Apps
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {/* CHOP */}
            <div
              className="p-8 rounded-xl border-2 transition-transform hover:scale-105"
              style={{
                backgroundColor: 'white',
                borderColor: 'var(--warm-tan)',
              }}
            >
              <div
                className="w-16 h-16 rounded-2xl mb-4 flex items-center justify-center text-2xl"
                style={{ backgroundColor: 'var(--auburn)' }}
              >
                🪓
              </div>
              <h3
                className="text-2xl font-bold mb-2"
                style={{ color: 'var(--deep-brown)' }}
              >
                CHOP
              </h3>
              <span
                className="inline-block px-3 py-1 rounded-full text-sm mb-4"
                style={{ backgroundColor: 'var(--warm-tan)', color: 'var(--charcoal)' }}
              >
                In Development
              </span>
              <p
                className="mb-4"
                style={{ color: 'var(--deep-brown)', opacity: 0.8 }}
              >
                A satisfying wood chopping arcade game with furnace crafting and gathering mechanics.
                Simple to play, hard to master.
              </p>
              <a
                href="https://github.com/Steelhead-Command/CHOP"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 font-medium hover:underline"
                style={{ color: 'var(--auburn)' }}
              >
                View on GitHub →
              </a>
            </div>

            {/* Water Flow */}
            <div
              className="p-8 rounded-xl border-2 transition-transform hover:scale-105"
              style={{
                backgroundColor: 'white',
                borderColor: 'var(--warm-tan)',
              }}
            >
              <div
                className="w-16 h-16 rounded-2xl mb-4 flex items-center justify-center text-2xl"
                style={{ backgroundColor: 'var(--deep-brown)' }}
              >
                🌊
              </div>
              <h3
                className="text-2xl font-bold mb-2"
                style={{ color: 'var(--deep-brown)' }}
              >
                Water Flow
              </h3>
              <span
                className="inline-block px-3 py-1 rounded-full text-sm mb-4"
                style={{ backgroundColor: 'var(--charcoal)', color: 'var(--cream)' }}
              >
                Coming Soon
              </span>
              <p
                className="mb-4"
                style={{ color: 'var(--deep-brown)', opacity: 0.8 }}
              >
                River and stream conditions for the Pacific Northwest.
                Flow rates, fishing conditions, and kayak readiness at your fingertips.
              </p>
              <span
                className="inline-flex items-center gap-2"
                style={{ color: 'var(--auburn)', opacity: 0.6 }}
              >
                Stay tuned...
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* GitHub Section */}
      <section
        className="px-6 py-20"
        style={{ backgroundColor: 'var(--deep-brown)' }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <h2
            className="text-3xl md:text-4xl font-bold mb-8"
            style={{ color: 'var(--cream)' }}
          >
            Open Source
          </h2>
          <p
            className="text-lg mb-8 max-w-2xl mx-auto"
            style={{ color: 'var(--cream)', opacity: 0.8 }}
          >
            Check out our work on GitHub. We believe in building in the open.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://github.com/Steelhead-Command"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 rounded-lg font-medium transition-colors hover:opacity-90"
              style={{ backgroundColor: 'var(--warm-tan)', color: 'var(--charcoal)' }}
            >
              @Steelhead-Command
            </a>
            <a
              href="https://github.com/Choco-Command"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 rounded-lg font-medium transition-colors hover:opacity-90"
              style={{ backgroundColor: 'var(--cream)', color: 'var(--charcoal)' }}
            >
              @Choco-Command
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        className="px-6 py-12"
        style={{ backgroundColor: 'var(--charcoal)' }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <p
            className="text-lg font-semibold mb-2"
            style={{ color: 'var(--cream)' }}
          >
            Thundergrouse LLC
          </p>
          <p
            className="mb-4"
            style={{ color: 'var(--cream)', opacity: 0.6 }}
          >
            Woodland, Washington
          </p>
          <p
            className="text-sm"
            style={{ color: 'var(--cream)', opacity: 0.4 }}
          >
            © 2025 Thundergrouse LLC. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
