import { createRoot } from "react-dom/client";
import "./index.css";
import {
  BrowserRouter as Router,

} from "react-router-dom";
import App from "./App.jsx";
let str = "";

createRoot(document.getElementById("root")).render(
  <Router>
    <App></App>
  </Router>
);
