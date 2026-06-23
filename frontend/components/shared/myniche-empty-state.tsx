interface MyNicheEmptyStateProps {
  title?: string;
  description?: string;
}

export default function MyNicheEmptyState({
  title = "Dashboard is empty",
  description = "Create your first script or planner item and this space will begin filling with real creator data.",
}: MyNicheEmptyStateProps) {
  return (
    <div className="rounded-lg border border-slate-800 bg-slate-900 p-6 text-center">
      <svg
        viewBox="0 0 520 260"
        role="img"
        aria-labelledby="myniche-empty-title"
        className="mx-auto h-auto w-full max-w-xl"
      >
        <title id="myniche-empty-title">MyNiche empty dashboard</title>
        <defs>
          <linearGradient id="emptyBrand" x1="84" y1="52" x2="430" y2="220">
            <stop offset="0%" stopColor="#ec4899" />
            <stop offset="55%" stopColor="#a855f7" />
            <stop offset="100%" stopColor="#f97316" />
          </linearGradient>
          <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="9" result="blur" />
            <feColorMatrix
              in="blur"
              type="matrix"
              values="1 0 0 0 0.9 0 1 0 0 0.25 0 0 1 0 0.7 0 0 0 0.35 0"
            />
            <feBlend in="SourceGraphic" />
          </filter>
        </defs>

        <rect width="520" height="260" rx="8" fill="#020617" />
        <path
          d="M92 184C84 124 122 73 185 68c37-3 54 15 78 15 29 0 45-26 91-14 55 14 86 67 76 118-12 58-69 68-168 68-101 0-161-10-170-71Z"
          fill="#0f172a"
        />
        <path
          d="M146 100h228c17 0 31 14 31 31v58c0 17-14 31-31 31H146c-17 0-31-14-31-31v-58c0-17 14-31 31-31Z"
          fill="#111827"
          stroke="#334155"
        />
        <path
          d="M145 100h230c16 0 30 14 30 30v15H115v-15c0-16 14-30 30-30Z"
          fill="#1e293b"
        />
        <circle cx="142" cy="124" r="5" fill="#fb7185" />
        <circle cx="160" cy="124" r="5" fill="#fbbf24" />
        <circle cx="178" cy="124" r="5" fill="#34d399" />
        <path
          d="M151 177h56M151 193h90M280 171h70M280 190h44"
          stroke="#475569"
          strokeWidth="10"
          strokeLinecap="round"
        />
        <path
          d="M243 189c15-37 33-57 55-60 19-3 33 7 43 30"
          fill="none"
          stroke="url(#emptyBrand)"
          strokeWidth="12"
          strokeLinecap="round"
          filter="url(#softGlow)"
        />
        <circle cx="298" cy="129" r="11" fill="#f8fafc" />
        <path
          d="M93 80 74 68M427 81l19-13M260 47V25M95 222l-17 13M424 222l18 14"
          stroke="#475569"
          strokeWidth="6"
          strokeLinecap="round"
        />
        <text
          x="260"
          y="72"
          textAnchor="middle"
          fill="url(#emptyBrand)"
          fontFamily="Arial, sans-serif"
          fontSize="30"
          fontWeight="800"
        >
          MyNiche
        </text>
        <text
          x="260"
          y="244"
          textAnchor="middle"
          fill="#e2e8f0"
          fontFamily="Arial, sans-serif"
          fontSize="22"
          fontWeight="700"
        >
          Dashboard is empty
        </text>
      </svg>

      <h2 className="mt-5 text-xl font-semibold text-white">{title}</h2>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-400">
        {description}
      </p>
    </div>
  );
}
