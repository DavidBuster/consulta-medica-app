import { useEffect, useState } from "react";
// import reactLogo from "./assets/react.svg";
// import viteLogo from "/vite.svg";
import "./App.css";
import axios from "axios";

function App() {
  const [notes, setNotes] = useState(0);

  useEffect(() => {
    const baseUrl = "/api/notes";
    axios.get(baseUrl).then((response) => console.log("RES", response));
  }, []);

  return (
    <>
      <h1>WHATS UP</h1>
      <div className="card">
        <button onClick={() => setNotes((count) => count + 1)}>
          count is {notes}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}

export default App;
