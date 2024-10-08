import { Tournament } from "@/types/tournament";
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


export const createTournaments = async (tournamentData: Partial<Tournament>): Promise<boolean> => {
    try {
        console.log(`${URL}/tournaments`);
		console.log(tournamentData);

        const response = await axios.post(`${URL}/tournaments`, tournamentData, {
            headers: {
                'Content-Type': 'application/json',
            },
        });

        return response.status === 201; 
    } catch (error) {
        console.error("Error creating tournaments", error);
        return false;
    }
};

export const updateTournaments = async (tournamentData: Partial<Tournament>): Promise<boolean> => {
	try {
		console.log(`${URL}/tournaments/${tournamentData.id}`);

		const response = await axios.put(`${URL}/tournaments/${tournamentData.id}`, tournamentData, {
			headers: {
				'Content-Type': 'application/json',
			},
		});

		return response.status === 204; 
	} catch (error) {
		console.error("Error updating tournaments", error);
		return false;
	}
};

export const deleteTournament = async (id: number): Promise<boolean> => {
	try {
		console.log(`${URL}/tournaments/${id}`);

		const response = await axios.delete(`${URL}/tournaments/${id}`);

		return response.status === 204; 
	} catch (error) {
		console.error("Error deleting tournaments", error);
		return false;
	}
};