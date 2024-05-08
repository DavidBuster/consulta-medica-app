import { Tooltip } from "@mui/material";
import React from "react";
import "./RoundedNumber.scss";
import { formatNumber } from "../../functions/formatNumber";
// import { formatNumber } from "../../functions/formatNumber";

export const RoundedNumber = ({ value, decimals = 4, unit }) => {
  const roundedValue = (
    Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals)
  ).toFixed(decimals);
  console.log(
    "RN",
    value,
    roundedValue,
    formatNumber(roundedValue, 4),
    formatNumber(value, 4)
  );
  return (
    <div className="roundedNumber">
      {Number(value) !== Number(roundedValue) ? (
        <Tooltip
          title={formatNumber(
            value,
            value.toString().match(/\.(?:\d*)$/)?.[0]?.length - 1 || 0
          )
            ?.toString()
            .replace(/^-?\d+(?:\.\d+)?(?:[eE][-+]?\d+)?$/, function (match) {
              return parseFloat(match)
                .toFixed(20)
                .replace(/\.?0+$/, ""); // Remove trailing zeros
            })}
        >
          <div className="flex">
            <div className="roundedVirgulilla">~</div>
            <div>
              {formatNumber(roundedValue, decimals)} {unit}
            </div>
          </div>
        </Tooltip>
      ) : (
        <>
          {formatNumber(roundedValue, decimals)} {unit}
        </>
      )}
    </div>
  );
};
