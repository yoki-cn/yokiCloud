import type { ReactNode } from "react";

import type { Post } from "../../data/blog";
import type { CollectedImage, CollectedLine } from "../../data/collected";
import type { FriendLink } from "../../data/friends";
import type { Gateway } from "../../data/gateways";
import type { Project, ProjectType } from "../../data/projects";
import type { ResourceItem } from "../../data/resources";
import type { PointerTiltHandlers } from "../../hooks/useRafPointerTilt";

import AboutSection from "./AboutSection";
import BlogSection from "./BlogSection";
import FriendsSection from "./FriendsSection";
import HeroGuide from "./HeroGuide";
import PortalSection from "./PortalSection";
import ProjectsSection from "./ProjectsSection";
import ResourcesSection from "./ResourcesSection";

export type SectionRegistryContext = {
  isLight: boolean;
  scrollToId: (id: string) => void;
  gateways: Gateway[];
  collectedLines: CollectedLine[];
  collectedImages: CollectedImage[];
  copiedLineId: string | null;
  onCopyLine: (text: string, id: string) => void;
  onOpenImage: (image: CollectedImage) => void;
  onDownloadImage: (url: string, id: string) => void;
  projectCount: number;
  postCount: number;
  quickLinks: {
    github: string;
    bilibili: string;
    linkedin: string;
    email: string;
  };
  statusHandlers: PointerTiltHandlers;
  projectTypes: ProjectType[];
  filteredProjects: Project[];
  activeProjectType: string;
  setActiveProjectType: (type: string) => void;
  onSelectProject: (project: Project) => void;
  archiveUrl: string;
  filteredResources: ResourceItem[];
  depotTypeOptions: string[];
  depotTagOptions: string[];
  activeDepotType: string;
  activeDepotTag: string;
  setActiveDepotType: (type: string) => void;
  setActiveDepotTag: (tag: string) => void;
  depotRouteHref: string;
  depotRouteLabel: string;
  filteredPosts: Post[];
  blogTagOptions: string[];
  activeTag: string;
  setActiveTag: (tag: string) => void;
  years: string[];
  activeYear: string;
  setActiveYear: (year: string) => void;
  logUrl: string;
  friendLinks: FriendLink[];
  email: string;
  displayName: string;
  githubUrl: string;
  linkedinUrl: string;
};

export type SectionConfig = {
  id: string;
  label: string;
  inNav?: boolean;
  withDivider?: boolean;
  render: (ctx: SectionRegistryContext) => ReactNode;
};

export const SECTION_REGISTRY: SectionConfig[] = [
  {
    id: "hero",
    label: "HERO",
    inNav: false,
    withDivider: true,
    render: (ctx) => (
      <HeroGuide
        gateways={ctx.gateways}
        collectedLines={ctx.collectedLines}
        collectedImages={ctx.collectedImages}
        copiedLineId={ctx.copiedLineId}
        onCopyLine={ctx.onCopyLine}
        onOpenImage={ctx.onOpenImage}
        onDownloadImage={ctx.onDownloadImage}
        scrollToId={ctx.scrollToId}
        projectCount={ctx.projectCount}
        postCount={ctx.postCount}
        quickLinks={ctx.quickLinks}
        statusHandlers={ctx.statusHandlers}
      />
    ),
  },
  {
    id: "portal",
    label: "PORTAL",
    inNav: true,
    withDivider: true,
    render: (ctx) => (
      <PortalSection
        isLight={ctx.isLight}
        scrollToId={ctx.scrollToId}
        projectCount={ctx.projectCount}
        postCount={ctx.postCount}
      />
    ),
  },
  {
    id: "projects",
    label: "PROJECTS",
    inNav: true,
    withDivider: true,
    render: (ctx) => (
      <ProjectsSection
        isLight={ctx.isLight}
        projectTypes={ctx.projectTypes}
        filteredProjects={ctx.filteredProjects}
        activeType={ctx.activeProjectType}
        onSelectType={ctx.setActiveProjectType}
        onSelectProject={ctx.onSelectProject}
        archiveUrl={ctx.archiveUrl}
      />
    ),
  },
  {
    id: "resources",
    label: "RESOURCES",
    inNav: true,
    withDivider: true,
    render: (ctx) => (
      <ResourcesSection
        isLight={ctx.isLight}
        filteredResources={ctx.filteredResources}
        depotTypeOptions={ctx.depotTypeOptions}
        depotTagOptions={ctx.depotTagOptions}
        activeDepotType={ctx.activeDepotType}
        activeDepotTag={ctx.activeDepotTag}
        setActiveDepotType={ctx.setActiveDepotType}
        setActiveDepotTag={ctx.setActiveDepotTag}
        depotRouteHref={ctx.depotRouteHref}
        depotRouteLabel={ctx.depotRouteLabel}
      />
    ),
  },
  {
    id: "blog",
    label: "BLOG",
    inNav: true,
    withDivider: true,
    render: (ctx) => (
      <BlogSection
        isLight={ctx.isLight}
        filteredPosts={ctx.filteredPosts}
        blogTagOptions={ctx.blogTagOptions}
        activeTag={ctx.activeTag}
        setActiveTag={ctx.setActiveTag}
        years={ctx.years}
        activeYear={ctx.activeYear}
        setActiveYear={ctx.setActiveYear}
        logUrl={ctx.logUrl}
      />
    ),
  },
  {
    id: "friends",
    label: "FRIENDS",
    inNav: true,
    withDivider: true,
    render: (ctx) => (
      <FriendsSection isLight={ctx.isLight} friendLinks={ctx.friendLinks} email={ctx.email} />
    ),
  },
  {
    id: "about",
    label: "ABOUT",
    inNav: true,
    withDivider: false,
    render: (ctx) => (
      <AboutSection
        isLight={ctx.isLight}
        displayName={ctx.displayName}
        email={ctx.email}
        githubUrl={ctx.githubUrl}
        linkedinUrl={ctx.linkedinUrl}
      />
    ),
  },
];

export const NAV_ITEMS = SECTION_REGISTRY.filter((item) => item.inNav).map((item) => ({
  id: item.id,
  label: item.label,
}));

