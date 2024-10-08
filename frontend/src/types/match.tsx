import { Game } from "./game";

export type Match = {
	id: number;
    tournamentId: number;
    player1Id: string;
    player2Id: string;
    winnerId: string;
    left: string;
    right: string;
    games: Game[];
	// set_number: number;
	// tournament_name: string;
	// tournament_id: number;
	// opponent: string;
	// opponent_id: number;
	// result: "Win" | "Loss";
	// round: number;
	// final_score: string;
	// datetime: string;
};
