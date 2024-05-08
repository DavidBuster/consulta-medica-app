import React from "react";
import { useTranslation } from "react-i18next";
import i18next from "i18next";
import en from "./i18n/en";
import es from "./i18n/es";
import { Chip } from "@mui/material";
// import { Chip } from '@material-ui/core'

i18next.addResourceBundle("en", "colorTag", en);
i18next.addResourceBundle("es", "colorTag", es);

export const ColorTag = (props) => {
  const { t } = useTranslation("colorTag");
  let tag;
  if (props?.tag !== undefined) tag = props.tag;
  let tagValue = tag ?? props;
  if (typeof tagValue === "object") tagValue = "NO_DATA";

  let borderColor,
    color,
    backgroundColor,
    tagText = t(tagValue);

  switch (tagValue) {
    // GREEN
    case "YES":
    case "ACCEPTED":
      borderColor = "#B7EB8F";
      color = "#389E0D";
      backgroundColor = "#F6FFED";
      break;

    // LIGHT YELLOW
    case "saurusMexico":
      borderColor = "#FFE58F";
      color = "#D48806";
      backgroundColor = "#FFFBE6";
      break;

    // BLUE
    case "PENDING":
    case "saurus":
      borderColor = "#ADC6FF";
      color = "#1D39C4";
      backgroundColor = "#F0F5FF";
      break;

    // LIGHT BLUE
    case "DRIVER_LICENSE_UK":
      borderColor = "#91D5FF";
      color = "#096DD9";
      backgroundColor = "#E6F7FF";
      break;

    // ORANGE
    case "IN_REVIEW":
    case "CARD_EU_IDENTIFICATION":
      borderColor = "#FFA39E";
      color = "#CF1322";
      backgroundColor = "#FFFBE6";
      break;

    // RED
    case "NO":
      borderColor = "#FFA39E";
      color = "#CF1322";
      backgroundColor = "#FFF1F0";
      break;

    // PINK
    case "":
      borderColor = "violet";
      color = "#b764b7";
      backgroundColor = "#ffe1ff";
      break;

    // LIME
    case "RESIDENCE_CARD":
    case "RESIDENT_PERMIT":
      borderColor = "lime";
      color = "#00c800";
      backgroundColor = "#e1ffe1";
      break;

    // PURPLE
    case "PASSPORT":
      borderColor = "purple";
      color = "purple";
      backgroundColor = "#d9bdd9";
      break;

    // BLACK
    case "":
      borderColor = "black";
      color = "white";
      backgroundColor = "black";
      break;

    // WHITE
    case "":
      borderColor = "black";
      color = "black";
      backgroundColor = "white";
      break;

    // DARK GREEN
    case "":
      borderColor = "darkgreen";
      color = "darkgreen";
      backgroundColor = "#a3dea3";
      break;

    // CYAN
    case "":
      borderColor = "#007474";
      color = "#007474";
      backgroundColor = "cyan";
      break;

    // YELLOW
    case "":
      borderColor = "##989800";
      color = "##989800";
      backgroundColor = "yellow";
      break;

    // GREY
    case "":
    default:
      borderColor = "#BDBDBD";
      color = "#797979";
      backgroundColor = "#D8D7D7";
      break;
  }

  return (
    <Chip
      className={props?.className}
      label={tagText ?? t("NO_DATA")}
      variant="outlined"
      style={{
        color,
        backgroundColor,
        borderColor,
        width: "fit-content",
        height: "fit-content",
      }}
    />
  );
};
