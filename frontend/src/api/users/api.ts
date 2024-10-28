import axios from "axios";

const URL = process.env.NEXT_PUBLIC_USER_API_URL;

export type PlayerResponse = {
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

export type AdminResponse = {
	id: string;
	username: string;
	fullname: string;
	profilePicture: string;
	email: string;
	role: string;
};

export type UserResponse = {
	id: string;
	username: string;
	fullname: string;
	email: string;
	role: string;
	gender: string;
	rating: number;
	country: string;
	profilePicture: string;
};

export const fetchUsers = async (): Promise<UserResponse[]> => {
	try {
		const response = await axios.get(`${URL}`);
		const formattedData: UserResponse[] = response.data.map(
			(user: any) => ({
				id: user.id,
				username: user.username,
				fullname: user.fullname,
				email: user.email,
				role: user.role,
				gender: user.gender,
				rating:
					user.rating && user.rating.rating
						? Math.floor(user.rating.rating)
						: 0,
				country: user.country,
				profilePicture: user.profilePicture,
			})
		);
		return formattedData;
	} catch (error) {
		console.error("Error fetching players", error);
		throw error;
	}
};

export const fetchOrganizer = async (id: string): Promise<string> => {
	try {
		const response = await axios.get(`${URL}/${id}`);
		return response.data.fullname;
	} catch (error) {
		console.error("Error fetching organizer", error);
		throw error;
	}
};

export const fetchPlayer = async (id: string): Promise<PlayerResponse> => {
	try {
		const response = await axios.get(`${URL}/${id}`);
		const formattedData: PlayerResponse = {
			id: response.data.id,
			username: response.data.username,
			fullname: response.data.fullname,
			gender: response.data.gender,
			rating: Math.floor(response.data.rating.rating),
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

export const fetchUserByRoles = async (
	role: string
): Promise<PlayerResponse[] | AdminResponse[]> => {
	try {
		const response = await axios.get(`${URL}/role/${role}`);
		if (role === "PLAYER") {
			return response.data.map((player: any) => ({
				id: player.id,
				username: player.username,
				fullname: player.fullname,
				gender: player.gender,
				rating: Math.floor(player.rating.rating),
				country: player.country,
				profilePicture: player.profilePicture,
				email: player.email,
				role: player.role,
			}));
		} else {
			return response.data.map((admin: any) => ({
				id: admin.id,
				username: admin.username,
				fullname: admin.fullname,
				profilePicture: admin.profilePicture,
				email: admin.email,
				role: admin.role,
			}));
		}
	} catch (error) {
		console.error("Error fetching players by role", error);
		throw error;
	}
};

// Fetch players ordered by rating
export const fetchTopPlayers = async (): Promise<PlayerResponse[]> => {
	try {
		const response = await axios.get(`${URL}/top-players`);
		const formattedData: PlayerResponse[] = response.data.map(
			(player: any) => ({
				id: player.id,
				username: player.username,
				fullname: player.fullname,
				gender: player.gender,
				rating: Math.floor(player.rating.rating),
				country: player.country,
				profilePicture: player.profilePicture,
				email: player.email,
				role: player.role,
			})
		);
		return formattedData;
	} catch (error) {
		console.error("Failed to fetch top players", error);
		throw error;
	}
};

export const getPlayerRank = async (id: string): Promise<number> => {
	try {
		const response = await axios.get(`${URL}/${id}/rank`);

		return response.data;
         // Assuming the API response contains a 'rank' field
	} catch (error) {
		console.error("Failed to fetch player rank", error);
		throw error;
	}
};
