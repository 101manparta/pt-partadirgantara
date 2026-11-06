import React from 'react';

interface VectorProps {
  type: 'ship' | 'plane' | 'truck' | 'clove' | 'globe';
  className?: string;
  opacity?: number;
}

export const SectionVector: React.FC<VectorProps> = ({ type, className = '', opacity = 0.08 }) => {
  return (
    <div
      className={`absolute pointer-events-none select-none z-0 overflow-hidden ${className}`}
      style={{ opacity }}
      aria-hidden="true"
    >
      {type === 'ship' && (
        <svg
          viewBox="0 0 400 240"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-full h-full text-slate-800 animate-drift-ship"
        >
          {/* Container Ship Minimal Line Vector */}
          <path d="M40 180 L360 180 L330 215 L80 215 Z" />
          <path d="M70 180 L90 140 L310 140 L330 180" />
          <line x1="20" y1="215" x2="380" y2="215" strokeDasharray="6 4" />
          {/* Bridge / Cabin */}
          <rect x="270" y="80" width="40" height="60" rx="2" />
          <rect x="278" y="90" width="24" height="15" />
          <line x1="290" y1="65" x2="290" y2="80" strokeWidth="2" />
          <line x1="285" y1="65" x2="295" y2="65" />
          {/* Stacks of Containers */}
          <rect x="100" y="100" width="35" height="40" />
          <rect x="140" y="100" width="35" height="40" />
          <rect x="180" y="100" width="35" height="40" />
          <rect x="220" y="100" width="35" height="40" />
          <rect x="120" y="60" width="35" height="40" />
          <rect x="160" y="60" width="35" height="40" />
          <rect x="200" y="60" width="35" height="40" />
          <line x1="100" y1="120" x2="135" y2="120" />
          <line x1="140" y1="120" x2="175" y2="120" />
          <line x1="180" y1="120" x2="215" y2="120" />
          <line x1="220" y1="120" x2="255" y2="120" />
          {/* Ocean waves */}
          <path d="M10 225 Q 35 220, 60 225 T 110 225 T 160 225 T 210 225 T 260 225 T 310 225 T 360 225 T 400 225" />
        </svg>
      )}

      {type === 'plane' && (
        <svg
          viewBox="0 0 360 240"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-full h-full text-slate-800 animate-drift-plane"
        >
          {/* Cargo Aircraft Minimal Vector */}
          <path d="M60 120 C 60 95, 120 90, 180 90 L 280 90 C 315 90, 335 110, 335 125 C 335 140, 310 145, 270 145 L 140 145 C 90 145, 60 135, 60 120 Z" />
          {/* Main Wing */}
          <polygon points="160,110 230,20 260,20 215,110" />
          {/* Engine */}
          <rect x="180" y="60" width="28" height="12" rx="3" />
          {/* Tail Fin */}
          <polygon points="75,90 95,30 118,30 108,90" />
          {/* Cargo Door Outline */}
          <rect x="240" y="105" width="25" height="28" rx="2" strokeDasharray="3 2" />
          {/* Flight Path Lines */}
          <line x1="20" y1="180" x2="140" y2="180" strokeDasharray="5 5" />
          <line x1="40" y1="200" x2="180" y2="200" strokeDasharray="8 6" />
        </svg>
      )}

      {type === 'truck' && (
        <svg
          viewBox="0 0 380 200"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-full h-full text-slate-800 animate-drift-truck"
        >
          {/* Container Freight Semi-Truck */}
          {/* Container Trailer */}
          <rect x="40" y="40" width="200" height="95" rx="2" />
          <line x1="40" y1="65" x2="240" y2="65" strokeDasharray="4 3" />
          <line x1="40" y1="95" x2="240" y2="95" strokeDasharray="4 3" />
          <line x1="140" y1="40" x2="140" y2="135" />
          {/* Cab */}
          <path d="M245 80 L285 80 L315 110 L315 135 L245 135 Z" />
          <rect x="270" y="90" width="22" height="18" rx="1" />
          {/* Chassis */}
          <line x1="30" y1="135" x2="320" y2="135" strokeWidth="2.5" />
          {/* Wheels */}
          <circle cx="70" cy="148" r="14" strokeWidth="2" />
          <circle cx="70" cy="148" r="6" />
          <circle cx="105" cy="148" r="14" strokeWidth="2" />
          <circle cx="105" cy="148" r="6" />
          <circle cx="210" cy="148" r="14" strokeWidth="2" />
          <circle cx="210" cy="148" r="6" />
          <circle cx="290" cy="148" r="14" strokeWidth="2" />
          <circle cx="290" cy="148" r="6" />
          {/* Road */}
          <line x1="10" y1="165" x2="360" y2="165" strokeDasharray="10 6" />
        </svg>
      )}

      {type === 'clove' && (
        <svg
          viewBox="0 0 300 300"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-full h-full text-[#FF6B00]"
        >
          {/* Botanical Clove (Syzygium aromaticum) Vector Line Art */}
          {/* Central Stem / Hypanthium */}
          <path d="M140 120 L 140 260 C 140 270, 160 270, 160 260 L 160 120" />
          {/* Calyx Teeth (4 triangular sepals) */}
          <path d="M135 120 C 120 100, 105 105, 95 115 C 105 128, 125 128, 135 125" />
          <path d="M165 120 C 180 100, 195 105, 205 115 C 195 128, 175 128, 165 125" />
          <path d="M142 120 L 130 90 L 145 98 L 150 120" />
          <path d="M158 120 L 170 90 L 155 98 L 150 120" />
          {/* Head / Unopened Flower Bud Crown (Central Dome) */}
          <circle cx="150" cy="85" r="28" strokeWidth="1.8" />
          <path d="M132 82 C 140 70, 160 70, 168 82" strokeDasharray="2 3" />
          {/* Adjacent Secondary Clove Bud */}
          <g transform="rotate(25 150 200) translate(40 -30) scale(0.75)">
            <path d="M140 120 L 140 240 C 140 248, 160 248, 160 240 L 160 120" />
            <circle cx="150" cy="85" r="26" />
            <path d="M135 120 C 115 100, 105 110, 95 120" />
            <path d="M165 120 C 185 100, 195 110, 205 120" />
          </g>
          {/* Botanical leaves accent */}
          <path d="M110 210 C 70 200, 50 160, 60 130 C 80 150, 95 180, 110 210 Z" />
          <line x1="60" y1="130" x2="105" y2="200" strokeDasharray="3 3" />
        </svg>
      )}

      {type === 'globe' && (
        <svg
          viewBox="0 0 320 320"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-full h-full text-slate-800 animate-rotate-globe"
        >
          {/* Globe & Connection Trade Lines */}
          <circle cx="160" cy="160" r="140" strokeWidth="1.8" />
          <ellipse cx="160" cy="160" rx="140" ry="60" />
          <ellipse cx="160" cy="160" rx="60" ry="140" />
          <line x1="20" y1="160" x2="300" y2="160" />
          <line x1="160" y1="20" x2="160" y2="300" />
          {/* Global shipping route nodes */}
          <circle cx="185" cy="175" r="4" fill="#FF6B00" />
          <circle cx="240" cy="120" r="3" fill="#FF6B00" />
          <circle cx="110" cy="130" r="3" fill="#FF6B00" />
          <circle cx="130" cy="220" r="3" fill="#FF6B00" />
          <path d="M185 175 Q 220 140, 240 120" stroke="#FF6B00" strokeWidth="1" strokeDasharray="4 3" />
          <path d="M185 175 Q 140 150, 110 130" stroke="#FF6B00" strokeWidth="1" strokeDasharray="4 3" />
        </svg>
      )}
    </div>
  );
};
