import Link from "next/link";

export function Brand() {
  return (
    <Link href="/" className="brand" aria-label="กลับหน้าแรก · BU Game On Expo">
      <span className="brand-home" aria-hidden="true">
        <svg width="18" height="18" viewBox="0 0 24 24">
          <path
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 10.5 12 3l9 7.5M5.5 8.6V20a1 1 0 0 0 1 1H10v-6h4v6h3.5a1 1 0 0 0 1-1V8.6"
          />
        </svg>
      </span>
      <span className="brand-text">
        <span className="brand-bu">BU</span>
        <span className="brand-game">GAME ON</span>
        <span className="brand-expo">EXPO 2026 · VOTE</span>
      </span>
    </Link>
  );
}
