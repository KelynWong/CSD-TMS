"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

export default function Searchbar({ onSearch = (term: string) => {} }) {
	const [searchTerm, setSearchTerm] = useState("");

	const handleSearch = (e: React.FormEvent) => {
		e.preventDefault();
	};

	return (
		<form onSubmit={handleSearch} className="flex items-center w-full max-w-xs">
			<div className="relative flex-grow">
				<Input
					type="text"
					placeholder="Search players..."
					value={searchTerm}
					onChange={(e) => {
						setSearchTerm(e.target.value);
						onSearch(e.target.value);
					}}
					className="w-full pr-10"
					aria-label="Search input"
				/>
				<Button
					type="submit"
					variant="ghost"
					size="sm"
					className="absolute right-0 top-0 h-full"
					aria-label="Submit search">
					<Search className="h-4 w-4" />
				</Button>
			</div>
		</form>
	);
}
