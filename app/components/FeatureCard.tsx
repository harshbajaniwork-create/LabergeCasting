import React, { useRef, useEffect } from "react";
import { gsap } from "gsap";

import ScrollTriggerPkg from "gsap/ScrollTrigger";
const ScrollTrigger = ScrollTriggerPkg;

gsap.registerPlugin(ScrollTrigger);

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay?: number;
  className?: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  icon,
  title,
  description,
  delay = 0,
  className = "",
}) => {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    gsap.fromTo(
      card,
      {
        opacity: 0,
        y: 60,
        scale: 0.9,
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        ease: "power3.out",
        delay: delay,
        scrollTrigger: {
          trigger: card,
          start: "top 80%",
          once: true,
        },
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.trigger === card) trigger.kill();
      });
    };
  }, [delay]);

  return (
    <div
      ref={cardRef}
      className={`group relative bg-white backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-stone-200/50 ${className}`}
    >
      {/* Gradient overlay on hover */}
      <div className="absolute inset-0 bg-linear-to-br from-sky/5 to-royal-blue/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="relative z-10">
        {/* Icon */}
        <div className="mb-6 text-sky transition-colors duration-300">
          {icon}
        </div>

        {/* Title */}
        <h3 className="text-xl font-sans font-semibold text-pitch-black mb-4 group-hover:text-sky transition-colors duration-300">
          {title}
        </h3>

        {/* Description */}
        <p className="text-stone-600 font-sans leading-relaxed group-hover:text-stone-700 transition-colors duration-300">
          {description}
        </p>
      </div>
    </div>
  );
};

export default FeatureCard;
