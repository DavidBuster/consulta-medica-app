import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import en from "./i18n/en";
import es from "./i18n/es";
import i18n from "../../../i18n";
import { crowdServices } from "../../../app/services/CrowdServices";
import { Card } from "@mui/material";
import { InformationField } from "../informationField/InformationField";
import EuroIcon from "@mui/icons-material/Euro";
import CurrencyBitcoinIcon from "@mui/icons-material/CurrencyBitcoin";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import AllInclusiveIcon from "@mui/icons-material/AllInclusive";
import "./InvestmentHeaders.scss";
import CurrencyPoundIcon from "@mui/icons-material/CurrencyPound";
import Accordion from "@mui/material/Accordion";
import AccordionActions from "@mui/material/AccordionActions";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { RoundedNumber } from "../roundedNumber/RoundedNumber";
import { Typography } from "@mui/material";

i18n.addResourceBundle("en", "investmentHeaders", en);
i18n.addResourceBundle("es", "investmentHeaders", es);

export const InvestmentHeaders = ({ header, expanded, setExpanded }) => {
  const { t } = useTranslation("investmentHeaders");
  const [data, setData] = useState({});
  const {
    amountTotal,
    amountBTC,
    amountETH,
    amountEUR,
    amountGBP,
    amountUSD,
    amountUSDT20,
    amountWOOP,
  } = data;
  const { title, params } = header;
  const [loadingData, setLoadingData] = useState(false);

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  useEffect(() => {
    getTableData();
  }, [params]);

  const getTableData = () => {
    setLoadingData(true);
    crowdServices
      .getInvestmentData(params)
      .then((response) => {
        setData(response.data);
      })
      .finally(() => setLoadingData(false));
  };

  const fields = [
    {
      title: t("AMOUNT_TOTAL"),
      value: amountTotal,
      icon: <AllInclusiveIcon />,
    },
    {
      title: t("AMOUNT_EUR"),
      value: amountEUR,
      icon: <EuroIcon />,
    },
    {
      title: t("AMOUNT_GBP"),
      value: amountGBP,
      icon: <CurrencyPoundIcon />,
    },
    {
      title: t("AMOUNT_USD"),
      value: amountUSD,
      icon: <AttachMoneyIcon />,
    },
    {
      title: t("AMOUNT_BTC"),
      value: amountBTC,
      icon: <CurrencyBitcoinIcon />,
    },
    {
      title: t("AMOUNT_ETH"),
      value: amountETH,
      icon: "E",
    },
    {
      title: t("AMOUNT_USDT"),
      value: amountUSDT20,
      icon: "T",
    },
    {
      title: t("AMOUNT_WOOP"),
      value: amountWOOP,
      icon: "W",
    },
  ];

  console.log("fields", fields);

  return (
    <Accordion expanded={expanded === title} onChange={handleChange(title)}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        {t(title)}
      </AccordionSummary>
      <AccordionDetails className="investmentHeader">
        {fields.map((field) => (
          <div className="informationField" key={field.title}>
            <div className="informationFieldTitle">
              <div className="informationFieldIcon">{field.icon}</div>
              <Typography>{field.title}</Typography>
            </div>
            <div className="informationFieldValue">
              <RoundedNumber value={field.value ?? 0} decimals={4} />
            </div>
          </div>
        ))}
      </AccordionDetails>
    </Accordion>
  );
};
