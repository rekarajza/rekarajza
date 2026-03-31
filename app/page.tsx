import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-cream min-h-[85vh] flex flex-col items-center justify-center text-center px-6 py-20">
        <Image
          src="/logo.png"
          alt="Réka rajza"
          width={280}
          height={140}
          className="object-contain mb-8"
          priority
        />
        <p className="text-xl md:text-2xl text-dark/70 font-light tracking-wide mb-4">
          Gyermekkönyv illusztrációk
        </p>
        <p className="max-w-md text-base text-dark/60 mb-10 leading-relaxed">
          Meleg, karakteres rajzok gyerekkönyvekhez, mesevilágokhoz és digitális kiadványokhoz.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/galeria"
            className="px-8 py-3 bg-fern text-white rounded-full font-semibold hover:bg-fern/80 transition-colors"
          >
            Galéria megtekintése
          </Link>
          <Link
            href="/bolt"
            className="px-8 py-3 border-2 border-fern text-fern rounded-full font-semibold hover:bg-fern hover:text-white transition-colors"
          >
            Bolt
          </Link>
        </div>
      </section>

      {/* Recent works */}
      <section className="bg-fennel py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl text-center mb-12">Friss munkák</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="aspect-square bg-pistachio/40 rounded-2xl flex items-center justify-center">
                <span className="text-dark/30 text-sm">Hamarosan...</span>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link
              href="/galeria"
              className="inline-block px-8 py-3 bg-fern text-white rounded-full font-semibold hover:bg-fern/80 transition-colors"
            >
              Az összes munka
            </Link>
          </div>
        </div>
      </section>

      {/* About teaser */}
      <section className="bg-cream py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl mb-6">Szia, Réka vagyok!</h2>
          <p className="text-dark/70 leading-relaxed text-lg mb-8">
            Gyermekkönyv illusztrátor vagyok, aki szereti az egyszerű vonalakat, meleg színeket
            és a mesék varázsát. Rajzaim digitálisan készülnek, de minden egyes vonalban
            ott van a kézzel rajzolt érzés.
          </p>
          <Link
            href="/rolam"
            className="inline-block px-8 py-3 border-2 border-fern text-fern rounded-full font-semibold hover:bg-fern hover:text-white transition-colors"
          >
            Tudj meg többet rólam
          </Link>
        </div>
      </section>
    </div>
  );
}
