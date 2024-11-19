import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Tournament } from "@/types/tournament";
import { ArrowRight } from "lucide-react";
import NoTournamentDisplay from "../NoTournamentDisplay";

export const OngoingTournamentsSection = ({ ongoingTournaments } : {ongoingTournaments: Tournament[] }) => {
	return (
		<div className="w-3/5 rounded-lg font-body mr-6">
			{/* Header */}
			<div className="flex items-center justify-between mb-3">
				<h2 className="text-2xl uppercase">Ongoing Tournaments</h2>
				<Link href="/tournaments">
					<Button className="text-md font-heading tracking-wider bg-red-500 hover:bg-red-700 text-white py-2 px-3 rounded-lg">
						View All
                        <ArrowRight className="ml-2" size={18} />
					</Button>
				</Link>
			</div>

			{/* Content */}
			{ongoingTournaments.length === 0 ? (
				<NoTournamentDisplay />
			) : (
				<div className="w-full grid grid-cols-2 gap-4">
					{ongoingTournaments.map((tournament) => (
						<Link href={`/tournaments/${tournament.id}`} key={tournament.id}>
							<div className="tournament flex flex-col items-center justify-between rounded-lg bg-slate-100 px-3 py-9 bg-black duration-300 hover:shadow-lg hover:shadow-gray-500">
								<div className="tournament-info">
									<div className="tournament-details text-center">
										<h3 className="text-xl font-bold text-white">{tournament.tournamentName}</h3>
										<h4 className="text-lg text-yellow-500">
											Start Date: {new Date(tournament.startDT).toLocaleDateString()}
										</h4>
										<h4 className="text-lg text-yellow-500">
											End Date: {new Date(tournament.endDT).toLocaleDateString()}
										</h4>
									</div>
								</div>
                                <div className="tournament-action flex items-center justify-center gap-4 mt-4">
                                    <Link href="/prediction">
                                        <Button className="font-heading text-md predict"><span>Predict</span></Button>
                                    </Link>
                                </div>
							</div>
						</Link>
					))}
				</div>
			)}
		</div>
	);
};
