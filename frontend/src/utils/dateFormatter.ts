export function formatDate(date: Date): string {
	return date.toLocaleDateString("en-GB", {
		year: "numeric",
		month: "long",
		day: "numeric",
	});
}
