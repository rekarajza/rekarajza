export default function Galeria() {
  return (
    <div>
      <section className="bg-fennel py-16 px-6 text-center">
        <h1 className="text-4xl md:text-5xl mb-4">Galéria</h1>
        <p className="text-dark/60 text-lg">Válogatás az eddigi munkáimból</p>
      </section>

      <section className="bg-cream py-16 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {Array.from({ length: 9 }).map((_, i) => (
            <div
              key={i}
              className="aspect-square bg-fennel rounded-2xl flex items-center justify-center hover:scale-105 transition-transform cursor-pointer"
            >
              <span className="text-dark/30 text-sm">Hamarosan...</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
