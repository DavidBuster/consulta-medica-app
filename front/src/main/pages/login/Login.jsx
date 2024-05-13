import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Loading } from "notiflix";
import { useTranslation } from "react-i18next";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import VisibilityIcon from "@mui/icons-material/Visibility";
import "./Login.css";
import AppContext from "../../../app/AppContext";
import {
  Card,
  Button,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import i18n from "../../../i18n";
import { tiroPichonServices as TiroPichonServices } from "../../../app/services/TiroPichonServices";
import en from "./i18n/en";
import es from "./i18n/es";
import { UnAuthorizedPage } from "../../../commons/components/unAuthorizedPage/UnAuthorizedPage";

i18n.addResourceBundle("en", "login", en);
i18n.addResourceBundle("es", "login", es);

export const Login = () => {
  useEffect(() => {
    localStorage.clear();
  }, []);

  const navigate = useNavigate();
  const { t } = useTranslation("login");
  // const [token, setToken] = useState();

  // const { setCheckToken } = useContext(AppContext);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [errorMessage, setErrorMessage] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    if (errorMessage) {
      setErrorMessage(false);
    }
    let value = e.target.value;
    setForm({
      ...form,
      [e.target.name]: value,
    });
  };

  const submitEmailAndPass = (ev) => {
    ev.preventDefault();
    Loading.circle();

    TiroPichonServices.signInWithEmailAndPass(form.email, form.password)
      .then((response) => {
        // localStorage.setItem(
        //   import.meta.env.VITE_APP_LOCAL_STORAGE_EMAIL_KEY,
        //   response.data.email
        // );
        // localStorage.setItem(
        //   import.meta.env.VITE_APP_LOCAL_STORAGE_NAME_KEY,
        //   response.data.FullName
        // );
        localStorage.setItem(
          import.meta.env.VITE_APP_LOCAL_STORAGE_TOKEN_KEY,
          response.data.token
        );
        // const timerStart = Date.now();
        // localStorage.setItem(
        //   import.meta.env.VITE_APP_LOCAL_STORAGE_START_TOKEN_TIME_KEY,
        //   timerStart
        // );
        navigate("/home");
      })
      .finally(() => Loading.remove());
  };

  // const submit2Fa = (ev) => {
  //   ev.preventDefault();
  //   Loading.circle();
  //   cryptoServices
  //     .signIn2Fa(guid, pin2Fa, token)
  //     .then((response) => {
  //       localStorage.setItem("email", form.email);
  //       localStorage.setItem(
  //         import.meta.env.VITE_APP_LOCAL_STORAGE_TOKEN_KEY,
  //         response.j
  //       );
  //       const hardOffset = 850_000;
  //       const softOffset = 600_000;
  //       const timerStart = Date.now();
  //       localStorage.setItem(
  //         import.meta.env.VITE_APP_LOCAL_STORAGE_START_TOKEN_TIME_KEY,
  //         timerStart
  //       );
  //       localStorage.setItem("timerEndSoft", timerStart + softOffset);
  //       localStorage.setItem("timerEndHard", timerStart + hardOffset);
  //       // setCheckToken((checkToken) => checkToken + 1);
  //       navigate("/customers");
  //     })
  //     .catch((err) => {
  //       setError2fa(true);
  //       setError2faMessage(t("INCORRECT_PIN"));
  //     })
  //     .finally(() => Loading.remove());
  // };

  // const handleForgotPassword = () => {
  //   window.location.href = "/recoverPassword";
  // };

  return (
    <UnAuthorizedPage>
      <Card className="loginFormContainer">
        <img
          style={{ margin: "24px" }}
          width={228}
          src="assets/images/logos/SaurusCrowd.png"
        />

        <Typography
          style={{
            fontSize: "14px",
            fontWeight: "700",
            lineHeight: "1.6",
            marginBottom: "32px",
          }}
        >
          {t("SUB_LOGIN")}
        </Typography>

        <TextField
          error={errorMessage}
          helperText={errorMessage ? t("WRONG_CREDENTIALS") : ""}
          style={{ marginBottom: "16px" }}
          label={t("EMAIL")}
          autoFocus
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          variant="outlined"
          required
          fullWidth
          onKeyPress={(event) => {
            if (event.key === "Enter") {
              submitEmailAndPass(event);
            }
          }}
          // InputProps={{
          //   readOnly: token !== undefined,
          // }}
        />

        <TextField
          fullWidth
          error={errorMessage}
          helperText={errorMessage ? t("WRONG_CREDENTIALS") : ""}
          autoComplete="on"
          style={{ marginBottom: "32px" }}
          label={t("PASSWORD")}
          type={showPassword ? "text" : "password"}
          InputProps={{
            // readOnly: token !== undefined,
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  // aria-label="toggle password visibility"
                  onClick={() =>
                    setShowPassword((showPassword) => !showPassword)
                  }
                >
                  {showPassword ? (
                    <VisibilityIcon style={{ color: "var(--color-two)" }} />
                  ) : (
                    <VisibilityOffIcon style={{ color: "var(--color-two)" }} />
                  )}
                </IconButton>
              </InputAdornment>
            ),
          }}
          name="password"
          value={form.password}
          onChange={handleChange}
          variant="outlined"
          required
          onKeyPress={(event) => {
            if (event.key === "Enter") {
              submitEmailAndPass(event);
            }
          }}
        />
        <Button
          className="primary w-full"
          disabled={form.email.length === 0 && form.password.length === 0}
          onClick={submitEmailAndPass}
        >
          {t("LOGIN")}
        </Button>

        {/* <Link
          onClick={handleForgotPassword}
          style={{
            color: "var(--color-thirteen)",
            textDecoration: "none",
            fontSize: "14px",
          }}
        >
          {t("FORGOT_PASSWORD")}
        </Link> */}
      </Card>
    </UnAuthorizedPage>
  );
};
