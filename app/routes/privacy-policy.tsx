import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { gsap } from "gsap";
import SplitText from "~/components/SplitText";

export default function PrivacyPolicy() {
  const { t, i18n } = useTranslation();

  useEffect(() => {
    window.scrollTo(0, 0);

    // Simple fade in animation for sections
    gsap.fromTo(
      ".privacy-section",
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.out",
        delay: 0.5,
      },
    );
  }, []);

  const sections = [
    "collect",
    "why",
    "where",
    "consent",
    "changes",
    "retention",
    "rights",
    "cookies",
    "contact",
  ];

  return (
    <main className="min-h-screen bg-stone-50">
      <Navbar />

      <div className="pt-32 pb-20 px-6 max-w-4xl mx-auto">
        {/* Header */}
        <header className="mb-16">
          <SplitText
            text={t("privacyPolicy.title")}
            tag="h1"
            className="text-4xl md:text-6xl font-display font-light text-stone-900 mb-4"
            delay={50}
            duration={0.8}
          />
          <p className="text-stone-500 font-sans tracking-widest uppercase text-xs">
            {t("privacyPolicy.lastUpdated")}
          </p>
        </header>

        {/* Content */}
        <div className="space-y-16 font-sans text-stone-700 leading-relaxed text-lg">
          <p className="text-xl text-stone-800 italic privacy-section">
            {t("privacyPolicy.intro")}
          </p>

          {sections.map((sectionKey) => (
            <section key={sectionKey} className="privacy-section space-y-6">
              <h2 className="text-2xl font-display font-medium text-stone-900 border-l-2 border-stone-800 pl-6 uppercase tracking-wider">
                {t(`privacyPolicy.sections.${sectionKey}.title`)}
              </h2>

              <div className="space-y-6 whitespace-pre-line pl-6">
                <p>{t(`privacyPolicy.sections.${sectionKey}.text`)}</p>

                {t(`privacyPolicy.sections.${sectionKey}.items`, {
                  returnObjects: true,
                }) instanceof Array && (
                  <ul className="list-disc list-inside space-y-3 pl-2">
                    {(
                      t(`privacyPolicy.sections.${sectionKey}.items`, {
                        returnObjects: true,
                      }) as string[]
                    ).map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                )}

                {i18n.exists(`privacyPolicy.sections.${sectionKey}.footer`) && (
                  <p className="text-stone-600 font-light underline-offset-4">
                    {t(`privacyPolicy.sections.${sectionKey}.footer`)}
                  </p>
                )}

                {i18n.exists(`privacyPolicy.sections.${sectionKey}.p2`) && (
                  <p>{t(`privacyPolicy.sections.${sectionKey}.p2`)}</p>
                )}

                {i18n.exists(`privacyPolicy.sections.${sectionKey}.p3`) && (
                  <p>{t(`privacyPolicy.sections.${sectionKey}.p3`)}</p>
                )}

                {i18n.exists(
                  `privacyPolicy.sections.${sectionKey}.wixLink`,
                ) && (
                  <a
                    href="https://www.wix.com/about/privacy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block text-stone-900 underline underline-offset-8 hover:text-stone-600 transition-colors duration-300"
                  >
                    {t(`privacyPolicy.sections.${sectionKey}.wixLink`)}
                  </a>
                )}

                {i18n.exists(
                  `privacyPolicy.sections.${sectionKey}.contact`,
                ) && (
                  <div className="p-6 bg-white border border-stone-200 rounded-sm shadow-sm italic">
                    {sectionKey === "contact" ? (
                      <a
                        href={`mailto:${t(`privacyPolicy.sections.${sectionKey}.contact`).replace("📧 ", "")}`}
                        className="hover:text-stone-900 transition-colors duration-300"
                      >
                        {t(`privacyPolicy.sections.${sectionKey}.contact`)}
                      </a>
                    ) : (
                      t(`privacyPolicy.sections.${sectionKey}.contact`)
                    )}
                  </div>
                )}
              </div>
            </section>
          ))}

          <div className="pt-16 border-t border-stone-200 text-center">
            <p className="text-stone-700 font-display italic text-lg">
              {t("privacyPolicy.sections.thanks")}
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
