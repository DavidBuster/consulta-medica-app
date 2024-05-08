import React from "react";
import "./NavBarTop.scss";
import { LangSwitcher } from "../../../commons/components/langSwitcher/LangSwitcher";
import { IconButton, Tooltip } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import en from "../navBarLateral/i18n/en";
import es from "../navBarLateral/i18n/es";
import i18n from "../../../i18n";

export const NavBarTop = () => {
  const { t } = useTranslation("navBarLateral");

  i18n.addResourceBundle("en", "navBarLateral", en);
  i18n.addResourceBundle("es", "navBarLateral", es);
  const navigate = useNavigate();

  return (
    <div className="navBarTop">
      <LangSwitcher />
      <Tooltip title={t("LOGOUT")}>
        <IconButton onClick={() => navigate("/login")}>
          <LogoutIcon />
        </IconButton>
      </Tooltip>
    </div>
  );
};
