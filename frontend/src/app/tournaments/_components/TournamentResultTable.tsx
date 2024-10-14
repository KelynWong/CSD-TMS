import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { RootMatch } from "@/types/tournamentDetails";

interface TournamentResultTableProps {
    matchResult: RootMatch;
}

export default function TournamentResultTable({ matchResult }: TournamentResultTableProps) {
    const players: string[] = [];
    const winners: string[] = [];

    // Recursive function to gather players and winners in each round
    const getPlayersInRound = (match: RootMatch): void => {
        // Base case: if this is a leaf match (no child matches), push the two players and the winner
        if (!match.left && !match.right) {
            players.push(match.player1.fullname);
            players.push(match.player2.fullname);
            winners.push(match.winner.fullname);
            return; // No need to continue recursion since it's a leaf match
        }

        // Recursive case: process the left and right matches
        if (match.left) {
            getPlayersInRound(match.left);
        }
        if (match.right) {
            getPlayersInRound(match.right);
        }

        // After processing the child matches, push the current match winner
        winners.push(match.winner.fullname);
    };

    // Extract player names and winners from the root match
    getPlayersInRound(matchResult);

    // Now you have both `players` and `winners` arrays populated
    console.log("Players:", players);
    console.log("Winners:", winners);

    return (
        <Table className="font-body text-base">
            <TableHeader>
                <TableRow className="bg-amber-400 hover:bg-amber-400">
                    <TableHead className="text-black font-bold text-center px-5">No.</TableHead>
                    <TableHead className="text-black font-bold pl-3 w-1/5">Round of {players.length}</TableHead>
                    <TableHead className="text-black font-bold pl-3 w-1/5">Quarter-Final</TableHead>
                    <TableHead className="text-black font-bold pl-3 w-1/5">Semi-Final</TableHead>
                    <TableHead className="text-black font-bold pl-3 w-1/5">Final</TableHead>
                    <TableHead className="text-black font-bold pl-3 w-1/5">Winner</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {players.map((player, index) => (
                    <TableRow key={index} className="hover:bg-transparent h-10">
                        <TableCell className="text-center">{index + 1}</TableCell>
                        <TableCell>
                            <div className="flex items-center gap-2">
                                {/* Dynamic player display */}
                                <img src="/images/default-flag.png" className="rounded-full w-6 h-6" alt="Player Profile" />
                                <p>{player}</p>
                            </div>
                        </TableCell>

                        {/* Winner Logic */}
                        {index % 2 === 0 && (
                            <TableCell rowSpan={2}>
                                <div className="flex items-center gap-2">
                                    <img src="/images/default-flag.png" className="rounded-full w-6 h-6" alt="Winner Profile" />
                                    <p>{winners[Math.floor(index / 2)]}</p>
                                </div>
                            </TableCell>
                        )}
                        {index % 4 === 0 && (
                            <TableCell rowSpan={4}>
                                <div className="flex items-center gap-2">
                                    <img src="/images/default-flag.png" className="rounded-full w-6 h-6" alt="Winner Profile" />
                                    <p>{winners[Math.floor(index / 4)]}</p>
                                </div>
                            </TableCell>
                        )}
                        {index % 8 === 0 && (
                            <TableCell rowSpan={8}>
                                <div className="flex items-center gap-2">
                                    <img src="/images/default-flag.png" className="rounded-full w-6 h-6" alt="Winner Profile" />
                                    <p>{winners[Math.floor(index / 8)]}</p>
                                </div>
                            </TableCell>
                        )}
                        {index === 0 && (
                            <TableCell rowSpan={16}>
                                <div className="flex items-center gap-2">
                                    <img src="/images/default-flag.png" className="rounded-full w-6 h-6" alt="Winner Profile" />
                                    <p>{winners[0]}</p>
                                </div>
                            </TableCell>
                        )}
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}