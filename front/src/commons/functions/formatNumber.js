export const formatNumber = (number, decimals = 2) => {
  const wholeNumber = Math.trunc(number);
  const decimalNumber = Math.abs(
    Math.round((number - wholeNumber) * Math.pow(10, decimals))
  );
  let decimalString = decimalNumber.toString();
  decimalString = `${"0".repeat(decimals)}${decimalString}`.substr(
    `${"0".repeat(decimals)}${decimalString}`.length - decimals
  );

  const firstString = `${wholeNumber
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ".")},${decimalString}`;

  let finalString = firstString
    .replaceAll(",", ";")
    .replaceAll(".", ",")
    .replaceAll(";", ".");

  return finalString;
};
