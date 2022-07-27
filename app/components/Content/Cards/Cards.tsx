import { type CardsContent } from "~/types";
import { type FC } from "react";
import Card from "./Card";

const Cards: FC<Pick<CardsContent, "cards">> = ({ cards }) => {
  if (!cards) return null;
  return (
    <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 xl:gap-8 p-1 sm:p-4">
      {cards.map((card) => (
        <Card key={card._key} {...card} />
      ))}
    </div>
  );
};

export default Cards;
