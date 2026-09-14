export type FooterProps = {
  brandName: string;
};

export default function Footer({ brandName }: FooterProps) {
  return (
    <footer className="relative border-t border-[var(--yc-line)]">
      <div className="content-rail">
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div className="yc-hud-text text-[9px] text-[var(--yc-dim)]">ORIGINAL UI / MODULAR TERMINAL AESTHETIC</div>
            <div className="yc-hud-text text-[9px] text-[var(--yc-dim)]">
              COPYRIGHT {new Date().getFullYear()} {brandName}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
