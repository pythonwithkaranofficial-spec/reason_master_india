/**
 * ReasonMaster India — Centralized Visual Asset Manifest
 * 
 * Strict solid-colour visual system:
 * - Royal Navy (#1E40AF) + Saffron Gold (#F59E0B)
 * - Zero gradients, zero 3D renders, academic educational clarity
 */

export interface VisualAsset {
  src: string;
  alt: string;
  width: number;
  height: number;
  decorative?: boolean;
}

export const ASSETS = {
  brand: {
    logoPrimary: {
      src: "/assets/brand/logo-primary.svg",
      alt: "ReasonMaster India Logo",
      width: 280,
      height: 48,
    },
    logoDark: {
      src: "/assets/brand/logo-dark.svg",
      alt: "ReasonMaster India Dark Logo",
      width: 280,
      height: 48,
    },
    logoMark: {
      src: "/assets/brand/logo-mark.svg",
      alt: "ReasonMaster India Symbol",
      width: 48,
      height: 48,
    },
    favicon: {
      src: "/favicon.svg",
      alt: "ReasonMaster Favicon",
      width: 32,
      height: 32,
    },
    ogImage: {
      src: "/assets/og/og-image.svg",
      alt: "ReasonMaster India — Reasoning Prep for 64+ Indian Exams",
      width: 1200,
      height: 630,
    },
  },
  categories: {
    ssc: {
      src: "/assets/categories/cat-ssc.svg",
      alt: "Staff Selection Commission (SSC) Reasoning",
      width: 64,
      height: 64,
    },
    banking: {
      src: "/assets/categories/cat-banking.svg",
      alt: "Banking & Financial Examinations Reasoning",
      width: 64,
      height: 64,
    },
    railway: {
      src: "/assets/categories/cat-railway.svg",
      alt: "Railway Recruitment Board (RRB) Reasoning",
      width: 64,
      height: 64,
    },
    insurance: {
      src: "/assets/categories/cat-insurance.svg",
      alt: "Insurance Sector Examinations Reasoning",
      width: 64,
      height: 64,
    },
    defence: {
      src: "/assets/categories/cat-defence.svg",
      alt: "Defence Services Examinations Reasoning",
      width: 64,
      height: 64,
    },
    police: {
      src: "/assets/categories/cat-police.svg",
      alt: "Police Services & Constable Reasoning",
      width: 64,
      height: 64,
    },
    central_govt: {
      src: "/assets/categories/cat-central-govt.svg",
      alt: "Central Government CSAT & Aptitude Examinations",
      width: 64,
      height: 64,
    },
    state_psc: {
      src: "/assets/categories/cat-state-psc.svg",
      alt: "State Public Service Commission Examinations",
      width: 64,
      height: 64,
    },
  } as Record<string, VisualAsset>,
  states: {
    emptyBookmarks: {
      src: "/assets/states/empty/empty-bookmarks.svg",
      alt: "No bookmarked reasoning questions yet",
      width: 120,
      height: 120,
    },
    emptyHistory: {
      src: "/assets/states/empty/empty-history.svg",
      alt: "No practice history recorded yet",
      width: 120,
      height: 120,
    },
    emptySearch: {
      src: "/assets/states/empty/empty-search.svg",
      alt: "No matching reasoning topics found",
      width: 120,
      height: 120,
    },
    emptyProgress: {
      src: "/assets/states/empty/empty-progress.svg",
      alt: "Begin your reasoning journey to track progress",
      width: 120,
      height: 120,
    },
    error404: {
      src: "/assets/states/errors/error-404.svg",
      alt: "Reasoning topic or page not found (404)",
      width: 140,
      height: 140,
    },
    practiceComplete: {
      src: "/assets/states/success/practice-complete.svg",
      alt: "Practice session completed successfully",
      width: 140,
      height: 140,
    },
  },
  illustrations: {
    studyHero: {
      src: "/assets/illustrations/study-hero.jpg",
      alt: "ReasonMaster India dedicated study desk with reasoning workbook and problem-solving tools",
      width: 1280,
      height: 720,
    },
  },
} as const;

/**
 * Returns the registered category emblem asset or a safe fallback
 */
export function getCategoryAsset(categoryId: string): VisualAsset {
  if (categoryId in ASSETS.categories) {
    return ASSETS.categories[categoryId];
  }
  return ASSETS.categories.ssc;
}
