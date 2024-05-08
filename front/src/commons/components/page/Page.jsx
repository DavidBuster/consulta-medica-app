import React from "react";
import "./Page.scss";
// import { useTranslation } from "react-i18next";
// import { Divider } from "@mui/material";
// import { useLocation } from "react-router-dom";

export const Page = ({ children, className, ...rest }) => {
  // const { t } = useTranslation("navBarLateral");
  // const location = useLocation();
  // const pageTitle = location.pathname
  //   .split("/")
  //   .map((el) => t(el.toUpperCase()))
  //   .join(" - ");
  // console.log("pageTitle", pageTitle);
  return (
    <div className={`page ${className ?? ""}`} {...rest}>
      {/* <div>{pageTitle}</div>
      <Divider className="w-full mb-16" /> */}
      {children}
    </div>
  );
};
