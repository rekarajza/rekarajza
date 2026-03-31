export default function Footer() {
  return (
    <footer className="bg-fennel mt-auto">
      <div className="max-w-5xl mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-sm text-dark/70">© {new Date().getFullYear()} Réka rajza. Minden jog fenntartva.</p>
        <div className="flex gap-6 text-sm text-dark/70">
          <a href="mailto:rekarajza@gmail.com" className="hover:text-peony transition-colors">rekarajza@gmail.com</a>
        </div>
      </div>
    </footer>
  );
}
