export type Match = {
	set_number: number;
	tournament_name: string;
	tournament_id: number;
	opponent: string;
	opponent_id: number;
	result: "Win" | "Loss";
	round: number;
	final_score: string;
	datetime: string;
};
