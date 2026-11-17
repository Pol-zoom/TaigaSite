import { useEffect, useState } from "react";
import "./BrowserMockup.css";
import { FaGoogle, FaYoutube, FaGithub, FaVk, FaWikipediaW } from "react-icons/fa";
import {
  LayoutGrid, Home, History, Download, Bookmark, Sparkles, Key, Settings,
  ArrowLeft, ArrowRight, RotateCw, Shield, Plus, X, Search, MoreVertical,
  Star, Briefcase, Tv, Folder, FileText, Check, Pencil, ChevronUp, RefreshCw, Bot, Feather, PanelLeft,
} from "lucide-react";

const DAYS = ["воскресенье", "понедельник", "вторник", "среда", "четверг", "пятница", "суббота"];
const MONTHS = ["января", "февраля", "марта", "апреля", "мая", "июня", "июля", "августа", "сентября", "октября", "ноября", "декабря"];

const pad = (n) => String(n).padStart(2, "0");

const greeting = (h) => {
  if (h < 5) return "Доброй ночи";
  if (h < 12) return "Доброе утро";
  if (h < 18) return "Добрый день";
  return "Добрый вечер";
};

function useNow(intervalMs) {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    if (!intervalMs) return undefined;
    const id = setInterval(() => setNow(new Date()), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);
  return now;
}


function Greeting({ live }) {
  const now = useNow(live ? 30000 : 0);
  return (
    <h2 className="bm-greeting" style={{ left: 51, top: 66 }}>
      {greeting(now.getHours())}, User
    </h2>
  );
}

function Clock({ live }) {
  const now = useNow(live ? 1000 : 0);
  const digits = `${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`.split("");
  const dateLabel = `${DAYS[now.getDay()]}, ${now.getDate()} ${MONTHS[now.getMonth()]}`.toUpperCase();
  return (
    <>
      <div className="bm-clock">
        <span className="bm-d">{digits[0]}</span>
        <span className="bm-d">{digits[1]}</span>
        <i>:</i>
        <span className="bm-d">{digits[2]}</span>
        <span className="bm-d">{digits[3]}</span>
        <i>:</i>
        <span className="bm-d">{digits[4]}</span>
        <span className="bm-d">{digits[5]}</span>
      </div>
      <div className="bm-date">{dateLabel}</div>
    </>
  );
}

const RAIL = [
  { icon: Home, top: 97, active: true },
  { icon: History, top: 161 },
  { icon: Download, top: 217 },
  { icon: Bookmark, top: 273 },
  { icon: Sparkles, top: 329 },
  { icon: Key, top: 385 },
  { icon: Settings, top: 441 },
];

const DIALS = [
  { name: "Google", left: 359, bg: "#ffffff", fg: "#4285f4", Logo: FaGoogle },
  { name: "YouTube", left: 614, bg: "#ff0000", fg: "#ffffff", Logo: FaYoutube },
  { name: "GitHub", left: 869, bg: "#ffffff", fg: "#111111", Logo: FaGithub },
  { name: "Википедия", left: 1125, bg: "#ffffff", fg: "#111111", Logo: FaWikipediaW },
  { name: "VK", left: 1380, bg: "#0077ff", fg: "#ffffff", Logo: FaVk },
];

const TAGS = [
  { label: "Все", left: 740, icon: LayoutGrid, active: true },
  { label: "Главные", left: 835, icon: Star },
  { label: "Работа", left: 951, icon: Briefcase },
  { label: "Медиа", left: 1056, icon: Tv },
  { label: "Разное", left: 1160, icon: Folder },
];

