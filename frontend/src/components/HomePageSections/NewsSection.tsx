import { Player } from "@/types/player";
import { Tournament } from "@/types/tournament";
import Link from "next/link";

export const NewsSection = ({ playersRank, ongoingTournaments, completedTournament, errors } : { playersRank: Player[], ongoingTournaments: Tournament[], completedTournament: Tournament[], errors: { playersErr: boolean, tournamentErr: boolean } } ) => {
	const { playersErr, tournamentErr } = errors;

	return (
		<div className="latest-rank w-100 flex">
			<div className="w-1/5 title px-6 py-5 text-center">
				<h1 className="text-3xl">Latest News</h1>
			</div>
			<div className="w-4/5 players px-14 py-5 flex items-center">
				<div id="scroll-text">
					<div className="flex items-center">
						{/* Error Handling */}
						{playersErr && tournamentErr ? (
							<h3 className="text-xl mr-12 text-ellipsis overflow-hidden whitespace-nowrap">
								No data found, please try again later. We apologize for the inconvenience caused.
							</h3>
						) : (
							<>
								{/* Player Rank */}
								{playersRank.length ? (
									<h3 className="text-xl mr-12 text-ellipsis overflow-hidden whitespace-nowrap w-64">
										🥇 Rank {playersRank[0].rank} - {playersRank[0].fullname}
									</h3>
								) : (
									<h3 className="text-xl mr-12 text-ellipsis overflow-hidden whitespace-nowrap w-64">
										Have a good day!
									</h3>
								)}

								{/* Ongoing Tournament */}
								{ongoingTournaments.length ? (
									<h3 className="text-xl mr-12 text-ellipsis overflow-hidden whitespace-nowrap w-96">
										🎉 {ongoingTournaments[0].tournamentName} is ongoing now!
									</h3>
								) : (
									<h3 className="text-xl mr-12 text-ellipsis overflow-hidden whitespace-nowrap w-64">
										No Ongoing Tournaments D:
									</h3>
								)}

								{/* Completed Tournament */}
								{completedTournament.length ? (
									<h3 className="text-xl mr-12 text-ellipsis overflow-hidden whitespace-nowrap w-96">
										🏆 {completedTournament[0].winner} won {completedTournament[0].tournamentName}
									</h3>
								) : (
									<h3 className="text-xl mr-12 text-ellipsis overflow-hidden whitespace-nowrap w-64">
										No Completed Tournaments
									</h3>
								)}
							</>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};
