export interface Match {
    id: number;
    tournamentId: number;
    player1Id: string;
    player2Id: string;
    winnerId: string;
    left: number;
    right: number;
    games: Game[];
}

export interface Player {
    id: string;
	username: string;
	fullname: string;
	email: string;
	role: string;
	gender: string;
	rating: number;
	country: string;
	profilePicture: string;
}

export interface Game {
    id: number;
    setNum: number;
    player1Score: number | null;
    player2Score: number | null;
}

export interface RootMatch {
    id: number;
    tournamentId: number;
    player1: Player;
    player2: Player;
    winner: Player;
    left?: RootMatch | null;
    right?: RootMatch | null;
    games: Game[];
}

export type TournamentDetails = {
    id: number;
    tournamentName: string;
    startDT: string;
    endDT: string;
    status: string;
    regStartDT: string;
    regEndDT: string;
    organizer: string;
    players: Player[]; // Array of players
    rootMatch: RootMatch | null; // Root match of the tournament
    matches: Match[];
};