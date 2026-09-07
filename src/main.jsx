import React from 'react';
import { createRoot } from "react-dom/client";
import App from "./app/App.jsx";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/index.css";
createRoot(document.getElementById("root")).render(<App />);
