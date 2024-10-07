import axios from "axios";

const URL = "http://localhost:8082";

export type TournamentResponse = {
	id: string;
	name: string;
	startDate: string;
	endDate: string;
	status: string;
};

export const fetchTournaments = async (
	id: string
): Promise<TournamentResponse[]> => {
	try {
		const response = await axios.get(`${URL}/players/${id}`);
		const formattedData: TournamentResponse[] = response.data.map(
			(tournament: any) => ({
				id: tournament.id,
				name: tournament.tournamentName,
				startDate: tournament.startDT,
				endDate: tournament.endDT,
				status: tournament.status,
			})
		);
		return formattedData;
	} catch (error) {
		console.error("Error fetching tournaments", error);
		throw error;
	}
};
