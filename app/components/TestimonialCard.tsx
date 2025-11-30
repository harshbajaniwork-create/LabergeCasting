import React, { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { Quote } from "lucide-react";
import ScrollTriggerPkg from "gsap/ScrollTrigger";
const ScrollTrigger = ScrollTriggerPkg;

gsap.registerPlugin(ScrollTrigger);

interface TestimonialCardProps {
  tag: string;
  quote: string;
  author: string;
  delay?: number;
  className?: string;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({
  tag,
  quote,
  author,
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
        y: 80,
        rotateX: -15,
      },
      {
        opacity: 1,
        y: 0,
        rotateX: 0,
        duration: 1,
        ease: "power3.out",
        delay: delay,
        scrollTrigger: {
          trigger: card,
          start: "top 85%",
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
      className={`group relative bg-white/90 backdrop-blur-md rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 border border-stone-100 overflow-hidden ${className}`}
    >
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-linear-to-br from-sky/5 via-sky/20 to-banane/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Decorative quote icon */}
      <div className="absolute top-6 right-6 text-tomato/20 group-hover:text-tomato/40 transition-colors duration-300">
        <Quote size={32} strokeWidth={1} />
      </div>

      <div className="relative z-10">
        {/* Tag */}
        <div className="inline-block bg-royal-blue/10 text-royal-blue px-4 py-2 rounded-full text-sm font-medium mb-6 group-hover:bg-royal-blue/20 transition-colors duration-300">
          {tag}
        </div>

        {/* Quote */}
        <blockquote className="text-stone-700 font-sans leading-relaxed mb-6 text-lg group-hover:text-stone-800 transition-colors duration-300">
          "{quote}"
        </blockquote>

        {/* Author */}
        <cite className="text-stone-500 font-medium text-base not-italic group-hover:text-royal-blue transition-colors duration-300">
          {author}
        </cite>
      </div>

      {/* Subtle border animation */}
      <div className="absolute inset-0 rounded-3xl border-2 border-transparent group-hover:border-tomato/20 transition-colors duration-500" />
    </div>
  );
};

export default TestimonialCard;
