//載入react相關套件
import React from "react";
import ReactDOM from "react-dom/client";

//載入CSS和react元件
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

//載入normalize.css
import "normalize.css";

//將react元件和HTML相互綁定
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
