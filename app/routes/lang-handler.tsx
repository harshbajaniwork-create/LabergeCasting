import { useEffect } from "react";
import { Outlet, useParams, useNavigate, useLocation } from "react-router";
import { useTranslation } from "react-i18next";

const VALID_LANGS = ["en", "fr"];

export default function LangHandler() {
  const { lang } = useParams();
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (lang && VALID_LANGS.includes(lang)) {
      if (i18n.language !== lang) {
        i18n.changeLanguage(lang);
      }
    } else {
      // If language is invalid or missing, redirect to /fr + current path
      const pathSegments = location.pathname.split("/").filter(Boolean);
      // If the first segment is an invalid lang, remove it
      if (
        pathSegments.length > 0 &&
        !VALID_LANGS.includes(pathSegments[0]) &&
        pathSegments[0].length === 2
      ) {
        pathSegments.shift();
      }
      const newPath = `/fr/${pathSegments.join("/")}`;
      navigate(newPath, { replace: true });
    }
  }, [lang, i18n, navigate, location.pathname]);

  // Update HTML lang attribute
  useEffect(() => {
    if (lang) {
      document.documentElement.lang = lang;
    }
  }, [lang]);

  return <Outlet />;
}
