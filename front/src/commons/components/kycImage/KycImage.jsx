import React from "react";
import { useTranslation } from "react-i18next";
import RotateLeftIcon from "@mui/icons-material/RotateLeft";
import { useState, useRef, useEffect } from "react";
import { IconButton, Tooltip } from "@mui/material";
import { capitalizeFirstLetter } from "../../functions/capitalizeFirstLetter";
import en from "./i18n/en";
import es from "./i18n/es";
import i18n from "../../../i18n";

i18n.addResourceBundle("en", "kycImage", en);
i18n.addResourceBundle("es", "kycImage", es);

export const KycImage = (props) => {
  const { img, savedUser, side, hasMultiple, label } = props;
  const { t } = useTranslation("kycImage");
  const [rotation, setRotation] = useState(0);
  const imageRef = useRef(null);
  const fatherRef = useRef(null);
  const [fatherWidth, setFatherWidth] = useState(0);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const textLabel = side;
  // label ||
  // (side &&
  //   (side === "SELFIE"
  //     ? "Selfie"
  //     : `${t(savedUser?.docType)} - ${capitalizeFirstLetter(side)}`)) ||
  // t(savedUser?.docType);
  const isRotated = rotation % 180 === -90;

  const isPdf = img?.name?.includes(".pdf");

  useEffect(() => {
    const element = imageRef.current;
    const fatherElement = fatherRef.current;

    const handleImageLoad = (el) => {
      const height = el.offsetHeight;
      const width = el.offsetWidth;

      if (height === 0 || width === 0)
        setTimeout(() => handleImageLoad(el), 200);
      else setDimensions({ width: width, height: height });
    };

    const handleImageLoadFather = (el) => {
      setTimeout(() => {
        const width = el.offsetWidth;
        setFatherWidth(width);
      }, 200);
    };

    if (element) {
      element.addEventListener("load", handleImageLoad(element));
    }

    if (fatherElement) {
      fatherElement.addEventListener(
        "load",
        handleImageLoadFather(fatherElement)
      );
    }

    return () => {
      if (element) {
        element.removeEventListener("load", handleImageLoad(element));
      }
      if (fatherElement) {
        fatherElement.removeEventListener(
          "load",
          handleImageLoadFather(fatherElement)
        );
      }
    };
  }, [img]);

  return (
    <div
      ref={fatherRef}
      style={{
        width: "100%",
        position: "relative",
        borderRadius: "8px",
        borderTopLeftRadius: hasMultiple ? "0px" : "8px",
        borderTopRightRadius: hasMultiple ? "0px" : "8px",
        overflow: "hidden",
        maxWidth: "100%",
        maxHeight: isPdf
          ? ""
          : `${Math.max(dimensions.width, dimensions.height)}px`,
        height: isPdf ? "" : isRotated ? dimensions.width : dimensions.height,
        backgroundColor: "rgb(240,240,240)",
        zIndex: "999",
      }}
    >
      {isPdf ? (
        <object
          data={`data:application/pdf;base64,${img.data}`}
          ref={imageRef}
          type="application/pdf"
          width="100%"
          style={{
            height: `calc(calc(${dimensions.width}px * 1.2194) + 124px)`,
          }}
        ></object>
      ) : (
        // <Tooltip title={t("OPEN_IMAGE_IN_NEW_TAB")}>
        <img
          ref={imageRef}
          src={`data:image/jpeg;base64,${img.data}`}
          style={{
            maxHeight: isRotated ? fatherWidth : "600px",
            maxWidth: isRotated ? dimensions.width : "",
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: `translate(-50%,-50%) rotate(${rotation}deg)`,
            // cursor: "pointer",
          }}
          // onClick={() =>
          //   window.open(`data:image/jpeg;base64,${img.data}`, "_blank")
          // }
        />
        // </Tooltip>
      )}

      <div
        style={{
          height: "68px",
          width: "100%",
          position: isPdf ? "" : "absolute",
          bottom: isPdf ? "-68px" : "0",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          color: "white",
          padding: "16px",
        }}
      >
        <div style={{ zIndex: "999" }}>{textLabel}</div>
        <div style={{ zIndex: "999", minWidth: "fit-content" }}>
          {!isPdf && (
            <Tooltip title={t("ROTATE")} placement="bottom">
              <IconButton onClick={() => setRotation(rotation - 90)}>
                <RotateLeftIcon style={{ color: "white" }} />
              </IconButton>
            </Tooltip>
          )}
        </div>
        <div
          style={{
            height: isPdf ? "68px" : "100%",
            width: isRotated ? dimensions.height : dimensions.width,
            backgroundColor: "rgba(0,0,0,0.5)",
            position: "absolute",
            left: "50%",
            transform: "translateX(-50%)",
          }}
        />
      </div>

      <div
        style={{
          height: "68px",
          width: "100%",
          backgroundColor: "#192d3e",
          position: "absolute",
          bottom: isPdf ? "-68px" : "0",
          zIndex: isPdf ? "" : "-9",
          borderRadius: "0px 0px 8px 8px",
        }}
      />
    </div>
  );
};
