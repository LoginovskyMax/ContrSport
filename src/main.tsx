import ReactDOM from "react-dom/client";
import { HashRouter as Router } from "react-router-dom";

import App from "./App";
import { CheckForLogin } from "./Components/Authentication/utils";
import Footer from "./Components/Footer";
import Header from "./Components/Header";
import Loading from "./Components/Loading/Lodaing";
import PopupMessage from "./Components/Message/PopMessage";
import { ToastContainer } from 'react-toastify';
import "./index.scss";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <Router>
    <Loading />
    <PopupMessage />
    <Header />
    <App />
    <ToastContainer position="bottom-right" theme="dark"/>
    <Footer />
    <CheckForLogin />
  </Router>
);
