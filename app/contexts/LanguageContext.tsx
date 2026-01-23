import React, { createContext, useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useLocation, useParams } from "react-router";

interface LanguageContextType {
  currentLanguage: string;
  toggleLanguage: () => void;
  changeLanguage: (lang: string) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined,
);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};

interface LanguageProviderProps {
  children: React.ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({
  children,
}) => {
  const { i18n } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language || "fr");
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();

  useEffect(() => {
    if (params.lang && params.lang !== currentLanguage) {
      setCurrentLanguage(params.lang);
    }
  }, [params.lang, currentLanguage]);

  const changeLanguage = (lang: string) => {
    if (lang === currentLanguage) return;

    // Construct new path by replacing the lang segment
    const pathSegments = location.pathname.split("/").filter(Boolean);
    if (
      pathSegments.length > 0 &&
      (pathSegments[0] === "en" || pathSegments[0] === "fr")
    ) {
      pathSegments[0] = lang;
    } else {
      pathSegments.unshift(lang);
    }

    const newPath = `/${pathSegments.join("/")}`;
    i18n.changeLanguage(lang);
    navigate(newPath);
  };

  const toggleLanguage = () => {
    const newLang = currentLanguage === "en" ? "fr" : "en";
    changeLanguage(newLang);
  };

  const value: LanguageContextType = {
    currentLanguage,
    toggleLanguage,
    changeLanguage,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};
