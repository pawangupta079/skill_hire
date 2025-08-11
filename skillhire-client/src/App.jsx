import { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [message, setMessage] = useState("Loading...");

  useEffect(() => {
    axios.get("http://localhost:5000")
      .then(res => setMessage(res.data))
      .catch(err => setMessage("Error: " + err.message));
  }, []);

  return <h1>{message}</h1>;
}

export default App;
