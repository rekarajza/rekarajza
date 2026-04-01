const images = [
  { src: "/galeria/1.jpg",    alt: "Erdei tábortűz illusztráció" },
  { src: "/galeria/14.jpg",   alt: "Virágos botanikai illusztráció" },
  { src: "/galeria/7.jpg",    alt: "Lány rózsaszín konyhával" },
  { src: "/galeria/22.jpg",   alt: "Színes könyvborítók" },
  { src: "/galeria/3.jpeg",   alt: "Téli éjszakai könyvborító" },
  { src: "/galeria/15.jpg",   alt: "Kék madár növényekkel" },
  { src: "/galeria/9.jpg",    alt: "Pasztell állatos illusztráció" },
  { src: "/galeria/6.jpg",    alt: "Lány berkenye fánál" },
  { src: "/galeria/12.png",   alt: "Álmos Mackók könyvek" },
  { src: "/galeria/2.jpeg",   alt: "Kék madárház őszi levelekkel" },
  { src: "/galeria/11.jpg",   alt: "Kék hátterű kenyér és teáskanna" },
  { src: "/galeria/4.jpg",    alt: "Téli mesekönyv lapok" },
  { src: "/galeria/13.jpg",   alt: "Álmos Mackók könyvborító" },
  { src: "/galeria/8.jpg",    alt: "Gyerekek főznek együtt" },
  { src: "/galeria/20.jpg",   alt: "Lány piros ruhában tulipánok között" },
  { src: "/galeria/5.jpg",    alt: "Finomság sárga board book" },
  { src: "/galeria/10.jpg",   alt: "Halloween tök és madárijesztő" },
  { src: "/galeria/16.jpg",   alt: "Lamo csoki csomagoló illusztrációk" },
  { src: "/galeria/19.jpg",   alt: "Sárga buszos interaktív könyv" },
  { src: "/galeria/21.jpg",   alt: "Gyermekkönyvek gyűjteménye" },
  { src: "/galeria/18.jpg",   alt: "Könyvek egymáson" },
  { src: "/galeria/17.jpg",   alt: "Színes flash kártyák állatokkal" },
];

export default function Home() {
  return (
    <div>
      <section className="bg-cream py-16 px-6">
        <div className="max-w-6xl mx-auto columns-1 sm:columns-2 md:columns-3 gap-4 space-y-4">
          {images.map((img, i) => (
            <div
              key={i}
              className="break-inside-avoid overflow-hidden rounded-2xl group cursor-pointer"
            >
              <img
                src={img.src}
                alt={img.alt}
                className="w-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading={i < 6 ? "eager" : "lazy"}
              />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
