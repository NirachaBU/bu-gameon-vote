import Link from "next/link";

export function Brand() {
  return (
    <Link href="/" className="brand" aria-label="BU Game On Expo">
      <span className="brand-bu">BU</span>
      <span className="brand-game">GAME ON</span>
      <span className="brand-expo">EXPO 2026 · VOTE</span>
    </Link>
  );
}
