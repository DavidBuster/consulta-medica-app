import React, { useEffect, useRef, useState } from "react";
// import Button from "@material-ui/core/Button";
import {
  Button,
  IconButton,
  Tooltip,
  Box,
  Checkbox,
  CircularProgress,
  Collapse,
  Divider,
  Paper,
  Popover,
  Table as MuiTable,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import FolderOffIcon from "@mui/icons-material/FolderOff";
import SearchIcon from "@mui/icons-material/Search";
import FilterAltOffIcon from "@mui/icons-material/FilterAltOff";
import "./Table.scss";
import { useTranslation } from "react-i18next";
import i18next from "i18next";
import en from "./i18n/en";
import es from "./i18n/es";
// import {
//   Box,
//   Checkbox,
//   CircularProgress,
//   Collapse,
//   Divider,
//   Paper,
//   Popover,
//   Table as MuiTable,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableFooter,
//   TableHead,
//   TablePagination,
//   TableRow,
//   TextField,
//   Typography,
// } from "@material-ui/core";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import LastPageIcon from "@mui/icons-material/LastPage";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
// import { Colors } from "styles/colors";
import { TableInputField } from "./TableInputField";
import { ColorTag } from "../colorTag/ColorTag";
import { ExpandIcon } from "../expandIcon/ExpandIcon";

i18next.addResourceBundle("en", "tableComponent", en);
i18next.addResourceBundle("es", "tableComponent", es);

const stickyColumn = {
  position: "sticky",
  right: 0,
};
const boxShadowValue = "rgb(164, 164, 164) -5px 0px 6px -5px";

function TablePaginationActions(props) {
  const { count, page, rowsPerPage, onPageChange } = props;

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton onClick={() => onPageChange(1)} disabled={page === 0}>
        <FirstPageIcon />
      </IconButton>
      <IconButton
        onClick={() => onPageChange((currentPage) => currentPage - 1)}
        disabled={page === 0}
      >
        <KeyboardArrowLeft />
      </IconButton>
      <IconButton
        onClick={() => onPageChange((currentPage) => currentPage + 1)}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
      >
        <KeyboardArrowRight />
      </IconButton>
      <IconButton
        onClick={() =>
          onPageChange(Math.max(0, Math.ceil(count / rowsPerPage)))
        }
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
      >
        <LastPageIcon />
      </IconButton>
    </Box>
  );
}

const TextFilter = ({
  column,
  value,
  setValue,
  handleClose,
  timeOutRef,
  setTableFlag,
}) => (
  <TableInputField
    placeholder={column.title}
    value={value}
    setValue={setValue}
    autoFocus={true}
    handleEnter={handleClose}
    timeOutRef={timeOutRef}
    setTableFlag={setTableFlag}
  />
);

const DateFilter = ({ value, setValue }) => {
  const { t } = useTranslation("tableComponent");

  const [datesFocus, setDatesFocus] = useState({
    dateInit: false,
    dateEnd: false,
  });

  const handleChangeDateFilter = (e) =>
    setValue({
      ...value,
      [e.target.name]: e.target.value,
    });

  return (
    <>
      <TextField
        type={datesFocus.dateInit || value.dateInit !== "" ? "date" : "text"}
        name="dateInit"
        value={value.dateInit}
        onChange={handleChangeDateFilter}
        variant="outlined"
        label={t("INITIAL_DATE")}
        onFocus={() => setDatesFocus({ dateInit: true, dateEnd: false })}
        onBlur={() => setDatesFocus({ dateInit: false, dateEnd: false })}
        className="filterTextfield dateFilter"
        error={value.dateInit === "" && value.dateEnd !== ""}
      />
      <TextField
        type={datesFocus.dateEnd || value.dateEnd !== "" ? "date" : "text"}
        name="dateEnd"
        value={value.dateEnd}
        onChange={handleChangeDateFilter}
        variant="outlined"
        label={t("FINAL_DATE")}
        onFocus={() => setDatesFocus({ dateInit: false, dateEnd: true })}
        onBlur={() => setDatesFocus({ dateInit: false, dateEnd: false })}
        className="filterTextfield dateFilter"
        error={value.dateInit !== "" && value.dateEnd === ""}
      />
    </>
  );
};

