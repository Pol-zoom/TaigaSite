import React from 'react';
import './BrowserMockup.css';
import {
  LayoutGrid, Home, History, Bookmark, Key, Settings,
  ArrowLeft, ArrowRight, RotateCw, Shield, Plus, X,
  Search, MoreVertical, Puzzle, FileText, Sparkles
} from 'lucide-react';

export default function BrowserMockup() {
  return (
    <div className="browser-window">
      {/* Sidebar */}
      <div className="bm-sidebar">
        <div className="bm-logo">
          <LayoutGrid size={18} color="#a17cff" />
          <span>TAIGA</span>
        </div>
        <nav className="bm-nav">
          <a href="#" className="active"><Home size={16} /> Главная</a>
          <a href="#"><History size={16} /> История</a>
          <a href="#"><Bookmark size={16} /> Закладки</a>
          <a href="#"><Key size={16} /> Пароли</a>
          <a href="#"><Settings size={16} /> Настройки</a>
        </nav>
      </div>

      {/* Main Area */}
      <div className="bm-main">
        {/* Tabs Row */}
        <div className="bm-tabs-row">
           <div className="bm-tab active">
             <LayoutGrid size={14} className="tab-icon" color="#a17cff" />
             <span>Новая вкладка</span>
             <X size={14} className="close-icon" />
           </div>
           <div className="bm-tab">
             <LayoutGrid size={14} className="tab-icon" opacity={0.4} />
             <span>Настройки</span>
           </div>
           <div className="bm-new-tab">
             <Plus size={16} />
           </div>
        </div>

        {/* Toolbar */}
        <div className="bm-toolbar">
           <div className="bm-nav-buttons">
             <ArrowLeft size={16} />
             <ArrowRight size={16} opacity={0.4} />
             <RotateCw size={14} />
           </div>
           <div className="bm-shield">
             <Shield size={14} color="#00e676" />
             <span>0</span>
           </div>
           <div className="bm-address-bar">
             <div className="bm-address-pill"><div className="green-dot"/> TAIGA</div>
             <span className="bm-url">home</span>
           </div>
           <div className="bm-toolbar-actions">
             <Puzzle size={16} color="#a17cff" />
             <MoreVertical size={16} />
           </div>
        </div>

        {/* Content */}
        <div className="bm-page">
           <div className="bm-page-grid" />

           <div className="bm-header">
             <div className="bm-greeting">
               <span className="ru-badge">RU</span>
               <h2>Добрый день , <span>User</span></h2>
             </div>
             <div className="bm-clock">
               <div className="bm-time"><span>15</span><span className="colon">:</span><span>05</span></div>
               <div className="bm-date">СУББОТА, 5 СЕНТЯБРЯ</div>
             </div>
           </div>

           <div className="bm-search-wrapper">
             <div className="bm-search">
               <Search size={16} color="#00e676" />
               <div className="bm-search-engine">
                 <div className="g-icon">G</div>
                 <span>Google</span>
               </div>
               <div className="bm-search-input">Поиск в Google или адрес...</div>
             </div>
           </div>

           <div className="bm-tags">
             <span className="active"><LayoutGrid size={14}/> Все</span>
             <span>☆ Главные</span>
             <span>💼 Работа</span>
             <span>📺 Медиа</span>
             <span>📁 Разное</span>
           </div>

           <div className="bm-dials">
             <div className="bm-dial">
               <div className="dial-icon" style={{background: 'white', color: '#ea4335'}}>G</div>
               <span>Google</span>
             </div>
             <div className="bm-dial">
               <div className="dial-icon" style={{background: '#ff0000', color: 'white'}}>▶</div>
               <span>YouTube</span>
             </div>
             <div className="bm-dial">
               <div className="dial-icon" style={{background: '#ffffff', color: 'black'}}>gh</div>
               <span>GitHub</span>
             </div>
             <div className="bm-dial">
               <div className="dial-icon" style={{background: '#0077ff', color: 'white'}}>VK</div>
               <span>VK</span>
             </div>
           </div>

           <div className="bm-widgets">
             <div className="bm-widget">
               <div className="widget-header">
                 <div className="widget-title">
                   <FileText size={14} color="#a17cff" /> ВЕБ-БЛОКНОТ
                 </div>
                 <div className="widget-toggles">
                   <span className="active">ТЕКСТ</span>
                   <span>✓ ДЕЛА</span>
                 </div>
               </div>
               <div className="widget-body text-muted">
                 Запишите мысли, скопируйте ссылки или списки дел...
               </div>
             </div>
             
             <div className="bm-widget">
               <div className="widget-header">
                 <div className="widget-title">
                   <Sparkles size={14} color="#ffb300" /> МЫСЛЬ ДНЯ
                 </div>
                 <RotateCw size={14} opacity={0.5} />
               </div>
               <div className="widget-body quote">
                 <p>“ Логика может привести вас от пункта А к пункту Б, а воображение — куда угодно. (Альберт Эйнштейн) ”</p>
                 <span>ЗАРЯДИСЬ ВДОХНОВЕНИЕМ</span>
               </div>
             </div>
           </div>

        </div>
      </div>
    </div>
  );
}
