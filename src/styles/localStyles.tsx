export default function LocalStyles() {
  return (
    <style>{`
      @keyframes scanY {
        0% { transform: translateY(-30%); opacity: 0; }
        10% { opacity: .25; }
        50% { opacity: .18; }
        90% { opacity: .25; }
        100% { transform: translateY(130%); opacity: 0; }
      }

      @keyframes softPulse {
        0%,100% { opacity: .35; }
        50% { opacity: .7; }
      }

      .scanline {
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        height: 38%;
        background: linear-gradient(
          to bottom,
          transparent,
          rgba(120,220,255,0.08),
          rgba(255,255,255,0.05),
          transparent
        );
        animation: scanY 5.2s linear infinite;
        pointer-events: none;
      }

      .grain {
        background-image:
          radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1.2px);
        background-size: 14px 14px;
      }

      /* Background grid: localized emphasis + edge falloff (day/night) */
      .bg-grid { opacity: 1; }
      .bg-grid::before,
      .bg-grid::after {
        content: "";
        position: absolute;
        inset: 0;
        pointer-events: none;
      }

      /* Base grid (subtle, fades at edges) */
      .bg-grid::before {
        opacity: 0.52;
        background-image:
          linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
        background-size: 28px 28px;
        background-position: 0 0;
        mask-image: radial-gradient(
          ellipse at 50% 38%,
          rgba(0,0,0,1) 0 56%,
          rgba(0,0,0,0) 94%
        );
        -webkit-mask-image: radial-gradient(
          ellipse at 50% 38%,
          rgba(0,0,0,1) 0 56%,
          rgba(0,0,0,0) 94%
        );
      }

      /* Local boost */
      .bg-grid::after {
        opacity: 0.22;
        background-image:
          linear-gradient(rgba(255,255,255,0.055) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px);
        background-size: 28px 28px;
        background-position: 0 0;
        mask-image: radial-gradient(
          circle at 50% 30%,
          rgba(0,0,0,1) 0 32%,
          rgba(0,0,0,0) 78%
        );
        -webkit-mask-image: radial-gradient(
          circle at 50% 30%,
          rgba(0,0,0,1) 0 32%,
          rgba(0,0,0,0) 78%
        );
      }

      /* Day: warmer grid */
      [data-theme="light"] .app-root .bg-grid::before {
        opacity: 0.50;
        background-image:
          linear-gradient(rgba(180,160,130,0.16) 1px, transparent 1px),
          linear-gradient(90deg, rgba(180,160,130,0.13) 1px, transparent 1px);
        background-size: 26px 26px;
        background-position: 0 0;
        mask-image: radial-gradient(
          ellipse at 50% 38%,
          rgba(0,0,0,1) 0 58%,
          rgba(0,0,0,0) 95%
        );
        -webkit-mask-image: radial-gradient(
          ellipse at 50% 38%,
          rgba(0,0,0,1) 0 58%,
          rgba(0,0,0,0) 95%
        );
      }

      [data-theme="light"] .app-root .bg-grid::after {
        opacity: 0.30;
        background-image:
          linear-gradient(rgba(180,160,130,0.22) 1px, transparent 1px),
          linear-gradient(90deg, rgba(180,160,130,0.18) 1px, transparent 1px),
          radial-gradient(rgba(180,160,130,0.10) 1px, transparent 1.2px);
        background-size: 26px 26px;
        background-position: 0 0, 0 0, 0.5px 0.5px;
        mask-image: radial-gradient(
          circle at 50% 30%,
          rgba(0,0,0,1) 0 36%,
          rgba(0,0,0,0) 80%
        );
        -webkit-mask-image: radial-gradient(
          circle at 50% 30%,
          rgba(0,0,0,1) 0 36%,
          rgba(0,0,0,0) 80%
        );
      }

      [data-theme="light"] .app-root .grain { opacity: 0.12; }

      .soft-pulse { animation: softPulse 3.6s ease-in-out infinite; }

      [data-theme="light"] .app-root {
        background-color: #f5f3ee;
        color: #0f172a;
      }

      [data-theme="light"] .panel {
        background-color: rgba(255,255,255,0.98);
        border-color: rgba(148,163,184,0.45);
        box-shadow:
          0 18px 40px rgba(148,163,184,0.30),
          inset 0 0 0 1px rgba(180,160,130,0.26),
          inset 0 0 0 2px rgba(245,213,150,0.10);
      }

      [data-theme="light"] .inner-elevated {
        background-color: #f3ece0;
        border-color: rgba(180,160,130,0.8);
      }

      [data-theme="light"] .section-title-main,
      [data-theme="light"] .heading-main { color: #111827; }

      [data-theme="light"] .section-desc,
      [data-theme="light"] .text-muted-block { color: #4b5563; }

      .app-root .section-meta-night { color: rgba(255,255,255,0.42); }
      .app-root .section-meta-slash { opacity: 0.35; }
      .app-root .section-meta-night .section-meta-dot { background: rgba(88,199,255,0.85); }

      .app-root .section-meta-day { color: #6b7280; }
      .app-root .section-meta-day .section-meta-dot { background: rgba(245,213,150,0.95); }

      [data-theme="light"] .app-root [class*="text-white/"] { color: #6b7280; }
      [data-theme="light"] .app-root [class*="text-white/9"] { color: #111827; }
      [data-theme="light"] .app-root [class*="text-white/7"] { color: #1f2937; }
      [data-theme="light"] .app-root [class*="text-white/5"] { color: #4b5563; }
      [data-theme="light"] .app-root [class*="text-white/3"] { color: #9ca3af; }

      [data-theme="light"] .app-root [class*="text-cyan-"] { color: #075985; }
      [data-theme="light"] .app-root [class*="text-orange-"] { color: #92400e; }

      [data-theme="light"] .app-root [class*="bg-white/5"] { background-color: #f3ece0; }
      [data-theme="light"] .app-root [class*="border-white/10"] { border-color: rgba(148,163,184,0.45); }
      [data-theme="light"] .app-root [class*="border-white/5"] { border-color: rgba(148,163,184,0.25); }

      [data-theme="light"] .app-root [class*="bg-cyan-400/15"] { background-color: rgba(56,189,248,0.16); }
      [data-theme="light"] .app-root [class*="hover:bg-cyan-400/22"]:hover { background-color: rgba(56,189,248,0.24); }
      [data-theme="light"] .app-root [class*="border-cyan-300/3"] { border-color: rgba(37,99,235,0.45); }

      [data-theme="light"] .app-root [class*="bg-orange-400/10"] { background-color: rgba(251,191,36,0.18); }
      [data-theme="light"] .app-root [class*="border-orange-300/3"] { border-color: rgba(217,119,6,0.45); }

      .app-root .proj-hud-chip {
        display: inline-flex;
        align-items: center;
        padding: 2px 6px;
        border-radius: 8px;
        border: 1px solid rgba(255,255,255,0.16);
        background: rgba(255,255,255,0.05);
        color: rgba(255,255,255,0.72);
        font-size: 9px;
        letter-spacing: 0.18em;
        text-transform: uppercase;
      }

      [data-theme="light"] .app-root .proj-hud-chip {
        border: 1px solid rgba(180,160,130,0.55);
        background: rgba(253,248,238,0.72);
        color: #374151;
      }

      [data-theme="light"] .pill {
        background-color: #f3ece0;
        border-color: rgba(180,160,130,0.8);
        color: #374151;
      }

      [data-theme="light"] .link-button {
        background-color: #f3ece0;
        border-color: rgba(148,163,184,0.6);
        color: #111827;
      }
      [data-theme="light"] .link-button:hover { background-color: #e5dccf; }

      [data-theme="light"] .app-root .ext-route {
        background-color: rgba(253,248,238,0.72);
        border-color: rgba(180,160,130,0.72);
        color: #111827;
      }
      [data-theme="light"] .app-root .ext-route:hover { background-color: #e5dccf; }
      [data-theme="light"] .app-root .ext-route-label { color: #111827; }

      [data-theme="light"] .app-root .top-bar {
        background-color: rgba(244, 232, 212, 0.97);
        border-bottom-color: rgba(180, 160, 130, 0.48);
      }

      [data-theme="light"] .app-root .header-tagline { color: #4b5563; }

      [data-theme="light"] .app-root .top-nav-link {
        background-color: transparent;
        border-color: transparent;
        color: #4b5563;
      }
      [data-theme="light"] .app-root .top-nav-link:hover {
        background-color: rgba(148,163,184,0.16);
        color: #111827;
      }

      [data-theme="light"] .app-root .top-bar-separator {
        background-image: linear-gradient(
          to bottom,
          rgba(0,0,0,0),
          rgba(245, 213, 150, 0.88),
          rgba(0,0,0,0)
        );
        opacity: 0.72;
        transform-origin: center;
        will-change: opacity, filter, transform;
        filter: drop-shadow(0 0 6px rgba(245,213,150,0.22));
      }

      [data-theme="light"] .app-root .year-router { border-top-color: rgba(180,160,130,0.35); }
      [data-theme="light"] .app-root .year-router-line { background: rgba(180,160,130,0.55); }
      [data-theme="light"] .app-root .year-router-label { color: #6b7280; }

      [data-theme="light"] .app-root .portal-section { position: relative; }
      [data-theme="light"] .app-root .portal-section::before {
        content: "";
        position: absolute;
        inset: -10px;
        pointer-events: none;
        z-index: 0;
        opacity: 0.55;
        background:
          radial-gradient(circle at 22% 18%, rgba(245,213,150,0.18), rgba(0,0,0,0) 55%),
          radial-gradient(circle at 72% 22%, rgba(91,167,186,0.12), rgba(0,0,0,0) 58%),
          radial-gradient(circle at 50% 82%, rgba(180,160,130,0.10), rgba(0,0,0,0) 60%),
          repeating-linear-gradient(90deg, rgba(180,160,130,0.10) 0 1px, rgba(0,0,0,0) 1px 30px),
          repeating-linear-gradient(0deg, rgba(180,160,130,0.06) 0 1px, rgba(0,0,0,0) 1px 24px);
        mask-image: radial-gradient(circle at 50% 35%, #000 0 62%, rgba(0,0,0,0) 90%);
      }
      [data-theme="light"] .app-root .portal-section > * { position: relative; z-index: 1; }

      [data-theme="light"] .app-root .portal-surface::after {
        content: "";
        position: absolute;
        inset: 0;
        border-radius: inherit;
        pointer-events: none;
        opacity: 0.65;
        background:
          radial-gradient(circle at 18% 34%, rgba(245,213,150,0.22) 0 2px, rgba(0,0,0,0) 3px),
          radial-gradient(circle at 18% 34%, rgba(180,160,130,0.14) 0 26px, rgba(0,0,0,0) 27px),
          linear-gradient(135deg, rgba(180,160,130,0.16), rgba(0,0,0,0) 58%);
        mix-blend-mode: multiply;
      }

      .app-root .section-title-divider {
        background: linear-gradient(90deg, rgba(255,255,255,0.22), rgba(255,255,255,0.10), rgba(0,0,0,0));
      }
      [data-theme="light"] .app-root .section-title-divider {
        background: linear-gradient(90deg, rgba(180,160,130,0.70), rgba(245,213,150,0.34), rgba(0,0,0,0));
      }

      @keyframes separatorBreath {
        0%, 100% {
          opacity: 0.58;
          transform: scaleX(1);
          filter:
            drop-shadow(0 0 7px rgba(245,213,150,0.22))
            drop-shadow(0 0 0 rgba(245,213,150,0));
        }
        50% {
          opacity: 1;
          transform: scaleX(1.55);
          filter:
            drop-shadow(0 0 20px rgba(245,213,150,0.78))
            drop-shadow(0 0 62px rgba(245,213,150,0.28));
        }
      }
      [data-theme="light"] .app-root .top-bar-actions:hover .top-bar-separator {
        animation: separatorBreath 1.9s ease-in-out infinite;
      }

      @keyframes portalSweep {
        0% { transform: translateX(-130%) skewX(-18deg); opacity: 0; }
        15% { opacity: 0.8; }
        55% { opacity: 0.55; }
        100% { transform: translateX(230%) skewX(-18deg); opacity: 0; }
      }

      .portal-hover-scan {
        position: absolute;
        top: 0;
        bottom: 0;
        left: -40%;
        width: 40%;
        pointer-events: none;
        opacity: 0;
      }

      [data-theme="light"] .app-root .portal-card:hover .portal-hover-scan {
        opacity: 1;
        background: linear-gradient(
          90deg,
          rgba(0,0,0,0),
          rgba(245,213,150,0.18),
          rgba(91,167,186,0.10),
          rgba(245,213,150,0.12),
          rgba(0,0,0,0)
        );
        animation: portalSweep 420ms linear 1;
        mix-blend-mode: multiply;
      }

      @keyframes tickFlash {
        0% { opacity: 0; transform: translateY(0); }
        25% { opacity: 0.95; }
        70% { opacity: 0.35; }
        100% { opacity: 0; transform: translateY(-1px); }
      }
      .portal-tickflash {
        position: absolute;
        left: 14px;
        bottom: 12px;
        height: 10px;
        width: 92px;
        pointer-events: none;
        opacity: 0;
      }
      .portal-tickflash::before,
      .portal-tickflash::after {
        content: "";
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        height: 1px;
        background: rgba(245,213,150,0.75);
      }
      .portal-tickflash::before {
        left: 0;
        width: 56px;
        box-shadow: 0 0 10px rgba(245,213,150,0.20), 0 0 0 1px rgba(180,160,130,0.20);
      }
      .portal-tickflash::after {
        left: 62px;
        width: 22px;
        background: rgba(91,167,186,0.35);
      }

      [data-theme="light"] .app-root .portal-card:hover .portal-tickflash {
        animation: tickFlash 520ms ease-out 1;
        animation-delay: 320ms;
      }

      .portal-sigil {
        position: absolute;
        top: 12px;
        right: 12px;
        width: 44px;
        height: 44px;
        border-radius: 999px;
        pointer-events: none;
        opacity: 0;
      }

      [data-theme="light"] .app-root .portal-sigil {
        opacity: 0.78;
        border: 1px solid rgba(180,160,130,0.62);
        box-shadow: 0 0 0 1px rgba(245,213,150,0.10) inset;
        background:
          radial-gradient(circle at 50% 50%, rgba(245,213,150,0.18), rgba(0,0,0,0) 62%),
          radial-gradient(circle at 30% 30%, rgba(91,167,186,0.10), rgba(0,0,0,0) 48%);
      }

      [data-theme="light"] .app-root .portal-sigil::before,
      [data-theme="light"] .app-root .portal-sigil::after {
        content: "";
        position: absolute;
        left: 50%;
        top: 50%;
        width: 60%;
        height: 1px;
        background: rgba(180,160,130,0.55);
        transform: translate(-50%, -50%);
      }
      [data-theme="light"] .app-root .portal-sigil::after {
        transform: translate(-50%, -50%) rotate(90deg);
        opacity: 0.85;
      }

      [data-theme="light"] .app-root .portal-sigil-01 {
        background:
          radial-gradient(circle at 50% 50%, rgba(245,213,150,0.22), rgba(0,0,0,0) 60%),
          radial-gradient(circle at 68% 34%, rgba(180,160,130,0.24) 0 2px, rgba(0,0,0,0) 3px),
          radial-gradient(circle at 36% 72%, rgba(91,167,186,0.14) 0 2px, rgba(0,0,0,0) 3px);
      }
      [data-theme="light"] .app-root .portal-sigil-02 {
        background:
          radial-gradient(circle at 50% 50%, rgba(91,167,186,0.14), rgba(0,0,0,0) 62%),
          conic-gradient(from 220deg, rgba(245,213,150,0.26), rgba(0,0,0,0), rgba(245,213,150,0.14));
      }
      [data-theme="light"] .app-root .portal-sigil-03 {
        background:
          radial-gradient(circle at 50% 50%, rgba(245,213,150,0.18), rgba(0,0,0,0) 60%),
          radial-gradient(circle at 50% 50%, rgba(180,160,130,0.14) 0 18px, rgba(0,0,0,0) 19px),
          linear-gradient(135deg, rgba(91,167,186,0.12), rgba(0,0,0,0) 58%);
      }

      [data-theme="light"] .app-root .gateway-card .portal-sigil {
        right: 92px;
        top: 10px;
        width: 40px;
        height: 40px;
        opacity: 0.72;
      }

      .route-corner {
        position: absolute;
        top: 10px;
        right: 10px;
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 4px 6px;
        border: 1px solid rgba(255,255,255,0.18);
        background: rgba(255,255,255,0.05);
        color: rgba(255,255,255,0.78);
        border-radius: 9px;
        backdrop-filter: blur(6px);
        -webkit-backdrop-filter: blur(6px);
        clip-path: polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 0 100%);
        pointer-events: none;
        z-index: 2;
      }
      .route-corner-text { display: flex; flex-direction: column; line-height: 1; }
      .route-corner-k { font-size: 8px; letter-spacing: 0.24em; opacity: 0.62; }
      .route-corner-code { margin-top: 2px; font-size: 9px; letter-spacing: 0.22em; opacity: 0.92; }
      .route-corner-ico { opacity: 0.7; }

      [data-theme="light"] .app-root .route-corner {
        border-color: rgba(180,160,130,0.70);
        background: rgba(253,248,238,0.78);
        color: #111827;
        box-shadow: inset 0 0 0 1px rgba(245,213,150,0.10), 0 10px 26px rgba(148,163,184,0.18);
      }
      [data-theme="light"] .app-root .route-corner-k { color: #6b7280; opacity: 1; }
      [data-theme="light"] .app-root .route-corner-code { color: #111827; }
      [data-theme="light"] .app-root .route-corner-ico { color: #111827; opacity: 0.75; }

      [data-theme="dark"] .app-root .top-bar-separator {
        opacity: 0.78;
        transform-origin: center;
        will-change: opacity, filter, transform;
        filter: drop-shadow(0 0 8px rgba(88,199,255,0.22));
      }

      @keyframes separatorBreathDark {
        0%, 100% {
          opacity: 0.55;
          transform: scaleX(1);
          filter:
            drop-shadow(0 0 8px rgba(88,199,255,0.18))
            drop-shadow(0 0 0 rgba(88,199,255,0));
        }
        50% {
          opacity: 1;
          transform: scaleX(1.65);
          filter:
            drop-shadow(0 0 18px rgba(88,199,255,0.62))
            drop-shadow(0 0 52px rgba(88,199,255,0.22));
        }
      }

      [data-theme="dark"] .app-root .top-bar-actions:hover .top-bar-separator {
        animation: separatorBreathDark 1.8s ease-in-out infinite;
      }

      [data-theme="dark"] .app-root .portal-card:hover .portal-hover-scan {
        opacity: 1;
        background: linear-gradient(
          90deg,
          rgba(0,0,0,0),
          rgba(88,199,255,0.22),
          rgba(255,255,255,0.10),
          rgba(88,199,255,0.14),
          rgba(0,0,0,0)
        );
        animation: portalSweep 520ms linear 1;
        mix-blend-mode: var(--statusBlend, screen);
      }

      [data-theme="dark"] .app-root .portal-card:hover .portal-tickflash {
        animation: tickFlash 520ms ease-out 1;
        animation-delay: 340ms;
      }

      [data-theme="dark"] .app-root .portal-tickflash::before {
        background: rgba(88,199,255,0.85);
        box-shadow: 0 0 14px rgba(88,199,255,0.38), 0 0 0 1px rgba(88,199,255,0.22);
      }

      [data-theme="dark"] .app-root .portal-tickflash::after {
        background: rgba(255,255,255,0.22);
      }

      [data-theme="dark"] .app-root .project-card {
        transition: transform 180ms ease, filter 180ms ease;
      }

      [data-theme="dark"] .app-root .project-card:hover {
        transform: translateY(-2px);
        filter:
          drop-shadow(0 14px 30px rgba(0,0,0,0.55))
          drop-shadow(0 0 18px rgba(88,199,255,0.10));
      }

      @keyframes terminalFlicker {
        0%, 100% { opacity: 1; }
        3% { opacity: 0.82; }
        6% { opacity: 1; }
        8% { opacity: 0.74; }
        10% { opacity: 1; }
        70% { opacity: 0.92; }
        72% { opacity: 1; }
      }

      [data-theme="dark"] .app-root .top-bar:hover .header-tagline {
        animation: terminalFlicker 2.8s linear infinite;
      }

      /* Image archive panel (day/night) */
      .archive-kicker {
        font-size: 10px;
        letter-spacing: 0.28em;
        color: rgba(255,255,255,0.55);
      }

      .archive-panel { position: relative; }
      .archive-panel::after {
        content: "";
        position: absolute;
        inset: 0;
        pointer-events: none;
        border-radius: inherit;
        opacity: 0.55;
        background:
          radial-gradient(circle at 22% 18%, rgba(88,199,255,0.10), rgba(0,0,0,0) 58%),
          radial-gradient(circle at 82% 24%, rgba(255,255,255,0.06), rgba(0,0,0,0) 62%),
          linear-gradient(135deg, rgba(255,255,255,0.06), rgba(0,0,0,0) 58%);
        mix-blend-mode: screen;
      }

      .archive-stage {
        position: relative;
        height: 220px;
        overflow: hidden;
      }
      @media (min-width: 768px) {
        .archive-stage { height: 240px; }
      }

      .archive-img {
        width: 100%;
        height: 100%;
        object-fit: contain;
        display: block;
        transform: scale(1.01);
      }

      .archive-stage::after {
        content: "";
        position: absolute;
        inset: 0;
        pointer-events: none;
        background:
          radial-gradient(circle at 30% 18%, rgba(88,199,255,0.14), rgba(0,0,0,0) 56%),
          radial-gradient(circle at 70% 78%, rgba(255,170,88,0.10), rgba(0,0,0,0) 60%),
          linear-gradient(180deg, rgba(0,0,0,0.10), rgba(0,0,0,0.55));
        opacity: 0.75;
      }

      .archive-stage-grid {
        position: absolute;
        inset: 0;
        pointer-events: none;
        opacity: 0.26;
        background-image:
          linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px);
        background-size: 22px 22px;
        mask-image: radial-gradient(circle at 50% 40%, rgba(0,0,0,1) 0 52%, rgba(0,0,0,0) 88%);
        -webkit-mask-image: radial-gradient(circle at 50% 40%, rgba(0,0,0,1) 0 52%, rgba(0,0,0,0) 88%);
      }

      .archive-stage-hud {
        position: absolute;
        left: 8px;
        top: 8px;
        display: inline-flex;
        align-items: center;
        gap: 5px;
        padding: 3px 5px;
        border: 1px solid rgba(255,255,255,0.14);
        background: rgba(0,0,0,0.14);
        color: rgba(255,255,255,0.70);
        border-radius: 7px;
        backdrop-filter: blur(3px);
        -webkit-backdrop-filter: blur(3px);
        clip-path: polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 0 100%);
        z-index: 2;
        max-width: calc(100% - 72px);
      }
      .archive-stage-hud-k { font-size: 7px; letter-spacing: 0.2em; opacity: 0.9; }
      .archive-stage-hud-dot {
        width: 2px;
        height: 2px;
        border-radius: 999px;
        background: rgba(88,199,255,0.90);
        box-shadow: 0 0 8px rgba(88,199,255,0.16);
      }

      .archive-stage-stamp {
        position: absolute;
        right: 8px;
        bottom: 8px;
        padding: 3px 7px;
        border: 1px solid rgba(255,255,255,0.12);
        background: rgba(255,255,255,0.03);
        color: rgba(255,255,255,0.62);
        border-radius: 999px;
        font-size: 7px;
        letter-spacing: 0.22em;
        z-index: 2;
      }

      .archive-footer-chip {
        display: inline-flex;
        align-items: center;
        padding: 2px 6px;
        border-radius: 8px;
        border: 1px solid rgba(255,255,255,0.16);
        background: rgba(255,255,255,0.05);
        color: rgba(255,255,255,0.62);
        font-size: 9px;
        letter-spacing: 0.18em;
        text-transform: uppercase;
      }

      [data-theme="light"] .app-root .archive-kicker { color: #111827; opacity: 0.72; }
      [data-theme="light"] .app-root .archive-panel::after {
        background:
          radial-gradient(circle at 22% 18%, rgba(245,213,150,0.18), rgba(0,0,0,0) 58%),
          radial-gradient(circle at 82% 24%, rgba(91,167,186,0.10), rgba(0,0,0,0) 62%),
          linear-gradient(135deg, rgba(180,160,130,0.12), rgba(0,0,0,0) 58%);
        mix-blend-mode: multiply;
        opacity: 0.65;
      }
      [data-theme="light"] .app-root .archive-stage {
        background: rgba(253,248,238,0.78);
        border-color: rgba(180,160,130,0.62);
      }
      [data-theme="light"] .app-root .archive-stage::after {
        background:
          radial-gradient(circle at 30% 18%, rgba(245,213,150,0.22), rgba(0,0,0,0) 56%),
          radial-gradient(circle at 70% 78%, rgba(91,167,186,0.12), rgba(0,0,0,0) 60%),
          linear-gradient(180deg, rgba(253,248,238,0.10), rgba(180,160,130,0.10));
        opacity: 0.72;
      }
      [data-theme="light"] .app-root .archive-stage-grid {
        opacity: 0.34;
        background-image:
          linear-gradient(rgba(180,160,130,0.22) 1px, transparent 1px),
          linear-gradient(90deg, rgba(180,160,130,0.18) 1px, transparent 1px);
        background-size: 22px 22px;
      }
      [data-theme="light"] .app-root .archive-stage-hud {
        border-color: rgba(180,160,130,0.72);
        background: rgba(253,248,238,0.82);
        color: #111827;
        box-shadow: inset 0 0 0 1px rgba(245,213,150,0.10), 0 10px 26px rgba(148,163,184,0.16);
      }
      [data-theme="light"] .app-root .archive-stage-hud-dot {
        background: rgba(245,213,150,0.95);
        box-shadow: 0 0 12px rgba(245,213,150,0.22);
      }
      [data-theme="light"] .app-root .archive-stage-stamp {
        border-color: rgba(245,213,150,0.78);
        background: rgba(253,248,238,0.88);
        color: #111827;
      }
      [data-theme="light"] .app-root .archive-footer-chip {
        border-color: rgba(180,160,130,0.62);
        background: rgba(253,248,238,0.72);
        color: #374151;
      }

      @keyframes statusSweep {
        0% { transform: translateX(-160%) skewX(-18deg); opacity: 0; }
        12% { opacity: 0.95; }
        55% { opacity: 0.65; }
        100% { transform: translateX(260%) skewX(-18deg); opacity: 0; }
      }

      @keyframes statusSheen {
        0% { transform: translateX(-170%) skewX(-18deg); opacity: 0; }
        18% { opacity: 0.55; }
        60% { opacity: 0.38; }
        100% { transform: translateX(250%) skewX(-18deg); opacity: 0; }
      }

      .status-tile {
        position: relative;
        overflow: hidden;
        transform-style: preserve-3d;
        will-change: transform;
        transition: transform 160ms ease, filter 220ms ease;
        --rx: 0deg;
        --ry: 0deg;
        --px: 50%;
        --py: 50%;
        --sx: 0;
        --sy: 0;
        --press: 0;
        --down: 0;
        --scanA: rgba(88,199,255,0.26);
        --scanB: rgba(255,255,255,0.10);
        --sheen: rgba(255,255,255,0.14);
        --pressHi: rgba(255,255,255,0.16);
        --pressLo: rgba(88,199,255,0.10);
        --statusBlend: screen;
      }

      .status-content {
        position: relative;
        z-index: 2;
      }

      .status-press {
        position: absolute;
        inset: -1px;
        pointer-events: none;
        z-index: 0;
        opacity: 0;
        background:
          radial-gradient(circle at var(--px) var(--py), var(--pressHi), rgba(255,255,255,0) 58%),
          radial-gradient(circle at var(--px) var(--py), var(--pressLo), rgba(0,0,0,0) 62%);
        mix-blend-mode: var(--statusBlend, screen);
        transition: opacity 160ms ease;
      }

      .status-tile::before,
      .status-tile::after {
        z-index: 1;
      }

      .status-tile::before {
        content: "";
        position: absolute;
        top: -35%;
        bottom: -35%;
        left: -60%;
        width: 38%;
        pointer-events: none;
        opacity: 0;
        background: linear-gradient(90deg, rgba(0,0,0,0), var(--scanA), var(--scanB), rgba(0,0,0,0));
        mix-blend-mode: screen;
      }

      .status-tile::after {
        content: "";
        position: absolute;
        top: -40%;
        bottom: -40%;
        left: -72%;
        width: 56%;
        pointer-events: none;
        opacity: 0;
        background: linear-gradient(90deg, rgba(0,0,0,0), var(--sheen), rgba(255,255,255,0.06), rgba(0,0,0,0));
        mix-blend-mode: screen;
        filter: blur(0.2px);
      }

      .status-tile:hover {
        transform:
          perspective(920px)
          rotateX(var(--rx))
          rotateY(var(--ry))
          translateY(calc(var(--press) * -1px))
          translateZ(calc(var(--down) * -3px));
        filter:
          drop-shadow(0 14px 30px rgba(0,0,0,0.55))
          drop-shadow(0 0 18px rgba(88,199,255,0.10));
      }

      .status-tile:hover .status-press {
        opacity: 1;
      }

      .status-tile {
        box-shadow:
          inset calc(var(--sx) * 1px) calc(var(--sy) * 1px) 18px rgba(0,0,0,0.28),
          inset 0 0 0 1px rgba(255,255,255,0.02);
      }

      .status-tile:hover {
        box-shadow:
          inset calc(var(--sx) * 1px) calc(var(--sy) * 1px) 18px rgba(0,0,0,0.34),
          inset 0 0 0 1px rgba(255,255,255,0.03);
      }

      .status-tile:hover::before {
        animation: statusSweep 640ms linear 1;
        opacity: 1;
      }

      .status-tile:hover::after {
        animation: statusSheen 700ms linear 1;
        animation-delay: 70ms;
        opacity: 1;
      }

      [data-theme="light"] .app-root .status-tile {
        background-color: rgba(253,248,238,0.88) !important;
        border-color: rgba(245,213,150,0.78) !important;
        --scanA: rgba(245,213,150,0.42);
        --scanB: rgba(255,248,232,0.28);
        --sheen: rgba(255,255,255,0.46);
        --pressHi: rgba(255,255,255,0.28);
        --pressLo: rgba(245,213,150,0.26);
        --statusBlend: normal;
        box-shadow:
          inset calc(var(--sx) * 1px) calc(var(--sy) * 1px) 16px rgba(247,231,206,0.52),
          inset 0 0 0 1px rgba(245,213,150,0.16);
      }

      [data-theme="light"] .app-root .status-tile::before,
      [data-theme="light"] .app-root .status-tile::after {
        mix-blend-mode: normal;
      }

      [data-theme="light"] .app-root .status-tile:hover {
        filter:
          drop-shadow(0 18px 36px rgba(245,213,150,0.18))
          drop-shadow(0 0 22px rgba(245,213,150,0.34));
        box-shadow:
          inset calc(var(--sx) * 1px) calc(var(--sy) * 1px) 18px rgba(247,231,206,0.70),
          inset 0 0 0 1px rgba(245,213,150,0.22);
      }

      @media (prefers-reduced-motion: reduce) {
        .scanline,
        .soft-pulse,
        .portal-hover-scan,
        .portal-tickflash,
        .status-tile::before,
        .status-tile::after {
          animation: none !important;
        }
        .status-tile {
          transition: none !important;
          transform: none !important;
          filter: none !important;
        }
        [data-theme="light"] .app-root .top-bar-separator,
        [data-theme="dark"] .app-root .top-bar-separator {
          animation: none !important;
          transform: none !important;
          filter: none !important;
        }
      }
    `}</style>
  );
}

