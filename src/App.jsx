import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FaWindows, FaLinux, FaTelegram } from "react-icons/fa";
import { Download, ArrowDown, Shield } from "lucide-react";

import Navbar from "./components/Navbar";
import BrowserMockup from "./components/BrowserMockup";
import Scene from "./components/Scene";
import Mascot from "./components/Mascot";
import { diveFit, queryGuide, updateGuide } from "./components/guide";
import { sceneState } from "./components/sceneState";

import "./App.css";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const reveal = (targets, trigger, from = { autoAlpha: 0, y: 60 }, to = {}) =>
  gsap.fromTo(
    targets,
    from,
    {
      autoAlpha: 1,
      y: 0,
      duration: 0.9,
      ease: "power3.out",
      immediateRender: false,
      ...to,
      scrollTrigger: { trigger, start: "top 88%", once: true },
    }
  );

const TITLE = "TAIGA".split("");
const STATEMENT = "Интернет должен быть твоим.".split(" ");
const TABS = ["Новая вкладка", "Почта", "Карты", "Музыка", "Заметки", "Новости"];
const TRACKERS = [
  "Рекламная сеть",
  "Счётчик аналитики",
  "Скрытый пиксель",
  "Сторонний виджет",
  "Трекер поведения",
  "Отпечаток браузера",
];
const DIVE = [
  { title: "Браузер", text: "Привет, я Квант! Покажу, что здесь где. Вот весь браузер TAIGA, давай заглянем внутрь.", rect: [0, 0, 1917, 997] },
  { title: "Поиск", text: "Сюда пишешь запрос или адрес. А поисковик можно сменить в один клик.", rect: [690, 322, 598, 50] },
  { title: "TaigaGuard", text: "А это TaigaGuard. Он считает, сколько лишнего я заблокировал на странице.", rect: [203, 58, 67, 40] },
  { title: "Быстрый доступ", text: "Любимые сайты под рукой, в одно касание. Фильтры сверху разложат их по группам.", rect: [359, 496, 1260, 114] },
  { title: "Блокнот и мысль дня", text: "Тут можно записать идеи и дела, а ещё каждый день ждёт новая мысль для вдохновения.", rect: [285, 636, 1408, 160] },
];

