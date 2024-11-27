import React from "react";
import { Tooltip, Box } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useNavigate, useLocation } from "react-router-dom";

const LanguageSwitcher = () => {
  const { i18n, t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng); // Cambiar idioma en i18n
    const currentPath = location.pathname.split("/").slice(2).join("/"); // Ruta sin idioma actual
    navigate(`/${lng}/${currentPath || "home"}`); // Redirigir al idioma seleccionado
  };

  // Definimos los idiomas en un objeto propio
  const languages = [
    { code: "en", name: "English", flag: "https://flagcdn.com/w40/gb.png" },
    { code: "es", name: "Español", flag: "https://flagcdn.com/w40/es.png" },
    { code: "nl", name: "Nederlands", flag: "https://flagcdn.com/w40/nl.png" },
  ];

  // Filtrar para excluir el idioma actual
  const availableLanguages = languages.filter(
    (lang) => lang.code !== i18n.language
  );

  return (
    <Box display="flex" justifyContent="center" gap={2}>
      {availableLanguages.map((lang) => (
        <Tooltip key={lang.code} title={lang.name} arrow>
          <img
            src={lang.flag} // URL de la bandera
            alt={lang.name}
            onClick={() => changeLanguage(lang.code)} // Cambiar idioma al hacer clic
            style={{
              cursor: "pointer",
              width: 40,
              height: 28,
              borderRadius: "4px",
            }}
          />
        </Tooltip>
      ))}
    </Box>
  );
};

export default LanguageSwitcher;
