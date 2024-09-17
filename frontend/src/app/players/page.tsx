import Link from "next/link";
import PlayersCarousel from "@/components/PlayersCarousel";
import { DataTable } from "./_components/DataTable";
import { Player, columns } from "./_components/DataTableColumns";
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
		<div className="w-full max-w-full overflow-hidden px-4 sm:px-6 lg:px-8">
			<div className="mx-auto max-w-7xl relative py-12 px-8 sm:px-12">
				<PlayersCarousel />
			</div>
			<div className="container mx-auto py-10">
				<DataTable columns={columns} data={data} />
			</div>
		</div>
	);
}
