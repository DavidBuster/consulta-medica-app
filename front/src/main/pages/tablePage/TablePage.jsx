import React, { useEffect, useState } from "react";
import Table from "../../../commons/components/table/Table";
import { useTranslation } from "react-i18next";
import en from "./i18n/en";
import es from "./i18n/es";
import i18n from "../../../i18n";
import { crowdServices } from "../../../app/services/CrowdServices";
import Highlighter from "react-highlight-words";
import { ColorTag } from "../../../commons/components/colorTag/ColorTag";
import { format } from "date-fns";
import { Button, TextField, Tooltip, IconButton } from "@mui/material";
import PersonSearchIcon from "@mui/icons-material/PersonSearch";
import { Link } from "react-router-dom";
import "./TablePage.scss";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import FilterAltOffRoundedIcon from "@mui/icons-material/FilterAltOffRounded";
import ClearIcon from "@mui/icons-material/Clear";
import { highlightedRender } from "../../../commons/functions/highlightedRender";
import Accordion from "@mui/material/Accordion";
import { InvestmentHeaders } from "../../../commons/components/investmentHeaders/InvestmentHeaders";

i18n.addResourceBundle("en", "kycPending", en);
i18n.addResourceBundle("es", "kycPending", es);

export const TablePage = ({ url, params, headers }) => {
  const { t } = useTranslation("kycPending");
  const [data, setData] = useState({ listUsers: [] });
  const rows = data?.listUsers;
  const totalResults = data?.totalResults;
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [filterEmail, setFilterEmail] = useState("");
  const [filterFullName, setFilterFullName] = useState("");
  const [loadingTable, setLoadingTable] = useState(false);
  const [expanded, setExpanded] = useState("");

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  useEffect(() => {
    setFilterEmail("");
    setFilterFullName("");
    setPage(1);
    setPageSize(10);
  }, [url, params]);

  useEffect(() => {
    getTableData();
  }, [url, params, page, pageSize]);

  const getTableData = (clear = false) => {
    setLoadingTable(true);
    crowdServices
      .getTableData(
        url,
        page,
        pageSize,
        clear ? "" : filterEmail,
        clear ? "" : filterFullName,
        params
      )
      .then((response) => {
        setData(response.data);
      })
      .finally(() => setLoadingTable(false));
  };

  const columns = [
    {
      title: t("FULL_NAME"),
      key: "FullName",
      render: (text) => highlightedRender(text, filterFullName),
    },
    {
      title: t("EMAIL"),
      key: "email",
      render: (text) => highlightedRender(text, filterEmail),
    },
    {
      title: t("PHONE"),
      key: "phone",
    },
    {
      title: t("AMOUNT"),
      key: "estimatedAmount",
    },
    {
      title: t("CURRENCY"),
      key: "currency",
    },
    {
      title: t("KYC_STATUS"),
      key: "kycStatus",
      render: ColorTag,
    },
    {
      title: t("CREATION_DATE"),
      key: "createdDate",
      render: (createDate) => {
        if (createDate) return format(createDate, "dd-MM-yyyy");
      },
    },
    {
      title: t("ACTIONS"),
      key: "actions",
      render: (_, row) => (
        <Tooltip title={t("CUSTOMER_DETAILS")}>
          <Link to={`/customer/${row.id}`}>
            <PersonSearchIcon />
          </Link>
        </Tooltip>
      ),
    },
  ];

  const filters = [
    {
      value: filterFullName,
      setValue: setFilterFullName,
      label: "FULL_NAME",
    },
    {
      value: filterEmail,
      setValue: setFilterEmail,
      label: "EMAIL",
    },
  ];

  return (
    <>
      {headers && (
        <div>
          {headers.map((header) => (
            <InvestmentHeaders
              key={header.url}
              header={header}
              expanded={expanded}
              setExpanded={setExpanded}
            />
          ))}
        </div>
      )}
      <div className="tableFilters">
        {filters.map((el) => (
          <TextField
            value={el.value}
            onChange={(ev) => el.setValue(ev.target.value)}
            variant="outlined"
            label={t(el.label)}
            onKeyPress={(event) => {
              if (event.key === "Enter") {
                getTableData();
              }
            }}
            InputProps={{
              endAdornment: (
                <IconButton
                  sx={{ visibility: el.value ? "visible" : "hidden" }}
                  onClick={() => {
                    el.setValue("");
                  }}
                >
                  <ClearIcon />
                </IconButton>
              ),
            }}
          />
        ))}
        <Button
          className="primary"
          onClick={() => getTableData()}
          startIcon={<SearchRoundedIcon />}
        >
          {t("SEARCH")}
        </Button>
        <Button
          className="secondary"
          onClick={() => {
            setFilterEmail("");
            setFilterFullName("");
            getTableData(true);
          }}
          startIcon={<FilterAltOffRoundedIcon />}
        >
          {t("CLEAR")}
        </Button>
      </div>
      <Table
        rows={rows}
        columns={columns}
        page={page}
        setPage={setPage}
        rowsPerPage={pageSize}
        setRowsPerPage={setPageSize}
        totalResults={totalResults}
        paginatedData
        // setTableFlag={setFlag}
        isLoading={loadingTable}
      />
    </>
  );
};
