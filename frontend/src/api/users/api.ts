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
		const response = await axios.get(`${URL}/users`);
		const formattedData: UserResponse[] = response.data.map((user: any) => ({
			id: user.id,
			username: user.username,
			fullname: user.fullname,
			email: user.email,
			role: user.role,
			gender: user.gender,
			rating: user.rank ? user.rank : 0,
			country: user.country,
			profilePicture: user.profilePicture,
		}));
		return formattedData;
	} catch (error) {
		console.error("Error fetching players", error);
		throw error;
	}
};

export const fetchPlayer = async (id: string): Promise<PlayerResponse> => {
	try {
		const response = await axios.get(`${URL}/users/${id}`);
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

export const fetchUserByRoles = async (
	role: string
): Promise<PlayerResponse[] | AdminResponse[]> => {
	try {
		const response = await axios.get(`${URL}/users/role/${role}`);
		if (role === "player") {
			return response.data.map((player: any) => ({
				id: player.id,
				username: player.username,
				fullname: player.fullname,
				gender: player.gender,
				rating: player.rank,
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


//TODO update this
const updateUser = async (id: string, formData: FormData) => {
  try {
    const response = await axios.put(`${URL}/users/${id}`, formData);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Error updating user", error);
    throw error;
  }
}
