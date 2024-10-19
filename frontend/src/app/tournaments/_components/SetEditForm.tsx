import { useState } from 'react';
import { SheetFooter, SheetClose } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Game } from "@/types/tournamentDetails";
import { updateGamesByGameId } from '@/api/matches/api';
import Loading from '@/components/Loading';
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { addGamesByMatchId } from '@/api/matchmaking/api';

interface SetEditFormProps {
  matchId: number;
  // game: Game;
  player1Name: string;
  player2Name: string;
  onClose: () => void; // New prop to close the Sheet and refresh the data
}

export default function SetEditForm({
  matchId,
  // game,
  player1Name,
  player2Name,
  onClose, // Accept the callback to close the Sheet
}: SetEditFormProps) {
  // const [player1Score, setPlayer1Score] = useState(game.player1Score);
  // const [player2Score, setPlayer2Score] = useState(game.player2Score);
  const [player1Scores, setPlayer1Scores] = useState([0, 0, 0]);
  const [player2Scores, setPlayer2Scores] = useState([0, 0, 0]);
  const [loading, setLoading] = useState(false);
  const [numSets, setNumSets] = useState(2);

  const onSubmit = async () => {
    setLoading(true);

    // const payload = {
    //   id: game.id,
    //   setNum: game.setNum,
    //   player1Score: player1Score,
    //   player2Score: player2Score
    // };

    const payload = player1Scores.slice(0, numSets).map((score, index) => ({
      setNum: index + 1,
      player1Score: score,
      player2Score: player2Scores[index],
    }));

    console.log(payload);
    // const response = await updateGamesByGameId(matchId, payload);
    const response = await addGamesByMatchId(matchId, payload);

    if (response) {
      console.log(response)
      setLoading(false);
      ("match games added successful!");
      
      // Call the onClose prop to notify the parent to refresh data
      onClose();
    } else {
      setLoading(false);
      ("Failed to update match games");
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
      <ScrollArea className="max-h-[75vh] overflow-y-auto">
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

      <SheetFooter className='pt-8'>
        <SheetClose asChild>
          <Button type="button" variant="outline" className="text-base">
            Close
          </Button>
        </SheetClose>
        <SheetClose asChild>
          <Button type="submit" className="bg-red-500 hover:bg-red-700 text-white text-base px-4 py-2 rounded">
            Add
          </Button>
        </SheetClose>
      </SheetFooter>
      </ScrollArea>
    </form>
  );
};