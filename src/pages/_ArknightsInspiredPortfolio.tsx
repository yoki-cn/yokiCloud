import { useEffect, useMemo, useState } from "react";
import { notify } from "../utils/notifications";

import { TerminalPageShell } from "../components/layout";
import ImagePreviewModal from "../components/modals/ImagePreviewModal";
import ProjectDossierModal from "../components/modals/ProjectDossierModal";
import { NAV_ITEMS, SECTION_REGISTRY, type SectionRegistryContext } from "../components/sections";
import DividerLine from "../components/ui/DividerLine";
import { siteConfig } from "../config/siteConfig";
import { BLOG_TAGS, POSTS } from "../data/blog";
import { COLLECTED_IMAGES, COLLECTED_LINES, type CollectedImage } from "../data/collected";
import { FRIEND_LINKS } from "../data/friends";
import { ARCHIVE_SITE_URL, DEPOT_SITE_URL, LOG_SITE_URL, PRIMARY_GATEWAYS } from "../data/gateways";
import { PROJECTS, PROJECT_TYPES, type Project } from "../data/projects";
import { RESOURCES } from "../data/resources";
import { useBodyScrollLock } from "../hooks/useBodyScrollLock";
import { useLocalStorageState } from "../hooks/useLocalStorageState";
import { useRafPointerTilt } from "../hooks/useRafPointerTilt";
import { useTheme } from "../hooks/useTheme";
import { runSelfTestsInDev } from "../utils/selfTests";
import type { AlgorithmBoardSummary } from "./_AlgorithmArchive";

runSelfTestsInDev();

export default function ArknightsInspiredPortfolio({ algorithmBoards, algorithmDirectories }: {
  algorithmBoards: AlgorithmBoardSummary[];
  algorithmDirectories: string[];
}) {
  const [activeType, setActiveType] = useState("all");
  const [activeTag, setActiveTag] = useState("ALL");
  const [activeYear, setActiveYear] = useState("ALL");
  const [activeDepotType, setActiveDepotType] = useState("ALL");
  const [activeDepotTag, setActiveDepotTag] = useState("ALL");
  const [bookmarksOpen, setBookmarksOpen] = useLocalStorageState<boolean>(
    "ark.portal.bookmarks.sidebarOpen.v1",
    () => {
      if (typeof window === "undefined") return true;
      return window.matchMedia?.("(min-width: 768px)")?.matches ?? true;
    }
  );
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [activeImage, setActiveImage] = useState<CollectedImage | null>(null);
  const [copiedLineId, setCopiedLineId] = useState<string | null>(null);
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

  useEffect(() => {
    const scrollToHash = () => {
      const id = window.location.hash.slice(1);
      if (id) document.getElementById(id)?.scrollIntoView({ block: "start" });
    };
    scrollToHash();
    window.addEventListener("hashchange", scrollToHash);
    return () => window.removeEventListener("hashchange", scrollToHash);
  }, []);

  function scrollToId(id: string) {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  async function copyText(text: string, id: string) {
    let copied = false;
    if (navigator.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(text);
        copied = true;
      } catch {
        copied = false;
      }
    }

    if (copied) {
      setCopiedLineId(id);
      notify("PRTS 信息已写入剪贴板，可供后续行动调用。", "success");
      return;
    }

    notify("PRTS 写入受阻：浏览器未授权剪贴板，请选中文字手动复制。", "error");
  }

  const sectionContext: SectionRegistryContext = {
    algorithmBoards,
    algorithmDirectories,
    isLight,
    scrollToId,
    gateways: PRIMARY_GATEWAYS,
    collectedLines: COLLECTED_LINES,
    collectedImages: COLLECTED_IMAGES,
    copiedLineId,
    onCopyLine: copyText,
    onOpenImage: setActiveImage,
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
    <TerminalPageShell
      brandName={siteConfig.brandName}
      tagline={siteConfig.tagline}
      navItems={NAV_ITEMS}
      isLight={isLight}
      onToggleTheme={toggleTheme}
      bookmarksOpen={bookmarksOpen}
      onBookmarksOpenChange={setBookmarksOpen}
      onScrollTo={scrollToId}
      githubUrl={siteConfig.links.github}
      linkedinUrl={siteConfig.links.linkedin}
      email={siteConfig.email}
      overlay={
        <>
          <ProjectDossierModal project={selectedProject} onClose={() => setSelectedProject(null)} />
          <ImagePreviewModal image={activeImage} onClose={() => setActiveImage(null)} />
        </>
      }
    >
      {SECTION_REGISTRY.map((section) => (
        <div key={section.id}>
          {section.render(sectionContext)}
          {section.withDivider ? <DividerLine /> : null}
        </div>
      ))}
    </TerminalPageShell>
  );
}
