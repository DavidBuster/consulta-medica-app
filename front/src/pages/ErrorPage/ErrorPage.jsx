import { useTranslation } from "react-i18next";
import { Link, useRouteError } from "react-router-dom";

import es from "./i18n/es.json";
import en from "./i18n/en.json";
import { useEffect } from "react";
import i18n from "../../i18n";

if (!i18n.hasResourceBundle("es", "error")) {
  i18n.addResourceBundle("es", "error", es, true, true);
  i18n.addResourceBundle("en", "error", en, true, true);
}

export default function ErrorPage() {
  const { t } = useTranslation("error");
  const error = useRouteError();
  console.error(error);

  return (
    <div id="error-page">
      <h1>Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <p>
        {/* <i>{error.statusText || error.message}</i> */}
        <i>{t("title")}</i>
      </p>
      <Link to={"/home"}>GO TO GOME</Link>
    </div>
  );
}
