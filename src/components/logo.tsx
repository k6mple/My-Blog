import Link from "next/link";

import { cx } from "@/lib/format";

interface LogoProps {
  className?: string;
  compact?: boolean;
  onClick?: () => void;
}

export function Logo({ className, compact = false, onClick }: LogoProps) {
  return (
    <Link href="/" className={cx("brand", className)} onClick={onClick}>
      <span className="brand-mark" aria-hidden="true" />
      <span className="brand-name">帧间</span>
      {!compact ? <span className="brand-en">Interframe</span> : null}
    </Link>
  );
}
