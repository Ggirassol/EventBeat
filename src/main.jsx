import { createRoot } from "react-dom/client";
import { HashRouter as Router } from "react-router-dom";
import App from "./App.jsx";
import { UserProvider } from "../UserContext.jsx";

createRoot(document.getElementById("root")).render(
  <UserProvider>
    <Router>
      <App />
    </Router>
  </UserProvider>
);
