export default function Adatkezeles() {
  return (
    <div className="bg-cream min-h-screen py-16 px-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl mb-2">Adatkezelési Tájékoztató</h1>
        <p className="text-dark/50 text-sm mb-12">Hatályos: 2025. január 1-től</p>

        <div className="prose prose-sm max-w-none text-dark/80 leading-relaxed space-y-8">

          <section>
            <h2 className="text-xl font-semibold text-dark mb-3">1. Az adatkezelő adatai</h2>
            <p>
              <strong>Adatkezelő neve:</strong> Jambrich-Kiss Réka Zsuzsanna<br />
              <strong>Székhely:</strong> 1048 Budapest, Óceán-árok u. 27.<br />
              <strong>Adószám:</strong> 55916187-1-42<br />
              <strong>E-mail:</strong> rekarajza@gmail.com<br />
              <strong>Weboldal:</strong> rekarajza.hu
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-dark mb-3">2. Az adatkezelés jogszabályi háttere</h2>
            <p>
              Az adatkezelés az Európai Parlament és a Tanács (EU) 2016/679 rendelete (GDPR), valamint az információs önrendelkezési jogról és az információszabadságról szóló 2011. évi CXII. törvény (Infotv.) rendelkezései alapján történik.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-dark mb-3">3. Kezelt személyes adatok és az adatkezelés célja</h2>

            <h3 className="text-base font-semibold text-dark mt-4 mb-2">3.1. Vásárlás során kezelt adatok</h3>
            <p>
              <strong>Kezelt adatok:</strong> teljes név, e-mail cím, számlázási cím (utca, házszám, város, irányítószám, ország)<br />
              <strong>Az adatkezelés célja:</strong> a vásárlási szerződés teljesítése, a digitális termék átadása, számla kiállítása<br />
              <strong>Jogalap:</strong> szerződés teljesítése (GDPR 6. cikk (1) bek. b) pont)<br />
              <strong>Megőrzési idő:</strong> a számviteli törvény alapján 8 év
            </p>

            <h3 className="text-base font-semibold text-dark mt-4 mb-2">3.2. Kapcsolatfelvétel során kezelt adatok</h3>
            <p>
              <strong>Kezelt adatok:</strong> név, e-mail cím, üzenet tartalma<br />
              <strong>Az adatkezelés célja:</strong> a megkeresés megválaszolása<br />
              <strong>Jogalap:</strong> az érintett hozzájárulása (GDPR 6. cikk (1) bek. a) pont)<br />
              <strong>Megőrzési idő:</strong> az ügy lezárásától számított 1 év
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-dark mb-3">4. Adatfeldolgozók</h2>
            <p>Az adatkezelő az alábbi adatfeldolgozókat veszi igénybe:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>Stripe Inc.</strong> — fizetési adatok feldolgozása (stripe.com)<br />
                <span className="text-dark/60 text-xs">Székhely: 510 Townsend Street, San Francisco, CA 94103, USA</span>
              </li>
              <li>
                <strong>Supabase Inc.</strong> — adatbázis és fájltárolás (supabase.com)<br />
                <span className="text-dark/60 text-xs">Az adatok az EU területén kerülnek tárolásra.</span>
              </li>
              <li>
                <strong>Brevo (Sendinblue SAS)</strong> — e-mail küldés (brevo.com)<br />
                <span className="text-dark/60 text-xs">Székhely: 7 rue de Madrid, 75008 Paris, Franciaország</span>
              </li>
              <li>
                <strong>Vercel Inc.</strong> — weboldal üzemeltetés (vercel.com)<br />
                <span className="text-dark/60 text-xs">Székhely: 340 S Lemon Ave #4133, Walnut, CA 91789, USA</span>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-dark mb-3">5. Sütik (cookie-k)</h2>
            <p>
              A Weboldal működéséhez szükséges munkamenet-sütiket használ. Ezek a sütik a böngésző bezárásával törlődnek, és nem tartalmaznak személyes azonosításra alkalmas adatot.
            </p>
            <p>
              A Weboldal nem használ marketing vagy nyomkövető sütiket.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-dark mb-3">6. Az érintett jogai</h2>
            <p>Az érintett személyek az alábbi jogokkal rendelkeznek:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Hozzáférés joga:</strong> tájékoztatást kérhet a kezelt adatairól</li>
              <li><strong>Helyesbítés joga:</strong> kérheti a pontatlan adatok helyesbítését</li>
              <li><strong>Törlés joga:</strong> kérheti adatai törlését, ha az adatkezelés jogalapja megszűnt</li>
              <li><strong>Adathordozhatóság joga:</strong> kérheti adatai géppel olvasható formátumban való átadását</li>
              <li><strong>Tiltakozás joga:</strong> tiltakozhat adatai kezelése ellen</li>
            </ul>
            <p>
              Jogai gyakorlásához kérjük, vegye fel a kapcsolatot a rekarajza@gmail.com e-mail címen. Az adatkezelő 30 napon belül válaszol a megkeresésekre.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-dark mb-3">7. Jogorvoslat</h2>
            <p>
              Amennyiben úgy véli, hogy adatainak kezelése sérti a GDPR rendelkezéseit, panaszt nyújthat be a Nemzeti Adatvédelmi és Információszabadság Hatósághoz (NAIH):
            </p>
            <p>
              <strong>NAIH</strong><br />
              Cím: 1055 Budapest, Falk Miksa utca 9-11.<br />
              E-mail: ugyfelszolgalat@naih.hu<br />
              Weboldal: naih.hu
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-dark mb-3">8. Az adatkezelési tájékoztató módosítása</h2>
            <p>
              Az adatkezelő fenntartja a jogot, hogy jelen tájékoztatót módosítsa. A módosításról az érintetteket a Weboldalon keresztül tájékoztatja. A tájékoztató mindenkor hatályos változata a rekarajza.hu/adatkezeles oldalon érhető el.
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}
