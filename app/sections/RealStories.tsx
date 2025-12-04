"use client";

import React, { useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { gsap } from "gsap";
import AnimatedRibbons from "~/components/AnimatedRibbons";
import SplitText from "~/components/SplitText";
import TestimonialCard from "~/components/TestimonialCard";
import ScrollTriggerPkg from "gsap/ScrollTrigger";
import { useLanguage } from "~/contexts/LanguageContext";
const ScrollTrigger = ScrollTriggerPkg;

gsap.registerPlugin(ScrollTrigger);

const RealStoriesSection = () => {
  const { t } = useTranslation();
  const { currentLanguage } = useLanguage();
  const subheadingRef = useRef<HTMLParagraphElement>(null);

  const stories = [
    {
      tag: t("realStories.stories.loveStory.tag"),
      quote: t("realStories.stories.loveStory.quote"),
      author: t("realStories.stories.loveStory.author"),
      delay: 0.2,
    },
    {
      tag: t("realStories.stories.resilience.tag"),
      quote: t("realStories.stories.resilience.quote"),
      author: t("realStories.stories.resilience.author"),
      delay: 0.4,
    },
    {
      tag: t("realStories.stories.stepmom.tag"),
      quote: t("realStories.stories.stepmom.quote"),
      author: t("realStories.stories.stepmom.author"),
      delay: 0.6,
    },
  ];

  useEffect(() => {
    const subheading = subheadingRef.current;
    if (!subheading) return;

    gsap.fromTo(
      subheading,
      {
        opacity: 0,
        y: 40,
      },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: subheading,
          start: "top 80%",
          once: true,
        },
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.trigger === subheading) trigger.kill();
      });
    };
  }, []);

  return (
    <section id="real-stories" className="relative min-h-screen bg-white py-20">
      {/* Static Ribbons */}
      <AnimatedRibbons className="z-0" />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Heading with SplitText Animation */}
        <div className="text-center mb-12">
          <SplitText
            key={`real-stories-title-${currentLanguage}`}
            text={t("realStories.title")}
            tag="h2"
            className="text-4xl md:text-6xl font-display font-light tracking-wide text-pitch-black mb-8"
            delay={80}
            duration={0.8}
            splitType="chars"
            from={{ opacity: 0, y: 60, rotateX: -90 }}
            to={{ opacity: 1, y: 0, rotateX: 0 }}
          />

          {/* Subheadline with ScrollReveal fade-up */}
          <p
            ref={subheadingRef}
            className="text-lg md:text-xl text-stone-600 font-sans leading-relaxed max-w-4xl mx-auto"
          >
            {t("realStories.subtitle")}
          </p>
        </div>

        {/* Story Cards Grid with Stagger */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {stories.map((story, index) => (
            <TestimonialCard
              key={index}
              tag={story.tag}
              quote={story.quote}
              author={story.author}
              delay={story.delay}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default RealStoriesSection;
