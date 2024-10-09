import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ReactElement, JSXElementConstructor, ReactNode, ReactPortal, AwaitedReactNode } from "react";

interface MatchMakingDetails {
    rootMatch: {
        id: number;
        player1: {
            profilePicture: string;
            fullname: string;
        };
        left?: MatchMakingDetails['rootMatch'];
        right?: MatchMakingDetails['rootMatch'];
    };
}

export default function TournamentResultTable({
    matchMakingDetails,
    tournamentDetails
}: { matchMakingDetails: MatchMakingDetails; tournamentDetails: any }) {
    
    const renderMatchCell = (match: {
        player1?: {
            profilePicture: any;
            fullname: string | number | bigint | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<AwaitedReactNode> | null | undefined;
        };
    }) => {
        return (
            <div className="flex items-center gap-2">
                <img
                    src={match?.player1?.profilePicture || "/images/default-profile.png"}
                    alt={String(match?.player1?.fullname) || "Player"}
                    className="rounded-full w-6 h-6"
                />
                <p>{match?.player1?.fullname}</p>
            </div>
        );
    };

    const renderTableRows = (match: {
        id?: any;
        player1?: {
            profilePicture: string;
            fullname: string;
        };
        left?: any;
        right?: any;
    }, round = `{Round of ${tournamentDetails.matches.length + 1}`): JSX.Element => {
        return (
            <>
                {/* Current match row */}
                <TableRow className="hover:bg-transparent h-10">
                    <TableCell className="text-center">{match?.id}</TableCell>
                    <TableCell>{match?.player1 && renderMatchCell(match)}</TableCell>
                    <TableCell rowSpan={2}>{match?.left && renderMatchCell(match.left)}</TableCell>
                    <TableCell rowSpan={4}>{match?.right && renderMatchCell(match.right)}</TableCell>
                </TableRow>

                {/* Recursive rendering for left and right matches */}
                {match?.left && renderTableRows(match.left, "Left Branch")}
                {match?.right && renderTableRows(match.right, "Right Branch")}
            </>
        );
    };

    return (
        <Table className="font-body text-base">
            <TableHeader>
                <TableRow className="bg-amber-400 hover:bg-amber-400">
                    <TableHead className="text-black font-bold text-center px-5">No.</TableHead>
                    <TableHead className="text-black font-bold pl-3 w-1/5">Round of {tournamentDetails.matches.length + 1}</TableHead>
                    <TableHead className="text-black font-bold pl-3 w-1/5">Quarter-Final</TableHead>
                    <TableHead className="text-black font-bold pl-3 w-1/5">Semi-Final</TableHead>
                    <TableHead className="text-black font-bold pl-3 w-1/5">Final</TableHead>
                    <TableHead className="text-black font-bold pl-3 w-1/5">Winner</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {renderTableRows(matchMakingDetails.rootMatch)}
            </TableBody>
        </Table>
    );
}