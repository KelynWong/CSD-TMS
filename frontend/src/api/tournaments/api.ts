import axios from "axios";

const URL = "http://localhost:8082";

type tournamentResponse = {
	id: number;
	tournamentName: string;
	startDT: string;
	endDT: string;
	status: string;
	regStartDT: string;
	regEndDT: string;
};

export const fetchTournaments = async (): Promise<tournamentResponse[]> => {
	try {
		console.log(`${URL}/tournaments`);

		const response = await axios.get(`${URL}/tournaments`);
		const formattedData: tournamentResponse[] = response.data.map((tournament: any) => ({
			id: tournament.id,
			tournamentName: tournament.tournamentName,
			startDT: tournament.startDT,
			endDT: tournament.endDT,
			status: tournament.status,
			regStartDT: tournament.regStartDT,
			regEndDT: tournament.regEndDT
		}));
		console.log(formattedData);
		return formattedData;
	} catch (error) {
		console.error("Error fetching tournaments", error);
		throw error;
	}
};