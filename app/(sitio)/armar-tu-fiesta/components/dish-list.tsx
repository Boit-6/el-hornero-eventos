type DishListProps = {
  title: string;
  dishes: ReadonlyArray<string>;
};

/** Lista informativa de platos que ya vienen incluidos en una propuesta. */
export function DishList({ title, dishes }: DishListProps) {
  return (
    <div>
      <h3 className="font-semibold">{title}</h3>
      <ul className="mt-3 space-y-2 text-sm text-muted">
        {dishes.map((dish) => (
          <li key={dish} className="flex gap-2">
            <span aria-hidden="true" className="text-gold">◆</span>
            {dish}
          </li>
        ))}
      </ul>
    </div>
  );
}
