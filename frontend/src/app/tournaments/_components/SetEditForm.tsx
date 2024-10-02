import { useState } from 'react';
import { Pencil } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@radix-ui/react-alert-dialog';
import { AlertDialogFooter, AlertDialogHeader } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';

interface SetEditFormProps {
  player1Name: string;
  player2Name: string;
  initialPlayer1Score: number;
  initialPlayer2Score: number;
}

export default function SetEditForm({
  player1Name,
  player2Name,
  initialPlayer1Score,
  initialPlayer2Score,
}: SetEditFormProps) {
  const [player1Score, setPlayer1Score] = useState(initialPlayer1Score);
  const [player2Score, setPlayer2Score] = useState(initialPlayer2Score);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        // Handle form submission logic here, such as saving updated scores
        console.log('Updated Scores:', { player1Score, player2Score });
      }}
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