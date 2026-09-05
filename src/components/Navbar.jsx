import "./Navbar.css";

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
      </div>

      <div className="nav-status">
        <span />
        ONLINE
      </div>

    </nav>
  );
}