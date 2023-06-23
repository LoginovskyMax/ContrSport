import { type FC } from "react";

import languageStore from "../../store/language";
import themeStore from "../../store/theme";
import "./style.scss";

const Footer: FC = () => {
  const theme = themeStore((state) => state.isDark);
  const { isEn } = languageStore();

  return (
    <footer className={theme ? "footer dark" : "footer"}>
      <p className="footer__year">© 2023</p>
      <div className="footer__content">
        <a href="https://github.com/jerubrin" target="_blank" rel="noreferrer">
          {isEn ? "Алексей Купцов" : "Alexey Kuptsov"}
        </a>
        <p>|</p>
        <a
          href="https://github.com/LoginovskyMax"
          target="_blank"
          rel="noreferrer"
        >
          {isEn ? "Максим Логиновский" : "Maxim Loginovsky"}
        </a>
      </div>
      <a href="https://terricon.kz/ru" target="_blank" rel="noreferrer">
        <img
          src={theme ? "images/white_logo.gif" : "images/logo.gif"}
          alt="logo"
          className="footer__logo"
        />
      </a>
    </footer>
  );
};

export default Footer;
