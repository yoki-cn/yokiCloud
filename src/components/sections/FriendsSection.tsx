import { sitePath } from "../../utils/sitePath";
﻿import { ArrowUpRight, CheckCircle2, Mail, Shield } from "lucide-react";

import type { FriendLink } from "../../data/friends";
import { handleExternalLinkClick } from "../../utils/linkActions";
import { LinkButton } from "../ui/Buttons";
import Panel from "../ui/Panel";
import { Pill } from "../ui/Pill";
import SectionTitle from "../ui/SectionTitle";
import { SystemState } from "../ui";

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
          {friendLinks.length ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {friendLinks.map((f) => (
                <a
                  key={f.name}
                  href={sitePath(f.href)}
                  target="_blank"
                  rel="noreferrer"
                  onClick={(e) => handleExternalLinkClick(e, f.href)}
                  className="group rounded-[var(--yc-radius-md)] border border-[var(--yc-line)] bg-[var(--yc-surface-inner)] px-3 py-3 transition hover:border-[var(--yc-line-strong)] hover:bg-[var(--yc-surface-strong)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--yc-focus)]"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="yc-hud-text text-[10px] text-[var(--yc-dim)]">FRIEND LINK</div>
                    <Pill tint="warm">OK</Pill>
                  </div>
                  <div className="heading-main mt-2 text-[13px] font-semibold text-[var(--yc-text)]">{f.name}</div>
                  <div className="text-muted-block mt-1 text-[11px] text-[var(--yc-muted)]">{f.note}</div>
                  <div className="yc-hud-text mt-3 inline-flex items-center gap-1.5 text-[9px] text-[var(--yc-dim)] group-hover:text-[var(--yc-text)]">
                    ROUTE
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </div>
                </a>
              ))}
            </div>
          ) : (
            <SystemState title="暂无友链节点" desc="已验证路由会显示在这里。" />
          )}

          <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="text-muted-block text-[11px] text-[var(--yc-muted)]">
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
