import Image from 'next/image';

export default function Karbantartas() {
  return (
    <div className="min-h-screen bg-cream flex flex-col items-center justify-center text-center px-6">
      <Image
        src="/logo.png"
        alt="Réka rajza"
        width={220}
        height={110}
        className="object-contain mb-8"
        priority
      />
      <h1 className="text-3xl md:text-4xl mb-4">Hamarosan visszatérünk!</h1>
      <p className="text-dark/60 text-lg max-w-md leading-relaxed">
        Az oldal éppen fejlesztés alatt áll. Köszönöm a türelmet — nemsokára minden elérhető lesz!
      </p>
      <p className="text-dark/40 text-sm mt-8">© Réka rajza</p>
    </div>
  );
}
