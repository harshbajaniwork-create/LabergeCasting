import React, { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

// Client-side only imports to avoid SSR issues
let ScrollTrigger: any = null;
let GSAPSplitText: any = null;

// Initialize GSAP plugins only on client side
if (typeof window !== "undefined") {
  import("gsap/ScrollTrigger").then((module) => {
    ScrollTrigger = module.default;
    gsap.registerPlugin(ScrollTrigger);
  });

  import("gsap/SplitText").then((module) => {
    GSAPSplitText = module.default;
    gsap.registerPlugin(GSAPSplitText);
  });

  gsap.registerPlugin(useGSAP);
}

export interface SplitTextProps {
  text: string;
  className?: string;
  delay?: number;
  duration?: number;
  ease?: string | ((t: number) => number);
  splitType?: "chars" | "words" | "lines" | "words, chars";
  from?: gsap.TweenVars;
  to?: gsap.TweenVars;
  threshold?: number;
  rootMargin?: string;
  tag?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span";
  textAlign?: React.CSSProperties["textAlign"];
  onLetterAnimationComplete?: () => void;
}

const SplitText: React.FC<SplitTextProps> = ({
  text,
  className = "",
  delay = 100,
  duration = 0.6,
  ease = "power3.out",
  splitType = "chars",
  from = { opacity: 0, y: 40 },
  to = { opacity: 1, y: 0 },
  threshold = 0.1,
  rootMargin = "-100px",
  tag = "p",
  textAlign = "center",
  onLetterAnimationComplete,
}) => {
  const ref = useRef<HTMLParagraphElement>(null);
  const animationCompletedRef = useRef(false);
  const [fontsLoaded, setFontsLoaded] = useState<boolean>(false);
  const [gsapReady, setGsapReady] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (document.fonts.status === "loaded") {
      setFontsLoaded(true);
    } else {
      document.fonts.ready.then(() => {
        setFontsLoaded(true);
      });
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Wait for both GSAP plugins to load
    const checkGSAPReady = () => {
      if (ScrollTrigger && GSAPSplitText) {
        setGsapReady(true);
      } else {
        setTimeout(checkGSAPReady, 50);
      }
    };

    checkGSAPReady();
  }, []);

  useGSAP(
    () => {
      if (
        !ref.current ||
        !text ||
        !fontsLoaded ||
        !gsapReady ||
        typeof window === "undefined"
      )
        return;
      const el = ref.current as HTMLElement & {
        _rbsplitInstance?: any; // Changed type to any
      };

      if (el._rbsplitInstance) {
        try {
          el._rbsplitInstance.revert();
        } catch (_) {}
        el._rbsplitInstance = undefined;
      }

      const startPct = (1 - threshold) * 100;
      const marginMatch = /^(-?\d+(?:\.\d+)?)(px|em|rem|%)?$/.exec(rootMargin);
      const marginValue = marginMatch ? parseFloat(marginMatch[1]) : 0;
      const marginUnit = marginMatch ? marginMatch[2] || "px" : "px";
      const sign =
        marginValue === 0
          ? ""
          : marginValue < 0
            ? `-=${Math.abs(marginValue)}${marginUnit}`
            : `+=${marginValue}${marginUnit}`;
      const start = `top ${startPct}%${sign}`;
      let targets: Element[] = [];
      const assignTargets = (self: any) => {
        if (splitType.includes("chars") && self.chars?.length)
          targets = self.chars;
        if (
          !targets.length &&
          splitType.includes("words") &&
          self.words?.length
        )
          targets = self.words;
        if (
          !targets.length &&
          splitType.includes("lines") &&
          self.lines?.length
        )
          targets = self.lines;
        if (!targets.length) targets = self.chars || self.words || self.lines;
      };
      const splitInstance = new GSAPSplitText(el, {
        type: splitType,
        smartWrap: true,
        autoSplit: splitType === "lines",
        linesClass: "split-line",
        wordsClass: "split-word",
        charsClass: "split-char",
        reduceWhiteSpace: false,
        onSplit: (self: any) => {
          assignTargets(self);
          return gsap.fromTo(
            targets,
            { ...from },
            {
              ...to,
              duration,
              ease,
              stagger: delay / 1000,
              scrollTrigger: {
                trigger: el,
                start,
                once: true,
                fastScrollEnd: true,
                anticipatePin: 0.4,
              },
              onComplete: () => {
                animationCompletedRef.current = true;
                onLetterAnimationComplete?.();
              },
              willChange: "transform, opacity",
              force3D: true,
            }
          );
        },
      });
      el._rbsplitInstance = splitInstance;
      return () => {
        ScrollTrigger.getAll().forEach((st: any) => {
          if (st.trigger === el) st.kill();
        });
        try {
          splitInstance.revert();
        } catch (_) {}
        el._rbsplitInstance = undefined;
      };
    },
    {
      dependencies: [
        text,
        delay,
        duration,
        ease,
        splitType,
        JSON.stringify(from),
        JSON.stringify(to),
        threshold,
        rootMargin,
        fontsLoaded,
        gsapReady,
        onLetterAnimationComplete,
      ],
      scope: ref,
    }
  );

  const renderTag = () => {
    const style: React.CSSProperties = {
      textAlign,
      wordWrap: "break-word",
      willChange: "transform, opacity",
    };
    const classes = `split-parent overflow-hidden inline-block whitespace-normal ${className}`;
    switch (tag) {
      case "h1":
        return (
          <h1 ref={ref} style={style} className={classes}>
            {text}
          </h1>
        );
      case "h2":
        return (
          <h2 ref={ref} style={style} className={classes}>
            {text}
          </h2>
        );
      case "h3":
        return (
          <h3 ref={ref} style={style} className={classes}>
            {text}
          </h3>
        );
      case "h4":
        return (
          <h4 ref={ref} style={style} className={classes}>
            {text}
          </h4>
        );
      case "h5":
        return (
          <h5 ref={ref} style={style} className={classes}>
            {text}
          </h5>
        );
      case "h6":
        return (
          <h6 ref={ref} style={style} className={classes}>
            {text}
          </h6>
        );
      default:
        return (
          <p ref={ref} style={style} className={classes}>
            {text}
          </p>
        );
    }
  };

  return renderTag();
};

export default SplitText;
