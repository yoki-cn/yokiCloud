export type FooterProps = {
  brandName: string;
};

export default function Footer({ brandName }: FooterProps) {
  return (
    <footer className="relative border-t border-white/5">
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div className="text-[9px] tracking-[0.22em] text-white/35">ORIGINAL UI / MODULAR TERMINAL AESTHETIC</div>
          <div className="text-[9px] tracking-[0.22em] text-white/35">
            ? {new Date().getFullYear()} {brandName}
          </div>
        </div>
      </div>
    </footer>
  );
}
