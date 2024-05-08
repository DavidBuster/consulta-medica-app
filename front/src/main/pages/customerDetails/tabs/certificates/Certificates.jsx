import React, { useState } from "react";
import { InformationCard } from "../../../../../commons/components/informationCard/InformationCard";
import { useTranslation } from "react-i18next";
import i18n from "../../../../../i18n";
import en from "./i18n/en";
import es from "./i18n/es";
import { MenuItem, TextField } from "@mui/material";
import { Confirm, Loading, Notify } from "notiflix";
import { crowdServices } from "../../../../../app/services/CrowdServices";

i18n.addResourceBundle("en", "certificates", en);
i18n.addResourceBundle("es", "certificates", es);

export const Certificates = ({ email }) => {
  const { t } = useTranslation("certificates");
  const [selectedCertificate, setSelectedCertificate] = useState("");

  const certificates = [
    {
      label: t("SAURUS_FIRST"),
      programCode: "saurus",
      roundCode: "01",
    },
    {
      label: t("SAURUS_SECOND"),
      programCode: "saurus",
      roundCode: "02",
    },
    {
      label: t("SAURUS_THIRD"),
      programCode: "saurus",
      roundCode: "03",
    },
    {
      label: t("SAURUS_MEXICO_FIRST"),
      programCode: "saurusMexico",
      roundCode: "01",
    },
  ];

  const handleSelectCertificate = (ev) => {
    console.log("handleSelectCertificate", ev.target.value);
    const selectedCertificateLabel = ev.target.value;
    setSelectedCertificate(selectedCertificateLabel);
    Confirm.show(
      t("CONFIRMATION"),
      t("DOWNLOAD_CERTIFICATE"),
      t("CONFIRM"),
      t("CANCEL"),
      () => downloadCertificate(selectedCertificateLabel)
    );
  };

  const downloadCertificate = (selectedCertificateLabel) => {
    Loading.circle();
    const selectedCert = certificates.find(
      (certificate) => certificate.label === selectedCertificateLabel
    );

    crowdServices
      .downloadCertificate(
        email,
        selectedCert.programCode,
        selectedCert.roundCode
      )
      .then((response) => {
        const pdfCertificate = response.data;
        let a = document.createElement("a");
        a.href = "data:application/pdf;base64," + pdfCertificate;
        a.target = "_blank";
        a.download = "CertificadoInversión.pdf";
        document.body.appendChild(a);
        a.click();
      })
      .catch((error) => {
        if (error.response.status === 402)
          Notify.failure(t("INVESTMENT_NON_EXISTING"));
      })
      .finally(() => Loading.remove());
  };

  return (
    <div>
      <InformationCard title={t("CERTIFICATES")}>
        {t("CERTIFICATES_TEXT")}
        <TextField
          value={selectedCertificate}
          onChange={handleSelectCertificate}
          variant="outlined"
          select
        >
          {certificates.map((el) => (
            <MenuItem key={el.label} value={el.label}>
              {el.label}
            </MenuItem>
          ))}
        </TextField>
      </InformationCard>
    </div>
  );
};
