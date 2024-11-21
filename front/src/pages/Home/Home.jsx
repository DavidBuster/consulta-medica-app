import React, { useEffect, useState } from "react";
import i18n from "../../i18n";
import es from "./i18n/es.json";
import en from "./i18n/en.json";
import { useTranslation } from "react-i18next";
import axios from "axios";

if (!i18n.hasResourceBundle("es", "home")) {
  i18n.addResourceBundle("es", "home", es, true, true);
  i18n.addResourceBundle("en", "home", en, true, true);
  // i18n.reloadResources("es", "error"); // Fuerza la recarga del namespace
}

export const Home = () => {
  const { t } = useTranslation("home");
  const [response, setResponse] = useState();

  useEffect(() => {
    // Función asíncrona para manejar la solicitud
    const fetchData = async () => {
      try {
        const res = await axios.get("http://localhost:3001/api/notes");
        setResponse(res.data); // Actualizamos el estado con los datos obtenidos
        console.log("RESPO", res.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData(); // Llamada a la función
  }, []); // El array vacío asegura que este efecto solo se ejecuta una vez

  return (
    <div>
      <div>{t("title")}</div>
      <div>{t("text")}</div>
      {response?.map((note) => (
        <div>
          {Object.entries(note).map((key, value) => (
            <div>
              {key}
              {value}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};
