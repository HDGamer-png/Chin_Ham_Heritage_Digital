import { useEffect, useRef, useState, type CSSProperties } from "react";

import {
  applyPageCustomization,
  postPageCustomization,
  type LandingPageCustomization,
} from "./pageTypography";

export type LandingPageFrameProps = {
  /**
   * CSS selector for the authored visual layer when a complete page is reused
   * as a scene-only Background. The document stays untouched on disk; its UI
   * is suppressed only inside this catalog frame.
   */
  backgroundCanvasSelector?: string;
  /** Extra authored atmosphere layers (scrims, veils, vignettes) to retain. */
  backgroundVisualSelector?: string;
  className?: string;
  /** Loaded directly when the packaged document is byte-exact. */
  sourceUrl: string;
  /** Set only for derived variants; the frame renders this instead of fetching sourceUrl. */
  srcDoc?: string;
  style?: CSSProperties;
  title: string;
  /**
   * Typography and colour overrides, appended to the loaded document's own
   * head. The packaged file is never rewritten, so it stays byte-exact.
   */
  customization?: LandingPageCustomization;
  /**
   * Runs against the live frame on every load and whenever the callback's own
   * identity changes, which is how a page that exposes a scene API of its own
   * receives slider values. Memoize it on the values it reads.
   */
  applyScene?: (frame: HTMLIFrameElement) => void;
};

export type LandingPageProps = Omit<
  LandingPageFrameProps,
  "sourceUrl" | "title" | "customization" | "backgroundCanvasSelector" | "backgroundVisualSelector"
>;

const URL_FRAME_SANDBOX = "allow-downloads allow-forms allow-modals allow-popups allow-same-origin allow-scripts allow-top-navigation allow-top-navigation-by-user-activation";
const SRCDOC_FRAME_SANDBOX = "allow-downloads allow-forms allow-modals allow-popups allow-scripts allow-top-navigation allow-top-navigation-by-user-activation";

const BACKGROUND_PRESENTATION_STYLE_ID = "threeui-background-presentation";

export function applyBackgroundPresentation(
  frame: HTMLIFrameElement | null,
  backgroundCanvasSelector?: string,
  backgroundVisualSelector?: string,
) {
  try {
    const document = frame?.contentDocument;
    if (!document) return;

    document.getElementById(BACKGROUND_PRESENTATION_STYLE_ID)?.remove();
    document.querySelectorAll("[data-threeui-background-layer]").forEach((element) => {
      element.removeAttribute("data-threeui-background-layer");
      element.removeAttribute("data-threeui-background-fill");
    });

    if (!backgroundCanvasSelector) {
      document.documentElement.removeAttribute("data-threeui-presentation");
      return;
    }

    const canvas = document.querySelector<HTMLElement>(backgroundCanvasSelector);
    if (canvas) {
      canvas.setAttribute("data-threeui-background-layer", "");
      canvas.setAttribute("data-threeui-background-fill", "");
    }

    if (backgroundVisualSelector) {
      document.querySelectorAll<HTMLElement>(backgroundVisualSelector).forEach((element) => {
        element.setAttribute("data-threeui-background-layer", "");
      });
    }

    document.documentElement.setAttribute("data-threeui-presentation", "background");
    document.body?.classList.add("is-ready");

    const presentationStyle = document.createElement("style");
    presentationStyle.id = BACKGROUND_PRESENTATION_STYLE_ID;
    presentationStyle.textContent = `
      html[data-threeui-presentation="background"],
      html[data-threeui-presentation="background"] body {
        width: 100% !important;
        height: 100% !important;
        min-height: 100% !important;
        overflow: hidden !important;
        background: radial-gradient(64% 52% at 27% 84%, rgba(232,238,222,.15) 0%, rgba(232,238,222,0) 72%),
                    radial-gradient(70% 60% at 92% 8%,  rgba(24,28,20,.18) 0%, rgba(24,28,20,0) 68%),
                    #2d312a !important;
      }
      /* Hide authored copy, buttons, pills and cards so only the 3D living world shines */
      html[data-threeui-presentation="background"] .dock-wrap,
      html[data-threeui-presentation="background"] .headline,
      html[data-threeui-presentation="background"] .lede,
      html[data-threeui-presentation="background"] .pill-clip,
      html[data-threeui-presentation="background"] .play-wrap,
      html[data-threeui-presentation="background"] .stat,
      html[data-threeui-presentation="background"] .card,
      html[data-threeui-presentation="background"] .knob-float,
      html[data-threeui-presentation="background"] .scroll {
        display: none !important;
        visibility: hidden !important;
        opacity: 0 !important;
      }
      html[data-threeui-presentation="background"] #hero,
      html[data-threeui-presentation="background"] .hero {
        position: fixed !important;
        inset: 0 !important;
        width: 100vw !important;
        height: 100vh !important;
        visibility: visible !important;
        display: block !important;
        overflow: hidden !important;
      }
      html[data-threeui-presentation="background"] .hero::after {
        visibility: visible !important;
        display: block !important;
      }
      html[data-threeui-presentation="background"] #scene {
        position: fixed !important;
        inset: 0 !important;
        width: 100vw !important;
        height: 100vh !important;
        max-width: none !important;
        max-height: none !important;
        margin: 0 !important;
        transform: none !important;
        opacity: 1 !important;
        visibility: visible !important;
        display: block !important;
        pointer-events: auto !important;
      }
    `;
    document.head?.appendChild(presentationStyle);

    // Re-run authored resize path after the layer becomes full-frame
    frame.contentWindow?.requestAnimationFrame(() => {
      frame.contentWindow?.dispatchEvent(new Event("resize"));
    });
  } catch (err) {
    console.warn("Could not apply background presentation:", err);
  }
}

