import { Card as CardType } from '../types/game';
import { Card } from './Card';

type HandProps = {
  title: string;
  score: number | string;
  cards: CardType[];
};

export const Hand = ({ title, score, cards }: HandProps) => {
  return (
    <div className="mb-4">
      <div className="flex items-center gap-2 mb-2">
        <h2 className="text-white text-2xl">{title}</h2>
        <span className="bg-white text-black px-3 py-1 rounded-full font-bold text-xl">{score}</span>
      </div>
      <div className="flex gap-4 justify-center">
        {cards.map((card, index) => (
          <Card key={index} rank={card.rank} suit={card.suit} hidden={card.hidden} />
        ))}
      </div>
    </div>
  );
};
