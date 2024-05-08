import React, { useEffect, useState } from "react";

import axios from "axios";

// import Button from '@material-ui/core/Button'
// import Typography from '@material-ui/core/Typography'
// import IconButton from '@material-ui/core/IconButton'
// import Tooltip from '@material-ui/core/Tooltip'
import DeleteIcon from "@mui/icons-material/Delete";
import PublishIcon from "@mui/icons-material/Publish";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import { useTranslation } from "react-i18next";
import {
  Box,
  Button,
  IconButton,
  Modal,
  Tooltip,
  Typography,
} from "@mui/material";
import { Loading, Notify } from "notiflix";

import en from "./i18n/en";
import es from "./i18n/es";
import i18n from "../../../i18n";
import { InformationCard } from "../informationCard/InformationCard";

i18n.addResourceBundle("en", "uploadButton", en);
i18n.addResourceBundle("es", "uploadButton", es);

export function UploadButton(props) {
  const { loadInfo, side = "side", url, ...rest } = props;
  const { t } = useTranslation("uploadButton");
  const [uploadedFile, setUploadedFile] = useState();
  const [previewFile, setPreviewFile] = useState();
  const [isPreviewFilePdf, setIsPreviewFilePdf] = useState(false);
  const [closeModalError, setCloseModalError] = useState(false);
  const [error, setError] = useState(false);
  const URL_BASE = import.meta.env.VITE_APP_API_URL;

  useEffect(() => {
    if (uploadedFile) {
      Loading.remove();
    }
  }, [uploadedFile]);

  const previewFileFront = (event) => {
    const file = event.target.files[0];
    handleFile(file);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    handleFile(file);
  };

  const handleFile = (file) => {
    const fileMaxMbSize = 10;
    const fileMaxBSize = fileMaxMbSize * Math.pow(1024, 2);
    setError(file.size >= fileMaxBSize);
    if (file.size < fileMaxBSize) {
      setUploadedFile(file);
      setPreviewFile(URL.createObjectURL(file));
      if (file.type === "application/pdf") {
        setIsPreviewFilePdf(true);
      } else {
        setIsPreviewFilePdf(false);
      }
    }
  };

  const uploadImages = async () => {
    const formData = new FormData();
    formData.append("files", uploadedFile);

    Loading.circle();

    axios({
      method: "post",
      url: `${URL_BASE}/${url}`,
      data: formData,
      headers: {
        Authorization: `Bearer ${localStorage.getItem(
          import.meta.env.VITE_APP_LOCAL_STORAGE_TOKEN_KEY
        )}`,
      },
    })
      .then(() => {
        Notify.success(t("IMAGE_UPLOADED_SUCCESFULLY"));
        setUploadedFile();
        setPreviewFile();
        setCloseModalError(false);
        if (loadInfo) loadInfo();
      })
      .finally(() => Loading.remove());
  };

  return (
    <>
      <div
        {...rest}
        style={{
          width: "100%",
          height: "160px",
          textAlign: "center",
          border: `1px solid ${error ? "red" : "silver"}`,
          borderRadius:
            uploadedFile && !previewFile ? "8px 8px 0px 0px" : "8px",
        }}
        onDragOver={(ev) => ev.preventDefault()}
        onDrop={handleDrop}
      >
        <input
          accept="image/*, application/pdf"
          style={{ display: "none" }}
          id={`${side}1`}
          type="file"
          onChange={previewFileFront}
        />
        <label htmlFor={`${side}1`}>
          <Button
            style={{ position: "relative", top: "40px" }}
            component="span"
            className="primary"
            startIcon={<PhotoCameraIcon />}
          >
            {t("UPLOAD_IMAGE")}
          </Button>
        </label>
        <Typography
          style={{
            fontSize: "15px",
            color: error ? "red" : "silver",
            position: "relative",
            top: "50px",
          }}
        >
          {t("OR_DRAG_AND_DROP_HERE")}
        </Typography>
      </div>
      {error && (
        <Typography
          style={{
            fontSize: "15px",
            color: "red",
            marginTop: "-1.6rem",
          }}
        >
          {t("IMAGE_TOO_LARGE")}
        </Typography>
      )}

      <Modal
        open={previewFile !== undefined}
        // onClose={() => setCloseModalError(true)}
        onClose={() => setPreviewFile()}
      >
        <InformationCard modal title={t("IMAGE_PREVIEW")}>
          <div
            style={{
              position: "relative",
              borderRadius: "8px",
              overflow: "hidden",
              display: "flex",
              justifyContent: "center",
              width: "fit-content",
              minWidth: "500px",
              height: isPreviewFilePdf ? "737px" : "",
            }}
          >
            {isPreviewFilePdf ? (
              <object
                data={previewFile}
                type="application/pdf"
                width="100%"
              ></object>
            ) : (
              <img src={previewFile} style={{ objectFit: "contain" }} />
            )}
            <div
              style={{
                height: "68px",
                width: "100%",
                position: "absolute",
                bottom: "0",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                color: "white",
                padding: "16px",
              }}
            >
              <div className="flex flex-col" style={{ zIndex: "999" }}>
                {t("PREVIEW")}
              </div>
              <div style={{ zIndex: "999" }}>
                <Tooltip
                  title={<Typography>{t("DISCARD")}</Typography>}
                  placement="bottom"
                >
                  <IconButton
                    onClick={() => {
                      setCloseModalError(false);
                      setPreviewFile();
                      setUploadedFile();
                      document.getElementById(`${side}1`).value = "";
                    }}
                  >
                    <DeleteIcon
                      style={{
                        color: closeModalError ? "red" : "white",
                      }}
                    />
                  </IconButton>
                </Tooltip>
                <Tooltip
                  title={<Typography>{t("UPLOAD_TO_SERVER")}</Typography>}
                  placement="bottom"
                >
                  <IconButton onClick={() => uploadImages()}>
                    <PublishIcon
                      style={{
                        color: closeModalError ? "red" : "white",
                      }}
                    />
                  </IconButton>
                </Tooltip>
              </div>
              <div
                style={{
                  height: "100%",
                  width: "100%",
                  backgroundColor: "rgba(0,0,0,0.5)",
                  position: "absolute",
                  left: "50%",
                  transform: "translateX(-50%)",
                }}
              />
            </div>
          </div>
        </InformationCard>
      </Modal>
    </>
  );
}
