import {
  Button,
  Card,
  Divider,
  IconButton,
  MenuItem,
  TextField,
  Tooltip,
} from "@mui/material";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import "./Announcement.scss";
import { checkEmail } from "../../../../../../commons/functions/validations/checkEmail";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import en from "./i18n/en";
import es from "./i18n/es";
import i18n from "../../../../../../i18n";
import { Confirm, Loading, Notify } from "notiflix";
import { crowdServices } from "../../../../../../app/services/CrowdServices";

i18n.addResourceBundle("en", "announcement", en);
i18n.addResourceBundle("es", "announcement", es);

export const Announcement = ({
  announcement,
  newAnnouncement,
  setOpenModal,
  reloadAnnouncements,
}) => {
  const { t } = useTranslation("announcement");
  const [isEditing, setIsEditing] = useState(false);

  const initialFormState = newAnnouncement
    ? {
        amount: "",
        programName: "",
        message: "",
        email: "",
      }
    : {
        amount: announcement.tokenAmount,
        programName: announcement.programName,
        message: announcement.message,
        email: announcement.email,
      };
  const [form, setForm] = useState(initialFormState);
  const { amount, programName, message, email } = form;

  const initialErrorsState = {
    amount: null,
    programName: null,
    message: null,
    email: null,
  };

  const [formErrors, setFormErrors] = useState(initialErrorsState);

  const fieldValidations = {
    amount: {
      validation: (amount) => Number(amount) > 0,
      text: t("INCORRECT_AMOUNT"),
    },
    programName: {
      validation: (currency) => currency !== "",
      text: t("FIELD_CANNOT_BE_EMPTY"),
    },
    email: {
      validation: (email) => checkEmail(email),
      text: t("FIELD_CANNOT_BE_EMPTY"),
    },
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

    setFormErrors({
      ...formErrors,
      [e.target.name]: null,
    });
  };

  const checkError = (key, newFormErrors = {}) => {
    let error = null;

    if (!(fieldValidations[key]?.validation(form[key]) ?? true)) {
      error = fieldValidations[key].text;
    }

    newFormErrors[key] = error;
    setFormErrors((curr) => ({ ...curr, [key]: error }));
  };

  const publishNewAnnouncement = () => {
    let newFormErrors = {};

    Object.keys(formErrors).forEach((key) => checkError(key, newFormErrors));

    if (Object.values(newFormErrors).some((error) => error !== null)) {
      return;
    }

    Loading.circle();
    crowdServices
      .createNewAnnouncement(email, message, programName, amount)
      .then(() => {
        Notify.success(t("ANNOUNCEMENT_PUBLISHED_SUCCESSFULLY"));
        reloadAnnouncements();
      })
      .finally(() => Loading.remove());
  };

  const editAnnouncement = () => {
    let body = { ...announcement, ...form };
    if (body.hasOwnProperty("amount")) {
      body["tokenAmount"] = body["amount"];
      delete body["amount"];
    }

    Loading.circle();
    crowdServices
      .updateAnnouncement(body)
      .then(() => {
        Notify.success(t("ANNOUNCEMENT_EDITED_SUCCESSFULLY"));
        reloadAnnouncements();
      })
      .finally(() => Loading.remove());
  };

  const handleDeleteAnnouncement = () => {
    Confirm.show(
      t("CONFIRMATION"),
      t("DELETE_ANNOUNCEMENT"),
      t("CONFIRM"),
      t("CANCEL"),
      deleteAnnouncement
    );
  };

  const deleteAnnouncement = () => {
    Loading.circle();
    crowdServices
      .deleteAnnouncement(announcement.id)
      .then(() => {
        Notify.success(t("ANNOUNCEMENT_DELETED_SUCCESSFULLY"));
        reloadAnnouncements();
      })
      .finally(() => Loading.remove());
  };

  return newAnnouncement || isEditing ? (
    <Card className="announcement" style={{ width: isEditing ? "" : "350px" }}>
      <div className="announcementAmount">
        <TextField
          className="announcementAmountTextfield"
          style={{ height: "fit-content" }}
          value={amount}
          onChange={(ev) => {
            const value = event.target.value;
            const regex = /^[0-9]*[.,]?[0-9]*$/;
            if (regex.test(value)) handleChange(ev);
          }}
          name="amount"
          label={t("AMOUNT")}
          variant="outlined"
          fullWidth
          required
          error={formErrors.amount !== null}
          helperText={formErrors.amount !== null && formErrors.amount}
          onBlur={(e) => checkError(e.target.name)}
        />
      </div>
      <Divider
        style={{
          marginTop: "var(--length-small-3)",
          marginBottom: "var(--length-medium-1)",
        }}
      />
      <div className="announcementContainer">
        <div className="announcementEmail">
          <TextField
            value={email}
            onChange={handleChange}
            name="email"
            label={"Email"}
            variant="outlined"
            fullWidth
            required
            onBlur={(e) => checkError(e.target.name)}
            error={formErrors.email !== null}
            helperText={formErrors.email !== null && formErrors.email}
          />
        </div>
        <div className="announcementTokensFrom">
          <div>{t("TOKENS_FROM")}</div>
          <TextField
            value={programName}
            onChange={handleChange}
            name="programName"
            label={t("PROJECT")}
            variant="outlined"
            fullWidth
            select
            required
            error={formErrors.programName !== null}
            helperText={
              formErrors.programName !== null && formErrors.programName
            }
            onBlur={(e) => checkError(e.target.name)}
          >
            {["Rewire Holding", "Saurus México"].map((el) => (
              <MenuItem value={el}>{el}</MenuItem>
            ))}
          </TextField>
        </div>
        <div className="announcementMessage">
          <TextField
            value={message}
            onChange={handleChange}
            name="message"
            label={`${t("MESSAGE")} (${t("OPTIONAL")})`}
            variant="outlined"
            fullWidth
            multiline
            rows={3}
            onBlur={(e) => checkError(e.target.name)}
          />
        </div>
        <div
          className="flex"
          style={{
            gap: "var(--length-small-3)",
            justifyContent: "space-between",
          }}
        >
          <Button
            className="primary"
            variant="outlined"
            fullWidth
            onClick={isEditing ? editAnnouncement : publishNewAnnouncement}
          >
            {t(isEditing ? "EDIT" : "PUBLISH")}
          </Button>
          <Button
            className="secondary"
            variant="outlined"
            fullWidth
            onClick={
              isEditing
                ? () => {
                    setIsEditing(false);
                    setForm(initialFormState);
                    setFormErrors(initialErrorsState);
                  }
                : () => setOpenModal(false)
            }
          >
            {t("CANCEL")}
          </Button>
        </div>
      </div>
    </Card>
  ) : (
    <Card className="announcement">
      <div className="announcementAmount">
        <Tooltip
          title={
            announcement.tokenAmount.length > 5 ? announcement.tokenAmount : ""
          }
        >
          <div>{announcement.tokenAmount}</div>
        </Tooltip>
        <div className="flex">
          <Tooltip title={t("EDIT_ANNOUNCEMENT")}>
            <IconButton
              style={{ height: "fit-content" }}
              onClick={() => setIsEditing(true)}
            >
              <EditIcon style={{ color: "var(--color-blue)" }} />
            </IconButton>
          </Tooltip>
          <Tooltip title={t("DELETE_ANNOUNCEMENT")}>
            <IconButton
              style={{ height: "fit-content" }}
              onClick={handleDeleteAnnouncement}
            >
              <DeleteIcon style={{ color: "var(--color-red)" }} />
            </IconButton>
          </Tooltip>
        </div>
      </div>
      <Divider
        style={{
          marginTop: "var(--length-small-3)",
          marginBottom: "var(--length-small-3)",
        }}
      />
      <div className="announcementContainer">
        <div className="announcementTokensFrom">
          {t("TOKENS_FROM")} {announcement.programName}
        </div>
        <div className="announcementMessage">{announcement.message}</div>
        <div className="announcementEmail">{announcement.email}</div>
        <div className="announcementStatus">{announcement.status}</div>
      </div>
    </Card>
  );
};
