"use client";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLanguage } from "~/contexts/LanguageContext";
import SplitText from "../components/SplitText";
import LiquidEther from "~/components/background/LiquidEther";
import { colors1 } from "~/constants";

export default function HeroSection(): React.JSX.Element {
  const { t } = useTranslation();
  const { currentLanguage } = useLanguage();
  const [isVisible, setIsVisible] = useState<boolean>(false);

  useEffect(() => {
    // Trigger animation after component mounts
    const timer = setTimeout(() => setIsVisible(true), 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section
      id="home"
      className="relative min-h-screen w-full overflow-hidden bg-linear-to-br from-white via-stone-50 to-neutral-100"
    >
      {/* Liquid Ether Background */}
      <div className="absolute inset-0 z-0">
        <div className="w-full h-full relative">
          <LiquidEther
            colors={colors1}
            mouseForce={20}
            cursorSize={100}
            isViscous={false}
            viscous={30}
            iterationsViscous={32}
            iterationsPoisson={32}
            resolution={0.5}
            isBounce={false}
            autoDemo={true}
            autoSpeed={0.5}
            autoIntensity={2.2}
            takeoverDuration={0.25}
            autoResumeDelay={3000}
            autoRampDuration={0.6}
          />
        </div>
      </div>

      {/* Overlay for better text readability */}
      <div className="absolute inset-0 z-10 bg-white/20 backdrop-blur-[0.5px]" />

      {/* Hero Content */}
      <div className="relative z-20 flex min-h-screen items-center justify-center px-6 py-12">
        <div className="max-w-6xl mx-auto text-center">
          {/* Main Headline */}
          <div className="mb-8">
            <SplitText
              key={`company-${currentLanguage}`}
              text={t("hero.company")}
              tag="h1"
              className="text-6xl md:text-8xl lg:text-9xl font-display font-normal tracking-wider text-stone-800"
              delay={80}
              duration={0.8}
              ease="power3.out"
              splitType="chars"
              from={{ opacity: 0, y: 60, rotationX: -90 }}
              to={{ opacity: 1, y: 0, rotationX: 0 }}
              threshold={0.2}
            />
          </div>

          {/* Subtitle */}
          <div className="mb-12">
            <SplitText
              key={`title-${currentLanguage}`}
              text={t("hero.title")}
              tag="h2"
              className="text-xl md:text-2xl lg:text-3xl font-sans font-extralight tracking-wide text-stone-600 max-w-4xl mx-auto leading-relaxed"
              delay={40}
              duration={0.6}
              ease="power2.out"
              splitType="words"
              from={{ opacity: 0, y: 30 }}
              to={{ opacity: 1, y: 0 }}
              threshold={0.1}
            />
          </div>

          {/* Call to Action */}
          <div
            className="opacity-0 animate-fade-in-up"
            style={{ animationDelay: "2s", animationFillMode: "forwards" }}
          >
            <button className="group relative px-12 py-4 bg-purple-200 border border-stone-300 text-stone-700 font-sans font-light tracking-widest text-sm uppercase transition-all duration-500  overflow-hidden cursor-pointer">
              <span className="relative z-10">Discover Excellence</span>
              <div className="absolute inset-0 bg-fuchsia-200 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
            </button>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
        <div className="flex flex-col items-center space-y-2 opacity-60">
          <span className="text-xs font-sans font-light tracking-widest text-stone-600 uppercase">
            Scroll
          </span>
          <div className="w-px h-12 bg-stone-400 animate-pulse" />
        </div>
      </div>
    </section>
  );
}
