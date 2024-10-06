import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
} from "@/components/ui/card";

export default function TournamentCard({
	name,
	start_date,
	end_date,
	status,
	result,
}: {
	name: string;
	start_date: string;
	end_date: string;
	status: string;
	result?: string;
}) {
	result = result || "win";
	const statusClass =
		status === "In Progress" ? "text-yellow-500" : "text-gray-500";
	return (
		<Card>
			<CardHeader>
				<CardTitle>{name}</CardTitle>
				<CardDescription>
					{formatted_start} - {formatted_end}
				</CardDescription>
				<CardDescription className={statusClass}>{status}</CardDescription>
				<CardDescription>{result}</CardDescription>
			</CardHeader>
		</Card>
	);
}
