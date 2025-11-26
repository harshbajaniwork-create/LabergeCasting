import React, { useRef, useEffect } from "react";
import { gsap } from "gsap";

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
}

const MagneticButton: React.FC<MagneticButtonProps> = ({
  children,
  className = "",
  onClick,
  type = "button",
  disabled = false,
}) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const button = buttonRef.current;
    const text = textRef.current;
    if (!button || !text) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (disabled) return;

      const rect = button.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      gsap.to(button, {
        x: x * 0.3,
        y: y * 0.3,
        duration: 0.3,
        ease: "power2.out",
      });

      gsap.to(text, {
        x: x * 0.1,
        y: y * 0.1,
        duration: 0.3,
        ease: "power2.out",
      });
    };

    const handleMouseLeave = () => {
      gsap.to([button, text], {
        x: 0,
        y: 0,
        duration: 0.5,
        ease: "elastic.out(1, 0.3)",
      });
    };

    button.addEventListener("mousemove", handleMouseMove);
    button.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      button.removeEventListener("mousemove", handleMouseMove);
      button.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [disabled]);

  return (
    <button
      ref={buttonRef}
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        relative overflow-hidden rounded-full px-8 py-4 font-medium transition-all duration-300
         text-white bg-sky hover:shadow-xl
        disabled:opacity-50 disabled:cursor-not-allowed
        group
        ${className}
      `}
    >
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-linear-to-r from-orchid/20 to-banane/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Text content */}
      <span
        ref={textRef}
        className="relative z-10 flex items-center justify-center gap-2"
      >
        {children}
      </span>

      {/* Ripple effect on click */}
      <div className="absolute inset-0 bg-white/20 rounded-full scale-0 group-active:scale-100 transition-transform duration-200" />
    </button>
  );
};

export default MagneticButton;
