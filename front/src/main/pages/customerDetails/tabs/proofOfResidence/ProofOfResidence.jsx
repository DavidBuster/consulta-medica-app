import React, { useContext } from "react";
import { InformationCard } from "../../../../../commons/components/informationCard/InformationCard";
import en from "./i18n/en";
import es from "./i18n/es";
import i18n from "../../../../../i18n";
import { InformationField } from "../../../../../commons/components/informationField/InformationField";
import PlaceIcon from "@mui/icons-material/Place";
i18n.addResourceBundle("en", "proofOfResidence", en);
i18n.addResourceBundle("es", "proofOfResidence", es);
import { ColorTag } from "../../../../../commons/components/ColorTag/ColorTag";
import { useTranslation } from "react-i18next";
import { KycImageList } from "../../../../../commons/components/kycImageList/KycImageList";
import PersonIcon from "@mui/icons-material/Person";
import PublicIcon from "@mui/icons-material/Public";
import AppContext from "../../../../../app/AppContext";
import { Avatar, Button, CircularProgress } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import AddTaskIcon from "@mui/icons-material/AddTask";
import { Confirm, Loading } from "notiflix";
import { crowdServices } from "../../../../../app/services/CrowdServices";

export const ProofOfResidence = ({
  customerData,
  documents,
  loadingAddresses,
  reloadUser,
}) => {
  const { t, i18n } = useTranslation("proofOfResidence");
  const { countryList } = useContext(AppContext);

  const fields = [
    {
      title: t("PENDING_DOCUMENTATION_STATUS"),
      icon: <PlaceIcon />,
      value: <ColorTag tag={customerData?.addressStatus} />,
    },
    {
      title: t("FULL_NAME"),
      icon: <PersonIcon />,
      value: customerData?.user?.FullName,
    },
    {
      title: t("ADDRESS"),
      icon: <HomeIcon />,
      value: customerData?.user?.address,
    },
    {
      title: t("COUNTRY_OF_RESIDENCE"),
      icon: <PublicIcon />,
      value: (
        <div className="flex flex-row items-end">
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
      ),
    },
  ];

  const handleApprovePOR = () =>
    Confirm.show(
      t("CONFIRMATION"),
      t("CONFIRM_APPROVE_POR"),
      t("OK"),
      t("CANCEL"),
      approvePOR
    );

  const approvePOR = () => {
    Loading.circle();
    crowdServices
      .approvePOR(customerData.id)
      .then(() => {
        reloadUser();
        Notify.success(t("POR_APPROVED_SUCCESSFULLY"));
      })
      .finally(() => Loading.remove());
  };

  return (
    <div className="documentationTab">
      <InformationCard title={t("DOCUMENTATION")}>
        {t("PROOF_OF_RESIDENCE_TEXT")}
        {fields.map((field) => (
          <InformationField key={field.title} field={field} />
        ))}
        <Button
          startIcon={<AddTaskIcon />}
          className="primary self-end"
          onClick={handleApprovePOR}
        >
          {t("APPROVE_POR")}
        </Button>
      </InformationCard>
      <InformationCard title={t("PROOF_OF_RESIDENCE")}>
        {loadingAddresses ? (
          <div className="w-full flex justify-center">
            <CircularProgress />
          </div>
        ) : (
          <KycImageList
            images={documents}
            side={t("PROOF_OF_RESIDENCE")}
            uploadUrl={`adm/uploadAddress/${customerData.id}`}
            loadUser={reloadUser}
          />
        )}
      </InformationCard>
    </div>
  );
};
