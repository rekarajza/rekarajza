export default function Rolam() {
  return (
    <div>
      <section className="bg-fennel py-16 px-6 text-center">
        <h1 className="text-4xl md:text-5xl">Rólam</h1>
      </section>

      <section className="bg-cream py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="flex flex-col md:flex-row gap-12 items-start">
            <img
              src="/reka.jpg"
              alt="Réka"
              className="w-48 h-48 rounded-full object-cover flex-shrink-0 mx-auto md:mx-0"
            />
            <div>
              <h2 className="text-4xl text-peony mb-6">Szia!</h2>
              <h3 className="text-xl font-semibold mb-4">Üdvözöllek a mesevilágomban!</h3>
              <p className="text-dark/70 leading-relaxed mb-4">
                2019 óta foglalkozom mesés illusztrációk, és természet-inspirálta kedves rajzok
                készítésével. Legfőképp digitálisan alkotok, de néha, ha időm engedi festek és
                rajzolok is.
              </p>
              <p className="text-dark/70 leading-relaxed mb-4">
                Rajzaimat a természetben töltött idő, az állatok, növények, tájak formálják.
                Kicsiknek és nagyoknak egyaránt szólnak a képeim, remélem te is megtalálod a
                saját kedvencedet!
              </p>
              <p className="text-dark/70 leading-relaxed mb-8">
                Ha egyéni tervezést, illusztrálást szeretnél, érdeklődj a kapcsolat fülön.
              </p>
              <p className="text-dark/70 leading-relaxed mb-6">Jó nézelődést!</p>
              <p className="text-2xl text-peach" style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic" }}>
                Réka
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
