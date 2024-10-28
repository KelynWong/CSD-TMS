import { Game } from "./game";

export type Match = {
	id: number;
    tournamentId: number;
    player1Id: string;
    player2Id: string;
    winnerId: string;
    left: number;
    right: number;
    games: Game[];
    roundNum: number;
};
