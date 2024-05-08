export const checkEmail = (value) =>
  !(
    !value.includes("@saurus.com") &&
    (value.slice(-3) === "con" ||
      value.slice(-8) === "gmail.co" ||
      !new RegExp(/^[^\+]+@([\w-]+\.)+[\w-]{2,4}$/g).test(value) ||
      value.split("@")[0].length < 2 ||
      value.includes("+"))
  );