export function LandingPageFrame({
  applyScene,
  backgroundCanvasSelector,
  backgroundVisualSelector,
  className = "",
  customization,
  sourceUrl,
  srcDoc,
  style,
  title,
}: LandingPageFrameProps) {
  const [ready, setReady] = useState(true);
  const frameRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;

    const setup = () => {
      try {
        applyPageCustomization(frame, customization);
        postPageCustomization(frame, customization);
        applyBackgroundPresentation(frame, backgroundCanvasSelector, backgroundVisualSelector);
        applyScene?.(frame);
      } catch (err) {
        console.warn("Could not apply frame customization:", err);
      }
      setReady(true);
    };

    if (frame.contentDocument?.readyState === "complete" || frame.contentDocument?.body) {
      setup();
    }

    frame.addEventListener("load", setup);
    const fallbackTimer = setTimeout(setup, 120);

    return () => {
      frame.removeEventListener("load", setup);
      clearTimeout(fallbackTimer);
    };
  }, [applyScene, backgroundCanvasSelector, backgroundVisualSelector, customization]);

  return (
    <div
      className={`threeui-background landing-page-frame${className ? ` ${className}` : ""}`}
      data-state={ready ? "ready" : "loading"}
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        overflow: "hidden",
        background: "transparent",
        pointerEvents: "auto",
        ...style,
      }}
    >
      <iframe
        ref={frameRef}
        title={title}
        {...(srcDoc ? { srcDoc } : { src: sourceUrl })}
        sandbox={srcDoc ? SRCDOC_FRAME_SANDBOX : URL_FRAME_SANDBOX}
        loading="eager"
        onLoad={(event) => {
          try {
            applyPageCustomization(event.currentTarget, customization);
            postPageCustomization(event.currentTarget, customization);
            applyBackgroundPresentation(event.currentTarget, backgroundCanvasSelector, backgroundVisualSelector);
            applyScene?.(event.currentTarget);
          } catch (err) {
            console.warn("Error in frame onLoad:", err);
          }
          setReady(true);
        }}
        style={{
          position: "absolute",
          inset: 0,
          display: "block",
          width: "100%",
          height: "100%",
          border: 0,
          background: "transparent",
          opacity: 1,
          pointerEvents: "auto",
        }}
      />
    </div>
  );
}
