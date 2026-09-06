import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FaWindows, FaLinux, FaTelegram } from "react-icons/fa";

import Navbar from "./components/Navbar";
import BrowserMockup from "./components/BrowserMockup";
import Feature from "./components/Feature";
import ParticleField from "./components/ParticleField";

import "./App.css";

gsap.registerPlugin(ScrollTrigger, useGSAP);

function App() {
  const page = useRef(null);

  useGSAP(
    () => {


      const heroTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: ".hero",
          start: "top top",
          end: "+=1800",
          scrub: 1.5,
          pin: true,
        },
      });

      heroTimeline
        .to(".hero-title", {
          scale: 0.55,
          y: -260,
          opacity: 0,
          ease: "none",
        })
        .to(
          ".hero-subtitle",
          {
            y: -100,
            opacity: 0,
            ease: "none",
          },
          "<"
        )
        .to(
          ".hero-browser",
          {
            scale: 1,
            y: 0,
            rotateX: 0,
            rotateY: 0,
            opacity: 1,
            ease: "power2.out",
          },
          0.15
        )
        .to(
          ".hero-grid",
          {
            opacity: 0.2,
          },
          0.1
        );




      const browserTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: ".browser-section",
          start: "top top",
          end: "+=2200",
          scrub: 1.5,
          pin: true,
        },
      });

      browserTimeline
        .fromTo(
          ".browser-section-title",
          {
            opacity: 0,
            y: 100,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.25,
          }
        )
        .to(".browser-main", {
          scale: 1.12,
          duration: 0.3,
        })
        .to(".browser-main", {
          scale: 0.82,
          x: -180,
          duration: 0.35,
        })
        .to(".browser-info", {
          opacity: 1,
          x: 0,
          duration: 0.35,
        });


      gsap.utils.toArray(".feature").forEach((feature) => {
        const image = feature.querySelector(".feature-visual");
        const text = feature.querySelector(".feature-content");

        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: feature,
            start: "top 75%",
            end: "bottom 25%",
            scrub: 1.5,
          },
        });

        timeline
          .fromTo(
            image,
            {
              opacity: 0,
              y: 120,
              scale: 0.8,
            },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.5,
            }
          )
          .fromTo(
            text,
            {
              opacity: 0,
              y: 70,
            },
            {
              opacity: 1,
              y: 0,
              duration: 0.4,
            },
            "-=0.25"
          );
      });


      const download = gsap.timeline({
        scrollTrigger: {
          trigger: ".download",
          start: "top 80%",
          end: "bottom 30%",
          scrub: 1.5,
        },
      });

      download
        .from(".download-title", {
          opacity: 0,
          y: 100,
        })
        .from(
          ".download-button",
          {
            opacity: 0,
            scale: 0.7,
          },
          "-=0.2"
        );

      /* --------------------------------
         MOUSE PARALLAX
      -------------------------------- */

      const handleMouseMove = (event) => {
        const x = event.clientX / window.innerWidth - 0.5;
        const y = event.clientY / window.innerHeight - 0.5;

        gsap.to(".hero-title", {
          x: x * 20,
          y: y * 20,
          duration: 1.5,
          ease: "power3.out",
        });

        gsap.to(".hero-browser", {
          rotateY: x * 5,
          rotateX: y * -5,
          duration: 1,
          ease: "power3.out",
        });
      };

      window.addEventListener("mousemove", handleMouseMove);

      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
      };
    },
    { scope: page }
  );

  return (
    <main ref={page}>
      <div className="ambient-aurora aurora-1" />
      <div className="ambient-aurora aurora-2" />
      <div className="ambient-aurora aurora-3" />
      <div className="noise-overlay" />
      <Navbar />

      <section className="hero">
        <ParticleField />

        <div className="hero-grid" />

        <div className="hero-content">

          <p className="hero-label">
            TAIGA / NEXT GEN
          </p>

          <h1 className="hero-title">
            TAIGA
          </h1>

          <p className="hero-subtitle">
            Браузер, который не просто быстрее.
            <br />
            Он создаёт совершенно другой интернет.
          </p>

          <div className="scroll-hint">
            <span>DISCOVER</span>
            <div className="scroll-line" />
          </div>
        </div>

        <div className="hero-browser">
          <BrowserMockup />
        </div>
      </section>

      <section className="manifesto">
        <div className="manifesto-inner">
          <span className="section-number">02</span>

          <h2>
            Интернет
            <br />
            должен быть
            <br />
            <span>твоим.</span>
          </h2>

          <p>
            TAIGA — это не просто ещё один браузер.
            Это собственное пространство между тобой
            и интернетом.
          </p>
        </div>
      </section>

      <section className="browser-section">
        <div className="browser-section-title">
          <span>03 / THE BROWSER</span>

          <h2>
            Один браузер.
            <br />
            Полный контроль.
          </h2>
        </div>

        <div className="browser-main">
          <BrowserMockup />
        </div>

        <div className="browser-info">
          <span>TAIGA UI</span>

          <h3>
            Минимум шума.
            <br />
            Максимум пространства.
          </h3>

          <p>
            Интерфейс создан так, чтобы браузер
            не мешал тебе пользоваться интернетом.
          </p>
        </div>
      </section>

      <section className="features">

        <Feature
          number="04"
          title="Быстрый"
          description="TAIGA запускается мгновенно и остаётся быстрым даже тогда, когда у тебя открыты десятки вкладок."
          type="speed"
        />

        <Feature
          number="05"
          title="Приватный"
          description="Твои данные остаются твоими. Никаких лишних трекеров и навязчивого поведения."
          type="privacy"
        />

        <Feature
          number="06"
          title="Красивый"
          description="Каждая деталь интерфейса создана с нуля — от вкладок до новой страницы."
          type="design"
        />

      </section>

      <section className="final">

        <ParticleField />

        <div className="final-content">
          <span>07 / FINAL</span>

          <h2>
            Интернет
            <br />
            начинается
            <br />
            здесь.
          </h2>

          <p>
            Попробуй TAIGA Browser.
          </p>

          <a
            href="#download"
            className="final-button"
          >
            DOWNLOAD TAIGA
          </a>
        </div>

      </section>

<section
  className="download"
  id="download"
>
  <span>TAIGA BROWSER</span>

  <h2 className="download-title">
    Готов попробовать?
  </h2>

  <div className="download-platforms">

    <a
      href="https://mega.nz/file/24IxUa6Y#oApAQbImyjKEYQcSBLG46WVC614QLfUUNJQ97xutYKs"
      target="_blank"
      rel="noopener noreferrer"
      className="download-platform active"
    >
      <div className="platform-icon">
        <FaWindows size={22} />
      </div>

      <div className="platform-info">
        <strong>Windows</strong>
        <small>WINDOWS · x64, ARM64</small>
      </div>

      <span className="platform-arrow">
        ↓
      </span>
    </a>

    <div className="download-platform disabled">
      <div className="platform-icon">
        <FaLinux size={26} />
      </div>

      <div className="platform-info">
        <strong>Linux</strong>
        <small>COMING SOON</small>
      </div>

      <span className="platform-soon">
        SOON
      </span>
    </div>

    <div className="download-platform disabled">
      <div className="platform-icon">
        <FaWindows size={22} />
      </div>

      <div className="platform-info">
        <strong>Windows Educational</strong>
        <small>FOR SCHOOLS & UNIVERSITIES</small>
      </div>

      <span className="platform-soon">
        SOON
      </span>
    </div>

    <div className="download-platform disabled">
      <div className="platform-icon">
        <FaLinux size={26} />
      </div>

      <div className="platform-info">
        <strong>Linux Educational</strong>
        <small>FOR SCHOOLS & UNIVERSITIES</small>
      </div>

      <span className="platform-soon">
        SOON
      </span>
    </div>

  </div>

  <div className="download-community">
    <a
      href="t.me/TaigaBroswer"
      target="_blank"
      rel="noopener noreferrer"
      className="download-tg-btn"
    >
      <FaTelegram size={16} />
      <span>TELEGRAM КАНАЛ</span>
    </a>
  </div>

  <p>
    TAIGA Browser · Your internet, your way.
  </p>
</section>

    <footer>
      <span>TAIGA BROWSER © 2026</span>

      <a
        href="https://t.me/taiga_browser"
        target="_blank"
        rel="noopener noreferrer"
        className="footer-tg-link"
      >
        <FaTelegram size={12} />
        <span>TELEGRAM КАНАЛ</span>
      </a>

      <span>
        MADE FOR THE OPEN WEB
      </span>
    </footer>

  </main>
  );
}

export default App; App;
