import { CheckCircle2, Cpu, Hammer, Linkedin, Mail, Shield } from "lucide-react";

import GithubMark from "../icons/GithubMark";
import { LinkButton } from "../ui/Buttons";
import { HudChip } from "../ui/Hud";
import Panel from "../ui/Panel";
import { Pill } from "../ui/Pill";
import SectionTitle from "../ui/SectionTitle";

export type AboutSectionProps = {
  isLight: boolean;
  displayName: string;
  email: string;
  githubUrl: string;
  linkedinUrl: string;
};

export default function AboutSection({ isLight, displayName, email, githubUrl, linkedinUrl }: AboutSectionProps) {
  return (
    <section id="about" className="py-10 md:py-16">
      <div className="flex flex-col gap-6">
        <SectionTitle
          isLight={isLight}
          kicker="IDENTITY NODE / 身份节点"
          title="终端身份"
          desc="关于我、目前关注的方向，以及可以联系到我的入口。"
        />

        <div className="grid md:grid-cols-[1fr_0.95fr] gap-4">
          <Panel label="PROFILE / 档案" sublabel="PUBLIC SUMMARY" icon={Shield}>
            <div className="flex flex-col gap-4">
              <div>
                <div className="yc-hud-text text-[10px] text-[var(--yc-dim)]">OPERATOR FILE / PUBLIC</div>
                <div className="heading-main mt-2 text-lg font-semibold text-[var(--yc-text)]">{displayName}</div>
                <div className="text-muted-block mt-1 text-sm text-[var(--yc-muted)]">
                  Product-oriented frontend developer / designer who enjoys calm, high-information interfaces.
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                <div className="inner-elevated rounded-[var(--yc-radius-md)] border border-[var(--yc-line)] bg-[var(--yc-surface-inner)] p-3">
                  <div className="yc-hud-text text-[9px] text-[var(--yc-dim)]">FOCUS / 方向</div>
                  <div className="text-muted-block mt-1 text-[11px] leading-relaxed text-[var(--yc-muted)]">
                    Web apps, design systems, performance, interaction architecture.
                  </div>
                </div>
                <div className="inner-elevated rounded-[var(--yc-radius-md)] border border-[var(--yc-line)] bg-[var(--yc-surface-inner)] p-3">
                  <div className="yc-hud-text text-[9px] text-[var(--yc-dim)]">VALUES / 标准</div>
                  <div className="text-muted-block mt-1 text-[11px] leading-relaxed text-[var(--yc-muted)]">
                    Clarity, maintainability, measurable impact.
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <Pill>
                  <CheckCircle2 className="w-3 h-3" />
                  SHIPPING
                </Pill>
                <Pill>
                  <Cpu className="w-3 h-3" />
                  SYSTEM THINKING
                </Pill>
                <Pill>
                  <Hammer className="w-3 h-3" />
                  DESIGN-DEV BRIDGE
                </Pill>
              </div>
            </div>
          </Panel>

          <Panel label="SKILL MATRIX / 技能矩阵" sublabel="VERIFIED" icon={Cpu}>
            <div className="grid gap-3">
              {[
                {
                  label: "Frontend",
                  items: ["React", "TypeScript", "Tailwind", "State Patterns"],
                },
                {
                  label: "Mobile",
                  items: ["Flutter", "Mini Program", "Cross-platform UX"],
                },
                {
                  label: "Design",
                  items: ["Figma", "Design Tokens", "Component Specs"],
                },
                {
                  label: "Product",
                  items: ["Metrics", "Experimentation", "Roadmap"],
                },
              ].map((row) => (
                <div
                  key={row.label}
                  className="inner-elevated rounded-[var(--yc-radius-md)] border border-[var(--yc-line)] bg-[var(--yc-surface-inner)] p-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="yc-hud-text text-[9px] text-[var(--yc-dim)]">{row.label.toUpperCase()}</span>
                    <span className="yc-hud-text text-[9px] text-[var(--yc-dim)]">OK</span>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {row.items.map((it) => (
                      <HudChip key={it}>
                        {it}
                      </HudChip>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Panel>
        </div>

        <Panel label="CONTACT / 通讯" sublabel="OPEN CHANNEL" icon={Mail}>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="text-muted-block text-sm text-[var(--yc-muted)]">如果你想看完整简历或详细 case，欢迎直接联系。</div>
            <div className="flex flex-wrap gap-2">
              <LinkButton href={`mailto:${email}`} icon={Mail}>
                EMAIL
              </LinkButton>
              <LinkButton href={githubUrl} icon={GithubMark}>
                GITHUB
              </LinkButton>
              <LinkButton href={linkedinUrl} icon={Linkedin}>
                LINKEDIN
              </LinkButton>
            </div>
          </div>
        </Panel>
      </div>
    </section>
  );
}
