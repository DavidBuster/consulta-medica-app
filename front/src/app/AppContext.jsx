import axios from "axios";
import { Loading } from "notiflix";
import React, { createContext, useEffect, useState } from "react";

const AppContext = createContext({});

export function AppContextProvider({ children }) {
  // NATIONALITIES
  const [countryList, setCountryList] = useState([]);
  const [checkToken, setCheckToken] = useState(0);
  // useEffect(() => {
  // 	SaurusService.getNationalities().then(response =>
  // 		setNationalityCountries(response.data.countryList)
  // 	)
  // }, [])
  useEffect(() => {
    if (
      localStorage.getItem(import.meta.env.VITE_APP_LOCAL_STORAGE_TOKEN_KEY) ===
      null
    )
      return;
    Loading.circle();
    // Promise.all([
    axios
      .get("https://api.saurus.com/data/api/v1.0/country/nationality")
      .then((response) => setCountryList(response.data.countryList))

      // cryptoServices.getConfiguration().then((response) => {
      //   if (response && response?.data) {
      //     localStorage.setItem(
      //       import.meta.env.VITE_APP_LOCAL_STORAGE_CONFIGURATION_KEY,
      //       JSON.stringify(response.data)
      //     );
      //   }
      // }),
      // ])
      .finally(() => Loading.remove());
  }, [checkToken]);

  return (
    <AppContext.Provider
      value={{
        countryList,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export default AppContext;
