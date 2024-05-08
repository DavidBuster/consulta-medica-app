// import { Typography } from '@material-ui/core'
import { Typography } from "@mui/material";
import React from "react";
import { useTranslation } from "react-i18next";
import en from "./i18n/en";
import es from "./i18n/es";
import i18n from "../../../i18n";

i18n.addResourceBundle("en", "noImagesInDatabaseBox", en);
i18n.addResourceBundle("es", "noImagesInDatabaseBox", es);

export const NoImagesInDatabaseBox = () => {
  const { t } = useTranslation("noImagesInDatabaseBox");

  return (
    <Typography
      style={{
        color: "red",
        border: `1px solid red`,
        borderRadius: "8px",
        padding: "3px",
        textAlign: "center",
      }}
      className="font-bold text-10 w-full"
    >
      {t("NO_PHOTOS_DATABASE")}
    </Typography>
  );
};
