import React from 'react';

export default function RingChart({ pct }) {
    const CIRC = 2 * Math.PI * 48; // r=48
    const offset = CIRC * (1 - (pct / 100));

    return (
        <div className="ring" aria-label="progress ring">
            <svg viewBox="0 0 120 120">
                <defs>
                    <linearGradient id="grad" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="rgba(61,220,151,.95)" />
                        <stop offset="55%" stopColor="rgba(78,161,255,.95)" />
                        <stop offset="100%" stopColor="rgba(124,92,255,.95)" />
                    </linearGradient>
                </defs>
                <circle cx="60" cy="60" r="48" fill="none" stroke="var(--line2)" strokeWidth="10" />
                <circle
                    cx="60" cy="60" r="48" fill="none" stroke="url(#grad)" strokeWidth="10"
                    strokeLinecap="round" transform="rotate(-90 60 60)"
                    strokeDasharray={CIRC.toFixed(2)}
                    strokeDashoffset={offset.toFixed(2)}
                    style={{ transition: 'stroke-dashoffset 0.5s ease-out' }}
                />
            </svg>
            <div className="pct">
                <div className="big">{pct}%</div>
                <div className="small">done</div>
            </div>
        </div>
    );
}
