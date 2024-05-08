import {
  Box,
  Button,
  Card,
  CircularProgress,
  Divider,
  MenuItem,
  Modal,
  Pagination,
  TextField,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { crowdServices } from "../../../../../app/services/CrowdServices";
import "./Announcements.scss";
import { Announcement } from "./announcement/Announcement";

import en from "./i18n/en";
import es from "./i18n/es";
import i18n from "../../../../../i18n";

i18n.addResourceBundle("en", "announcements", en);
i18n.addResourceBundle("es", "announcements", es);

export const Announcements = () => {
  const { t } = useTranslation("announcements");
  const [data, setData] = useState([]);
  const totalResults = data.length;
  const [loadingData, setLoadingData] = useState(false);
  const [page, setPage] = useState(1);
  const [resultsPerPage, setResultsPerPage] = useState(10);
  const [publishNewAnnouncement, setPublishNewAnnouncement] = useState(false);

  useEffect(() => {
    getBulletinData();
  }, []);

  const getBulletinData = () => {
    if (publishNewAnnouncement) setPublishNewAnnouncement(false);
    setLoadingData(true);
    crowdServices
      .getBulletinData()
      .then((response) => {
        // Reverse to show latest announcements first
        setData(response.data.reverse());
      })
      .finally(() => setLoadingData(false));
  };

  if (loadingData)
    return (
      <div
        className="flex items-center justify-center"
        style={{ height: "100%" }}
      >
        <CircularProgress />
        {t("LOADING_ANNOUNCEMENTS")}
      </div>
    );

  return (
    <>
      <div className="flex flex-col" style={{ gap: "var(--length-medium-2)" }}>
        <div
          className="flex items-center"
          style={{
            gap: "var(--length-medium-2)",
            justifyContent: "space-between",
          }}
        >
          <Button
            className="primary"
            onClick={() => setPublishNewAnnouncement(true)}
          >
            {t("PUBLISH_NEW_ANNOUNCEMENT")}
          </Button>

          <Modal
            open={publishNewAnnouncement}
            onClose={() => setPublishNewAnnouncement(false)}
          >
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                maxHeight: "90%",
                maxWidth: "90%",
              }}
            >
              <Announcement
                newAnnouncement
                setOpenModal={setPublishNewAnnouncement}
                reloadAnnouncements={getBulletinData}
              />
            </div>
          </Modal>
          <div
            className="flex items-center"
            style={{ gap: "var(--length-medium-2)" }}
          >
            <div>{t("RESULTS_PER_PAGE")}:</div>
            <TextField
              style={{ backgroundColor: "white" }}
              variant="outlined"
              select
              value={resultsPerPage}
              onChange={(event) => {
                setResultsPerPage(parseInt(event.target.value));
                setPage(1);
              }}
            >
              {[5, 10, 25].map((val, index) => (
                <MenuItem key={index} value={val}>
                  {val}
                </MenuItem>
              ))}
            </TextField>
            <div>
              {Math.min((page - 1) * resultsPerPage + 1, totalResults)}-
              {Math.min(page * resultsPerPage, totalResults)} {t("OF")}{" "}
              {totalResults}
            </div>
            <Pagination
              count={
                Math.floor(totalResults / resultsPerPage) +
                (totalResults % resultsPerPage !== 0 ? 1 : 0)
              }
              showFirstButton
              showLastButton
              page={page}
              onChange={(_, value) => {
                setPage(value);
              }}
            />
          </div>
        </div>
        <div className="announcementsContainer">
          {data
            .filter(
              (_, ind) =>
                ind >= (page - 1) * resultsPerPage &&
                page * resultsPerPage > ind
            )
            .map((announcement) => (
              <Announcement
                key={announcement.id}
                announcement={announcement}
                reloadAnnouncements={getBulletinData}
              />
            ))}
        </div>
      </div>
    </>
  );
};
