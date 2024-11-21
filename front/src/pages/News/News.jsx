import React from "react";
import i18n from "../../i18n";
import es from "./i18n/es.json";
import en from "./i18n/en.json";
import { useTranslation } from "react-i18next";

if (!i18n.hasResourceBundle("es", "news")) {
  i18n.addResourceBundle("es", "news", es, true, true);
  i18n.addResourceBundle("en", "news", en, true, true);
  // i18n.reloadResources("es", "error"); // Fuerza la recarga del namespace
}

export const News = () => {
  const { t } = useTranslation("news");
  return <div>{t("title")}</div>;
};
