import React, { useState } from "react";
import "./KycImageList.css";
import { KycImage } from "../KycImage/KycImage";
// import { UploadButton } from "app/main/uploadButton/UploadButton";
// import { Button } from "@material-ui/core";
import { useTranslation } from "react-i18next";
import i18next from "i18next";
import en from "./i18n/en";
import es from "./i18n/es";
import { NoImagesInDatabaseBox } from "../NoImagesInDatabaseBox/NoImagesInDatabaseBox";
import { ToggleButtonGroup, ToggleButton, Button } from "@mui/material";
import { useEffect } from "react";
import { UploadButton } from "../uploadButton/UploadButton";

i18next.addResourceBundle("en", "kycImageList", en);
i18next.addResourceBundle("es", "kycImageList", es);

const ImageBlock = ({ imgs, label, savedUser, side }) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  return (
    <>
      <div>
        {imgs.length > 1 && (
          <div className="kycContainer">
            {imgs.map((img, index) => (
              <div
                key={img.name}
                className={
                  index === selectedImageIndex
                    ? "selectedImage"
                    : "notSelectedImage"
                }
                onClick={() => setSelectedImageIndex(index)}
              >
                {img.name.includes(".pdf") ? (
                  <>
                    <object
                      data={`data:application/pdf;base64,${img.data}`}
                      type="application/pdf"
                      style={{
                        objectFit: "cover",
                        height: "100%",
                        width: "100%",
                      }}
                    ></object>
                    {index !== selectedImageIndex && (
                      <div
                        onClick={() => setSelectedImageIndex(index)}
                        style={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          width: "100%",
                          height: "100%",
                        }}
                      />
                    )}
                  </>
                ) : (
                  <img
                    src={`data:image/jpeg;base64,${img.data}`}
                    style={{
                      objectFit: "cover",
                      height: "auto",
                      width: "auto",
                      maxHeight: "100%",
                      maxWidth: "100%",
                    }}
                  />
                )}
              </div>
            ))}
          </div>
        )}
        {imgs.length > 0 ? (
          <KycImage
            img={imgs?.[selectedImageIndex]}
            savedUser={savedUser}
            side={side}
            hasMultiple={imgs?.length > 1}
            label={label}
          />
        ) : (
          <NoImagesInDatabaseBox />
        )}
      </div>
    </>
  );
};

export const KycImageList = ({
  images,
  savedUser,
  loadUser,
  side,
  upload = true,
  label,
  uploadUrl,
}) => {
  const { t } = useTranslation("kycImageList");
  const [displayType, setDisplayType] = useState("CARROUSEL");
  const [totalBlocks, setTotalBlocks] = useState(1);
  const [imagess, setImagess] = useState([]);
  const imagesPerBlock = 10;

  useEffect(() => {
    if (images !== undefined) setImagess(images);
  }, [images]);

  return (
    <>
      {imagess.length > 1 && (
        <ToggleButtonGroup
          value={displayType}
          exclusive
          style={{ alignSelf: "center" }}
          onChange={(e) => setDisplayType(e.target.value)}
        >
          <ToggleButton value={"CARROUSEL"}>{t("CARROUSEL")}</ToggleButton>
          <ToggleButton value={"LIST"}>{t("LIST")}</ToggleButton>
        </ToggleButtonGroup>
      )}
      {displayType === "CARROUSEL" ? (
        <>
          {Array.from({ length: totalBlocks }, (_, index) => index).map(
            (ind) => (
              <ImageBlock
                key={ind}
                imgs={imagess
                  .slice()
                  .reverse()
                  .slice(ind * imagesPerBlock, (ind + 1) * imagesPerBlock)}
                label={label}
                savedUser={savedUser}
                side={side}
              />
            )
          )}
          {imagess.length > totalBlocks * imagesPerBlock && (
            <Button
              variant="contained"
              color="secondary"
              onClick={() => setTotalBlocks(totalBlocks + 1)}
            >
              {t("SHOW_MORE")}
            </Button>
          )}
        </>
      ) : (
        <div className="flex flex-col" style={{ gap: "1.6rem" }}>
          {imagess.length > 0 ? (
            imagess.map((img) => (
              <KycImage
                img={img}
                savedUser={savedUser}
                hasMultiple={false}
                side={side}
              />
            ))
          ) : (
            <NoImagesInDatabaseBox />
          )}
        </div>
      )}
      {upload && (
        <UploadButton
          savedUser={savedUser}
          loadInfo={loadUser}
          side={side}
          url={uploadUrl}
        />
      )}
    </>
  );
};
