"use client";

import React, { useRef, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLanguage } from "~/contexts/LanguageContext";
import SplitText from "../components/SplitText";
import AnimatedRibbons from "~/components/AnimatedRibbons";

export default function VideoSection2(): React.JSX.Element {
  const { t } = useTranslation();
  const { currentLanguage } = useLanguage();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVideoLoaded, setIsVideoLoaded] = useState<boolean>(false);

  useEffect(() => {
    if (videoRef.current && isVideoLoaded) {
      videoRef.current.play().catch((error) => {
        console.log("Video autoplay failed:", error);
      });
    }
  }, [isVideoLoaded]);

  return (
    <section
      id="video-showcase"
      className="relative w-full h-screen overflow-hidden bg-black"
    >
      {/* Animated Ribbons Background */}
      <AnimatedRibbons />

      {/* Video Background */}
      <div className="absolute inset-0 z-10">
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster="/Video/video-poster-2.png"
          onLoadedData={() => setIsVideoLoaded(true)}
          style={{
            opacity: isVideoLoaded ? 1 : 0.8,
            transition: "opacity 1.5s ease-in-out",
          }}
        >
          <source src="/Video/video2.mp4" type="video/mp4" />
          <source src="/Video/video.webm" type="video/webm" />
          Your browser does not support the video tag.
        </video>
      </div>

      {/* Subtle Loading Hint (Optional, non-blocking) */}
      {!isVideoLoaded && (
        <div className="absolute top-4 right-4 z-50">
          <div className="w-4 h-4 border-2 border-white/20 border-t-white/60 rounded-full animate-spin"></div>
        </div>
      )}

      {/* Elegant Overlay */}
      <div className="absolute inset-0 z-30 bg-linear-to-t from-black/60 via-transparent to-black/30" />

      {/* Video Controls Hint (Hidden but accessible) */}
      <div className="sr-only">
        <p>{t("video.accessibility")}</p>
      </div>
    </section>
  );
}
