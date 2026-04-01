export default function Aszf() {
  return (
    <div className="bg-cream min-h-screen py-16 px-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl mb-2">Általános Szerződési Feltételek</h1>
        <p className="text-dark/50 text-sm mb-12">Hatályos: 2025. január 1-től</p>

        <div className="prose prose-sm max-w-none text-dark/80 leading-relaxed space-y-8">

          <section>
            <h2 className="text-xl font-semibold text-dark mb-3">1. A Szolgáltató adatai</h2>
            <p>
              <strong>Vállalkozó neve:</strong> Jambrich-Kiss Réka Zsuzsanna<br />
              <strong>Székhely:</strong> 1048 Budapest, Óceán-árok u. 27.<br />
              <strong>Adószám:</strong> 55916187-1-42<br />
              <strong>Weboldal:</strong> rekarajza.hu<br />
              <strong>E-mail:</strong> rekarajza@gmail.com<br />
              <strong>Tevékenység:</strong> Digitális illusztrációk értékesítése<br />
              <strong>Adóügyi státusz:</strong> Alanyi adómentes (nem áfakörös)
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-dark mb-3">2. Az ÁSZF hatálya és elfogadása</h2>
            <p>
              Jelen Általános Szerződési Feltételek (továbbiakban: ÁSZF) a Jambrich-Kiss Réka Zsuzsanna egyéni vállalkozó (továbbiakban: Szolgáltató) által üzemeltetett rekarajza.hu weboldalon (továbbiakban: Weboldal) keresztül nyújtott digitális termékértékesítési szolgáltatásra vonatkoznak.
            </p>
            <p>
              A Weboldalon történő vásárlással a Vásárló elfogadja jelen ÁSZF rendelkezéseit. Az ÁSZF a Szolgáltató és a Vásárló között létrejövő szerződés részét képezi.
            </p>
            <p>
              A Szolgáltató fenntartja a jogot, hogy az ÁSZF-et egyoldalúan módosítsa. A módosítás a Weboldalon való közzétételkor lép hatályba.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-dark mb-3">3. A forgalmazott termékek</h2>
            <p>
              A Weboldalon kizárólag digitális tartalmak (illusztrációk) értékesítése történik, amelyek vásárlás után elektronikus formában (letölthető fájlként) kerülnek átadásra. A termékek fizikai formában nem kerülnek kiszállításra.
            </p>
            <p>
              A digitális termékek személyes, nem kereskedelmi célú felhasználásra készültek. Kereskedelmi célú felhasználás esetén a Vásárló köteles előzetesen kapcsolatba lépni a Szolgáltatóval.
            </p>
            <p>
              A termékekre vonatkozó részletes információk (formátum, méret, felbontás) az egyes termékek leírásában találhatók.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-dark mb-3">4. A vásárlás menete</h2>
            <p>
              A vásárlás az alábbi lépések szerint zajlik:
            </p>
            <ol className="list-decimal pl-5 space-y-1">
              <li>A Vásárló a kívánt terméket a kosárba helyezi.</li>
              <li>A kosár tartalmát áttekinti, majd a „Fizetés" gombra kattint.</li>
              <li>A Vásárló megadja az e-mail címét, számlázási adatait és bankkártya-adatait.</li>
              <li>A fizetés a Stripe biztonságos fizetési rendszeren keresztül történik.</li>
              <li>Sikeres fizetés után a Vásárló e-mailben megkapja a letöltési linket.</li>
            </ol>
            <p>
              A szerződés a sikeres fizetés visszaigazolásával jön létre a Szolgáltató és a Vásárló között.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-dark mb-3">5. Árak és fizetés</h2>
            <p>
              A Weboldalon feltüntetett árak magyar forintban (Ft) értendők. A Szolgáltató alanyi adómentes, ezért az árak általános forgalmi adót nem tartalmaznak.
            </p>
            <p>
              A fizetés bankkártyával történik a Stripe fizetési szolgáltatón keresztül. A Szolgáltató készpénzes fizetést nem fogad el. A Stripe adatkezelési gyakorlatáról a stripe.com/privacy oldalon tájékozódhat.
            </p>
            <p>
              A Szolgáltató fenntartja a jogot az árak megváltoztatására. A módosított árak a Weboldalon való megjelenéstől érvényesek, a már megvásárolt termékeket nem érintik.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-dark mb-3">6. Digitális tartalom átadása</h2>
            <p>
              A sikeres fizetést követően a Vásárló a megadott e-mail címre kap egy letöltési linket, amely korlátozott ideig érvényes. A Vásárló felelőssége a fájl letöltése az érvényességi időn belül.
            </p>
            <p>
              Amennyiben a letöltési link lejár vagy nem érkezik meg, a Vásárló a rekarajza@gmail.com e-mail címen kérhet segítséget.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-dark mb-3">7. Elállási jog</h2>
            <p>
              A 45/2014. (II. 26.) Korm. rendelet 29. § (1) bekezdés m) pontja alapján a Vásárló <strong>nem gyakorolhatja az elállási jogát</strong> olyan nem tárgyi adathordozón nyújtott digitális adattartalom tekintetében, amelynek szolgáltatása megkezdődött, feltéve hogy a Vásárló az elállási jog elvesztéséről előzetesen kifejezetten tudomást szerzett és ehhez hozzájárult.
            </p>
            <p>
              A vásárlás véglegesítésével a Vásárló kifejezetten hozzájárul ahhoz, hogy a Szolgáltató a digitális tartalom szolgáltatását azonnal megkezdje, és tudomásul veszi, hogy ezzel elállási jogát elveszíti.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-dark mb-3">8. Szavatosság és kellékszavatosság</h2>
            <p>
              A Szolgáltató szavatolja, hogy a digitális termékek letölthetők és az ismertetett formátumban elérhetők. Amennyiben a termék letöltése technikai hiba miatt nem lehetséges, a Szolgáltató köteles azt orvosolni vagy a vételárat visszatéríteni.
            </p>
            <p>
              A szavatossági igény érvényesítési határideje a Polgári Törvénykönyv rendelkezései szerint 2 év.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-dark mb-3">9. Szerzői jogok</h2>
            <p>
              A Weboldalon elérhető összes illusztráció a Szolgáltató szerzői jogi védelem alatt álló alkotása. A megvásárolt digitális tartalmak kizárólag személyes, nem kereskedelmi célú felhasználásra jogosítanak fel.
            </p>
            <p>
              A megvásárolt tartalmak nem értékesíthetők tovább, nem módosíthatók, és nem használhatók fel kereskedelmi célokra a Szolgáltató előzetes írásbeli engedélye nélkül. A szerzői jogi jogsértés polgári és büntetőjogi következményekkel járhat.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-dark mb-3">10. Panaszkezelés</h2>
            <p>
              A Vásárló panaszát a rekarajza@gmail.com e-mail címen terjesztheti elő. A Szolgáltató a panaszt 30 napon belül kivizsgálja és írásban válaszol.
            </p>
            <p>
              Amennyiben a Vásárló a panasz kezelésével nem elégedett, a következő szervekhez fordulhat:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Budapesti Békéltető Testület</strong> — 1016 Budapest, Krisztina krt. 99. | bekelteto.testulet@bkik.hu</li>
              <li><strong>Fogyasztóvédelmi hatóság:</strong> Pest Vármegyei Kormányhivatal Fogyasztóvédelmi Főosztály</li>
              <li><strong>Online vitarendezési platform:</strong> ec.europa.eu/consumers/odr</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-dark mb-3">11. Adatkezelés</h2>
            <p>
              A vásárlás során megadott személyes adatok (név, e-mail cím, számlázási cím) kezelése az Adatkezelési Tájékoztató szerint történik, amely a Weboldalon érhető el. Az adatkezelés jogalapja a szerződés teljesítése (GDPR 6. cikk (1) bek. b) pont).
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-dark mb-3">12. Alkalmazandó jog és joghatóság</h2>
            <p>
              Jelen ÁSZF-re a magyar jog az irányadó, különös tekintettel a Polgári Törvénykönyvről szóló 2013. évi V. törvényre és az elektronikus kereskedelmi szolgáltatásokról szóló 2001. évi CVIII. törvényre. A felek közötti jogvitákban a magyar bíróságok rendelkeznek joghatósággal.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-dark mb-3">13. Vegyes rendelkezések</h2>
            <p>
              Ha jelen ÁSZF valamely rendelkezése érvénytelen vagy végrehajthatatlan, ez nem érinti a többi rendelkezés érvényességét. Az érvénytelen rendelkezés helyébe a jogszabálynak leginkább megfelelő rendelkezés lép.
            </p>
            <p>
              Jelen ÁSZF 2025. január 1-jén lép hatályba.
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}
