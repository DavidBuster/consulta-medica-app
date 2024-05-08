import React from "react";

import { useTranslation } from "react-i18next";
import EditIcon from "@mui/icons-material/Edit";
import { useState } from "react";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import {
  Icon,
  IconButton,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { ColorTag } from "../ColorTag/ColorTag";
import useClipBoardApi from "../../hooks/useClipBoardApi";
import en from "./i18n/en";
import es from "./i18n/es";
import i18n from "../../../i18n";
import "./InformationField.scss";
import { RoundedNumber } from "../roundedNumber/RoundedNumber";

i18n.addResourceBundle("en", "informationField", en);
i18n.addResourceBundle("es", "informationField", es);

export const InformationField = (props) => {
  const {
    field,
    handleChangeEditInfo = () => {},
    handleSaveInfo,
    whiteText,
    screeningInfo,
    isEditing,
    className,
    ...rest
  } = props;

  let {
    title,
    icon = "bookmark",
    value,
    editingFields,
    isCopyable,
    type = "",
  } = field;

  const { t } = useTranslation("informationField");

  const [isCopied, handleCopyClick] = useClipBoardApi();

  if (!Array.isArray(value)) value = [value];

  if (editingFields && !Array.isArray(editingFields))
    editingFields = [editingFields];

  const editingMultiLine = editingFields && editingFields.length > 1;

  const renderValue = (val) => {
    if (
      (typeof val === "undefined" || val === "") &&
      value.length > 1 &&
      !value.every((value) => typeof value === "undefined" || value === "")
    )
      return;
    switch (type) {
      case "booleanTag":
        return <ColorTag tag={val ? "YES" : "NO"} />;

      default:
        return (
          <Typography
            component={"span"}
            style={{
              marginLeft: screeningInfo ? "2.3rem" : "none",
              color: whiteText
                ? "rgb(250, 250, 250)"
                : val
                ? "rgba(0, 0, 0, 0.87)"
                : "rgb(170, 170, 170)",
              width: "100%",
            }}
          >
            {/* <RoundedNumber
              value={val}
              decimals={2}
              // unit={currencyStyle?.name}
            /> */}
            {val ?? t("FIELD_UNFILLED")}

            {isCopyable && val && (
              <Tooltip
                title={
                  <Typography>{isCopied ? t("COPIED") : t("COPY")}</Typography>
                }
              >
                <IconButton
                  style={{
                    marginLeft: "8px",
                    color: "var(--color-primary)",
                  }}
                  onClick={() => handleCopyClick(val)}
                >
                  <ContentCopyIcon
                    sx={{
                      fontSize: "2rem",
                    }}
                  />
                </IconButton>
              </Tooltip>
            )}
          </Typography>
        );
    }
  };

  return (
    <div {...rest} className={`informationField ${className}`}>
      <div className="informationFieldTitle">
        <div className="informationFieldIcon">{icon}</div>
        <strong>{title}</strong>
        {/* {editingFields &&
          (!isEditing ? (
            <Tooltip
              title={
                <Typography>{`${t("EDIT")} ${title.toLowerCase()}`}</Typography>
              }
            >
              <IconButton
                style={{
                  color: "var(--color-primary)",
                  marginTop: "-8px",
                }}
                onClick={() => setIsEditing(true)}
              >
                <EditIcon
                  sx={{
                    fontSize: "2rem",
                  }}
                />
              </IconButton>
            </Tooltip>
          ) : (
            <>
              {handleSaveInfo && (
                <Tooltip
                  title={<Typography>{t("SAVE")}</Typography>}
                  style={{ marginRight: "8px" }}
                >
                  <IconButton
                    style={{
                      color: "green",
                      marginTop: "-8px",
                    }}
                    onClick={() => {
                      console.log("SAVE");
                      setIsEditing(false);
                      handleSaveInfo();
                    }}
                  >
                    <CheckIcon
                      sx={{
                        fontSize: "2rem",
                      }}
                    />
                  </IconButton>
                </Tooltip>
              )}
              <Tooltip
                title={<Typography>{t("EXIT_EDITING_MODE")}</Typography>}
              >
                <IconButton
                  style={{
                    color: "red",
                    marginTop: "-8px",
                  }}
                  onClick={() => setIsEditing(false)}
                >
                  <CloseIcon
                    sx={{
                      fontSize: "2rem",
                    }}
                  />
                </IconButton>
              </Tooltip>
            </>
          ))} */}
      </div>
      <div className="informationFieldValue">
        {editingFields && isEditing ? (
          <div className="flex flex-col mt-10">
            {editingFields.map((field, ind) => {
              return (
                <div key={ind}>
                  {field.render ?? (
                    <TextField
                      defaultValue={field.defaultValue}
                      onChange={handleChangeEditInfo}
                      name={field.name}
                      type={field.type}
                      variant="outlined"
                      className="w-full mb-10"
                      label={editingMultiLine ? field.label : ""}
                    />
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          value.map((val, ind) => (
            <div key={ind} className="informationFieldValueRow">
              {renderValue(val)}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
