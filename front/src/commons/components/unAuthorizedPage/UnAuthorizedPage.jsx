import React from "react";
import { LangSwitcher } from "../langSwitcher/LangSwitcher";

export const UnAuthorizedPage = ({ children }) => {
  return (
    <div className="flex w-full items-center justify-center">
      <div style={{ position: "fixed", bottom: "10px", right: "10px" }}>
        <LangSwitcher darkText />
      </div>

      {/* <div className="loginTopBannerContainer">
        <img
          className="logoImageHidden"
          src="/mocked/login/login_banner_left_no_bg.png"
          style={{
            position: "absolute",
            left: 0,
            height: "100%",
            maxWidth: "fit-content",
          }}
        />
        <img
          className="logoImageVis"
          src="/mocked/logos/M88Mansion_logo_big.png"
          style={{ height: "fit-content", zIndex: "9" }}
        />
        <img
          className="logoImageHidden"
          src="/mocked/login/login_banner_right_no_bg.png"
          style={{
            position: "absolute",
            right: 0,
            height: "100%",
            maxWidth: "fit-content",
          }}
        />
      </div> */}

      {children}
    </div>
  );
};
