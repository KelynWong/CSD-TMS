import { PlayerCard } from "./_components/PlayerCard";
import { Player } from "@/types/player";

export default function Players() {
	const data: Player[] = [
		{
			id: 1,
			username: "KaiXuan",
			fullname: "Kai Xuan",
			gender: "Male",
			ranking: 1,
			rating: 103,
			wins: 9,
			losses: 1,
			win_rate: 90,
		},
		{
			id: 2,
			username: "Lynette",
			fullname: "Lynette",
			gender: "Female",
			ranking: 2,
			rating: 102,
			wins: 8,
			losses: 2,
			win_rate: 80,
		},
		{
			id: 3,
			username: "Kelyn",
			fullname: "Kelyn",
			gender: "Female",
			ranking: 3,
			rating: 101,
			wins: 7,
			losses: 3,
			win_rate: 70,
		},
		{
			id: 4,
			username: "Sonia",
			fullname: "Sonia",
			gender: "Female",
			ranking: 4,
			rating: 100,
			wins: 6,
			losses: 4,
			win_rate: 60,
		},
		{
			id: 5,
			username: "John Doe",
			fullname: "John Doe",
			gender: "Male",
			ranking: 4,
			rating: 100,
			wins: 6,
			losses: 4,
			win_rate: 60,
		},
		{
			id: 6,
			username: "John Doe",
			fullname: "John Doe",
			gender: "Male",
			ranking: 4,
			rating: 100,
			wins: 6,
			losses: 4,
			win_rate: 60,
		},
		{
			id: 7,
			username: "John Doe",
			fullname: "John Doe",
			gender: "Male",
			ranking: 4,
			rating: 100,
			wins: 6,
			losses: 4,
			win_rate: 60,
		},
		{
			id: 8,
			username: "John Doe",
			fullname: "John Doe",
			gender: "Male",
			ranking: 4,
			rating: 100,
			wins: 6,
			losses: 4,
			win_rate: 60,
		},
		{
			id: 9,
			username: "John Doe",
			fullname: "John Doe",
			gender: "Male",
			ranking: 4,
			rating: 100,
			wins: 6,
			losses: 4,
			win_rate: 60,
		},
		{
			id: 10,
			username: "John Doe",
			fullname: "John Doe",
			gender: "Male",
			ranking: 4,
			rating: 100,
			wins: 6,
			losses: 4,
			win_rate: 60,
		},
		{
			id: 11,
			username: "John Doe",
			fullname: "John Doe",
			gender: "Male",
			ranking: 4,
			rating: 100,
			wins: 6,
			losses: 4,
			win_rate: 60,
		},
	];
	return (
		<div className="container mx-auto px-4 py-8">
			<h1 className="text-3xl font-bold mb-6">Players</h1>
			<div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
				{data.map((player) => (
					<PlayerCard key={player.id} player={player} />
				))}
			</div>
		</div>
	);
}
