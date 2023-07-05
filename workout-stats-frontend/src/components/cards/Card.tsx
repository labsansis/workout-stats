import "./Card.css";

export function Card(props: CardProps) {
  return (
    <div className="rounded-lg shadow-md card">
      <div className="py-3 text-4xl text-center">{props.value}</div>
      <div className="py-2 text-base text-center">{props.label}</div>
    </div>
  );
}

export type CardProps = {
  // The value of the card, e.g. "40"
  value: string;
  // The label of the card
  label: string;
};
