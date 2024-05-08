import React, { useContext, useEffect, useState } from "react";
import { InformationCard } from "../../../../../commons/components/informationCard/InformationCard";
import en from "./i18n/en";
import es from "./i18n/es";
import i18n from "../../../../../i18n";
import { useTranslation } from "react-i18next";
import { InformationField } from "../../../../../commons/components/informationField/InformationField";

i18n.addResourceBundle("en", "info", en);
i18n.addResourceBundle("es", "info", es);
import HomeIcon from "@mui/icons-material/Home";
import PublicIcon from "@mui/icons-material/Public";
import AppContext from "../../../../../app/AppContext";
import {
  Avatar,
  InputAdornment,
  MenuItem,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Button,
  Tooltip,
} from "@mui/material";
import CakeIcon from "@mui/icons-material/Cake";
import { format } from "date-fns";
import PhoneIcon from "@mui/icons-material/Phone";
import AlternateEmailIcon from "@mui/icons-material/AlternateEmail";
import InterestsIcon from "@mui/icons-material/Interests";
import PinIcon from "@mui/icons-material/Pin";
import EventBusyIcon from "@mui/icons-material/EventBusy";
import StarRateIcon from "@mui/icons-material/StarRate";
import "./Info.scss";
import EditIcon from "@mui/icons-material/Edit";
import { Confirm, Loading, Notify } from "notiflix";
import { crowdServices } from "../../../../../app/services/CrowdServices";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";
import CheckIcon from "@mui/icons-material/Check";
import AddTaskIcon from "@mui/icons-material/AddTask";
import { ColorTag } from "../../../../../commons/components/colorTag/ColorTag";
import PersonIcon from "@mui/icons-material/Person";
import BadgeIcon from "@mui/icons-material/Badge";

