import "./Navbar.css";
import { FaTelegram } from "react-icons/fa";

export default function Navbar() {
  return (
    <nav className="navbar">

      <a
        href="/"
        className="nav-logo"
      >
        TAIGA
      </a>

      <div className="nav-links">
        <a href="#features">
          FEATURES
        </a>

        <a href="#download">
          DOWNLOAD
        </a>

        <a
          href="t.me/TaigaBroswer"
          target="_blank"
          rel="noopener noreferrer"
          className="nav-tg"
        >
          <FaTelegram size={13} />
          <span>TELEGRAM</span>
        </a>
      </div>

      <div className="nav-status">
        <span />
        ONLINE
      </div>

    </nav>
