import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Match } from "@/types/tournamentDetails";
import { useMemo } from "react";
import TPlayer from "./TPlayer";

interface TournamentResultTableProps {
    matchResult: Match[]; // Array of matches in the tournament
}

/**
 * TournamentResultTable Component
 * 
 * Displays the results of the tournament in a table format.
 * - Shows players in the first round.
 * - Shows winners for each subsequent round, leading to the final winner.
 * - Includes scores for matches where available.
 */
export default function TournamentResultTable({ matchResult }: TournamentResultTableProps) {
    const players: any[] = []; // Array to hold all players
    const winners: any[] = []; // Array to hold winners for each round
    const scores: { [roundNum: number]: { winnerName: string, score: string }[] } = {}; // Object to store scores by round

    // Extract distinct round numbers and sort them in descending order
    const roundNums = matchResult.map(item => item.roundNum);
    const distinctRoundNums = Array.from(new Set(roundNums)).sort((a, b) => b - a);

    // Gather players in each round by filtering based on roundNum
    // Adds "Bye." for matches with only one player.
    const getPlayersInRound = (round: number): void => {
        matchResult
            .filter((match) => match.roundNum === round)
            .forEach((match) => {
                if (match.player1 !== null) players.push(match.player1);

                if (match.player2 !== null) players.push(match.player2);
                else players.push("Bye.");
            });
    };

    // Gather winners and scores in BFS order based on roundNum levels
    // Adds scores for matches where results are available.
    const gatherWinnersBFS = (): void => {    
        matchResult.forEach((match) => {
            if (match.winner !== null) {
                winners.push(match.winner);
                const formattedScores = match.games.map(game => `${game.player1Score}-${game.player2Score}`).join(' / ');
                
                if (!scores[match.roundNum]) {
                    scores[match.roundNum] = [];
                }
                scores[match.roundNum].push({ winnerName: match.winner.fullname, score: formattedScores });
            } else {
                winners.push("Match not played yet");
                if (!scores[match.roundNum]) {
                    scores[match.roundNum] = [];
                }
                scores[match.roundNum].push({ winnerName: "Match not played yet", score: "" });
            }
        });
    };

    // Populate players and winners
    getPlayersInRound(distinctRoundNums[0]); // Players for the first round
    gatherWinnersBFS(); // Winners for subsequent rounds

    // Create column headers dynamically based on distinct round numbers
    const columnHeaders = useMemo(() => {
        const headers = [];
        for (let i = 0; i < distinctRoundNums.length; i++) {
            headers.push(`Round of ${distinctRoundNums[i]}`);
        }
        headers.push("Winner"); // Always include the final winner column
        return headers;
    }, [players.length]);

    return (
        <Table className="font-body text-base">
            {/* Table Header */}
            <TableHeader>
                <TableRow className="bg-amber-400 hover:bg-amber-400">
                    <TableHead className="text-black font-bold text-center px-5 w-3">No.</TableHead>
                    {columnHeaders.map((header, index) => (
                        <TableHead key={index} className={`text-black font-bold pl-3 w-1/${columnHeaders.length}`}>
                            {header}
                        </TableHead>
                    ))}
                </TableRow>
            </TableHeader>

            {/* Table Body */}
            <TableBody>
                {players.map((player, index) => (
                    <TableRow key={index} className="hover:bg-transparent h-10">
                        {/* Player Row Number */}
                        <TableCell className="text-center w-3">{index + 1}</TableCell>
                        
                        {/* Player Details */}
                        <TableCell className={`w-1/${columnHeaders.length}`}>
                            <div className="flex items-center gap-2">
                                {player == "Bye." ? (
                                    <p>{player}</p>
                                ) : (
                                    <TPlayer player={player} />
                                )}
                            </div>
                            {/* Display score if available for the player */}
                            {scores[distinctRoundNums[0]] && scores[distinctRoundNums[0]].some(scoreObj => scoreObj.winnerName === player.fullname) && (
                                <p className="text-sm font-bold mt-1" style={{ color: "#00215f" }}>
                                    {scores[distinctRoundNums[0]].find(scoreObj => scoreObj.winnerName === player.fullname)?.score}
                                </p>
                            )}
                        </TableCell>

                        {/* Winner Logic */}
                        {[...Array(columnHeaders.length-1)].map((_, round) => {
                            const rowSpan = Math.pow(2, round + 1); // Calculate rowSpan for each round

                            // Dynamically calculate the starting index for the current round
                            let startingIndex = 0;
                            for (let r = 0; r < round; r++) {
                                startingIndex += Math.pow(2, columnHeaders.length - r - 2);
                            }

                            // Calculate the winner index for the current row and round
                            const winnerIndex = startingIndex + Math.floor(index / rowSpan);

                            // Display the winner only on the first row of each block
                            if (index % rowSpan === 0) {
                                if (winners[winnerIndex] == "Match not played yet" || winners[winnerIndex] == "Bye.") {    
                                    return (
                                        <TableCell key={round} rowSpan={rowSpan}>
                                            <div className="flex items-center gap-2 italic text-slate-400">
                                                <p>{winners[winnerIndex]}</p> 
                                            </div>
                                        </TableCell>
                                    );
                                } else {
                                    return (
                                        <TableCell key={round} rowSpan={rowSpan}>
                                            <div className="flex flex-col items-start gap-1">
                                                <div className="flex flex-row items-center gap-2">
                                                    <TPlayer player={winners[winnerIndex]} />
                                                </div>
                                                {scores[distinctRoundNums[round+1]] && scores[distinctRoundNums[round+1]].some(scoreObj => scoreObj.winnerName === winners[winnerIndex].fullname) && (
                                                    <p className="text-sm font-bold mt-1" style={{ color: "#00215f" }}>
                                                        {scores[distinctRoundNums[round+1]].find(scoreObj => scoreObj.winnerName === winners[winnerIndex].fullname)?.score}
                                                    </p>
                                                )}
                                            </div>
                                        </TableCell>
                                    );
                                }
                            }

                            return null;
                        })}
                    </TableRow> 
                ))}
            </TableBody>
        </Table>
    );
}