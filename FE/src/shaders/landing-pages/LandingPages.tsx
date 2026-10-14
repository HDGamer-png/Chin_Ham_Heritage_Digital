import { useCallback, useMemo } from "react";

import {
  splitTypographyProps,
  usePageTypography,
  type PageTypographyProps,
} from "./pageTypography";
import { LandingPageFrame, type LandingPageProps } from "./LandingPageFrame";
export { LandingPageFrame, applyBackgroundPresentation } from "./LandingPageFrame";
export type { LandingPageFrameProps, LandingPageProps } from "./LandingPageFrame";
import {
  KAGE_TYPOGRAPHY,
  SYLVA_TYPOGRAPHY,
} from "./pageRecipes";

export function KageLandingPage(props: LandingPageProps & PageTypographyProps) {
  const [type, frame] = splitTypographyProps(props);
  const customization = usePageTypography(KAGE_TYPOGRAPHY, type);
  return (
    <LandingPageFrame
      {...frame}
      customization={customization}
      title="Kage — Where stillness reveals the unseen"
      sourceUrl="/landing-pages/kage.html?v=bunkers_thuyetminh_v38"
    />
  );
}

export const SYLVA_HERO_VARIANTS = ["living-green", "sakura-sunset", "maple-autumn", "sequoia-mist"] as const;
export type SylvaHeroVariant = (typeof SYLVA_HERO_VARIANTS)[number];

export type SylvaHeroProps = LandingPageProps & PageTypographyProps & {
  variant?: SylvaHeroVariant;
  presentation?: "page" | "background";
  backgroundCanvasSelector?: string;
  backgroundVisualSelector?: string;
};

const SYLVA_HERO_BASE_URL = "/landing-pages/inner-green-3d.html";

const SYLVA_HERO_TITLES: Record<SylvaHeroVariant, string> = {
  "living-green": "Sylva — Into the living world",
  "sakura-sunset": "Sylva — Sakura Sunset",
  "maple-autumn": "Sylva — Maple Autumn",
  "sequoia-mist": "Sylva — Sequoia Mist",
};

export function SylvaHero({
  variant = "living-green",
  presentation = "page",
  backgroundCanvasSelector,
  backgroundVisualSelector,
  ...props
}: SylvaHeroProps) {
  const safeVariant = SYLVA_HERO_VARIANTS.includes(variant) ? variant : "living-green";
  const [type, frame] = splitTypographyProps(props);
  const customization = usePageTypography(SYLVA_TYPOGRAPHY, type);

  return (
    <LandingPageFrame
      {...frame}
      key={safeVariant}
      backgroundCanvasSelector={presentation === "background" ? "#scene" : backgroundCanvasSelector}
      backgroundVisualSelector={presentation === "background" ? undefined : backgroundVisualSelector}
      customization={customization}
      title={SYLVA_HERO_TITLES[safeVariant]}
      sourceUrl={SYLVA_HERO_BASE_URL}
    />
  );
}
