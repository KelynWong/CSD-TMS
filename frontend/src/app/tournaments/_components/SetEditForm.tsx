import { useState } from 'react';
import { SheetFooter, SheetClose } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { addGamesByMatchId } from '@/api/matchmaking/api';
import Loading from '@/components/Loading';
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { message } from 'antd';

interface SetEditFormProps {
  matchId: number;
  player1Name: string;
  player2Name: string;
}

export default function SetEditForm({
  matchId,
  player1Name,
  player2Name,
}: SetEditFormProps) {
  const [player1Scores, setPlayer1Scores] = useState([0, 0, 0]);
  const [player2Scores, setPlayer2Scores] = useState([0, 0, 0]);
  const [loading, setLoading] = useState(false);
  const [numSets, setNumSets] = useState(2);
  const [error, setError] = useState<string | null>(null);

  const validateScores = () => {
    let player1Wins = 0;
    let player2Wins = 0;

    for (let i = 0; i < numSets; i++) {
      const player1Score = player1Scores[i];
      const player2Score = player2Scores[i];

      const isValidScore = (p1Score: number, p2Score: number) => {
        return (p1Score === 30 && p2Score === 29) ||
          (p2Score === 30 && p1Score === 29) ||
          ((p1Score >= 20 && p2Score >= 20) && Math.abs(p1Score - p2Score) === 2) ||
          ((p1Score === 21 && p2Score >= 0 && p2Score < 20) ||
            (p2Score === 21 && p1Score >= 0 && p1Score < 20));
      };

      if (!isValidScore(player1Score, player2Score)) {
        return `Game No. ${i + 1} is invalid. The scores do not meet the required criteria.`;
      }

      if (player1Score > player2Score) {
        player1Wins++;
      } else {
        player2Wins++;
      }
    }

    if (numSets === 2 && player1Wins !== 2 && player2Wins !== 2) {
      return "If only two games are submitted, one player must win both games.";
    }
    
    return null;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validateScores();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    const payload = player1Scores.slice(0, numSets).map((score, index) => ({
      setNum: index + 1,
      player1Score: score,
      player2Score: player2Scores[index],
    }));

    console.log(payload);
    const response = await addGamesByMatchId(matchId, payload);
    setLoading(false);

    if (response) {
      console.log(response);
      message.success("Match games added successfully!");
      setTimeout(() => {
        window.location.reload();
      }, 500); // Delay of 0.5 seconds before reloading
    } else {
      message.error("Failed to update match games");
    }
  };

  const addSet = () => {
    if (numSets < 3) {
      setNumSets(numSets + 1);
    }
  };

  const removeSet = () => {
    if (numSets > 2) {
      setNumSets(numSets - 1);
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <form onSubmit={onSubmit}>
      <ScrollArea className="max-h-[65vh] overflow-y-auto">
        {[...Array(numSets)].map((_, index) => (
          <div key={index} className="flex flex-col gap-4 font-body">
            <h2 className="text-lg font-bold">Game No. {index + 1}</h2>
            <div className="flex items-center justify-between">
              <label htmlFor={`player1Score${index}`} className="font-bold">
                {player1Name} Score:
              </label>
              <input
                type="number"
                id={`player1Score${index}`}
                name={`player1Score${index}`}
                className="border border-slate-300 rounded px-2 py-1 w-20"
                value={player1Scores[index] !== null ? player1Scores[index] : ''}
                onChange={(e) => {
                  const newScores = [...player1Scores];
                  newScores[index] = Number(e.target.value);
                  setPlayer1Scores(newScores);
                }}
                min="0"
                required
              />
            </div>
            <div className="flex items-center justify-between">
              <label htmlFor={`player2Score${index}`} className="font-bold">
                {player2Name} Score:
              </label>
              <input
                type="number"
                id={`player2Score${index}`}
                name={`player2Score${index}`}
                className="border border-slate-300 rounded px-2 py-1 w-20"
                value={player2Scores[index] !== null ? player2Scores[index] : ''}
                onChange={(e) => {
                  const newScores = [...player2Scores];
                  newScores[index] = Number(e.target.value);
                  setPlayer2Scores(newScores);
                }}
                min="0"
                required
              />
            </div>
            {index < numSets - 1 && <Separator className="my-6" />}
          </div>
        ))}

        <div className="mt-4">
          {numSets < 3 && (
            <Button type="button" onClick={addSet}>
              Add Game
            </Button>
          )}
          {numSets === 3 && (
            <Button type="button" onClick={removeSet}>
              Remove Game
            </Button>
          )}
        </div>
      </ScrollArea>

      {error && <div className="text-red-500 mt-4">{error}</div>}

      <SheetFooter className='pt-8'>
        <SheetClose asChild>
          <Button type="button" variant="outline" className="text-base">
            Close
          </Button>
        </SheetClose>
        <Button type="submit" className="bg-red-500 hover:bg-red-700 text-white text-base px-4 py-2 rounded">
          Add
        </Button>
      </SheetFooter>
    </form>
  );
}