import Link from "next/link";

type UpcomingItem = {
  id: string;
  href: string;
  title: string;
  detail: string;
};

type UpcomingListProps = {
  title: string;
  emptyText: string;
  items: UpcomingItem[];
};

export function UpcomingList({ title, emptyText, items }: UpcomingListProps) {
  return (
    <section className="rounded-2xl border border-line bg-night p-5">
      <h2 className="font-display text-xl font-semibold">{title}</h2>
      {items.length === 0 ? (
        <p className="mt-3 text-muted">{emptyText}</p>
      ) : (
        <ul className="mt-3 divide-y divide-line">
          {items.map((item) => (
            <li key={item.id}>
              <Link href={item.href} className="block min-h-11 py-2 hover:text-gold-bright">
                <span className="font-semibold">{item.title}</span>
                <span className="block text-sm text-muted">{item.detail}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
