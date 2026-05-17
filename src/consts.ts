import type { Site, Metadata, Socials } from "@types";

export const SITE: Site = {
  NAME: "Manoj Kumar",
  EMAIL: "", // optional: add when you want mailto on homepage
  NUM_POSTS_ON_HOMEPAGE: 2,
  NUM_WORKS_ON_HOMEPAGE: 2,
  NUM_PROJECTS_ON_HOMEPAGE: 3,
};

export const HOME: Metadata = {
  TITLE: "Home",
  DESCRIPTION:
    "Program Manager and Product Operations lead — AI-powered delivery, unit economics, and hands-on automation.",
};

export const BLOG: Metadata = {
  TITLE: "Essays",
  DESCRIPTION: "Notes on GenAI ops, team building, and product delivery.",
};

export const WORK: Metadata = {
  TITLE: "Work",
  DESCRIPTION: "Where I have worked and what I have done.",
};

export const PROJECTS: Metadata = {
  TITLE: "Projects",
  DESCRIPTION: "Portfolio builds — agentic LLM tools, teardowns, and ops dashboards.",
};

export const SOCIALS: Socials = [
  {
    NAME: "linkedin",
    HREF: "https://www.linkedin.com/in/dvmk97",
  },
  {
    NAME: "github",
    HREF: "https://github.com/Kill3r-28",
  },
  {
    NAME: "resume",
    HREF: "/resume.pdf",
  },
];
