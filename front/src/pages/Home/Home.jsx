import React, { useEffect, useState } from "react";
import i18n from "../../i18n";
import es from "./i18n/es.json";
import en from "./i18n/en.json";
import { useTranslation } from "react-i18next";
import axios from "axios";
import MapComponent from "../../components/MapComponent/MapComponent";
import { Helmet } from "react-helmet";

if (!i18n.hasResourceBundle("es", "home")) {
  i18n.addResourceBundle("es", "home", es, true, true);
  i18n.addResourceBundle("en", "home", en, true, true);
  // i18n.reloadResources("es", "error"); // Fuerza la recarga del namespace
}

export const Home = () => {
  const { t } = useTranslation("home");
  const [response, setResponse] = useState();
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    // Función asíncrona para manejar la solicitud
    const fetchData = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/notes`);
        // const res = await axios.get("/api/notes");
        setResponse(res.data); // Actualizamos el estado con los datos obtenidos
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData(); // Llamada a la función
  }, []); // El array vacío asegura que este efecto solo se ejecuta una vez

  // console.log("RESPONSE", response);

  return (
    <div>
      <Helmet>
        <script type="application/ld+json">
          {`
          {
            "@context": "https://schema.org",
            "@type": "MedicalBusiness",
            "name": "Consulta Médica Ejemplo",
            "url": "https://www.tusitio.com",
            "logo": "https://www.tusitio.com/logo.png",
            "image": "https://www.tusitio.com/imagen-de-la-consulta.jpg",
            "description": "Consulta médica especializada en atención primaria.",
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "Calle Ejemplo 123",
              "addressLocality": "Madrid",
              "addressRegion": "Madrid",
              "postalCode": "28001",
              "addressCountry": "ES"
            },
            "telephone": "+34-123-456-789",
            "sameAs": [
              "https://www.facebook.com/tuconsulta",
              "https://www.instagram.com/tuconsulta"
            ],
            "openingHours": "Mo-Fr 09:00-18:00"
          }
          `}
        </script>
      </Helmet>
      <div>{t("title")}</div>
      <div>{t("text")}</div>
      {response?.map((note) => (
        <div>{note.content}</div>
      ))}
      <MapComponent />
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1066.4421422015366!2d-4.505367888448788!3d36.61172929402674!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd72fb8a1aca004f%3A0x5140dcde607fe166!2sAv.%20Carlota%20Alessandri%2C%2033%2C%2029620%20Torremolinos%2C%20M%C3%A1laga!5e1!3m2!1sen!2ses!4v1732710077683!5m2!1sen!2ses"
        width="600"
        height="450"
        // style="border:0;"
        // allowfullscreen=""
        loading="lazy"
        // referrerpolicy="no-referrer-when-downgrade"
      ></iframe>
    </div>
  );
};
