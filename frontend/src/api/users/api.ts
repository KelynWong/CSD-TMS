import axios from "axios";
import { Player } from "@/types/player";

const URL = "http://localhost:8080";

type PlayerResponse = {
	id: string;
	username: string;
	fullname: string;
	gender: string;
	rating: number;
	country: string;
	profilePicture: string;
	email: string;
	role: string;
};

export const fetchPlayers = async (): Promise<PlayerResponse[]> => {
	try {
		const response = await axios.get(`${URL}/api/users`);
		return response.data;
	} catch (error) {
		console.error("Error fetching players", error);
		throw error;
	}
};

export const fetchPlayer = async (id: string): Promise<PlayerResponse> => {
	try {
		const response = await axios.get(`${URL}/api/users/${id}`);
		console.log(response.data);
		const formattedData: PlayerResponse = {
			id: response.data.id,
			username: response.data.username,
			fullname: response.data.fullname,
			gender: response.data.gender,
			rating: response.data.rank,
			country: response.data.country,
			profilePicture: response.data.profilePicture,
			email: response.data.email,
			role: response.data.role,
		};
		return formattedData;
	} catch (error) {
		console.error("Error fetching player", error);
		throw error;
	}
};
