import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import en from "./i18n/en";
import es from "./i18n/es";
import { format } from "date-fns";
import {
  IconButton,
  Tooltip,
  Modal,
  TextField,
  Button,
  InputAdornment,
} from "@mui/material";
import i18n from "../../../../../i18n";
import Table from "../../../../../commons/components/table/Table";
import { crowdServices } from "../../../../../app/services/CrowdServices";
import AddIcon from "@mui/icons-material/Add";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import "./InvestmentTables.scss";
import { ColorTag } from "../../../../../commons/components/colorTag/ColorTag";
import { InformationCard } from "../../../../../commons/components/informationCard/InformationCard";
import { UploadButton } from "../../../../../commons/components/uploadButton/UploadButton";
import { Confirm, Loading, Notify } from "notiflix";
import BorderedSection from "../../../../../commons/components/borderedSection/BorderedSection";
import TokenIcon from "@mui/icons-material/Token";
import CurrencyBitcoinIcon from "@mui/icons-material/CurrencyBitcoin";

i18n.addResourceBundle("en", "investmentTables", en);
i18n.addResourceBundle("es", "investmentTables", es);

export const InvestmentTables = ({ url }) => {
  const { t } = useTranslation("investmentTables");
  const [data, setData] = useState({ listUsers: [] });
  const rows = data?.listUsers;
  const totalResults = data?.totalResults;
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [openModalAddProofOfPayment, setOpenModalAddProofOfPayment] =
    useState(false);
  const [openModalSeeProofOfPayment, setOpenModalSeeProofOfPayment] =
    useState(false);
  const [openModalEditProofOfPayment, setOpenModalEditProofOfPayment] =
    useState(false);
  const [seeProofOfPaymentFiles, setSeeProofOfPaymentFiles] = useState({});
  const [loadingTable, setLoadingTable] = useState(false);
  const [newInvestedAmount, setNewInvestedAmount] = useState(0);
  const [investmentRoundInfo, setInvestmentRoundInfo] = useState({});

  useEffect(() => {
    getTableData();
  }, [page, pageSize]);

  const getTableData = () => {
    setLoadingTable(true);
    crowdServices
      .getTableData(url, page, pageSize)
      .then((response) => {
        const tableResults = response.data.listUsers;
        setData(response.data);
        Promise.allSettled(
          tableResults.map(({ programCode, roundCode }) =>
            getInvestmentRoundInfo(programCode, roundCode)
          )
        ).then((values) => {
          const result = {};

          for (let i = 0; i < values.length; i++) {
            const roundCode = tableResults[i].roundCode;
            const programCode = tableResults[i].programCode;
            const value = values[i].value.tokenValue;

            if (!result[programCode]) {
              result[programCode] = {};
            }

            // Only add the value if it doesn't exist for the same roundCode
            if (!result[programCode][roundCode]) {
              result[programCode][roundCode] = value;
            }
          }

          setInvestmentRoundInfo(result);
        });
      })
      .finally(() => {
        setLoadingTable(false);
      });
  };

  const getInvestmentRoundInfo = (programCode, roundCode) =>
    new Promise((resolve, reject) =>
      crowdServices
        .getInvestmentRoundInfo(programCode, roundCode)
        .then((response) => resolve(response.data))
        .catch((err) => reject(err))
    );

  const deleteProofOfPayment = (id) => {
    crowdServices.deleteProofOfPayment(id).then(() => {
      Notify.success("PROOF_OF_PAYMENT_DELETED_SUCCESSFULLY");
      getTableData();
    });
  };

  const columns = [
    {
      title: t("INVESTED_FROM"),
      key: "investFrom",
    },
    {
      title: t("ALIAS"),
      key: "accountAlias",
    },
    {
      title: t("AMOUNT"),
      key: "amount",
      render: (amount, row) => `${amount} ${row.currency}`,
    },
    {
      title: t("CREATION_DATE"),
      key: "createdDate",
      render: (createDate) => {
        if (createDate) return format(createDate, "dd-MM-yyyy");
      },
    },
    {
      title: t("PROGRAM"),
      key: "programCode",
      render: ColorTag,
    },
    {
      title: t("ROUND"),
      key: "roundCode",
    },
    {
      title: t("STATUS"),
      key: "status",
      render: ColorTag,
    },
    {
      title: t("ACTIONS"),
      key: "actions",
      render: (
        _,
        {
          id,
          email,
          currency,
          amountShares,
          programCode,
          roundCode,
          amount,
          amountEUR,
        }
      ) => {
        const newTokenAmount =
          (0.9 * newInvestedAmount * amountEUR) /
          (amount * investmentRoundInfo?.[programCode]?.[roundCode]);

        const modifyInvestment = (id) => {
          Loading.circle();
          crowdServices
            .modifyInvestment(
              id,
              Number(newInvestedAmount).toString(),
              newTokenAmount.toFixed(0),
              newTokenAmount
            )
            .then(() => {
              Notify.success(t("INVESTMENT_MODIFIED_SUCCESSFULLY"));
              getTableData();
              setOpenModalEditProofOfPayment(false);
            })
            .finally(() => Loading.remove());
        };

        const switchCurrency = () => {
          switch (currency) {
            case "EUR":
              return "€";
            case "GBP":
              return "£";
            case "USD":
              return "$";
            case "BTC":
              return <CurrencyBitcoinIcon />;

            default:
              return currency;
          }
        };

        const importantFields = [
          {
            label: "INVESTED_AMOUNT",
            value: newInvestedAmount,
            onChange: (e) => setNewInvestedAmount(e.target.value),
            readOnly: false,
            initial: amount,
            unit: switchCurrency(),
          },
          {
            label: "TOKENS",
            value: newTokenAmount.toFixed(0),
            readOnly: true,
            initial: amountShares,
            unit: <TokenIcon />,
          },
        ];

        const investmentFields = [
          {
            label: "CURRENCY_VALUE",
            value: `${amountEUR / amount} ${switchCurrency()}/token`,
          },
          {
            label: "EMAIL",
            value: email,
          },
          {
            label: "PROGRAM",
            value: programCode,
          },
          {
            label: "ROUND",
            value: roundCode,
          },
        ];

        return (
          <div className="investmentActionsContainer">
            <Tooltip title={t("ADD_PROOF_OF_PAYMENT")}>
              <IconButton
                style={{ backgroundColor: "var(--color-green)" }}
                onClick={() => setOpenModalAddProofOfPayment(true)}
              >
                <AddIcon />
              </IconButton>
            </Tooltip>
            <Modal
              open={openModalAddProofOfPayment}
              onClose={() => setOpenModalAddProofOfPayment(false)}
            >
              <InformationCard
                modal
                title={t("ADD_PROOF_OF_PAYMENT")}
                style={{ minWidth: "400px" }}
              >
                <UploadButton
                  url={`adm/uploadProofPay/${id}/${programCode}/${roundCode}`}
                  loadInfo={getTableData}
                />
              </InformationCard>
            </Modal>
            <Tooltip title={t("SEE_PROOF_OF_PAYMENT")}>
              <IconButton
                style={{ backgroundColor: "var(--color-blue)" }}
                onClick={() => {
                  crowdServices
                    .getProofOfPaymentFiles(id)
                    .then((response) => {
                      setSeeProofOfPaymentFiles(response.data);
                      setOpenModalSeeProofOfPayment(true);
                    })
                    .catch(() => Notify.failure("SOMETHING_WENT_WRONG"));
                }}
              >
                <ReceiptLongIcon />
              </IconButton>
            </Tooltip>
            <Modal
              open={openModalSeeProofOfPayment}
              onClose={() => setOpenModalSeeProofOfPayment(false)}
            >
              <InformationCard
                modal
                title={t("SEE_PROOF_OF_PAYMENT")}
                style={{ minWidth: "400px" }}
              >
                <img src={seeProofOfPaymentFiles.url} />
                <div>Hash: {seeProofOfPaymentFiles.hash}</div>
              </InformationCard>
            </Modal>
            <Tooltip title={t("EDIT")}>
              <IconButton
                style={{ backgroundColor: "var(--color-yellow)" }}
                onClick={() => setOpenModalEditProofOfPayment(true)}
              >
                <EditIcon />
              </IconButton>
            </Tooltip>
            <Modal
              open={openModalEditProofOfPayment}
              onClose={() => {
                setOpenModalEditProofOfPayment(false);
                setNewInvestedAmount(0);
              }}
            >
              <InformationCard
                modal
                title={t("EDIT_INVESTMENT")}
                style={{ width: "500px" }}
              >
                <strong style={{ color: "var(--color-red)" }}>
                  {t("IMPORTANT_NOTE")}
                </strong>
                {importantFields.map(
                  ({ label, value, readOnly, onChange, initial, unit }) => {
                    return (
                      <BorderedSection
                        key={label}
                        title={t(label)}
                        className="flex items-center"
                        style={{
                          justifyContent: "space-around",
                          gap: "0.5rem",
                          marginTop: "4px",
                        }}
                      >
                        <TextField
                          label={t("INITIAL_AMOUNT")}
                          InputProps={{
                            readOnly: true,
                            endAdornment: (
                              <InputAdornment position="end">
                                {unit}
                              </InputAdornment>
                            ),
                          }}
                          value={initial}
                        />
                        <div>+</div>
                        <TextField
                          label={t("NEW_AMOUNT")}
                          InputProps={{
                            readOnly,
                            endAdornment: (
                              <InputAdornment position="end">
                                {unit}
                              </InputAdornment>
                            ),
                          }}
                          value={value}
                          onChange={onChange}
                          type="number"
                          className={readOnly ? "" : "highlightTextfield"}
                        />
                        <div>=</div>
                        <TextField
                          label={t("TOTAL_AMOUNT")}
                          InputProps={{
                            readOnly: true,
                            endAdornment: (
                              <InputAdornment position="end">
                                {unit}
                              </InputAdornment>
                            ),
                          }}
                          value={Number(initial) + Number(value)}
                        />
                      </BorderedSection>
                    );
                  }
                )}
                {investmentFields.map(({ label, value }) => {
                  return (
                    <TextField
                      key={label}
                      label={t(label)}
                      InputProps={{
                        readOnly: true,
                      }}
                      value={value}
                    />
                  );
                })}
                <Button
                  className="primary self-end"
                  onClick={() => {
                    if (newInvestedAmount !== 0)
                      Confirm.show(
                        t("CONFIRMATION"),
                        t("CONFIRMATION_MODIFY_INVESTMENT"),
                        t("CONFIRM"),
                        t("CANCEL"),
                        () => modifyInvestment(id)
                      );
                  }}
                >
                  {t("MODIFY_INVESTMENT")}
                </Button>
              </InformationCard>
            </Modal>
            <Tooltip
              title={t("DELETE")}
              onClick={() => {
                Confirm.show(
                  t("CONFIRMATION"),
                  t("CONFIRMATION_DELETE_PROOF_OF_PAYMENT"),
                  t("CONFIRM"),
                  t("CANCEL"),
                  () => deleteProofOfPayment(id)
                );
              }}
            >
              <IconButton style={{ backgroundColor: "var(--color-red)" }}>
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </div>
        );
      },
    },
  ];

  return (
    <>
      <Table
        rows={rows}
        columns={columns}
        page={page}
        setPage={setPage}
        rowsPerPage={pageSize}
        setRowsPerPage={setPageSize}
        totalResults={totalResults}
        paginatedData
        load
        isLoading={loadingTable}
      />
    </>
  );
};
