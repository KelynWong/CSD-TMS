import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Player } from "@/types/player";
import { ArrowUpRight } from "lucide-react";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";

export const PlayersRankSection = ({ playersRank } : {playersRank: Player[] }) => {
	return (
		<div className="w-2/5 rounded-lg font-body">
			{/* Header */}
			<div className="flex items-center justify-between mb-3">
                <h2 className="text-2xl rounded-t-lg font-bold uppercase">Current Rankings</h2>
                <Link href="/rankings">
                    <Button className="text-base tracking-wider bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-3 rounded-lg">
                        <ArrowUpRight size={18} />
                    </Button>
                </Link>
            </div>

			{/* Content */}
            <div className="w-full flex flex-col gap-4">
				{playersRank.length === 0 ? (
                    <div className="text-center text-md italic">
                        No players found.
                    </div>
                ) : (
                    <div className="w-full flex flex-col items-center justify-between rounded-lg bg-slate-100 px-4 py-3">
                        <Table>
                            <TableHeader>
                                <TableRow className='hover:bg-transparent'>
                                    <TableHead>Rank</TableHead>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Rating</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {playersRank.map((player) => (
                                    <TableRow key={player.id} className="tournament-info hover:bg-slate-200">
                                        <TableCell>{player.rank}</TableCell>
                                        <TableCell><Link href={`/players/${player.id}`}>{player.fullname}</Link></TableCell>
                                        <TableCell>{player.rating}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                )}
            </div>
		</div>
	);
};