import { useEffect, useMemo, useState } from "react";

import ProjectDossierModal from "../components/modals/ProjectDossierModal";
import ImagePreviewModal from "../components/modals/ImagePreviewModal";
import Footer from "../components/sections/Footer";
import HeaderTopBar from "../components/sections/HeaderTopBar";
import { NAV_ITEMS, SECTION_REGISTRY, type SectionRegistryContext } from "../components/sections";
import DividerLine from "../components/ui/DividerLine";
import { BLOG_TAGS, POSTS } from "../data/blog";
import { COLLECTED_IMAGES, COLLECTED_LINES, type CollectedImage } from "../data/collected";
import { FRIEND_LINKS } from "../data/friends";
import { ARCHIVE_SITE_URL, DEPOT_SITE_URL, LOG_SITE_URL, PRIMARY_GATEWAYS } from "../data/gateways";
import { PROJECTS, PROJECT_TYPES, type Project } from "../data/projects";
import { RESOURCES } from "../data/resources";
import { siteConfig } from "../config/siteConfig";
import { useBodyScrollLock } from "../hooks/useBodyScrollLock";
import { useRafPointerTilt } from "../hooks/useRafPointerTilt";
import { useTheme } from "../hooks/useTheme";
import LocalStyles from "../styles/localStyles";
import { runSelfTestsInDev } from "../utils/selfTests";

runSelfTestsInDev();