function App() {
  const page = useRef(null);

  useGSAP(
    () => {
      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const heroEl = document.querySelector(".hero");
      const onHeroMove = (e) => {
        const r = heroEl.getBoundingClientRect();
        heroEl.style.setProperty("--mx", `${e.clientX - r.left}px`);
        heroEl.style.setProperty("--my", `${e.clientY - r.top}px`);
      };

      if (reducedMotion) {
        gsap.set(".boot", { display: "none" });
        gsap.set(".word", { color: "#f2eeff" });
        Object.assign(sceneState, { gather: 1, ignite: 1, open: 1, fly: 0, world: 0, travel: 0, dim: 0 });
        return undefined;
      }

      const counter = { v: 0 };
      gsap
        .timeline()
        .to(counter, {
          v: 100,
          duration: 1.5,
          ease: "power2.inOut",
          onUpdate: () => {
            document.querySelector(".boot-count").textContent = String(Math.round(counter.v)).padStart(3, "0");
          },
        })
        .to(".boot-bar span", { scaleX: 1, duration: 1.5, ease: "power2.inOut" }, 0)
        .to(".boot", { yPercent: -100, duration: 0.9, ease: "expo.inOut" }, "+=0.15")
        .set(".boot", { display: "none" });
      gsap.from(".hero-letter", { yPercent: 110, duration: 1.1, stagger: 0.07, ease: "expo.out", delay: 1.6 });
      gsap.from(".hero-foot", { autoAlpha: 0, duration: 1, delay: 2.2 });
      heroEl.addEventListener("pointermove", onHeroMove);

      gsap.to(".hud-bar span", {
        scaleX: 1,
        ease: "none",
        scrollTrigger: { trigger: document.documentElement, start: "top top", end: "bottom bottom", scrub: 0.3 },
      });
      const stages = ["Фрагменты", "Сборка", "Активация", "Портал открыт", "Вход"];
      const cap = document.querySelector(".hero-cap");
      let stageIdx = -1;
      const flash = document.querySelector(".flash");

      const hero = gsap.timeline({
        scrollTrigger: {
          trigger: ".hero",
          start: "top top",
          end: "+=5200",
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const idx = Math.min(stages.length - 1, Math.floor(self.progress * stages.length));
            if (idx !== stageIdx) {
              stageIdx = idx;
              cap.textContent = stages[idx];
            }
          },
        },
      });
      hero
        .to(".hero-title", { yPercent: -80, autoAlpha: 0, duration: 1.1, ease: "power2.in" }, 0.2)
        .to(".hero-kicker", { yPercent: -120, autoAlpha: 0, duration: 0.7 }, 0.2)
        .to(sceneState, { gather: 1, duration: 1.8, ease: "power1.inOut" }, 0)
        .to(sceneState, { ignite: 1, duration: 1.3, ease: "power1.in" }, 1.7)
        .to(sceneState, { open: 1, duration: 1.4, ease: "power2.out" }, 2.6)
        .to(sceneState, { fly: 1, duration: 2.2, ease: "none" }, 3.6)
        .to(".hero-scroll", { autoAlpha: 0, duration: 0.4 }, 0.2)
        .to(flash, { opacity: 1, duration: 0.5, ease: "power2.in" }, 5.0)
        .to(flash, { opacity: 0, duration: 0.7, ease: "power2.out" }, 5.5)
        .to(".hero-foot", { autoAlpha: 0, duration: 0.5 }, 5.4);

      gsap.to(sceneState, {
        world: 1,
        ease: "none",
        scrollTrigger: { trigger: ".statement", start: "top bottom", end: "center center", scrub: 1 },
      });
      gsap.to(sceneState, {
        travel: 1,
        ease: "none",
        scrollTrigger: {
          trigger: ".statement",
          start: "top bottom",
          endTrigger: ".launch",
          end: "bottom bottom",
          scrub: 1,
        },
      });
      const statementEl = document.querySelector(".statement");
      const launchEl = document.querySelector(".launch");
      const clamp01 = (v) => Math.min(1, Math.max(0, v));
      const updateDim = () => {
        const vh = window.innerHeight;
        const a = statementEl.getBoundingClientRect().top;
        const b = launchEl.getBoundingClientRect().top;
        const into = 1 - clamp01((a - vh * 0.4) / (vh * 0.6));
        const out = clamp01((vh * 0.85 - b) / (vh * 0.6));
        sceneState.dim = into * (1 - out * 0.88);
      };
      ScrollTrigger.create({
        trigger: document.documentElement,
        start: "top top",
        end: "bottom bottom",
        onUpdate: updateDim,
        onRefresh: updateDim,
      });

      gsap.fromTo(
        ".statement .word",
        { color: "#3a3354" },
        {
          color: "#f2eeff",
          stagger: 0.3,
          ease: "none",
          immediateRender: false,
          scrollTrigger: { trigger: ".statement-title", start: "top 80%", end: "bottom 45%", scrub: true },
        }
      );
      gsap.fromTo(
        ".marquee-track",
        { xPercent: 0 },
        { xPercent: -50, ease: "none", scrollTrigger: { trigger: ".statement", start: "top bottom", end: "bottom top", scrub: true } }
      );

      const diveCard = document.querySelector(".dive-card");
      const diveNotes = gsap.utils.toArray(".dive-note");
      const first = diveFit(DIVE[0].rect);
      gsap.set(diveCard, { x: first.x, y: first.y, scale: first.s, transformOrigin: "0 0" });

      const guide = queryGuide(document.querySelector(".dive"));
      let diveOn = false;
      const guideTick = () => {
        if (diveOn) updateGuide(guide, { x: window.innerWidth / 2, y: window.innerHeight / 2 });
      };
      gsap.ticker.add(guideTick);
      gsap.to(".robot-float", { y: -7, duration: 1.6, ease: "sine.inOut", repeat: -1, yoyo: true });

      const dive = gsap.timeline({
        scrollTrigger: {
          trigger: ".dive",
          start: "top top",
          end: "+=" + (DIVE.length + 0.5) * 1000,
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onToggle: (self) => {
            diveOn = self.isActive;
          },
        },
      });
      dive.fromTo(".robot-enter", { x: -320, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: 0.7, ease: "power3.out" }, 0);

      DIVE.forEach((step, i) => {
        const land = i + 0.45;
        dive.to(
          diveCard,
          {
            x: () => diveFit(step.rect).x,
            y: () => diveFit(step.rect).y,
            scale: () => diveFit(step.rect).s,
            duration: 1,
            ease: "power2.inOut",
          },
          i
        );
        dive.to(diveNotes[i], { autoAlpha: 1, y: 0, duration: 0.4, ease: "power2.out" }, land);
        dive
          .to(".robot-hop", { y: -18, duration: 0.12, ease: "power2.out" }, land)
          .to(".robot-hop", { y: 0, duration: 0.2, ease: "bounce.out" }, land + 0.12)
          .to(".arm-inner", { rotation: -11, duration: 0.1, ease: "power2.out" }, land + 0.1)
          .to(".arm-inner", { rotation: 0, duration: 0.18, ease: "power2.inOut" }, land + 0.22);
        if (i > 0) {
          dive.to(
            ".dive-ring",
            {
              width: () => step.rect[2] * diveFit(step.rect).s + 28,
              height: () => step.rect[3] * diveFit(step.rect).s + 28,
              duration: 0.01,
            },
            i + 0.02
          );
          dive.to([".dive-ring", ".dive-beam"], { autoAlpha: 1, duration: 0.3 }, land);
        }
        if (i < DIVE.length - 1) {
          dive.to(diveNotes[i], { autoAlpha: 0, y: -18, duration: 0.3, ease: "power2.in" }, i + 0.9);
          if (i > 0) dive.to([".dive-ring", ".dive-beam"], { autoAlpha: 0, duration: 0.25 }, i + 0.9);
        }
      });
      const diveEnd = DIVE.length - 0.05;
      dive.to([diveNotes[DIVE.length - 1], ".dive-ring", ".dive-beam"], { autoAlpha: 0, duration: 0.4 }, diveEnd);
      dive.to(".robot-enter", { x: -320, autoAlpha: 0, duration: 0.5, ease: "power2.in" }, diveEnd);

      gsap.utils.toArray(".module").forEach((mod) => {
        gsap.fromTo(
          mod.querySelector(".module-copy"),
          { yPercent: 12 },
          { yPercent: -12, ease: "none", scrollTrigger: { trigger: mod, start: "top bottom", end: "bottom top", scrub: true } }
        );
        reveal(mod.querySelector(".module-copy"), mod);
        reveal(mod.querySelector(".demo"), mod, { autoAlpha: 0, y: 80, scale: 0.97 }, { scale: 1, duration: 1.1 });
      });

      gsap.fromTo(
        ".tab-chip",
        { autoAlpha: 0, x: -30 },
        {
          autoAlpha: 1,
          x: 0,
          stagger: 0.08,
          duration: 0.6,
          ease: "power2.out",
          immediateRender: false,
          scrollTrigger: { trigger: ".demo-tabs", start: "top 85%", once: true },
        }
      );
      gsap.fromTo(
        ".speed-fill",
        { scaleX: 0 },
        { scaleX: 1, duration: 1.2, ease: "power2.out", immediateRender: false, scrollTrigger: { trigger: ".demo-tabs", start: "top 85%", once: true } }
      );
      gsap.fromTo(
        ".tracker-row",
        { autoAlpha: 0, x: 24 },
        {
          autoAlpha: 1,
          x: 0,
          stagger: 0.1,
          duration: 0.5,
          ease: "power2.out",
          immediateRender: false,
          scrollTrigger: { trigger: ".demo-privacy", start: "top 85%", once: true },
        }
      );
      gsap.fromTo(
        ".blocked-count",
        { innerText: 0 },
        {
          innerText: 48,
          snap: { innerText: 1 },
          duration: 1.6,
          ease: "none",
          immediateRender: false,
          scrollTrigger: { trigger: ".demo-privacy", start: "top 85%", once: true },
        }
      );
      gsap.fromTo(
        ".stack-pane",
        { rotateX: 60, z: -60, autoAlpha: 0.2 },
        {
          rotateX: 0,
          z: 0,
          autoAlpha: 1,
          stagger: 0.15,
          duration: 0.9,
          ease: "power2.out",
          immediateRender: false,
          scrollTrigger: { trigger: ".demo-stack", start: "top 85%", once: true },
        }
      );

      gsap.fromTo(
        ".launch-title",
        { skewX: -12, x: -60 },
        { skewX: 0, x: 0, ease: "none", immediateRender: false, scrollTrigger: { trigger: ".launch", start: "top 80%", end: "top 25%", scrub: true } }
      );
      gsap.fromTo(
        ".launch-fill",
        { scaleX: 0 },
        { scaleX: 1, ease: "none", immediateRender: false, scrollTrigger: { trigger: ".launch", start: "top 55%", end: "bottom 65%", scrub: true } }
      );
      gsap.fromTo(
        ".launch-value",
        { innerText: 0 },
        {
          innerText: 100,
          snap: { innerText: 1 },
          ease: "none",
          immediateRender: false,
          scrollTrigger: { trigger: ".launch", start: "top 55%", end: "bottom 65%", scrub: true },
        }
      );
      reveal(".platforms > *", ".platforms", { autoAlpha: 0, y: 40 }, { stagger: 0.12 });

      const hudSec = document.querySelector(".hud-sec");
      const secEls = gsap.utils.toArray("[data-sec]");
      let secCurrent = "";
      const updateHud = () => {
        const mid = window.innerHeight * 0.5;
        const found = secEls.find((el) => {
          const r = el.getBoundingClientRect();
          return r.top <= mid && r.bottom > mid;
        });
        const label = found ? found.dataset.sec : secCurrent;
        if (label && label !== secCurrent) {
          secCurrent = label;
          hudSec.textContent = label;
        }
      };
      ScrollTrigger.create({
        trigger: document.documentElement,
        start: "top top",
        end: "bottom bottom",
        onUpdate: updateHud,
        onRefresh: updateHud,
      });
      updateHud();

      return () => {
        heroEl.removeEventListener("pointermove", onHeroMove);
        gsap.ticker.remove(guideTick);
      };
    },
    { scope: page }
  );

  return (
    <main ref={page} id="top" className="relative">
      <Scene />
      <div className="boot" aria-hidden="true">
        <span className="boot-label">TAIGA // ИНИЦИАЛИЗАЦИЯ</span>
        <span className="boot-count">000</span>
        <div className="boot-bar"><span /></div>
      </div>

      <div className="flash" aria-hidden="true" />

      <div className="hud" aria-hidden="true">
        <div className="hud-bar"><span /></div>
        <div className="hud-sec">00 / Старт</div>
      </div>

      <Navbar />

      <section className="hero" data-sec="00 / Старт">
        <div className="absolute inset-x-0 top-[16vh] z-[4] flex flex-col items-center text-center">
          <p className="mb-3.5 font-mono text-xs uppercase tracking-[0.1em] text-[var(--dim)]">Next-gen браузер</p>
          <h1 className="hero-title" aria-label="TAIGA">
            {TITLE.map((letter, i) => (
              <span className="hero-letter-wrap" key={i} aria-hidden="true">
                <span className="hero-letter">{letter}</span>
              </span>
            ))}
          </h1>
        </div>

        <div className="hero-foot">
          <span className="hero-cap">Фрагменты</span>
          <span className="hero-scroll">Листай <ArrowDown size={13} /></span>
        </div>
      </section>

      <section className="statement relative flex min-h-screen items-center px-[7vw] py-[18vh]" data-sec="01 / Идея">
        <div className="w-full">
          <span className="label">01 — Идея</span>
          <h2 className="statement-title">
            {STATEMENT.map((word, i) => (
              <span className="word" key={i}>{word}{" "}</span>
            ))}
          </h2>
          <p className="statement-note">
            TAIGA — собственное пространство между тобой и интернетом. Без шума, без навязчивого поведения и без десятка лишних кнопок.
          </p>
        </div>
        <div className="marquee" aria-hidden="true">
          <div className="marquee-track">
            <span>NEXT-GEN BROWSER · СКОРОСТЬ · ПРИВАТНОСТЬ · ДИЗАЙН · TAIGA ·&nbsp;</span>
            <span>NEXT-GEN BROWSER · СКОРОСТЬ · ПРИВАТНОСТЬ · ДИЗАЙН · TAIGA ·&nbsp;</span>
          </div>
        </div>
      </section>

      <section className="dive" data-sec="02 / Внутри">
        <div className="dive-stage">
          <div className="dive-card">
            <BrowserMockup live={false} />
          </div>
          {DIVE.map((n, i) => (
            <div className="dive-note" key={n.title}>
              <span className="label">{String(i + 1).padStart(2, "0")} — {n.title}</span>
              <p>{n.text}</p>
            </div>
          ))}
          <div className="dive-ring" aria-hidden="true" />
          <svg className="dive-beam" aria-hidden="true">
            <line className="beam-line" x1="0" y1="0" x2="0" y2="0" />
            <circle className="beam-dot" cx="0" cy="0" r="7" />
          </svg>
          <Mascot />
        </div>
      </section>

      <section className="modules" id="modules" data-sec="03 / Возможности">
        <article className="module grid gap-10 px-[7vw] py-[14vh] lg:grid-cols-2 lg:gap-[6vw] lg:py-[16vh]">
          <div className="module-copy">
            <span className="label">03 — Скорость</span>
            <h2>Быстрый</h2>
            <p>TAIGA запускается мгновенно и остаётся быстрым, даже когда открыто много вкладок.</p>
          </div>
          <div className="demo demo-tabs">
            <div className="demo-tabs-row">
              {TABS.map((t, i) => (
                <span className="tab-chip" key={t} style={i === 0 ? { borderColor: "var(--violet)" } : undefined}>{t}</span>
              ))}
            </div>
            <div className="speed-track"><div className="speed-fill" /></div>
            <span className="demo-caption">вкладки открываются без задержки</span>
          </div>
        </article>

        <article className="module grid gap-10 px-[7vw] py-[14vh] lg:grid-cols-2 lg:gap-[6vw] lg:py-[16vh]">
          <div className="module-copy">
            <span className="label">04 — Приватность</span>
            <h2>Приватный</h2>
            <p>Твои данные остаются твоими. Никакого сбора данных с моей стороны не происходит т.к нет деняк.</p>
          </div>
          <div className="demo demo-privacy">
            <div className="demo-count">
              <span className="blocked-count">0</span>
              <small>заблокировано</small>
            </div>
            <ul className="tracker-list">
              {TRACKERS.map((t) => (
                <li className="tracker-row" key={t}>
                  <Shield size={13} />
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </div>
        </article>

        <article className="module grid gap-10 px-[7vw] py-[14vh] lg:grid-cols-2 lg:gap-[6vw] lg:py-[16vh]">
          <div className="module-copy">
            <span className="label">05 — Дизайн</span>
            <h2>Красивый</h2>
            <p>Каждая деталь интерфейса нарисована с нуля: от вкладок до новой страницы.</p>
          </div>
          <div className="demo demo-stack">
            <div className="stack">
              <div className="stack-pane pane-a"><i /><i /></div>
              <div className="stack-pane pane-b"><i /><i /><i /></div>
              <div className="stack-pane pane-c"><i /><i /></div>
            </div>
          </div>
        </article>
      </section>

      <section className="launch relative flex min-h-screen flex-col px-[7vw] pt-[16vh]" id="launch" data-sec="04 / Запуск">
        <span className="label">06 — Запуск</span>
        <h2 className="launch-title">
          <span className="line"><span className="line-inner">Попробуй</span></span>
          <span className="line"><span className="line-inner">точно не пожалеешь.</span></span>
        </h2>

        <div className="load mt-[6vh] max-w-[520px]">
          <div className="load-head">
            <span>ЗАГРУЗКА ПАКЕТА</span>
            <span><span className="launch-value">0</span>%</span>
          </div>
          <div className="load-track"><div className="launch-fill" /></div>
        </div>

        <div className="platforms mt-[8vh] flex max-w-[560px] flex-col pb-[10vh]">
          <a
            className="platform-main"
            href="https://github.com/Pol-zoom/TaigaSite/releases/download/Broswer/TAIGA.Browser.Setup.2.1.1.exe"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaWindows size={22} />
            <span className="platform-name">
              <strong>Скачать для Windows</strong>
              <small>x64, ARM64</small>
            </span>
            <Download size={20} />
          </a>

          <ul className="platform-list">
            <li><FaLinux size={14} /><span>Linux</span><em>скоро</em></li>
            <li><FaWindows size={14} /><span>Windows для школ и университетов</span><em>скоро</em></li>
            <li><FaLinux size={14} /><span>Linux для школ и университетов</span><em>скоро</em></li>
          </ul>

          <a className="tg-link" href="https://t.me/TaigaBroswer" target="_blank" rel="noopener noreferrer">
            <FaTelegram size={15} />
            <span>Новости и обновления в Telegram</span>
          </a>
        </div>

        <footer>
          <span>TAIGA Browser © 2026</span>
          <span>Сделано для открытого интернета</span>
        </footer>
      </section>
    </main>
  );
}

export default App;
