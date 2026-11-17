import "./Navbar.css";
import { FaTelegram } from "react-icons/fa";

export default function Navbar() {
  return (
    <header className="navbar">
      <a href="#top" className="nav-logo">TAIGA</a>
      <nav className="nav-links">
        <a href="#modules">Возможности</a>
        <a href="#inside">Внутри</a>
        <a href="#launch">Скачать</a>
        <a href="https://t.me/TaigaBroswer" target="_blank" rel="noopener noreferrer" className="nav-tg">
          <FaTelegram size={13} />
          <span>Telegram</span>
        </a>
      </nav>
    </header>
  );
}
