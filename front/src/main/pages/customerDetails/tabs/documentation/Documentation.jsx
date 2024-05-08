import React from "react";
import { InformationCard } from "../../../../../commons/components/informationCard/InformationCard";
import en from "./i18n/en";
import es from "./i18n/es";
import i18n from "../../../../../i18n";
import { InformationField } from "../../../../../commons/components/informationField/InformationField";
import PlaceIcon from "@mui/icons-material/Place";
i18n.addResourceBundle("en", "documentation", en);
i18n.addResourceBundle("es", "documentation", es);
import InterestsIcon from "@mui/icons-material/Interests";
import { ColorTag } from "../../../../../commons/components/ColorTag/ColorTag";
import PinIcon from "@mui/icons-material/Pin";
import { useTranslation } from "react-i18next";
import "./Documentation.scss";
import { KycImageList } from "../../../../../commons/components/kycImageList/KycImageList";
import { Button, CircularProgress } from "@mui/material";
import AddTaskIcon from "@mui/icons-material/AddTask";
import { Confirm, Loading, Notify } from "notiflix";
import { crowdServices } from "../../../../../app/services/CrowdServices";

export const Documentation = ({
  customerData,
  documents,
  loadingDocuments,
  reloadUser,
}) => {
  const { t } = useTranslation("documentation");

  const frontPictures = documents.filter((doc) =>
    doc.name.split("/")?.[2].startsWith("FRONT")
  );
  const backPictures = documents.filter((doc) =>
    doc.name.split("/")?.[2].startsWith("BACK")
  );
  const selfiePictures = documents.filter((doc) =>
    doc.name.split("/")?.[2].startsWith("SELFIE")
  );

  const fields = [
    {
      title: t("PENDING_DOCUMENTATION_STATUS"),
      icon: <PlaceIcon />,
      value: <ColorTag tag={customerData?.documentStatus} />,
    },
    {
      title: t("FULL_NAME"),
      icon: <PinIcon />,
      value: customerData?.user?.FullName,
    },
    {
      title: t("DOCUMENT_NUMBER"),
      icon: <PinIcon />,
      value: customerData?.user?.numberDocument,
    },
    {
      title: t("DOCUMENT_TYPE"),
      icon: <InterestsIcon />,
      value: <ColorTag tag={customerData?.user?.typeDocument} />,
    },
  ];

  const handleApproveDocumentation = () =>
    Confirm.show(
      t("CONFIRMATION"),
      t("CONFIRM_APPROVE_DOCUMENTATION"),
      t("OK"),
      t("CANCEL"),
      approveDocumentation
    );

  const approveDocumentation = () => {
    Loading.circle();
    crowdServices
      .approveDocumentation(customerData.id)
      .then(() => {
        reloadUser();
        Notify.success(t("DOCUMENTATION_APPROVED_SUCCESSFULLY"));
      })
      .finally(() => Loading.remove());
  };

  return (
    <div className="documentationTab">
      <InformationCard title={t("DOCUMENTATION")} style={{ minWidth: "300px" }}>
        {t("ID_DOCUMENT_TEXT")}
        {fields.map((field) => (
          <InformationField key={field.title} field={field} />
        ))}
        <Button
          startIcon={<AddTaskIcon />}
          className="primary self-end"
          onClick={handleApproveDocumentation}
        >
          {t("APPROVE_DOCUMENTATION")}
        </Button>
      </InformationCard>
      <InformationCard title={t("FRONT")} style={{ minWidth: "300px" }}>
        {loadingDocuments ? (
          <div className="w-full flex justify-center">
            <CircularProgress />
          </div>
        ) : (
          <KycImageList
            images={frontPictures}
            side={t("FRONT")}
            uploadUrl={`adm/uploadDocuments/${customerData.id}/FRONT`}
            loadUser={reloadUser}
          />
        )}
      </InformationCard>
      <InformationCard title={t("BACK")} style={{ minWidth: "300px" }}>
        {loadingDocuments ? (
          <div className="w-full flex justify-center">
            <CircularProgress />
          </div>
        ) : (
          <KycImageList
            images={backPictures}
            side={t("BACK")}
            uploadUrl={`adm/uploadDocuments/${customerData.id}/BACK`}
            loadUser={reloadUser}
          />
        )}
      </InformationCard>
      <InformationCard title={t("SELFIE")} style={{ minWidth: "300px" }}>
        {loadingDocuments ? (
          <div className="w-full flex justify-center">
            <CircularProgress />
          </div>
        ) : (
          <KycImageList
            images={selfiePictures}
            side={t("SELFIE")}
            uploadUrl={`adm/uploadDocuments/${customerData.id}/SELFIE`}
            loadUser={reloadUser}
          />
        )}
      </InformationCard>
    </div>
  );
};
