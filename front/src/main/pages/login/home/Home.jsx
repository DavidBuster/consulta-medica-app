import React, { useEffect, useState } from "react";
import { Page } from "../../../../commons/components/page/Page";
import { DraggableList } from "../../../../commons/components/draggableList/DraggableList";
import { Button } from "@mui/material";
import { Loading } from "notiflix";
import { tiroPichonServices } from "../../../../app/services/TiroPichonServices";

export const Home = () => {
  const [list, setList] = useState([
    {
      name: "Kristina Zasiadka",
      image:
        "https://media.geeksforgeeks.org/wp-content/uploads/20230816223829/geeksgforgeeks-logo-1.png",
    },
    {
      name: "John Doe",
      image:
        "https://media.geeksforgeeks.org/wp-content/uploads/20230721212159/gfg-logo.jpeg",
    },
    {
      name: "Jane Smith",
      image:
        "https://media.geeksforgeeks.org/wp-content/uploads/20230909123918/GeeksforGeeks-Wide-logo-black.png",
    },
    // Add more items here
  ]);

  useEffect(() => {
    getPlayersList();
  }, []);

  const getPlayersList = () => {
    console.log("getPlayersList");
    Loading.circle();

    tiroPichonServices
      .getPlayersList()
      .then((response) => setList(response.data.list))
      .finally(() => Loading.remove());
  };

  const handleSendPreferences = () => {
    console.log("handleSendPreferences");
    Loading.circle();

    // tiroPichonServices.
  };

  return (
    <Page>
      <DraggableList items={list} setItems={setList} />
      <Button className="primary" onClick={handleSendPreferences}>
        ENVIAR
      </Button>
    </Page>
  );
};
