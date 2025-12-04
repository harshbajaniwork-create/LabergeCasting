import { useLayoutEffect, useRef, type ReactNode } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { setGlobalSmoother } from "../lib/utils";

const ScrollSmoothProvider = ({ children }: { children: ReactNode }) => {
  const smoothWrapperRef = useRef<HTMLDivElement | null>(null);
  const smoothContentRef = useRef<HTMLDivElement | null>(null);
  const smootherInstance = useRef<any>(null);

  useGSAP(() => {
    // Only run on the client, after React has hydrated the DOM
    if (typeof window === "undefined") return;

    let cancelled = false;
    let rafId: number | null = null;
    let ScrollTrigger: any;

    const setup = async () => {
      try {
        // Dynamically import GSAP plugins only on the client so SSR doesn't try
        // to evaluate their ESM in Node.
        const [{ ScrollSmoother }, { ScrollTrigger: ST }] = await Promise.all([
          import("gsap/ScrollSmoother"),
          import("gsap/ScrollTrigger"),
        ]);

        if (cancelled) return;
        ScrollTrigger = ST;

        gsap.registerPlugin(ScrollSmoother, ScrollTrigger);

        // Defer ScrollSmoother setup to the next animation frame to avoid
        // mutating the DOM during React's hydration/commit phase.
        rafId = window.requestAnimationFrame(() => {
          if (!smoothWrapperRef.current || !smoothContentRef.current) return;

          // Kill any existing ScrollSmoother instance
          if (smootherInstance.current) {
            smootherInstance.current.kill();
          }

          // Create ScrollSmoother instance
          smootherInstance.current = ScrollSmoother.create({
            wrapper: smoothWrapperRef.current,
            content: smoothContentRef.current,
            smooth: 1.5,
            effects: true,
            smoothTouch: 0.1,
            normalizeScroll: true,
          });

          // Set global reference for other components to use
          setGlobalSmoother(smootherInstance.current);

          // Refresh ScrollTrigger instances when ScrollSmoother is ready
          ScrollTrigger.refresh();
        });
      } catch (e) {
        // In production, fail silently rather than breaking the app if GSAP fails
        console.error("ScrollSmoothProvider: failed to init GSAP smoother", e);
      }
    };

    setup();

    return () => {
      cancelled = true;
      if (rafId !== null) {
        window.cancelAnimationFrame(rafId);
      }
      if (smootherInstance.current) {
        smootherInstance.current.kill();
        smootherInstance.current = null;
        setGlobalSmoother(null);
      }
    };
  }, []);

  // Handle route changes - refresh ScrollSmoother
  useLayoutEffect(() => {
    const refreshSmoother = () => {
      if (smootherInstance.current) {
        setTimeout(() => {
          smootherInstance.current?.refresh();
          ScrollTrigger.refresh();
        }, 100);
      }
    };

    window.addEventListener("popstate", refreshSmoother);
    window.addEventListener("hashchange", refreshSmoother);

    return () => {
      window.removeEventListener("popstate", refreshSmoother);
      window.removeEventListener("hashchange", refreshSmoother);
    };
  }, []);

  return (
    <div ref={smoothWrapperRef} id="smooth-wrapper">
      <div ref={smoothContentRef} id="smooth-content">
        {children}
      </div>
    </div>
  );
};

export default ScrollSmoothProvider;
