import Link from "next/link";

import { cx } from "@/lib/format";

interface TagProps {
  children: React.ReactNode;
  href?: string;
  className?: string;
  muted?: boolean;
}

export function Tag({ children, href, className, muted = false }: TagProps) {
  const classes = cx("tag", muted && "tag-muted", className);

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return <span className={classes}>{children}</span>;
}
