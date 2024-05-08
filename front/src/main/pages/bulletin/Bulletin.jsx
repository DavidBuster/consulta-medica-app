import React from "react";
import { Page } from "../../../commons/components/page/Page";
import { useTranslation } from "react-i18next";
import en from "./i18n/en";
import es from "./i18n/es";
import { Announcements } from "./tabs/announcements/Announcements";
import "./Bulletin.scss";
import i18n from "../../../i18n";

i18n.addResourceBundle("en", "bulletin", en);
i18n.addResourceBundle("es", "bulletin", es);

export const Bulletin = () => {
  const { t } = useTranslation("bulletin");
  return (
    <>
      <div
        className="pageHeader flex-col"
        style={{ alignItems: "flex-start", height: "unset" }}
      >
        <div className="title">{t("BULLETIN")}</div>
        <div className="subtitle"> {t("BULLETIN_TEXT")}</div>
      </div>
      <Page>
        <Announcements />
      </Page>
    </>
  );
};
