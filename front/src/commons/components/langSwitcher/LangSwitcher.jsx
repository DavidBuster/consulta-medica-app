import React, { useEffect, useState } from "react";
import i18n from "../../../i18n";
import {
  Button,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Popover,
  Typography,
} from "@mui/material";

const languages = [
  {
    id: "es",
    title: "Español",
    flag: "es",
  },
  {
    id: "en",
    title: "English",
    flag: "en",
  },
];

export const LangSwitcher = ({ darkText, hideText }) => {
  const [currentLanguage, setCurrentLanguage] = useState(languages[0]);

  const [menu, setMenu] = useState(null);

  const langMenuClick = (event) => {
    setMenu(event.currentTarget);
  };

  const langMenuClose = () => {
    setMenu(null);
  };

  function handleLanguageChange(lng) {
    i18n.changeLanguage(lng.id);
    langMenuClose();
  }

  useEffect(() => {
    const updatedLanguage = languages.find((lng) => lng.id === i18n.language);
    setCurrentLanguage(updatedLanguage || languages[0]);
  }, [i18n.language]);

  return (
    <>
      <Button onClick={langMenuClick} style={{ width: "fit-content" }}>
        <img
          className="mx-4"
          src={`/assets/images/flags/${currentLanguage.flag}.png`}
          alt={currentLanguage.title}
        />

        {!hideText && (
          <Typography
            className="mx-4"
            style={{
              color: darkText
                ? "var(--color-primary)"
                : "var(--color-background)",
            }}
          >
            {currentLanguage.title}
          </Typography>
        )}
      </Button>

      <Popover
        open={Boolean(menu)}
        anchorEl={menu}
        onClose={langMenuClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        classes={{
          paper: "py-4",
        }}
      >
        {languages
          .sort((a, b) => {
            const textA = a.title;
            const textB = b.title;
            return textA < textB ? -1 : textA > textB ? 1 : 0;
          })
          .map((lng) => (
            <MenuItem key={lng.id} onClick={() => handleLanguageChange(lng)}>
              <ListItemIcon className="min-w-40">
                <img
                  // className="min-w-20"
                  src={`/assets/images/flags/${lng.flag}.png`}
                  alt={lng.title}
                />
              </ListItemIcon>
              <ListItemText primary={lng.title} />
            </MenuItem>
          ))}
      </Popover>
    </>
  );
};