export default function BrowserMockup({ live = true }) {
  return (
    <div className="browser-window">
      <aside className="bm-rail">
        <div className="bm-logo"><LayoutGrid size={13} /></div>
        {RAIL.map(({ icon: Icon, top, active }) => (
          <span key={top} className={`bm-rail-item${active ? " active" : ""}`} style={{ top }}>
            <Icon size={18} strokeWidth={1.7} />
          </span>
        ))}
        <div className="bm-avatar">initial</div>
        <span className="bm-rail-item" style={{ top: 929 }}>
          <PanelLeft size={18} strokeWidth={1.7} />
        </span>
      </aside>

      <div className="bm-tabbar" />
      <div className="bm-tab">
        <LayoutGrid size={12} color="#a17cff" />
        <span>Новая вкладка</span>
        <X size={12} className="bm-x" />
      </div>
      <Plus className="bm-plus" size={16} />

      <div className="bm-toolbar" />
      <div className="bm-navbtns">
        <ArrowLeft size={16} />
        <ArrowRight size={16} className="dim" />
        <RotateCw size={14} />
      </div>
      <div className="bm-shield">
        <Shield size={14} />
        <span className="bm-badge">0</span>
      </div>
      <div className="bm-address">
        <div className="bm-taiga"><span className="bm-live" />TAIGA</div>
        <span className="bm-home">home</span>
      </div>
      <div className="bm-tr-icons">
        <span className="bm-sq"><Sparkles size={15} color="#a17cff" /><i className="bm-dot" /></span>
        <span className="bm-sq"><Download size={15} /></span>
        <span className="bm-sq"><MoreVertical size={15} /></span>
      </div>

      <div className="bm-canvas">
        <Greeting live={live} />
        <span className="bm-ru">RU</span>

        <div className="bm-time">
          <Clock live={live} />
        </div>

        <div className="bm-search">
          <Search size={16} />
          <div className="bm-engine">
            <span className="bm-g">G</span>
            <span>Google</span>
          </div>
          <div className="bm-input">Поиск в Google или адрес...</div>
        </div>

        <div className="bm-tags">
          {TAGS.map(({ label, icon: Icon, active }) => (
            <span key={label} className={active ? "active" : ""}>
              <Icon size={14} />
              {label}
            </span>
          ))}
        </div>

        {DIALS.map((d) => (
          <div className="bm-dial" key={d.name} style={{ left: d.left - 189 }}>
            <div className="bm-dial-icon" style={{ background: d.bg, color: d.fg }}><d.Logo size={22} /></div>
            <span>{d.name}</span>
          </div>
        ))}

        <div className="bm-widget bm-note">
          <div className="bm-wh">
            <span className="bm-wt"><FileText size={14} color="#a17cff" />ВЕБ-БЛОКНОТ</span>
            <span className="bm-toggle">
              <b className="active">ТЕКСТ</b>
              <b><Check size={10} /> ДЕЛА</b>
            </span>
          </div>
          <p className="bm-placeholder">Запишите мысли, скопируйте ссылки или списки дел...</p>
        </div>

        <div className="bm-widget bm-quote">
          <div className="bm-wh">
            <span className="bm-wt"><Sparkles size={14} color="#ffb300" />МЫСЛЬ ДНЯ</span>
            <RefreshCw size={13} className="dim" />
          </div>
          <div className="bm-qbody">
            <p>«Успех — это способность шагать от одной неудачи к другой, не теряя энтузиазма.» (Уинстон Черчилль)</p>
            <span>ЗАРЯДИСЬ ВДОХНОВЕНИЕМ</span>
          </div>
        </div>

        <div className="bm-actions">
          <span><Pencil size={14} />РЕДАКТИРОВАТЬ</span>
          <span><Plus size={14} />ДОБАВИТЬ САЙТ</span>
          <span><Feather size={14} />РЕЖИМ ДЗЕН</span>
        </div>

        <div className="bm-up"><ChevronUp size={16} /></div>
        <div className="bm-bot"><Bot size={28} /></div>
        <div className="bm-toast">Вкладка закрыта! Память очищена, ресурсы спасены! +5 коинов.</div>
      </div>
    </div>
  );
}
