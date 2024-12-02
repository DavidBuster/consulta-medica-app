import { Link, Outlet, useLocation } from "react-router-dom";
import { Tabs, Tab, Box, Paper } from "@mui/material";
import LanguageSwitcher from "../../components/LanguageSwitcherButton/LanguageSwitcherButton";
import "./App.css";

import es from "./i18n/es.json";
import en from "./i18n/en.json";
import nl from "./i18n/nl.json";
import i18n from "../../i18n";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";

if (!i18n.hasResourceBundle("es", "app")) {
  i18n.addResourceBundle("es", "app", es, true, true);
  i18n.addResourceBundle("en", "app", en, true, true);
  i18n.addResourceBundle("nl", "app", nl, true, true);
  // i18n.reloadResources("es", "error"); // Fuerza la recarga del namespace
}

const App = () => {
  const { t, i18n } = useTranslation("app");
  const location = useLocation();

  // Extraer el idioma del path
  const currentLang = location.pathname.split("/")[1]; // 'en', 'es', etc.

  useEffect(() => {
    const availableLanguages = i18n.options.supportedLngs.filter(
      (language) => language !== "cimode"
    );
    console.log(
      "currentLang",
      currentLang,
      "availableLanguages",
      availableLanguages
    );
    console.log("i18n", i18n);
    if (availableLanguages.includes(currentLang)) {
      console.log("currentLang 2222222222222", currentLang);
      i18n.changeLanguage(currentLang); // Cambia el idioma en i18n
    }
  }, [location]);

  // Quitar el idioma del path para obtener la ruta base
  const normalizedPath = location.pathname.replace(`/${currentLang}`, "");

  // Define las rutas y sus nombres
  const routes = [
    { path: "/home", label: "home" },
    { path: "/news", label: "news" },
  ];

  return (
    <div className="app">
      <Paper className="appBox">
        <div className="header">
          <div>
            <img
              src="https://www.w3schools.com/images/w3schools_green.jpg"
              alt="W3Schools.com"
            />
            <div>DR FRA</div>
          </div>
          <LanguageSwitcher />
        </div>
        <div className="tabs">
          <Tabs value={normalizedPath}>
            {routes.map((route) => (
              <Tab
                key={route.path}
                label={t(route.label)}
                value={route.path}
                component={Link}
                to={`/${currentLang}${route.path}`}
                // to={route.path}
              />
            ))}
          </Tabs>
        </div>
        <div className="pageTitle">
          {t(routes.find((route) => normalizedPath == route.path)?.label)}
        </div>

        <div className="contentDiv">
          <div className="outletDiv">
            <Outlet />
          </div>
          <div className="lateralBar">
            <div className="lateralDiv">
              <div className="lateralTitle">{t("emergency")}</div>
              <div className="lateralTitle">
                (0034) 608 68 83 38
                <br />
                {t("only_emergencies")}
              </div>
            </div>

            <div className="lateralDiv">
              <div className="lateralTitle">{t("phone_numbers")}</div>
              <div className="lateralTitle">
                Torremolinos: (0034) 608 68 83 38
                <br />
                Fuengirola: (0034) 608 68 83 38
                <br />
                {t("available_from")}
              </div>
            </div>
            <div className="lateralDiv">
              <div className="lateralTitle">{t("open_hours")}</div>
              <div className="lateralTitle">
                (0034) 608 68 83 38
                <br />
                {t("only_emergencies")}
              </div>
            </div>
          </div>
        </div>

        <div className="footer">FOOTER</div>
      </Paper>
    </div>
  );
};

export default App;
