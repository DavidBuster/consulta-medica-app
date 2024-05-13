import React, { useEffect } from "react";
import { AppContextProvider } from "./AppContext";
import {
  Route,
  BrowserRouter as Router,
  Routes,
  useLocation,
} from "react-router-dom";
import "../styles/styles.scss";
import { Confirm, Loading } from "notiflix";
import { NavBarLateral } from "../main/components/navBarLateral/NavBarLateral";
import "./App.scss";
import { NavBarTop } from "../main/components/navBarTop/NavBarTop";
import { routesDict } from "./routes";

Loading.init({
  svgColor: "var(--color-primary)",
});

Confirm.init({
  okButtonBackground: "var(--color-primary)",
  okButtonColor: "var(--color-secondary)",
  borderRadius: "5px",
  titleColor: "var(--color-primary)",
  cancelButtonColor: "var(--color-primary)",
  cancelButtonBackground: "var(--color-secondary)",
  messageMaxLength: 999,
  titleMaxLength: 999,
});

export const AppRoutes = () => {
  const location = useLocation();

  const displayNavBars = location.pathname !== "/login";
  // && location.pathname !== "/recoverPassword" &&
  // location.pathname.split("/")?.[1] !== "EmailrecoverPassword";

  let tokenKey = import.meta.env.VITE_APP_LOCAL_STORAGE_TOKEN_KEY;
  const token = localStorage.getItem(tokenKey);
  // const startTimeTokenKey = import.meta.env
  //   .VITE_APP_LOCAL_STORAGE_START_TOKEN_TIME_KEY;
  // const startTimeToken = JSON.parse(localStorage.getItem(startTimeTokenKey));
  // const timerDelayToLogout = 900_000;

  if (
    token === null &&
    displayNavBars
    // || (startTimeToken !== null &&
    //   startTimeToken + timerDelayToLogout < new Date().getTime())
  )
    window.location.pathname = "/login";

  return (
    <>
      {displayNavBars && <NavBarLateral />}
      <div className="appPage">
        {displayNavBars && <NavBarTop />}
        <Routes>
          {Object.values(routesDict)
            .flat(1)
            .map((el) => (
              <Route key={el.path} path={el.path} element={el.element} />
            ))}
        </Routes>
      </div>
    </>
  );
};

const App = () => {
  return (
    <AppContextProvider>
      <div className="app">
        <Router>
          <AppRoutes />
        </Router>
      </div>
    </AppContextProvider>
  );
};

export default App;
