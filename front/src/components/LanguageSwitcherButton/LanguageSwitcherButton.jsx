import React, { useState } from "react";
import {
  Button,
  Popover,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import { useTranslation } from "react-i18next";

const LanguageSwitcher = () => {
  const { i18n } = useTranslation(); // Acceso a i18n
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng); // Cambia el idioma
    handleClose(); // Cierra el popover
  };

  const languages = [
    { code: "en", name: "English" },
    { code: "es", name: "Español" },
  ];

  return (
    <div>
      {/* Botón para abrir el popover */}
      <Button variant="contained" onClick={handleClick}>
        Cambiar Idioma
      </Button>

      {/* Popover para mostrar los idiomas */}
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        <List>
          {languages.map((lang) => (
            <ListItem key={lang.code} disablePadding>
              <ListItemButton onClick={() => changeLanguage(lang.code)}>
                <ListItemText primary={lang.name} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Popover>
    </div>
  );
};

export default LanguageSwitcher;
