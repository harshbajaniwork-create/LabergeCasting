import React from "react";
import { useTranslation } from "react-i18next";
import { Shield, Heart, Users } from "lucide-react";
import AnimatedRibbons from "~/components/AnimatedRibbons";
import SplitText from "~/components/SplitText";
import FeatureCard from "~/components/FeatureCard";
import { useLanguage } from "~/contexts/LanguageContext";

const OurApproachSection = () => {
  const { t } = useTranslation();
  const { currentLanguage } = useLanguage();

  const features = [
    {
      icon: <Heart size={48} strokeWidth={1.5} />,
      title: t("ourApproach.allStories.title"),
      description: t("ourApproach.allStories.description"),
      delay: 0.4,
    },
    {
      icon: <Shield size={48} strokeWidth={1.5} />,
      title: t("ourApproach.confidential.title"),
      description: t("ourApproach.confidential.description"),
      delay: 0.2,
    },
    {
      icon: <Users size={48} strokeWidth={1.5} />,
      title: t("ourApproach.storiesCollected.title"),
      description: t("ourApproach.storiesCollected.description"),
      delay: 0.6,
    },
  ];

  return (
    <section
      id="our-approach"
      className="relative min-h-screen bg-ivore py-20 flex items-center justify-center"
    >
      {/* Static Ribbons that span from here to end */}
      <AnimatedRibbons className="z-0" />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Heading with SplitText Animation */}
        <div className="text-center mb-16">
          <SplitText
            key={`our-approach-title-${currentLanguage}`}
            text={t("ourApproach.title")}
            tag="h2"
            className="text-4xl md:text-6xl font-display font-light tracking-wide text-pitch-black"
            delay={80}
            duration={0.8}
            splitType="chars"
            from={{ opacity: 0, y: 60, rotateX: -90 }}
            to={{ opacity: 1, y: 0, rotateX: 0 }}
          />
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              delay={feature.delay}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default OurApproachSection;
