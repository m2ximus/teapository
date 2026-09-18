export const Arrow = () => (
  <svg className="arrow" width="16" height="16" viewBox="0 0 18 18" fill="none" aria-hidden>
    <path d="M3 9h12m0 0-5-5m5 5-5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const Plus = () => (
  <svg className="plus" width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
    <path d="M7 1.5v11M1.5 7h11" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
  </svg>
);

export const Cup = ({ className = "" }: { className?: string }) => (
  <svg className={className} width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden>
    <path d="M3 8h11v3.5A4.5 4.5 0 0 1 9.5 16h-2A4.5 4.5 0 0 1 3 11.5V8Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    <path d="M14 9.2h1.2a2 2 0 0 1 0 4H13.6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

export const Back = () => (
  <svg className="back" width="16" height="16" viewBox="0 0 18 18" fill="none" aria-hidden>
    <path d="M15 9H3m0 0 5-5M3 9l5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const Close = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
    <path d="M2.5 2.5l9 9m0-9-9 9" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
  </svg>
);
