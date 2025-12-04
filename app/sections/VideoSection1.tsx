"use client";

import React, { useRef, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLanguage } from "~/contexts/LanguageContext";
import SplitText from "../components/SplitText";
import AnimatedRibbons from "~/components/AnimatedRibbons";

export default function VideoSection1(): React.JSX.Element {
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
          <source src="/Video/video.mp4" type="video/mp4" />
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

      {/* Content Overlay */}
      <div className="absolute inset-0 z-40 flex items-center justify-center">
        <div className="text-center max-w-4xl mx-auto px-6">
          {/* Main Title */}
          <div className="mb-6">
            <img
              src="/logo/Laberge_casting_blanc.png"
              alt="logo"
              className="mb-16"
            />
            <SplitText
              key={`video-title-${currentLanguage}`}
              text={t("video.title")}
              tag="h2"
              className="text-4xl md:text-6xl lg:text-7xl font-display font-normal tracking-wider text-white drop-shadow-2xl"
              delay={60}
              duration={0.8}
              ease="power3.out"
              splitType="chars"
              from={{ opacity: 0, y: 40, rotationX: -45 }}
              to={{ opacity: 1, y: 0, rotationX: 0 }}
              threshold={0.3}
            />
          </div>

          {/* Subtitle */}
          <div className="mb-8">
            <SplitText
              key={`video-subtitle-${currentLanguage}`}
              text={t("video.subtitle")}
              tag="p"
              className="text-lg md:text-xl lg:text-2xl font-sans font-light tracking-wide text-white/90 max-w-3xl mx-auto leading-relaxed drop-shadow-lg"
              delay={30}
              duration={0.6}
              ease="power2.out"
              splitType="words"
              from={{ opacity: 0, y: 20 }}
              to={{ opacity: 1, y: 0 }}
              threshold={0.2}
            />
          </div>

          {/* Elegant Divider */}
          <div className="flex items-center justify-center mb-8">
            <div className="w-16 h-px bg-white/40"></div>
            <div className="w-2 h-2 bg-white/60 rounded-full mx-4"></div>
            <div className="w-16 h-px bg-white/40"></div>
          </div>

          {/* Description */}
          <div
            className="opacity-0 animate-fade-in-up"
            style={{ animationDelay: "1.5s", animationFillMode: "forwards" }}
          >
            <p className="text-base md:text-lg font-sans font-extralight tracking-wide text-white/80 max-w-2xl mx-auto leading-relaxed">
              {t("video.description")}
            </p>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-50">
        <div className="flex flex-col items-center space-y-2 opacity-70">
          <span className="text-xs font-sans font-light tracking-widest text-white uppercase">
            {t("common.continue")}
          </span>
          <div className="w-px h-12 bg-white/60 animate-pulse" />
        </div>
      </div>

      {/* Video Controls Hint (Hidden but accessible) */}
      <div className="sr-only">
        <p>{t("video.accessibility")}</p>
      </div>
    </section>
  );
}
