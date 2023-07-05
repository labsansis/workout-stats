import { Card, CardProps } from "./Card";

export function CardGrid({ cards }: CardGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
      {cards.map((card, i) => (
        <Card key={i} {...card} />
      ))}
    </div>
  );
}

type CardGridProps = {
  cards: CardProps[];
};
