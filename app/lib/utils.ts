import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Global reference to ScrollSmoother instance
let globalSmoother: any = null; // Use 'any' to avoid type complications

export const setGlobalSmoother = (smoother: any) => {
  globalSmoother = smoother;
};

export const getGlobalSmoother = (): any => {
  return globalSmoother;
};

// Utility functions for smooth scroll control
export const scrollTo = (
  target: number | string | Element,
  options: { offset?: number; duration?: number; easing?: string } = {}
) => {
  if (globalSmoother) {
    globalSmoother.scrollTo(target, options);
  }
};

export const scrollToTop = () => {
  if (globalSmoother) {
    globalSmoother.scrollTo(0);
  }
};

export const scrollToBottom = () => {
  if (globalSmoother) {
    globalSmoother.scrollTo("100%");
  }
};