export const Info = ({ customerData, reloadUser }) => {
  const { t, i18n } = useTranslation("info");
  const { countryList } = useContext(AppContext);
  const [newPhoneCode, setNewPhoneCode] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [newForm, setNewForm] = useState(customerData);

  useEffect(() => {
    setNewForm(customerData.user);
  }, [customerData]);

  const documentTypes = [
    "CARD_EU_IDENTIFICATION",
    "PASSPORT",
    "DRIVER_LICENSE_UK",
    "RESIDENCE_CARD",
  ];

  const handleChangeEditInfo = (e) =>
    setNewForm((curr) => ({ ...curr, [e.target.name]: e.target.value }));

  const handleCancelInfo = () => {
    setNewForm({ ...customerData.user });
    setIsEditing((curr) => !curr);
    setNewPhoneCode("");
  };

  const handleSaveInfo = () =>
    Confirm.show(
      t("CONFIRMATION"),
      t("CONFIRM_SAVE_INFO"),
      t("OK"),
      t("CANCEL"),
      editCustomerData
    );

  const editCustomerData = () => {
    Loading.circle();
    crowdServices
      .editCustomerData(customerData.id, newForm)
      .then(() => {
        reloadUser();
        Notify.success(t("INFO_EDITED_SUCCESSFULLY"));
        setIsEditing(false);
      })
      .finally(() => Loading.remove());
  };

  const fields = [
    {
      title: t("FULL_NAME"),
      icon: <PersonIcon />,
      value: customerData?.user?.FullName,
      editingFields: [
        {
          defaultValue: customerData?.user?.FullName,
          name: "FullName",
        },
      ],
    },
    {
      title: t("ADDRESS"),
      icon: <HomeIcon />,
      value: customerData?.user?.address,
      editingFields: [
        {
          defaultValue: customerData?.user?.address,
          name: "address",
        },
      ],
    },
    {
      title: t("COUNTRY_OF_RESIDENCE"),
      icon: <PublicIcon />,
      value: customerData?.user?.country ? (
        <div className="flex flex-row" style={{ alignItems: "center" }}>
          {
            countryList.find(
              (el) => el.nameEs === customerData?.user?.country
            )?.[i18n.language === "en" ? "nameEn" : "nameEs"]
          }
          <Avatar
            src={`/assets/images/flags/${
              countryList.find(
                (el) => el.nameEs === customerData?.user?.country
              )?.isEea
                ? "eea"
                : "noeea"
            }.jpg`}
            style={{
              width: "30px",
              height: "30px",
              marginLeft: "8px",
            }}
          />
        </div>
      ) : null,
      editingFields: [
        {
          render: (
            <TextField
              defaultValue={customerData?.user?.country}
              onChange={handleChangeEditInfo}
              name="country"
              variant="outlined"
              select
              className="w-full"
            >
              {countryList
                .sort((a, b) => {
                  const varKey = i18n.language === "en" ? "nameEn" : "nameEs";
                  return a[varKey] > b[varKey]
                    ? 1
                    : b[varKey] > a[varKey]
                    ? -1
                    : 0;
                })
                .map((el, index) => (
                  <MenuItem key={index} value={el.nameEs}>
                    {i18n.language === "en" ? el.nameEn : el.nameEs}
                  </MenuItem>
                ))}
            </TextField>
          ),
        },
      ],
    },
    {
      title: t("BIRTHDAY"),
      icon: <CakeIcon />,
      value:
        customerData?.user?.birthdate &&
        format(customerData?.user?.birthdate, "dd-MM-yyyy"),
      editingFields: [
        {
          defaultValue:
            customerData?.user?.birthdate &&
            format(customerData?.user?.birthdate, "yyyy-MM-dd"),
          name: "birthdate",
          type: "date",
        },
      ],
    },
    {
      title: t("PHONE"),
      icon: <PhoneIcon />,
      value: (
        <>
          {`${
            customerData?.user?.phoneCode
              ? `${customerData?.user?.phoneCode} `
              : ""
          }${customerData?.user?.phone}`}
          <Tooltip
            title={t(
              customerData?.user?.numVerificated ? "VERIFIED" : "NOT_VERIFIED"
            )}
          >
            {customerData?.user?.numVerificated ? (
              <CheckIcon style={{ color: "var(--color-green)" }} />
            ) : (
              <CloseIcon style={{ color: "var(--color-red)" }} />
            )}
          </Tooltip>
        </>
      ),
      editingFields: [
        {
          render: (
            <div className="flex">
              <TextField
                defaultValue={customerData?.user?.phoneCode}
                onChange={handleChangeEditInfo}
                name="phoneCode"
                variant="outlined"
                select
                className="countryPhoneCodeTextfield"
              >
                {countryList
                  .sort((a, b) => {
                    const varKey = i18n.language === "en" ? "nameEn" : "nameEs";
                    return a[varKey] > b[varKey]
                      ? 1
                      : b[varKey] > a[varKey]
                      ? -1
                      : 0;
                  })
                  .map((el) => (
                    <MenuItem key={el.alfa2} value={el.phoneCode}>
                      {i18n.language === "en" ? el.nameEn : el.nameEs}
                    </MenuItem>
                  ))}
              </TextField>
              <TextField
                defaultValue={customerData?.user?.phone}
                onChange={handleChangeEditInfo}
                name="phone"
                variant="outlined"
                style={{ flex: "1 1 0" }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      {newPhoneCode}
                    </InputAdornment>
                  ),
                }}
              />
            </div>
          ),
        },
      ],
    },
    {
      title: t("EMAIL"),
      icon: <AlternateEmailIcon />,
      value: customerData?.user?.email,
      editingFields: [
        {
          defaultValue: customerData?.user?.email,
          name: "email",
        },
      ],
    },
    {
      title: t("DOCUMENT_TYPE"),
      icon: <InterestsIcon />,
      value: <ColorTag tag={customerData?.user?.typeDocument} />,
      editingFields: {
        render: (
          <TextField
            fullWidth
            defaultValue={customerData?.user?.typeDocument}
            onChange={handleChangeEditInfo}
            variant="outlined"
            select
            name="typeDocument"
          >
            {documentTypes.map((el) => (
              <MenuItem key={el} value={el}>
                <ColorTag tag={el} />
              </MenuItem>
            ))}
          </TextField>
        ),
      },
    },
    {
      title: t("DOCUMENT_NUMBER"),
      icon: <PinIcon />,
      value: customerData?.user?.numberDocument,
      editingFields: [
        {
          defaultValue: customerData?.user?.numberDocument,
          name: "numberDocument",
        },
      ],
    },
    {
      title: t("EXPIRACY_DATE"),
      icon: <EventBusyIcon />,
      value:
        customerData?.user?.dateExpiredDocument &&
        format(customerData?.user?.dateExpiredDocument, "dd-MM-yyyy"),
      editingFields: [
        {
          defaultValue:
            customerData?.user?.dateExpiredDocument &&
            format(customerData?.user?.dateExpiredDocument, "yyyy-MM-dd"),
          name: "dateExpiredDocument",
          type: "date",
        },
      ],
    },
    {
      title: t("PEP"),
      icon: <StarRateIcon />,
      value: <ColorTag tag={customerData?.user?.isPEP ? "YES" : "NO"} />,
      editingFields: {
        render: (
          <ToggleButtonGroup
            value={newForm?.isPEP}
            name="isPep"
            exclusive
            onChange={(_, newAlignment) => {
              setNewForm((curr) => ({ ...curr, isPEP: newAlignment }));
            }}
          >
            <ToggleButton value={true}>{t("YES")}</ToggleButton>
            <ToggleButton value={false}>{t("NO")}</ToggleButton>
          </ToggleButtonGroup>
        ),
      },
    },
  ];

  const handleApproveProfile = () =>
    Confirm.show(
      t("CONFIRMATION"),
      t("CONFIRM_APPROVE_PROFILE"),
      t("OK"),
      t("CANCEL"),
      approveProfile
    );

  const approveProfile = () => {
    Loading.circle();
    crowdServices
      .approveProfile(customerData.id)
      .then(() => {
        reloadUser();
        Notify.success(t("PROFILE_APPROVED_SUCCESSFULLY"));
      })
      .finally(() => Loading.remove());
  };

  const handleApproveKYC = () =>
    Confirm.show(
      t("CONFIRMATION"),
      t("CONFIRM_APPROVE_KYC"),
      t("OK"),
      t("CANCEL"),
      approveKYC
    );

  const approveKYC = () => {
    Loading.circle();
    crowdServices
      .approveKYC(customerData.id)
      .then(() => {
        reloadUser();
        Notify.success(t("KYC_APPROVED_SUCCESSFULLY"));
      })
      .finally(() => Loading.remove());
  };

  return (
    <div className="profileInformation">
      <InformationCard
        className="profileInformationFields"
        title={t("PROFILE_INFORMATION")}
        headerButtons={
          isEditing ? (
            <div
              className="flex"
              style={{
                justifyContent: "flex-end",
                gap: "var(--length-medium-3)",
              }}
            >
              <Button
                startIcon={<SaveIcon />}
                style={{
                  color: "var(--color-background)",
                  borderColor: "var(--color-green)",
                  backgroundColor: "var(--color-green)",
                }}
                onClick={handleSaveInfo}
              >
                {t("SAVE")}
              </Button>
              <Button
                startIcon={<CloseIcon />}
                style={{
                  color: "var(--color-background)",
                  borderColor: "var(--color-red)",
                  backgroundColor: "var(--color-red)",
                }}
                onClick={handleCancelInfo}
              >
                {t("CANCEL")}
              </Button>
            </div>
          ) : (
            <div
              className="flex"
              style={{
                justifyContent: "flex-end",
                gap: "var(--length-medium-3)",
              }}
            >
              <Button
                startIcon={<EditIcon />}
                className="primary"
                onClick={() => setIsEditing((curr) => !curr)}
              >
                {t("EDIT")}
              </Button>
              {customerData.profileStatus !== "ACCEPTED" && (
                <Button
                  startIcon={<PersonIcon />}
                  style={{
                    color: "var(--color-background)",
                    borderColor: "var(--color-green)",
                    backgroundColor: "var(--color-green)",
                  }}
                  onClick={handleApproveProfile}
                >
                  {t("APPROVE_PROFILE")}
                </Button>
              )}
              {customerData.kycStatus !== "ACCEPTED" && (
                <Button
                  startIcon={<BadgeIcon />}
                  style={{
                    color: "var(--color-background)",
                    borderColor: "var(--color-green)",
                    backgroundColor: "var(--color-green)",
                  }}
                  onClick={handleApproveKYC}
                >
                  {t("APPROVE_KYC")}
                </Button>
              )}
            </div>
          )
        }
      >
        {fields.map((field) => (
          <InformationField
            key={field.title}
            field={field}
            isEditing={isEditing}
            handleChangeEditInfo={handleChangeEditInfo}
            // handleChangeEditInfo={
            // 	field.handleChangeEditInfo ?? handleChangeEditInfo
            // }
            // handleSaveInfo={
            // 	field.handleSaveEditInfo ?? handleSaveEditInfo
            // }
          />
        ))}
      </InformationCard>
    </div>
  );
};
