import { useState } from 'react';
import {
  AlertDialogAction,
  AlertDialogCancel,
} from '@radix-ui/react-alert-dialog';
import { AlertDialogFooter } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Game } from "@/types/tournamentDetails";
import { updateGamesByGameId } from '@/api/matches/api';
import Loading from '@/components/Loading';

interface SetEditFormProps {
  matchId: number;
  game: Game;
  player1Name: string;
  player2Name: string;
  onClose: () => void; // New prop to close the dialog and refresh the data
}

export default function SetEditForm({
  matchId,
  game,
  player1Name,
  player2Name,
  onClose, // Accept the callback to close the dialog
}: SetEditFormProps) {
  const [player1Score, setPlayer1Score] = useState(game.player1Score);
  const [player2Score, setPlayer2Score] = useState(game.player2Score);
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    setLoading(true);

    const payload = {
      id: game.id,
      setNum: game.setNum,
      player1Score: player1Score,
      player2Score: player2Score
    };

    console.log(payload);
    const response = await updateGamesByGameId(matchId, payload);

    if (response) {
      console.log(response)
      setLoading(false);
      alert("Game updated successful!");
      
      // Call the onClose prop to notify the parent to refresh data
      onClose();
    } else {
      setLoading(false);
      alert("Failed to update game");
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <form onSubmit={onSubmit}
    >
      <div className="flex flex-col gap-4 pb-8 font-body">
        <div className="flex items-center justify-between">
          <label htmlFor="player1Score" className="font-bold">
            {player1Name} Score:
          </label>
          <input
            type="number"
            id="player1Score"
            name="player1Score"
            className="border border-slate-300 rounded px-2 py-1 w-20"
            value={player1Score !== null ? player1Score : ''}
            onChange={(e) => setPlayer1Score(Number(e.target.value))}
            min="0"
            required
          />
        </div>
        <div className="flex items-center justify-between">
          <label htmlFor="player2Score" className="font-bold">
            {player2Name} Score:
          </label>
          <input
            type="number"
            id="player2Score"
            name="player2Score"
            className="border border-slate-300 rounded px-2 py-1 w-20"
            value={player2Score !== null ? player2Score : ''}
            onChange={(e) => setPlayer2Score(Number(e.target.value))}
            min="0"
            required
          />
        </div>
      </div>

      <AlertDialogFooter>
        <AlertDialogCancel>
          <Button type="button" variant="outline" className="text-base">Cancel</Button>
        </AlertDialogCancel>
        <AlertDialogAction asChild>
          <Button type="submit" className="bg-amber-500 text-base text-white px-4 py-2 rounded hover:bg-amber-600">
            Update
          </Button>
        </AlertDialogAction>
      </AlertDialogFooter>
    </form>
  );
};