const OptionsFilter = ({ column, value, setValue }) =>
  column.filters.map((filter) => (
    <div
      className="tableFilterOption"
      onClick={() =>
        setValue((currentFilters) =>
          !currentFilters.includes(filter.value)
            ? [...currentFilters, filter.value]
            : currentFilters.filter((filt) => filt !== filter.value)
        )
      }
    >
      <Checkbox checked={value.includes(filter.value)} />
      {column.render === ColorTag ? (
        <ColorTag tag={filter.value} />
      ) : (
        <Typography>{filter.text}</Typography>
      )}
    </div>
  ));

const FilterPopUp = ({ column, setTableFlag, timeOutRef }) => {
  const { t } = useTranslation("tableComponent");
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (clear = false) => {
    if (clear) column.filterSetter(clearState);
    setTableFlag((currentFlag) => !currentFlag);
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  let FilterRender;
  let icon;
  let clearState;

  switch (column?.filterType) {
    case filterTypes.text:
      FilterRender = TextFilter;
      clearState = "";
      icon = (
        <SearchIcon
          style={{
            color: column.filteredValue !== "" ? "var(--color-secondary)" : "",
          }}
        />
      );
      break;
    case filterTypes.date:
      FilterRender = DateFilter;
      clearState = {
        dateInit: "",
        dateEnd: "",
      };
      icon = (
        <CalendarMonthIcon
          style={{
            color: Object.values(column.filteredValue).every(
              (value) => value !== ""
            )
              ? "var(--color-secondary)"
              : Object.values(column.filteredValue).every(
                  (value) => value === ""
                )
              ? ""
              : "red",
          }}
        />
      );
      break;
    case filterTypes.options:
      FilterRender = OptionsFilter;
      clearState = [];
      icon = (
        <FilterAltIcon
          style={{
            color:
              column?.filteredValue?.length > 0 ? "var(--color-secondary)" : "",
          }}
        />
      );
      break;

    default:
      return <></>;
  }

  return (
    <>
      {icon && <IconButton onClick={handleClick}>{icon}</IconButton>}
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={() => handleClose()}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <div
          className="flex flex-col"
          style={{
            width: "250px",
            minWidth: "min-content",
            padding: "0.5rem",
            gap: "8px",
          }}
        >
          <FilterRender
            column={column}
            handleClose={handleClose}
            value={column.filteredValue}
            setValue={column.filterSetter}
            timeOutRef={timeOutRef}
            setTableFlag={setTableFlag}
          />
          <div
            className="w-full flex"
            style={{
              gap: "8px",
            }}
          >
            <Button
              className="w-full primary"
              // variant="contained"
              // color="secondary"
              onClick={() => {
                handleClose();
              }}
              startIcon={<SearchIcon className="text-black" />}
            >
              {t("SEARCH")}
            </Button>
            <Button
              className="w-full secondary"
              // style={{
              //   backgroundColor: "red",
              // }}
              variant="contained"
              onClick={() => {
                handleClose(true);
              }}
              startIcon={<FilterAltOffIcon className="text-black" />}
            >
              {t("CLEAR")}
            </Button>
          </div>
        </div>
      </Popover>
    </>
  );
};

function Row(props) {
  const { t } = useTranslation("tableComponent");
  const {
    row,
    lastRow,
    rowInd,
    openedRow,
    setOpenedRow,
    expandable,
    sortedKeys,
    columns,
    isScrollable,
    tableContainer,
    expandedRowsIndexes,
    setExpandedRowsIndexes,
    singleExpanded,
    onRowClick,
    selectedRow,
    selectedRowsIndexes,
    setSelectedRowsIndexes,
  } = props;

  const selected =
    selectedRowsIndexes.includes(row.guid) ?? row.guid === selectedRow;

  const opened = expandedRowsIndexes.includes(rowInd) ?? rowInd === openedRow;

  const [isOpenTooltip, setIsOpenTooltip] = useState(false);

  const handleMouseEnter = () => {
    setIsOpenTooltip(true);

    // Hide the tooltip after 1 second
    setTimeout(() => {
      setIsOpenTooltip(false);
    }, 1000);
  };

  const handleMouseLeave = () => {
    setIsOpenTooltip(false);
  };

  return (
    <>
      <Tooltip
        title={
          expandable
            ? opened
              ? t("COLLAPSE")
              : t("EXPAND")
            : onRowClick
            ? selected
              ? t("VIEW_ALL_WALLETS_TRANSACTIONS")
              : t("VIEW_WALLET_TRANSACTIONS")
            : ""
        }
        followCursor
        open={isOpenTooltip}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <TableRow
          className={`${expandable || onRowClick ? "pointerCursor" : ""} ${
            lastRow ? "lastRow" : ""
          } ${opened || selected ? "highlightedRow" : ""}`}
          onClick={() => {
            if (expandable) {
              setExpandedRowsIndexes(
                expandedRowsIndexes.includes(rowInd)
                  ? expandedRowsIndexes.filter((el) => el !== rowInd)
                  : singleExpanded
                  ? [rowInd]
                  : [...expandedRowsIndexes, rowInd]
              );
            }
            if (onRowClick) {
              setSelectedRowsIndexes(
                selectedRowsIndexes.includes(row.guid)
                  ? selectedRowsIndexes.filter((el) => el !== row.guid)
                  : singleExpanded
                  ? [row.guid]
                  : [...selectedRowsIndexes, row.guid]
              );
              onRowClick(row);
            }
          }}
          sx={{ "& > *": { borderBottom: "unset" } }}
        >
          {expandable && (
            <TableCell>
              <IconButton>
                <ExpandIcon expanded={opened} />
              </IconButton>
            </TableCell>
          )}
          {sortedKeys.map((key) => {
            const col = columns.find((col) => col?.key === key);
            return (
              <TableCell
                key={key}
                align="left"
                style={{
                  textWrap: "nowrap",
                  ...(col.fixed && isScrollable(tableContainer)
                    ? {
                        ...stickyColumn,
                        backgroundColor: "white",
                        boxShadow: !columns
                          .slice(
                            0,
                            columns.findIndex((column) => column === col)
                          )
                          .some((col) => "fixed" in col)
                          ? boxShadowValue
                          : "",
                      }
                    : {}),
                }}
              >
                {("render" in col
                  ? col?.render(row[key], row, rowInd, {
                      handleMouseEnter,
                      handleMouseLeave,
                    })
                  : row[key]) ?? "-"}
              </TableCell>
            );
          })}
        </TableRow>
      </Tooltip>
      {expandable && opened && (
        <TableRow
          className="expandableRow"
          style={{ backgroundColor: "#F0F1F3" }}
        >
          <TableCell
            style={{
              padding: opened ? "16px" : "0px",
              borderBottom: !opened ? "none" : "",
              // borderBottom: !open ? '1px solid transparent' : ''
            }}
            colSpan={sortedKeys.length + 1}
          >
            {/* <Collapse in={opened} timeout='auto' unmountOnExit> */}
            {/* <Box sx={{ margin: 1 }}> */}
            {expandable.expandedRowRender(row)}
            {/* </Box> */}
            {/* </Collapse> */}
          </TableCell>
        </TableRow>
      )}
    </>
  );
}

const Table = (props) => {
  const {
    rows = [],
    columns,
    expandable,
    paginatedData,
    isLoading,
    page,
    setPage,
    rowsPerPage,
    setRowsPerPage,
    initialRowsPerPage = 10,
    totalResults,
    setTableFlag = () => {},
    openedRow,
    singleExpanded = true,
    className,
    noPagination,
    onRowClick,
    selectedRow,
  } = props;
  const { t } = useTranslation("tableComponent");
  const propTotalResults = totalResults ?? rows?.length;

  const [componentPage, setComponentPage] = useState(1);
  const actualPage = page ?? componentPage;

  const [rowssPerPage, setRowssPerPage] = useState(initialRowsPerPage);
  const actualRowsPerPage = rowsPerPage ?? rowssPerPage;
  const setActualRowsPerPage = setRowsPerPage ?? setRowssPerPage;

  const timeOutRef = useRef(null);
  const [componentOpenedRow, setComponentOpenedRow] = useState(openedRow);
  const [componentSelectedRow, setComponentSelectedRow] = useState(selectedRow);

  const [expandedRowsIndexes, setExpandedRowsIndexes] = useState([]);
  const [selectedRowsIndexes, setSelectedRowsIndexes] = useState([]);
  useEffect(() => {
    setComponentOpenedRow(openedRow);
    setExpandedRowsIndexes([]);
  }, [openedRow]);

  useEffect(() => {
    setComponentSelectedRow(selectedRow);
    if (!rows.map((row) => row.guid).includes(selectedRow))
      setSelectedRowsIndexes([]);
  }, [selectedRow]);

  const handleChangePage = (newPage) => {
    if (setPage) setPage(newPage);
    else setComponentPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setActualRowsPerPage(parseInt(event.target.value));
    if (setPage) setPage(1);
    else setComponentPage(1);
  };

  const sortedKeys = columns.map((column) => column.key);

  function isScrollableHorizontally(element) {
    return element?.scrollWidth > element?.clientWidth;
  }

  var tableContainer = document.getElementById("tableContainer");

  const [dimensions, setDimensions] = useState({
    height: window.innerHeight,
    width: window.innerWidth,
  });

  useEffect(() => {
    function handleResize() {
      setDimensions({
        height: window.innerHeight,
        width: window.innerWidth,
      });
    }

    window.addEventListener("resize", handleResize);

    return (_) => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const myElementRef = useRef(null);
  const [elementHeight, setElementHeight] = useState(0);

  useEffect(() => {
    const element = myElementRef.current;

    if (!element) return;

    const resizeObserver = new ResizeObserver((entries) => {
      // The ResizeObserver callback is called whenever the size of the observed element changes
      for (const entry of entries) {
        const newHeight = entry.target.clientHeight;
        setElementHeight(newHeight);
      }
    });

    // Start observing the element
    resizeObserver.observe(element);

    // Clean up by disconnecting the ResizeObserver when the component unmounts
    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <div
      style={{
        flex: "1 0 auto",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
      className={className}
    >
      <TableContainer
        component={Paper}
        style={{
          maxHeight: isScrollableHorizontally(tableContainer)
            ? elementHeight + 8
            : elementHeight,
          borderRadius: "4px 4px 0px 0px",
          // flex: flexBasisAuto ? '1 0 auto' : '1 0 0px'
          flex: "1 0 auto",
          boxShadow: noPagination !== undefined ? "none" : "",
        }}
        id="tableContainer"
      >
        <MuiTable
          ref={myElementRef}
          stickyHeader
          style={{ borderCollapse: expandable ? "collapse" : "" }}
        >
          <TableHead>
            <TableRow>
              {expandable && <TableCell />}
              {columns.map((column, index) => (
                <TableCell
                  key={column.key}
                  align="left"
                  style={{
                    ...(column.fixed &&
                      isScrollableHorizontally(tableContainer) && {
                        ...stickyColumn,
                        boxShadow: !columns
                          .slice(
                            0,
                            columns.findIndex((col) => column === col)
                          )
                          .some((col) => "fixed" in col)
                          ? boxShadowValue
                          : "",
                      }),
                    ...column,
                  }}
                >
                  <div
                    className="flex items-center"
                    style={{ justifyContent: "space-between" }}
                  >
                    <div
                      className="flex items-center w-full"
                      style={{ justifyContent: "space-between" }}
                    >
                      {column.title}
                      <FilterPopUp
                        column={column}
                        setTableFlag={setTableFlag}
                        timeOutRef={timeOutRef}
                      />
                    </div>
                    {index !== columns.length - 1 && (
                      <Divider
                        orientation="vertical"
                        style={{
                          height: "3rem",
                          marginLeft: column.filterType ? "" : "16px",
                        }}
                      />
                    )}
                  </div>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody className="relative">
            <TableRow className={`loadingDiv ${isLoading ? "isLoading" : ""}`}>
              <TableCell className="border-0">
                {isLoading && <CircularProgress />}
              </TableCell>
            </TableRow>
            {rows?.length === 0 ? (
              <TableRow className="noHover">
                <TableCell
                  colSpan={expandable ? columns.length + 1 : columns.length}
                >
                  <div
                    className="h-full w-full flex justify-center items-center"
                    style={{ minHeight: "15rem" }}
                  >
                    <div className="flex flex-col gap-8 items-center justify-center">
                      <FolderOffIcon
                        style={{
                          width: "6rem",
                          height: "6rem",
                          color: "lightgrey",
                        }}
                      />
                      <Typography style={{ color: "lightgrey" }}>
                        {t("NO_DATA")}
                      </Typography>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              rows
                ?.slice(
                  !paginatedData ? (actualPage - 1) * actualRowsPerPage : 0,
                  !paginatedData
                    ? actualPage * actualRowsPerPage
                    : actualRowsPerPage
                )
                ?.map((row, ind, mappedRows) => (
                  <Row
                    key={(actualPage - 1) * actualRowsPerPage + ind}
                    row={row}
                    rowInd={ind}
                    lastRow={
                      noPagination === undefined &&
                      ind === mappedRows.length - 1
                    }
                    openedRow={componentOpenedRow}
                    setOpenedRow={setComponentOpenedRow}
                    expandable={expandable}
                    sortedKeys={sortedKeys}
                    columns={columns}
                    isScrollable={isScrollableHorizontally}
                    tableContainer={tableContainer}
                    // open={expandedRowsIndexes.includes(ind)}
                    expandedRowsIndexes={expandedRowsIndexes}
                    setExpandedRowsIndexes={setExpandedRowsIndexes}
                    singleExpanded={singleExpanded}
                    onRowClick={onRowClick}
                    selectedRow={selectedRow}
                    selectedRowsIndexes={selectedRowsIndexes}
                    setSelectedRowsIndexes={setSelectedRowsIndexes}
                  />
                ))
            )}
          </TableBody>
        </MuiTable>
      </TableContainer>
      {noPagination === undefined && (
        <TableContainer
          style={{
            boxShadow:
              "0px 2px 1px -1px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12)",
            marginTop: "-1px",
          }}
        >
          <MuiTable style={{ borderTop: "1px solid rgb(224, 224, 224)" }}>
            <TableFooter>
              <TableRow>
                <TablePagination
                  style={stickyColumn}
                  rowsPerPageOptions={[5, 10, 25]}
                  colSpan={expandable ? columns.length + 1 : columns.length}
                  // count={propTotalResults - 1 ?? 0}
                  count={propTotalResults ?? 0}
                  rowsPerPage={actualRowsPerPage}
                  page={actualPage - 1}
                  SelectProps={{
                    native: true,
                  }}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  ActionsComponent={TablePaginationActions}
                  labelRowsPerPage={t("ROWS_PER_PAGE")}
                />
              </TableRow>
            </TableFooter>
          </MuiTable>
        </TableContainer>
      )}
    </div>
  );
};

export const filterTypes = {
  options: "options",
  date: "date",
  text: "text",
};

export default Table;
