export default function Logo() {
  return (
    <div className="inline-flex items-center font-serif text-[22px] italic font-medium leading-none">
      <svg width="28" height="28" viewBox="0 0 80 80" className="-mb-1 -mr-1">
        <g transform="rotate(-4 40 40)">
          <path
            d="M 40 14 C 54 14 62 28 62 44 C 62 56 56 62 50 62 L 30 62 C 24 62 18 56 18 44 C 18 28 26 14 40 14 Z"
            fill="#fafaf6"
            stroke="#3a3a36"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          <path
            d="M 28 46 Q 28 44 30 44 L 50 44 Q 52 44 52 46 L 47 60 Q 46 62 44 62 L 36 62 Q 34 62 33 60 Z"
            fill="#3a3a36"
          />
          <circle cx="32" cy="32" r="2.2" fill="#3a3a36" />
          <circle cx="44" cy="32" r="2.2" fill="#3a3a36" />
          <ellipse cx="26" cy="35" rx="3" ry="2.4" fill="#f4a78a" opacity="0.85" />
          <ellipse cx="50" cy="35" rx="3" ry="2.4" fill="#f4a78a" opacity="0.85" />
          <path d="M 35 35 Q 38 37 41 35" stroke="#3a3a36" strokeWidth="1.6" fill="none" strokeLinecap="round" />
        </g>
      </svg>
      <span className="text-[#5d8474]">bento</span>
    </div>
  );
}
