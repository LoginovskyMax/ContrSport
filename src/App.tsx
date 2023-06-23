import { Routes, Route } from "react-router-dom";

import "./App.scss";
import MainPage from "./Pages/MainPage";
import NotFound from "./Pages/NotFound/NotFound";
import themeStore from "./store/theme";

const App = () => {
  const isDark = themeStore((state) => state.isDark);

  document.addEventListener("pinch-zoom", (e) => e.preventDefault());

  return (
    <div className={isDark ? "darkApp" : "App"}>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
};

export default App;
