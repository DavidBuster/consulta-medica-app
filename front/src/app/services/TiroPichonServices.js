import axios from "axios";
import i18n from "../../i18n";
import {
  mockedCustomersList,
  mockedLogin2Fa,
  mockedLoginEmailPass,
} from "./mockedData";

const API_URL = import.meta.env.VITE_APP_API_URL;

class TiroPichonServices {
  // Login
  signInWithEmailAndPass = async (username, password) =>
    this.callApi("auth/login", {
      username,
      password,
    });

  savePreferences = (list) =>
    this.callApi("player/preferences", {
      list,
    });

  getPlayersList = () => this.callApi("players");

  callApi = async (url, body = null, config = {}, method) => {
    // const tokenAutoRefreshDelay = 840_000;
    // const tokenExpirationDelay = 900_000;
    // const tokenStartTime = localStorage.getItem(
    //   import.meta.env.VITE_APP_LOCAL_STORAGE_TOKEN_KEY
    // );
    // const actualTime = Date.now();

    // if (
    //   tokenStartTime !== null &&
    //   actualTime > tokenStartTime + tokenAutoRefreshDelay &&
    //   !(actualTime > tokenStartTime + tokenExpirationDelay)
    // )
    //   await this.refreshToken();

    return new Promise((resolve, reject) => {
      axios({
        method: method ?? (body ? methodTypes.post : methodTypes.get),
        url: `${API_URL}/${url}`,
        data: body,
        ...config,
        headers: {
          Authorization: `Bearer ${localStorage.getItem(
            import.meta.env.VITE_APP_LOCAL_STORAGE_TOKEN_KEY
          )}`,
          ...config.headers,
        },
      })
        .then((response) => {
          if (response.status === 200) {
            resolve(response);
          }
        })
        .catch((error) => {
          console.error(`Error in ${url}`, error);
          if (
            error?.response?.status === 401 &&
            error?.config &&
            !error?.config?.__isRetryRequest
          ) {
            console.log(`401`);
            window.location.pathname = "/login";
          } else if (error?.response?.status === 523) {
            Report.failure(
              "",
              error?.response?.data?.message ?? i18n.language === "en"
                ? error?.response?.data?.in18MessageVo?.txtEn
                  ? error?.response?.data?.in18MessageVo?.txtEn
                  : "Something went wrong"
                : error?.response?.data?.in18MessageVo?.txtEs
                ? error?.response?.data?.in18MessageVo?.txtEs
                : "Algo fue mal",
              "Ok"
            );
          }
          // else {
          //   Notify.failure(
          //     i18n?.language === "en"
          //       ? "Something went wrong. Please try again..."
          //       : "Algo salió mal. Inténtelo de nuevo"
          //   );
          // }
          reject(error);
        });
    });
  };
}

const methodTypes = { put: "put", post: "post", get: "get" };

export const tiroPichonServices = new TiroPichonServices();
