import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { cx } from "@/lib/format";

interface SectionHeadingProps {
  title: string;
  description?: string;
  href?: string;
  linkLabel?: string;
  className?: string;
  headingId?: string;
}

export function SectionHeading({
  title,
  description,
  href,
  linkLabel = "查看全部",
  className,
  headingId,
}: SectionHeadingProps) {
  return (
    <div className={cx("section-heading", className)}>
      <div className="section-heading-copy">
        <h2 id={headingId}>{title}</h2>
        {description ? <p>{description}</p> : null}
      </div>
      {href ? (
        <Link href={href} className="text-link section-heading-link">
          {linkLabel}
          <ArrowUpRight size={15} strokeWidth={1.8} aria-hidden="true" />
        </Link>
      ) : null}
    </div>
  );
}
