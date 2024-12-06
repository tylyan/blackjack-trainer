type CardProps = {
  rank: string;
  suit: string;
  hidden?: boolean;
};

export const Card = ({ rank, suit, hidden }: CardProps) => {
  const isRed = suit === '♥' || suit === '♦';

  return (
    <div
      className={`bg-white rounded-lg p-4 w-32 h-48 flex flex-col justify-between relative drop-shadow-lg
        ${hidden ? 'bg-gray-300' : isRed ? 'text-red-600' : 'text-black'}`}
    >
      {hidden ? (
        <div className="text-5xl absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-slate-800 ">?</div>
      ) : (
        <>
          <div className="text-2xl font-bold">
            {rank}
            <span className="text-sm">{suit}</span>
          </div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-5xl">{suit}</div>
          <div className="text-2xl font-bold self-end rotate-180">
            {rank}
            <span className="text-sm">{suit}</span>
          </div>
        </>
      )}
    </div>
  );
};
