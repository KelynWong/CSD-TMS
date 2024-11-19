import { Tournament } from "./tournament";

export type Category = {
	all: Tournament[];
	completed: Tournament[];
	ongoing: Tournament[];
	upcoming: Tournament[];
};