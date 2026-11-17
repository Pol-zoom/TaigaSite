
export default function Robot() {
  return (
    <div className="robot" aria-hidden="true">
      <div className="robot-enter">
        <div className="robot-hop">
          <div className="robot-float">
            <svg
              className="robot-svg"
              width="220"
              height="250"
              viewBox="0 0 220 250"
            >
              <defs>
                <linearGradient
                  id="rb-body"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="0" stopColor="#4846a0" />
                  <stop offset="1" stopColor="#302e7d" />
                </linearGradient>

                <linearGradient
                  id="rb-head"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="0" stopColor="#514fa5" />
                  <stop offset="1" stopColor="#302e7d" />
                </linearGradient>

                <radialGradient
                  id="rb-glow"
                  cx="0.5"
                  cy="0.5"
                  r="0.5"
                >
                  <stop
                    offset="0"
                    stopColor="#a17cff"
                    stopOpacity="0.55"
                  />
                  <stop
                    offset="1"
                    stopColor="#a17cff"
                    stopOpacity="0"
                  />
                </radialGradient>
              </defs>

              <ellipse
                className="robot-shadow"
                cx="110"
                cy="240"
                rx="56"
                ry="9"
                fill="url(#rb-glow)"
              />

              <path
                className="robot-flame"
                d="M92 205 Q110 246 128 205 Z"
                fill="#a17cff"
                opacity="0.6"
              />

              {/* Левая рука */}
              <rect
                x="22"
                y="132"
                width="20"
                height="58"
                rx="10"
                fill="url(#rb-body)"
                className="robot-arm-l"
              />

              {/* Корпус */}
              <rect
                x="58"
                y="112"
                width="104"
                height="98"
                rx="40"
                fill="url(#rb-body)"
              />

              {/* Панель корпуса */}
              <rect
                x="88"
                y="144"
                width="44"
                height="32"
                rx="13"
                fill="#211f62"
              />

              {/* Сердце */}
              <circle
                cx="110"
                cy="160"
                r="8"
                fill="#a17cff"
                className="robot-heart"
              />

              {/* Голова */}
              <rect
                x="38"
                y="28"
                width="144"
                height="94"
                rx="42"
                fill="url(#rb-head)"
              />

              {/* Боковые элементы */}
              <circle cx="32" cy="76" r="10" fill="#514fa5" />
              <circle cx="188" cy="76" r="10" fill="#514fa5" />

              {/* Лицо */}
              <rect
                x="54"
                y="44"
                width="112"
                height="62"
                rx="27"
                fill="#171644"
              />

              {/* Глаза */}
              <g className="robot-eyes">
                <ellipse
                  cx="86"
                  cy="72"
                  rx="12"
                  ry="14"
                  fill="#7fe9ff"
                />

                <ellipse
                  cx="134"
                  cy="72"
                  rx="12"
                  ry="14"
                  fill="#7fe9ff"
                />

                <circle
                  className="robot-pupil"
                  cx="86"
                  cy="70"
                  r="5"
                  fill="#302e7d"
                />

                <circle
                  className="robot-pupil"
                  cx="134"
                  cy="70"
                  r="5"
                  fill="#302e7d"
                />
              </g>

              {/* Улыбка */}
              <path
                d="M94 91 Q110 104 126 91"
                stroke="#7fe9ff"
                strokeWidth="4"
                fill="none"
                strokeLinecap="round"
              />

              {/* Щёки */}
              <ellipse
                cx="68"
                cy="92"
                rx="8"
                ry="4.5"
                fill="#ff7bd5"
                opacity="0.5"
              />

              <ellipse
                cx="152"
                cy="92"
                rx="8"
                ry="4.5"
                fill="#ff7bd5"
                opacity="0.5"
              />

              {/* Антенна */}
              <line
                x1="110"
                y1="28"
                x2="110"
                y2="10"
                stroke="#aaa7e8"
                strokeWidth="5"
                strokeLinecap="round"
              />

              <circle
                className="robot-bulb"
                cx="110"
                cy="8"
                r="7"
                fill="#ff7bd5"
              />
            </svg>

            <div className="robot-head-marker" />
            <div className="robot-shoulder" />

            <div className="robot-arm">
              <div className="arm-inner">
                <i className="arm-limb" />
                <i className="arm-hand" />
                <i className="arm-stick" />
                <i className="arm-tip" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
