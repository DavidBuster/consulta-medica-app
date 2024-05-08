import React, { useEffect, useState } from "react";
import "./NavBarLateral.scss";
import { useTranslation } from "react-i18next";
import { Link, useLocation } from "react-router-dom";
import i18n from "../../../i18n";
import en from "./i18n/en";
import es from "./i18n/es";
import { routesDict } from "../../../app/routes";
import { IconButton, Tooltip } from "@mui/material";
import FileDownloadRoundedIcon from "@mui/icons-material/FileDownloadRounded";

i18n.addResourceBundle("en", "navBarLateral", en);
i18n.addResourceBundle("es", "navBarLateral", es);

export const NavBarLateral = () => {
  const { t } = useTranslation("navBarLateral");
  const location = useLocation();
  const actualPage = location.pathname.split("/")[1];
  const [showNavBar, setShowNavBar] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 1200) {
        setShowNavBar(true);
      } else {
        setShowNavBar(false);
      }
    };

    handleResize(); // Call it initially

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []); // Empty dependency array to run only once on component mount

  return (
    <>
      <div className={`navBarLateral ${showNavBar ? "" : "hidden"}`}>
        <div className="hideNavBarContainer">
          <Tooltip title={t(showNavBar ? "HIDE_NAVBAR" : "SHOW_NAVBAR")}>
            <IconButton onClick={() => setShowNavBar((curr) => !curr)}>
              <FileDownloadRoundedIcon
              // style={{ transform: `rotate(${showNavBar ? "90" : "270"}deg)` }}
              />
            </IconButton>
          </Tooltip>
        </div>
        <div className="logoContainer">
          <img
            className="logo"
            src={`/assets/images/logos/${
              showNavBar ? "SaurusNavbar.png" : "SC_white.png"
            }`}
          />
        </div>
        <div className="navBarLateralButtonsContainer">
          {Object.entries(routesDict)
            .filter(([key]) => key !== "")
            .map(([block, routes]) => (
              <div key={block}>
                <Tooltip title={showNavBar ? "" : t(block)}>
                  <div className="blockText">
                    {showNavBar ? t(block) : t(block).charAt(0)}
                  </div>
                </Tooltip>
                {routes.map((route) => (
                  <Tooltip
                    key={route.path}
                    title={showNavBar ? "" : t(route.path)}
                  >
                    <Link
                      to={route.path}
                      className={`link ${
                        `/${actualPage}` === route.path ? "active" : ""
                      }`}
                      style={{
                        display: "flex",
                        gap: "var(--length-small-3)",
                      }}
                    >
                      <div className="linkIcon">{route.icon}</div>
                      <div className="linkText">{t(route.path)}</div>
                    </Link>
                  </Tooltip>
                ))}
              </div>
            ))}
        </div>
      </div>
      <div className={`darkEffect ${showNavBar ? "" : "hidden"}`} />
    </>
  );
};
