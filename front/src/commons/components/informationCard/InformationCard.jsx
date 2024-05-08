import React from "react";
import CloseIcon from "@mui/icons-material/Close";
import "./InformationCard.scss";
import { IconButton, Typography } from "@mui/material";

export const InformationCard = (props) => {
  const { title, children, setOpen, modal, className, headerButtons, ...rest } =
    props;

  return (
    <div
      {...rest}
      className="informationCard"
      style={{
        ...(modal && {
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          maxHeight: "90%",
          maxWidth: "90%",
        }),
        ...props.style,
      }}
    >
      <div className="contentHeaderModal">
        <Typography variant="subtitle1">{title}</Typography>
        {headerButtons}
        {setOpen && (
          <IconButton onClick={() => setOpen(false)}>
            <CloseIcon style={{ color: "white" }} />
          </IconButton>
        )}
      </div>
      <div
        className={`flex flex-col h-full ${className ?? ""}`}
        style={{
          gap: "1.6rem",
          overflow: props?.style?.overflow ?? "auto",
          backgroundColor: modal ? "#f6f7f9" : "white",
          padding: "16px",
        }}
      >
        {children}
      </div>
    </div>
  );
};
