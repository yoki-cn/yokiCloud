import { ArrowUpRight, CheckCircle2, Mail, Shield } from "lucide-react";

import type { FriendLink } from "../../data/friends";
import { LinkButton } from "../ui/Buttons";
import Panel from "../ui/Panel";
import { Pill } from "../ui/Pill";
import SectionTitle from "../ui/SectionTitle";

export type FriendsSectionProps = {
  isLight: boolean;
  friendLinks: FriendLink[];
  email: string;
};

export default function FriendsSection({ isLight, friendLinks, email }: FriendsSectionProps) {
  return (
    <section id="friends" className="py-10 md:py-14">
      <div className="flex flex-col gap-6">
        <SectionTitle
          isLight={isLight}
          kicker="FRIEND NODES / 友链节点"
          title="友链"
          desc="友链是“已验证路由”。If you want to exchange links, send a signal."
        />

        <Panel
          label="FRIENDS / FRIEND NODES"
          sublabel="CLEARANCE VERIFIED"
          icon={Shield}
          right={
            <Pill>
              <CheckCircle2 className="w-3 h-3" />
              VERIFIED
            </Pill>
          }
        >
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {friendLinks.map((f) => (
              <a
                key={f.name}
                href={f.href}
                target="_blank"
                rel="noreferrer"
                className="group rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 px-3 py-3 transition"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="text-[10px] tracking-[0.24em] text-white/45">FRIEND LINK</div>
                  <Pill tint="warm">OK</Pill>
                </div>
                <div className="mt-2 heading-main text-[13px] font-semibold text-white/90">{f.name}</div>
                <div className="mt-1 text-[11px] text-white/55 text-muted-block">{f.note}</div>
                <div className="mt-3 inline-flex items-center gap-1.5 text-[9px] tracking-[0.24em] text-white/45 group-hover:text-white/80">
                  ROUTE
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </div>
              </a>
            ))}
          </div>

          <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="text-[11px] text-white/55 text-muted-block">
              Want to exchange links? Send a signal with your site + short intro.
            </div>
            <LinkButton href={`mailto:${email}`} icon={Mail}>
              REQUEST LINK
            </LinkButton>
          </div>
        </Panel>
      </div>
    </section>
  );
}
