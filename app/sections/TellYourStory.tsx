"use client";

import React, { useRef, useEffect } from "react";
import { Element } from "react-scroll";
import { useTranslation } from "react-i18next";
import { gsap } from "gsap";
import AnimatedRibbons from "~/components/AnimatedRibbons";
import SplitText from "~/components/SplitText";
import StoryForm from "~/components/StoryForm";
import ScrollTriggerPkg from "gsap/ScrollTrigger";
import { useLanguage } from "~/contexts/LanguageContext";
const ScrollTrigger = ScrollTriggerPkg;

gsap.registerPlugin(ScrollTrigger);

const TellYourStorySection = () => {
  const { t } = useTranslation();
  const { currentLanguage } = useLanguage();
  const contentBlocksRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const contentBlocks = contentBlocksRef.current;

    if (contentBlocks) {
      const blocks = contentBlocks.querySelectorAll(".content-block");
      gsap.fromTo(
        blocks,
        {
          opacity: 0,
          y: 50,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.2,
          scrollTrigger: {
            trigger: contentBlocks,
            start: "top 80%",
            once: true,
          },
        }
      );
    }

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.trigger === contentBlocks) {
          trigger.kill();
        }
      });
    };
  }, []);

  return (
    <Element name="tell-your-story">
      <section
        id="tell-your-story"
        className="relative min-h-screen bg-stone-50 py-20"
      >
        {/* Static Ribbons */}
        <AnimatedRibbons className="z-0" />

        {/* Content */}
        <div className="relative z-10 max-w-6xl mx-auto px-6">
          {/* Heading with SplitText Animation */}
          <div className="text-center mb-12">
            <SplitText
              key={`tell-your-story-title-${currentLanguage}`}
              text={t("tellYourStory.title")}
              tag="h2"
              className="text-4xl md:text-6xl font-display font-light tracking-wide text-pitch-black mb-8"
              delay={80}
              duration={0.8}
              splitType="chars"
              from={{ opacity: 0, y: 60, rotateX: -90 }}
              to={{ opacity: 1, y: 0, rotateX: 0 }}
            />
          </div>

          {/* Main Content Paragraph */}
          <div ref={contentBlocksRef} className="mb-16 max-w-3xl mx-auto">
            <div className="content-block">
              <p className="text-stone-600 font-sans leading-relaxed text-lg text-center whitespace-pre-line">
                {t("tellYourStory.description")}
              </p>
            </div>
          </div>

          {/* Form Section with Slide-up Animation */}
        </div>
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-20 items-center">
            {/* Tagline Image - Hidden on mobile, shown on large screens */}
            <div className="hidden lg:flex items-center justify-center">
              <img
                src={
                  currentLanguage === "en"
                    ? "/Tag lines/EveryoneHasAstory_1.png"
                    : "/Tag lines/Laberge_casting_tagLine_destop_v2.png"
                }
                alt="tagline"
                className="w-fit object-contain"
                key={currentLanguage}
              />
            </div>
            {/* Form - Full width on mobile, constrained on larger screens */}
            <div className="w-full lg:w-fit mx-auto lg:mx-0">
              <StoryForm />
            </div>
          </div>
        </div>
      </section>
    </Element>
  );
};

export default TellYourStorySection;
