"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="relative z-10 bg-stone-50 py-12 px-6 border-t border-stone-200/50">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
        {/* Copyright */}
        <div className="text-stone-400 font-sans text-xs uppercase tracking-[0.2em]">
          © {new Date().getFullYear()} Laberge Casting. All rights reserved.
        </div>

        {/* Privacy Policy Link */}
        <Link
          to="/privacy-policy"
          className="group relative text-stone-500 font-sans text-xs uppercase tracking-[0.2em] transition-colors duration-300 hover:text-stone-900"
        >
          {t("privacyPolicy.title")}
          <span className="absolute -bottom-1 left-0 w-0 h-px bg-stone-900 transition-all duration-300 group-hover:w-full" />
        </Link>

        {/* Social / Contact Placeholder */}
        <div className="flex items-center space-x-6">
          <a
            href="mailto:info@labergecasting.com"
            className="text-stone-400 hover:text-stone-900 transition-colors duration-300"
            aria-label="Email"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
