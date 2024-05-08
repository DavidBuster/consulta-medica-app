import React from "react";
import SvgIcon from "@mui/material/SvgIcon";
import "./BorderedSection.css";
import { FormLabel } from "@mui/material";

function BorderedSection(props) {
  const { icon, title, children, error = false, className, style } = props;
  return (
    <div className="mainContainer" style={{ borderColor: error ? "red" : "" }}>
      <div className="header">
        <div
          className="headerBorderBefore"
          style={{ borderColor: error ? "red" : "" }}
        ></div>
        {(icon || title) && (
          <div className="headerTitle">
            {icon && <SvgIcon component={icon} />}
            {title && <span className="title">{title}</span>}
          </div>
        )}
        <div
          className="headerBorderAfter"
          style={{ borderColor: error ? "red" : "" }}
        ></div>
      </div>
      <div
        className={`childrenContainer ${className ?? ""}`}
        style={props.style}
        // style={{
        //   gap: "20px",
        //   paddingLeft: "10px",
        //   paddingRight: "10px",
        //   paddingBottom: "10px",
        // }}
      >
        {children}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        {!!error && (
          <FormLabel
            style={{
              fontSize: "0.75rem",
              color: "#d32f2f",
              marginTop: "3px",
              marginLeft: "14px",
              marginRight: "14px",
              letterSpacing: "0.03333em",
            }}
          >
            {error}
          </FormLabel>
        )}
        {/* <div
          style={{
            fontSize: "0.75rem",
            // color: "#d32f2f",
            marginTop: "3px",
            marginLeft: "auto",
            marginRight: "14px",
            letterSpacing: "0.03333em",
          }}
        >
          {title}
        </div> */}
      </div>
    </div>
  );
}

export default BorderedSection;
