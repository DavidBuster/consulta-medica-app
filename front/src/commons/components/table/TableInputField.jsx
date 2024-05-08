import React from "react";
import { IconButton, TextField } from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";

import { useTranslation } from "react-i18next";
// import { TextField } from '@material-ui/core'

export const TableInputField = ({
  placeholder,
  value,
  setValue = () => {},
  autoFocus = false,
  handleEnter = null,
  timeOutRef,
  setTableFlag,
}) => {
  const { t } = useTranslation("tableComponent");

  const handleEnterSearch = () => {
    if (timeOutRef) clearTimeout(timeOutRef.current);
    if (setTableFlag) setTableFlag((currentFlag) => !currentFlag);
  };

  return (
    <TextField
      placeholder={`${t("ENTER")} ${placeholder.toLowerCase()}`}
      variant="outlined"
      label={placeholder}
      fullWidth
      value={value}
      autoFocus={autoFocus}
      onChange={(event) => setValue(event.target.value)}
      onKeyPress={(e) => {
        if (e.key === "Enter") {
          if (handleEnter !== null) handleEnter();
          else handleEnterSearch();
        }
      }}
      style={{ backgroundColor: "white", minWidth: "170px" }}
      InputProps={{
        endAdornment: (
          <IconButton
            sx={{ visibility: value ? "visible" : "hidden" }}
            onClick={() => {
              setValue("");
            }}
          >
            <ClearIcon />
          </IconButton>
        ),
      }}
    />
  );
};
