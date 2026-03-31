export default function Bolt() {
  return (
    <div>
      <section className="bg-fennel py-16 px-6 text-center">
        <h1 className="text-4xl md:text-5xl mb-4">Bolt</h1>
        <p className="text-dark/60 text-lg max-w-xl mx-auto">
          Digitális termékek — vásárlás után azonnal letölthető illusztrációk és rajzok.
          Nyomtatható, felhasználható, örök.
        </p>
      </section>

      <section className="bg-cream py-16 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="aspect-square bg-fennel flex items-center justify-center">
                <span className="text-dark/30 text-sm">Hamarosan...</span>
              </div>
              <div className="p-5">
                <h3 className="font-semibold text-dark mb-1">Termék neve</h3>
                <p className="text-dark/50 text-sm mb-4">Digitális letöltés</p>
                <button
                  disabled
                  className="w-full py-2 bg-fern/30 text-fern/50 rounded-full text-sm font-semibold cursor-not-allowed"
                >
                  Hamarosan
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
