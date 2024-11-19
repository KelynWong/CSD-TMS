import { useState } from 'react';
import { SheetFooter, SheetClose } from "@/components/ui/sheet"; // Sheet components for footer and close button
import { Button } from "@/components/ui/button"; // Button component
import { addGamesByMatchId } from "@/api/matchmaking/api"; // API call for adding match games
import Loading from "@/components/Loading"; // Loading component
import { Separator } from "@/components/ui/separator"; // Separator for dividing sections
import { ScrollArea } from "@/components/ui/scroll-area"; // Scrollable area component
import { message } from "antd"; // Ant Design message component for notifications

// Props definition for the SetEditForm component
interface SetEditFormProps {
  matchId: number; // Match ID for submitting scores
  player1Name: string; // Name of Player 1
  player2Name: string; // Name of Player 2
}

// Main Component: SetEditForm
// Allows users to edit and submit match scores
export default function SetEditForm({
  matchId,
  player1Name,
  player2Name,
}: SetEditFormProps) {
  // State variables
  const [player1Scores, setPlayer1Scores] = useState([0, 0, 0]); // Scores for Player 1
  const [player2Scores, setPlayer2Scores] = useState([0, 0, 0]); // Scores for Player 2
  const [loading, setLoading] = useState(false); // Loading state
  const [numSets, setNumSets] = useState(2); // Number of sets (games)
  const [error, setError] = useState<string | null>(null); // Validation error message

  // Validates the entered scores for all games
  const validateScores = () => {
    let player1Wins = 0;
    let player2Wins = 0;

    for (let i = 0; i < numSets; i++) {
      const player1Score = player1Scores[i];
      const player2Score = player2Scores[i];

      // Validation logic for a valid score
      const isValidScore = (p1Score: number, p2Score: number) => {
        return (p1Score === 30 && p2Score === 29) || // Max score with a narrow win
          (p2Score === 30 && p1Score === 29) ||
          ((p1Score >= 20 && p2Score >= 20) && Math.abs(p1Score - p2Score) === 2) || // Deuce with 2-point lead
          ((p1Score === 21 && p2Score >= 0 && p2Score < 20) || // Normal win condition
            (p2Score === 21 && p1Score >= 0 && p1Score < 20));
      };

      if (!isValidScore(player1Score, player2Score)) {
        return `Game No. ${i + 1} is invalid. The scores do not meet the required criteria.`; // Return error for invalid scores
      }

      // Track the number of wins for each player
      if (player1Score > player2Score) {
        player1Wins++;
      } else {
        player2Wins++;
      }
    }

    // Validation for winning conditions in 2 games
    if (numSets === 2 && player1Wins !== 2 && player2Wins !== 2) {
      return "If only two games are submitted, one player must win both games.";
    }
    
    return null; // No errors
  };

  // Handles form submission
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate scores before submission
    const validationError = validateScores();
    if (validationError) {
      setError(validationError); // Set error message
      return;
    }

    setLoading(true); // Show loading state

    // Prepare payload for API
    const payload = player1Scores.slice(0, numSets).map((score, index) => ({
      setNum: index + 1,
      player1Score: score,
      player2Score: player2Scores[index],
    }));

    const response = await addGamesByMatchId(matchId, payload); // Submit scores via API
    setLoading(false); // Stop loading

    if (response) {
      message.success("Match games added successfully!"); // Show success message
      setTimeout(() => {
        window.location.reload();
      }, 500); // Delay of 0.5 seconds before reloading
    } else {
      message.error("Failed to update match games"); // Show error message
    }
  };

  // Adds another game (up to a maximum of 3 games)
  const addSet = () => {
    if (numSets < 3) {
      setNumSets(numSets + 1);
    }
  };

  // Removes the last game (minimum of 2 games)
  const removeSet = () => {
    if (numSets > 2) {
      setNumSets(numSets - 1);
    }
  };

  // Show loading component if in loading state
  if (loading) {
    return <Loading />;
  }

  return (
    <form onSubmit={onSubmit}>
      {/* Scrollable content area for game inputs */}
      <ScrollArea className="max-h-[65vh] overflow-y-auto">
        {[...Array(numSets)].map((_, index) => (
          <div key={index} className="flex flex-col gap-4 font-body">
            <h2 className="text-lg font-bold">Game No. {index + 1}</h2>
            <div className="flex items-center justify-between">
              {/* Input for Player 1's score */}
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
                  setPlayer1Scores(newScores); // Update Player 1's score
                }}
                min="0"
                required
              />
            </div>
            <div className="flex items-center justify-between">
              {/* Input for Player 2's score */}
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
                  setPlayer2Scores(newScores); // Update Player 2's score
                }}
                min="0"
                required
              />
            </div>
            {/* Separator between games */}
            {index < numSets - 1 && <Separator className="my-6" />}
          </div>
        ))}

        <div className="mt-4">
          {/* Add or remove game buttons */}
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

      {/* Error message display */}
      {error && <div className="text-red-500 mt-4">{error}</div>}

      {/* Footer with Close and Submit buttons */}
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