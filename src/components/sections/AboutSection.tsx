import { CheckCircle2, Cpu, Github, Hammer, Linkedin, Mail, Shield } from "lucide-react";

import { LinkButton } from "../ui/Buttons";
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
          desc="保持克制的个人介绍，把“我是谁”作为档案补全而非主叙事。"
        />

        <div className="grid md:grid-cols-[1fr_0.95fr] gap-4">
          <Panel label="PROFILE / 档案" sublabel="PUBLIC SUMMARY" icon={Shield}>
            <div className="flex flex-col gap-4">
              <div>
                <div className="text-[10px] tracking-[0.28em] text-white/45">OPERATOR FILE / PUBLIC</div>
                <div className="heading-main mt-2 text-lg font-semibold text-white/92">{displayName}</div>
                <div className="text-muted-block mt-1 text-sm text-white/55">
                  Product-oriented frontend developer / designer who enjoys calm, high-information interfaces.
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                <div className="inner-elevated rounded-lg border border-white/10 bg-white/5 p-3">
                  <div className="text-[9px] tracking-[0.22em] text-white/45">FOCUS / 方向</div>
                  <div className="text-muted-block mt-1 text-[11px] text-white/65 leading-relaxed">
                    Web apps, design systems, performance, interaction architecture.
                  </div>
                </div>
                <div className="inner-elevated rounded-lg border border-white/10 bg-white/5 p-3">
                  <div className="text-[9px] tracking-[0.22em] text-white/45">VALUES / 标准</div>
                  <div className="text-muted-block mt-1 text-[11px] text-white/65 leading-relaxed">
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
                <div key={row.label} className="inner-elevated rounded-lg border border-white/10 bg-white/5 p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] tracking-[0.24em] text-white/45">{row.label.toUpperCase()}</span>
                    <span className="text-[9px] tracking-[0.18em] text-white/30">OK</span>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {row.items.map((it) => (
                      <span
                        key={it}
                        className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[9px] tracking-wide text-white/60"
                      >
                        {it}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Panel>
        </div>

        <Panel label="CONTACT / 通讯" sublabel="OPEN CHANNEL" icon={Mail}>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="text-sm text-muted-block text-white/60">如果你想看完整简历或详细 case，欢迎直接联系。</div>
            <div className="flex flex-wrap gap-2">
              <LinkButton href={`mailto:${email}`} icon={Mail}>
                EMAIL
              </LinkButton>
              <LinkButton href={githubUrl} icon={Github}>
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
