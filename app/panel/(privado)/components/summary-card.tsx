import Link from "next/link";

type SummaryCardProps = {
  title: string;
  value: string;
  detail?: string;
  href?: string;
};

export function SummaryCard({ title, value, detail, href }: SummaryCardProps) {
  const content = (
    <>
      <p className="text-sm text-muted">{title}</p>
      <p className="mt-1 font-display text-4xl font-semibold tabular-nums text-gold">{value}</p>
      {detail && <p className="mt-1 text-sm text-muted">{detail}</p>}
    </>
  );
  const className = "block rounded-2xl border border-line bg-night p-5";

  return href ? (
    <Link href={href} className={`${className} hover:border-gold`}>
      {content}
    </Link>
  ) : (
    <div className={className}>{content}</div>
  );
}
