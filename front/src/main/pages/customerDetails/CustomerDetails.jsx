import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./CustomerDetails.scss";
import {
  Button,
  Divider,
  MenuItem,
  Popover,
  Tab,
  Tabs,
  Tooltip,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import { useTranslation } from "react-i18next";
import { Confirm, Loading, Notify } from "notiflix";
import { crowdServices } from "../../../app/services/CrowdServices";
import HomeIcon from "@mui/icons-material/Home";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import BadgeIcon from "@mui/icons-material/Badge";
import { Info } from "./tabs/info/Info";
import { Documentation } from "./tabs/documentation/Documentation";
import { ProofOfResidence } from "./tabs/proofOfResidence/ProofOfResidence";
import { InvestmentTables } from "./tabs/investmentTables/InvestmentTables";
import { Certificates } from "./tabs/certificates/Certificates";
import AlternateEmailRoundedIcon from "@mui/icons-material/AlternateEmailRounded";
import VerifiedIcon from "@mui/icons-material/Verified";
import HelpIcon from "@mui/icons-material/Help";

import en from "./i18n/en";
import es from "./i18n/es";
import i18n from "../../../i18n";
import { InformationCard } from "../../../commons/components/informationCard/InformationCard";

i18n.addResourceBundle("en", "customerDetails", en);
i18n.addResourceBundle("es", "customerDetails", es);

export const CustomerDetails = () => {
  const { t } = useTranslation("customerDetails");
  const { id } = useParams();
  const [customerData, setCustomerData] = useState({});
  const [documents, setDocuments] = useState([]);
  const [loadingDocuments, setLoadingDocuments] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [loadingAddresses, setLoadingAddresses] = useState(false);
  const [selectedTab, setSelectedTab] = useState("information");
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    getCustomerInfo();
  }, []);

  const getCustomerInfo = () => {
    Loading.circle();
    Promise.all([
      getCustomerData(),
      getCustomerDocuments(),
      getCustomerAddresses(),
    ]).finally(() => Loading.remove());
  };

  const getCustomerData = () =>
    crowdServices
      .getCustomerData(id)
      .then((response) => setCustomerData(response.data));
  const getCustomerDocuments = () => {
    setLoadingDocuments(true);
    crowdServices.getCustomerDocuments(id).then((response) => {
      setLoadingDocuments(false);
      setDocuments(response.data);
    });
  };
  const getCustomerAddresses = () => {
    setLoadingAddresses(true);
    crowdServices.getCustomerAddresses(id).then((response) => {
      setLoadingAddresses(false);
      setAddresses(response.data);
    });
  };

  const switchStatusColor = (status) => {
    switch (status) {
      case "ACCEPTED":
        return "green";
      case "REJECTED":
        return "red";
      case "IN_REVIEW":
        return "yellow";
      case "PENDING":
        return "blue";
      default:
        break;
    }
  };

  const headerIcons = [
    {
      title: "PROFILE",
      value: customerData.profileStatus,
      icon: <PersonIcon />,
    },
    {
      title: "ID",
      value: customerData.documentStatus,
      icon: <BadgeIcon />,
    },
    {
      title: "ADDRESS",
      value: customerData.addressStatus,
      icon: <HomeIcon />,
    },
    {
      title: "QUESTIONNAIRE",
      value: customerData.investStatus,
      icon: <FormatListBulletedIcon />,
    },
  ];

  const tabsDictionary = [
    {
      key: "information",
      component: (
        <Info customerData={customerData} reloadUser={getCustomerData} />
      ),
    },
    {
      key: "documentation",
      component: (
        <Documentation
          customerData={customerData}
          documents={documents}
          loadingDocuments={loadingDocuments}
          reloadUser={getCustomerDocuments}
        />
      ),
    },
    {
      key: "proofOfResidence",
      component: (
        <ProofOfResidence
          customerData={customerData}
          documents={addresses}
          loadingAddresses={loadingAddresses}
          reloadUser={getCustomerAddresses}
        />
      ),
    },
    {
      key: "investments",
      component: (
        <div className="flex flex-col" style={{ gap: "1.6rem" }}>
          <InformationCard title={t("FIRST_SECOND_INVESTMENTS")}>
            <InvestmentTables key="investments" url={`adm/invests/${id}`} />
          </InformationCard>
          <InformationCard title={t("THIRD_INVESTMENTS")}>
            <InvestmentTables
              key="thirdInvestments"
              url={`adm/investsNew/${id}`}
            />
          </InformationCard>
        </div>
      ),
    },
    {
      key: "certificates",
      component: <Certificates email={customerData?.user?.email} />,
    },
  ];

  const emailOptions = [
    {
      text: "SELFIE",
      message: "Selfie sujetando el documento de identidad",
    },
    {
      text: "ID",
      message: "Documentos de identidad",
    },
    {
      text: "PROOF_OF_RESIDENCE",
      message: "Prueba de residencia",
    },
    {
      text: "QUESTIONNAIRE",
      message: "Cuestionario",
    },
    {
      text: "PROFILE",
      message: "Datos de perfil",
    },
  ];

  const handleSelectEmail = (message) => {
    Confirm.show(
      t("CONFIRMATION"),
      t("CONFIRMATION_SEND_EMAIL"),
      t("CONFIRM"),
      t("CANCEL"),
      () => sendEmail(message)
    );
  };

  const sendEmail = (message) => {
    Loading.circle();
    crowdServices
      .sendEmail(id, message)
      .then(() => Notify.success(t("EMAIL_SENT_SUCCESSFULLY")))
      .finally(() => Loading.remove());
  };

  const kycVerified = customerData.kycStatus === "ACCEPTED";

  return (
    <div
      className="flex flex-col"
      style={{ overflow: "hidden", height: "100%" }}
    >
      <div className="pageHeader">
        <div className="flex" style={{ gap: "1rem" }}>
          <div>{customerData?.user?.email}</div>
          <Tooltip title={t(kycVerified ? "KYC_VERIFIED" : "KYC_PENDING")}>
            {kycVerified ? (
              <VerifiedIcon style={{ color: "var(--color-green)" }} />
            ) : (
              <HelpIcon style={{ color: "var(--color-red)" }} />
            )}
          </Tooltip>
        </div>
        <div className="headerIcons">
          <div>
            {headerIcons.map((icon) => (
              <Tooltip
                key={icon.title}
                title={`${t(icon.title)}: ${t(icon.value)}`}
              >
                <span style={{ color: switchStatusColor(icon.value) }}>
                  {icon.icon}
                </span>
              </Tooltip>
            ))}
          </div>
          <Button
            className="secondary"
            onClick={handleClick}
            startIcon={<AlternateEmailRoundedIcon />}
          >
            {t("SEND_EMAIL")}
          </Button>

          <Popover
            open={Boolean(anchorEl)}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "center",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "center",
            }}
          >
            {emailOptions.map((option, ind) => (
              <MenuItem
                key={option.text}
                onClick={() => handleSelectEmail(option.message)}
              >
                {t(option.text)}
              </MenuItem>
            ))}
          </Popover>
        </div>
      </div>
      <div
        style={{
          paddingLeft: "var(--length-medium-2)",
          paddingRight: "var(--length-medium-2)",
          overflow: "auto",
          // flex: "1 1 0",
        }}
      >
        <Tabs
          value={selectedTab}
          onChange={(_, value) => setSelectedTab(value)}
          indicatorColor="primary"
          textColor="inherit"
          variant="scrollable"
          scrollButtons="auto"
          className="mx-24 my-12 items-center overflow-x-auto"
          classes={{
            indicator: "flex justify-center bg-transparent w-full h-full",
          }}
          TabIndicatorProps={{
            children: (
              <Divider className="w-full h-full rounded-full opacity-50" />
            ),
          }}
        >
          {tabsDictionary.map((tab) => (
            <Tab
              key={tab.key}
              className="text-14 font-bold min-h-40 min-w-64 mx-4"
              disableRipple
              label={t(tab.key)}
              value={tab.key}
            />
          ))}
        </Tabs>
        <div style={{ padding: "var(--length-medium-2)" }}>
          {tabsDictionary.find((tab) => tab.key === selectedTab)?.component}
        </div>
      </div>
    </div>
  );
};
