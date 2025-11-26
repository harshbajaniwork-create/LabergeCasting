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
  const hookRef = useRef<HTMLParagraphElement>(null);
  const contentBlocksRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const hook = hookRef.current;
    const contentBlocks = contentBlocksRef.current;

    if (hook) {
      gsap.fromTo(
        hook,
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
            trigger: hook,
            start: "top 80%",
            once: true,
          },
        }
      );
    }

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
        if (trigger.trigger === hook || trigger.trigger === contentBlocks) {
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
          {/* Hook Question with ScrollReveal fade-up */}
          <p
            ref={hookRef}
            className="text-2xl md:text-3xl font-display font-light text-royal-blue mb-12"
          >
            {t("tellYourStory.hook")}
          </p>
        </div>

        {/* Content Blocks with Stagger */}
        <div
          ref={contentBlocksRef}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16"
        >
          <div className="content-block">
            <p className="text-stone-600 font-sans leading-relaxed">
              {t("tellYourStory.perks.description")}
            </p>
          </div>

          <div className="content-block">
            <p className="text-stone-600 font-sans leading-relaxed">
              {t("tellYourStory.whatInvolves.description")}
            </p>
          </div>
        </div>

        {/* Form Section with Slide-up Animation */}
      </div>
      <div className="w-full max-w-fit mx-auto grid grid-cols-2 gap-20">
        <div className="flex items-center justify-center">
          <img
            src="/Tag lines/EveryoneHasAstory_1.png"
            alt="tagline"
            className="w-fit object-contain"
          />
        </div>
        <div className="flex w-fit">
          <StoryForm />
        </div>
      </div>
      </section>
    </Element>
  );
};

export default TellYourStorySection;
