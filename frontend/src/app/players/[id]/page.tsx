import PlayerHero from "@/components/PlayerHero";
import { Player } from "@/types/player";

export default function PlayerProfile({ params }: { params: { id: string } }) {
	const player: Player = {
		id: 1,
		username: "KaiXuan",
		fullname: "Kai Xuan",
		gender: "Male",
		ranking: 1,
		rating: 103,
		wins: 9,
		losses: 1,
		win_rate: 90,
	};
	return (
		<>
			<div>
				<PlayerHero {...player} />
			</div>
			<div>
				<p>Match History</p>
			</div>
			<div>
				<p>Tournament History</p>
			</div>
		</>
	);
}