export default function ArknightsInspiredPortfolio() {
  const [activeType, setActiveType] = useState("all");
  const [activeTag, setActiveTag] = useState("ALL");
  const [activeYear, setActiveYear] = useState("ALL");
  const [activeDepotType, setActiveDepotType] = useState("ALL");
  const [activeDepotTag, setActiveDepotTag] = useState("ALL");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [activeImage, setActiveImage] = useState<CollectedImage | null>(null);
  const [copiedLineId, setCopiedLineId] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const { isLight, toggleTheme } = useTheme();
  const statusHandlers = useRafPointerTilt();

  const filteredProjects = useMemo(() => {
    if (activeType === "all") return PROJECTS;
    return PROJECTS.filter((p) => p.type === activeType);
  }, [activeType]);

  const years = useMemo(() => {
    const ys = Array.from(new Set(POSTS.map((p) => String(p.date).slice(0, 4))));
    ys.sort((a, b) => (a === b ? 0 : a > b ? -1 : 1));
    return ys;
  }, []);

  const filteredPosts = useMemo(() => {
    let list = POSTS;
    if (activeTag !== "ALL") list = list.filter((p) => p.tag === activeTag);
    if (activeYear !== "ALL") list = list.filter((p) => String(p.date).startsWith(activeYear));
    return list;
  }, [activeTag, activeYear]);

  const blogTagOptions = useMemo(() => ["ALL", ...BLOG_TAGS], []);

  const depotTypeOptions = useMemo(() => {
    const types = Array.from(new Set(RESOURCES.map((r) => r.type)));
    types.sort((a, b) => (a === b ? 0 : a > b ? 1 : -1));
    return ["ALL", ...types];
  }, []);

  const depotTagOptions = useMemo(() => {
    const tags = Array.from(new Set(RESOURCES.flatMap((r) => (Array.isArray(r.tags) ? r.tags : []))));
    tags.sort((a, b) => (a === b ? 0 : a > b ? 1 : -1));
    return ["ALL", ...tags];
  }, []);

  const filteredResources = useMemo(() => {
    let list = RESOURCES;
    if (activeDepotType !== "ALL") list = list.filter((r) => r.type === activeDepotType);
    if (activeDepotTag !== "ALL") list = list.filter((r) => (r.tags || []).includes(activeDepotTag));
    return list;
  }, [activeDepotType, activeDepotTag]);

  const depotRouteHref = useMemo(() => {
    if (!DEPOT_SITE_URL) return "";
    if (DEPOT_SITE_URL === "#") return "#";
    const params = new URLSearchParams();
    if (activeDepotType !== "ALL") params.set("type", activeDepotType);
    if (activeDepotTag !== "ALL") params.set("tag", activeDepotTag);
    const q = params.toString();
    if (!q) return DEPOT_SITE_URL;
    return `${DEPOT_SITE_URL}${DEPOT_SITE_URL.includes("?") ? "&" : "?"}${q}`;
  }, [activeDepotType, activeDepotTag]);

  const depotRouteLabel = useMemo(() => {
    const parts = [
      activeDepotType !== "ALL" ? activeDepotType : null,
      activeDepotTag !== "ALL" ? activeDepotTag : null,
    ].filter(Boolean) as string[];
    return `OPEN DEPOT · ${parts.length ? parts.join(" / ") : "ALL"}`;
  }, [activeDepotType, activeDepotTag]);

  useEffect(() => {
    if (!copiedLineId) return undefined;
    const t = window.setTimeout(() => setCopiedLineId(null), 1100);
    return () => window.clearTimeout(t);
  }, [copiedLineId]);

  useBodyScrollLock(Boolean(selectedProject || activeImage));

  function scrollToId(id: string) {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    setMenuOpen(false);
  }

  async function copyText(text: string, id: string) {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        const ta = document.createElement("textarea");
        ta.value = text;
        ta.style.position = "fixed";
        ta.style.left = "-9999px";
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        ta.remove();
      }
      setCopiedLineId(id);
    } catch {
      setCopiedLineId(id);
    }
  }

  function guessExt(url: string) {
    const clean = url.split("?")[0];
    const m = clean.match(/\.([a-z0-9]+)(?:@|$)/i);
    return (m?.[1] || "png").toLowerCase();
  }

  async function downloadImage(url: string, fileId: string) {
    const ext = guessExt(url);
    const filename = `${fileId}.${ext}`;
    try {
      const res = await fetch(url);
      const blob = await res.blob();
      const a = document.createElement("a");
      const obj = URL.createObjectURL(blob);
      a.href = obj;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.setTimeout(() => URL.revokeObjectURL(obj), 1200);
    } catch {
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      a.target = "_blank";
      a.rel = "noreferrer";
      document.body.appendChild(a);
      a.click();
      a.remove();
    }
  }

  const sectionContext: SectionRegistryContext = {
    isLight,
    scrollToId,
    gateways: PRIMARY_GATEWAYS,
    collectedLines: COLLECTED_LINES,
    collectedImages: COLLECTED_IMAGES,
    copiedLineId,
    onCopyLine: copyText,
    onOpenImage: setActiveImage,
    onDownloadImage: downloadImage,
    projectCount: PROJECTS.length,
    postCount: POSTS.length,
    quickLinks: {
      github: siteConfig.links.github,
      bilibili: siteConfig.links.bilibili,
      linkedin: siteConfig.links.linkedin,
      email: siteConfig.email,
    },
    statusHandlers,
    projectTypes: PROJECT_TYPES,
    filteredProjects,
    activeProjectType: activeType,
    setActiveProjectType: setActiveType,
    onSelectProject: setSelectedProject,
    archiveUrl: ARCHIVE_SITE_URL,
    filteredResources,
    depotTypeOptions,
    depotTagOptions,
    activeDepotType,
    activeDepotTag,
    setActiveDepotType,
    setActiveDepotTag,
    depotRouteHref,
    depotRouteLabel,
    filteredPosts,
    blogTagOptions,
    activeTag,
    setActiveTag,
    years,
    activeYear,
    setActiveYear,
    logUrl: LOG_SITE_URL,
    friendLinks: FRIEND_LINKS,
    email: siteConfig.email,
    displayName: siteConfig.displayName,
    githubUrl: siteConfig.links.github,
    linkedinUrl: siteConfig.links.linkedin,
  };

  return (
    <div className="app-root min-h-screen bg-[#070a0e] text-white">
      <LocalStyles />

      <div className="bg-grid fixed inset-0 pointer-events-none" />
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(circle_at_18%_22%,rgba(88,199,255,0.10),transparent_40%),radial-gradient(circle_at_82%_28%,rgba(255,170,88,0.08),transparent_40%),radial-gradient(circle_at_50%_85%,rgba(255,255,255,0.06),transparent_45%)]" />
      <div className="fixed inset-0 pointer-events-none opacity-20 grain" />

      <HeaderTopBar
        brandName={siteConfig.brandName}
        tagline={siteConfig.tagline}
        navItems={NAV_ITEMS}
        menuOpen={menuOpen}
        onToggleMenu={() => setMenuOpen((s) => !s)}
        onScrollTo={scrollToId}
        isLight={isLight}
        onToggleTheme={toggleTheme}
        githubUrl={siteConfig.links.github}
        linkedinUrl={siteConfig.links.linkedin}
        email={siteConfig.email}
      />

      <main className="relative max-w-6xl mx-auto px-4 md:px-6">
        {SECTION_REGISTRY.map((section) => (
          <div key={section.id}>
            {section.render(sectionContext)}
            {section.withDivider ? <DividerLine /> : null}
          </div>
        ))}
      </main>

      <Footer brandName={siteConfig.brandName} />

      <ProjectDossierModal project={selectedProject} onClose={() => setSelectedProject(null)} />
      <ImagePreviewModal image={activeImage} onClose={() => setActiveImage(null)} />
    </div>
  );
}

