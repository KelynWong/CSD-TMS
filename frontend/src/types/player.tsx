export type Player = {
	id: string;
	username: string;
	fullname: string;
	gender: string;
	ranking: number;
	rating: number;
	wins: number;
	losses: number;
	win_rate: number;
	profilePicture: string;
};

export type PlayerCardProps = {
	id: string;
	fullname: string;
	username: string;
	gender: string;
	profilePicture: string;
};
