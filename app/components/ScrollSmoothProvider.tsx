import { useLayoutEffect, useRef, type ReactNode } from "react";
import { gsap } from "gsap";
import ScrollSmootherPkg from "gsap/ScrollSmoother";
import { useGSAP } from "@gsap/react";
import { setGlobalSmoother } from "../lib/utils";
import ScrollTriggerPkg from "gsap/ScrollTrigger";

const ScrollTrigger = ScrollTriggerPkg;
const ScrollSmoother = ScrollSmootherPkg;

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

const ScrollSmoothProvider = ({ children }: { children: ReactNode }) => {
  const smoothWrapperRef = useRef<HTMLDivElement | null>(null);
  const smoothContentRef = useRef<HTMLDivElement | null>(null);
  const smootherInstance = useRef<any>(null);

  useGSAP(() => {
    // Ensure DOM is ready
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

    return () => {
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
