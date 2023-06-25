import { Routes, Route } from "react-router-dom";

import "./App.scss";
import CreateGame from "./Pages/CreateGame/CreateGame";
import MainPage from "./Pages/MainPage";
import NotFound from "./Pages/NotFound/NotFound";
import themeStore from "./store/theme";
import PayPage from "./Pages/PayPage/PayPage";

const App = () => {
  const isDark = themeStore((state) => state.isDark);

  document.addEventListener("pinch-zoom", (e) => e.preventDefault());

  return (
    <div className={isDark ? "darkApp" : "App"}>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/createGame" element={<CreateGame />} />
        <Route path="/pay-page/:gameId" element={<PayPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
};

export default App;
