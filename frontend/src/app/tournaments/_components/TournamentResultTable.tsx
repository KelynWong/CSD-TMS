import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Match } from "@/types/tournamentDetails";
import { useMemo } from "react";
import TPlayer from "./TPlayer";

interface TournamentResultTableProps {
    matchResult: Match[];
}

export default function TournamentResultTable({ matchResult }: TournamentResultTableProps) {
    const players: any[] = [];
    const winners: any[] = [];

    console.log(matchResult);

    // Extract distinct roundNum values and sort them in descending order
    const roundNums = matchResult.map(item => item.roundNum);
    const distinctRoundNums = Array.from(new Set(roundNums)).sort((a, b) => b - a);

    // Gather players in each round by filtering based on roundNum
    const getPlayersInRound = (round: number): void => {
        matchResult
            .filter((match) => match.roundNum === round)
            .forEach((match) => {
                if (match.player1.id) players.push(match.player1);

                if (match.player2.id) players.push(match.player2);
                else players.push("Bye");
            });
    };

    // Gather winners in BFS order based on roundNum levels
    const gatherWinnersBFS = (): void => {    
        console.log('matchResult', matchResult);    
        matchResult
            .forEach((match) => {
                console.log('match', match);
                if (match.winner !== null) winners.push(match.winner);
                else winners.push("Match not played yet");
            });
        
        // Append winners in order
        // winners.unshift(...currentLevelWinners);
    };

    // Populate players and winners
    getPlayersInRound(distinctRoundNums[0]);
    gatherWinnersBFS();

    // Now you have both `players` and `winners` arrays populated
    console.log("Players:", players);
    console.log("Winners:", winners);

    // Calculate total rounds needed based on number of players
    // const totalRounds = Math.floor(Math.log2(players.length));
    // console.log("Total Rounds:", totalRounds);

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

            {/* TO BE EDITED AGN... BRAIN TOO DEAD NOW, I HVNT HANDLE
            1. IF IS ODD NUMBER OF ROUNDS, FIRST ROW WILL BE BYE
            2. IDK IF IT HANDLES LIKE PLAYER OF 10 FOR EG, CORRECTLY */}
            <TableBody>
                {players.map((player, index) => (
                    <TableRow key={index} className="hover:bg-transparent h-10">
                        <TableCell className="text-center w-3">{index + 1}</TableCell>
                        <TableCell className={`w-1/${columnHeaders.length}`}>
                            <div className="flex items-center gap-2">
                                <TPlayer player={player} />
                            </div>
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
                                console.log('winners[winnerIndex]', winners[winnerIndex]);
                                if (winners[winnerIndex] == "Match not played yet" || winners[winnerIndex] == "Bye") {    
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
                                            <div className="flex items-center gap-2">
                                                <TPlayer player={winners[winnerIndex]} />
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

// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// import { RootMatch } from "@/types/tournamentDetails";
// import { useMemo } from "react";

// interface TournamentResultTableProps {
//     matchResult: RootMatch;
// }

// export default function TournamentResultTable({ matchResult }: TournamentResultTableProps) {
//     const players: string[] = [];
//     const winners: string[] = [];

//     // Recursive function to gather players and winners in each round
//     const getPlayersInRound = (match: RootMatch): void => {
//         // Base case: if this is a leaf match (no child matches), push the two players and the winner
//         if (!match.left && !match.right) {
//             if (match.player1) {
//                 players.push(match.player1.fullname);
//             }
//             if (match.player2) {
//                 players.push(match.player2.fullname);
//             }
//             return; // No need to continue recursion since it's a leaf match
//         }

//         // Recursive case: process the left and right matches
//         if (match.left) {
//             getPlayersInRound(match.left);
//         }
//         if (match.right) {
//             getPlayersInRound(match.right);
//         }

//         // After processing the child matches, push the current match winner
//         // winners.push(match.winner.fullname);
//     };

//     // BFS function to gather winners level by level
//     const gatherWinnersBFS = (match: RootMatch): void => {
//         const queue: RootMatch[] = [match]; // Start with the root match in the queue

//         // Continue processing while there are matches in the queue
//         while (queue.length > 0) {
//             const currentLevelSize = queue.length; // Number of nodes at the current level
//             const currentLevelWinners: string[] = []; // Temporary array for winners at the current level

//             // Process each match in the current level
//             for (let i = 0; i < currentLevelSize; i++) {
//                 const currentMatch = queue.shift(); // Get the first match from the queue

//                 // Add the winner of the current match to the temporary array
//                 if (currentMatch) {
//                     if (currentMatch.winner) 
//                         currentLevelWinners.push(currentMatch.winner.fullname);
//                     else
//                         currentLevelWinners.push("Match not played yet");
//                 }

//                 // Add child matches (if they exist) to the queue for further processing
//                 if (currentMatch?.left) queue.push(currentMatch.left);
//                 if (currentMatch?.right) queue.push(currentMatch.right);
//             }

//             // console.log(currentLevelWinners)

//             // Once all matches in the current level are processed, append the level winners to the main array
//             winners.unshift(...currentLevelWinners);
//         }
//     };

//     // Extract player names and winners from the root match
//     getPlayersInRound(matchResult);
//     gatherWinnersBFS(matchResult);

//     // Now you have both `players` and `winners` arrays populated
//     console.log("Players:", players);
//     console.log("Winners:", winners);

//     // Calculate total rounds needed based on number of players
//     const totalRounds = Math.floor(Math.log2(players.length));
//     console.log("Total Rounds:", totalRounds);

//     const columnHeaders = useMemo(() => {
//         const headers = [];
//         for (let i = 0; i < totalRounds; i++) {
//             headers.push(`Round of ${players.length / Math.pow(2, i)}`);
//         }
//         headers.push("Winner"); // Always include the final winner column
//         return headers;
//     }, [players.length]);

//     return (
//         <Table className="font-body text-base">
//             <TableHeader>
//                 <TableRow className="bg-amber-400 hover:bg-amber-400">
//                     <TableHead className="text-black font-bold text-center px-5 w-3">No.</TableHead>
//                     {columnHeaders.map((header, index) => (
//                         <TableHead key={index} className={`text-black font-bold pl-3 w-1/${columnHeaders.length}`}>
//                             {header}
//                         </TableHead>
//                     ))}
//                 </TableRow>
//             </TableHeader>

//             {/* TO BE EDITED AGN... BRAIN TOO DEAD NOW, I HVNT HANDLE
//             1. IF IS ODD NUMBER OF ROUNDS, FIRST ROW WILL BE BYE
//             2. IDK IF IT HANDLES LIKE PLAYER OF 10 FOR EG, CORRECTLY */}
//             <TableBody>
//                 {players.map((player, index) => (
//                     <TableRow key={index} className="hover:bg-transparent h-10">
//                         <TableCell className="text-center w-3">{index + 1}</TableCell>
//                         <TableCell className={`w-1/${columnHeaders.length}`}>
//                             <div className="flex items-center gap-2">
//                                 {/* Dynamic player display */}
//                                 <img src="/images/default_profile.png" className="rounded-full w-6 h-6" alt="Player Profile" />
//                                 <p>{player}</p>
//                             </div>
//                         </TableCell>

//                         {/* Winner Logic */}
//                         {[...Array(totalRounds)].map((_, round) => {
//                             const rowSpan = Math.pow(2, round + 1); // Calculate rowSpan for each round

//                             // Dynamically calculate the starting index for the current round
//                             let startingIndex = 0;
//                             for (let r = 0; r < round; r++) {
//                                 startingIndex += Math.pow(2, totalRounds - r - 1);
//                             }

//                             // Calculate the winner index for the current row and round
//                             const winnerIndex = startingIndex + Math.floor(index / rowSpan);

//                             // Display the winner only on the first row of each block
//                             if (index % rowSpan === 0) {
//                                 if (winners[winnerIndex] !== "Match not played yet") {
//                                     return (
//                                         <TableCell key={round} rowSpan={rowSpan}>
//                                             <div className="flex items-center gap-2">
//                                                 <img src="/images/default_profile.png" className="rounded-full w-6 h-6" alt="Winner Profile" />
//                                                 <p>{winners[winnerIndex]}</p> 
//                                             </div>
//                                         </TableCell>
//                                     );
//                                 } else {
//                                     return (
//                                         <TableCell key={round} rowSpan={rowSpan}>
//                                             <div className="flex items-center gap-2 italic text-slate-400">
//                                                 <p>{winners[winnerIndex]}</p> 
//                                             </div>
//                                         </TableCell>
//                                     );
//                                 }
//                             }

//                             return null;
//                         })}
//                     </TableRow> 
//                 ))}
//             </TableBody>
//         </Table>
//     );
// }