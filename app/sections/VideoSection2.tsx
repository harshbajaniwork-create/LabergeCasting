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
    const video = videoRef.current;
    if (video) {
      const handleLoadedData = () => {
        setIsVideoLoaded(true);
        video.play().catch((error) => {
          console.log("Video autoplay failed:", error);
        });
      };

      video.addEventListener("loadeddata", handleLoadedData);
      return () => video.removeEventListener("loadeddata", handleLoadedData);
    }
  }, []);

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
          preload="metadata"
          style={{
            opacity: isVideoLoaded ? 1 : 0,
            transition: "opacity 1s ease-in-out",
          }}
        >
          <source src="/Video/video2.mp4" type="video/mp4" />
          <source src="/Video/video.webm" type="video/webm" />
          Your browser does not support the video tag.
        </video>
      </div>

      {/* Video Loading Placeholder */}
      {!isVideoLoaded && (
        <div className="absolute inset-0 z-20 bg-linear-to-br from-stone-900 via-stone-800 to-black flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-stone-300 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-stone-300 font-sans font-light tracking-wide">
              {t("video.loading")}
            </p>
          </div>
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
