"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";

import { countries } from "countries-list";

const countryList = Object.entries(countries).map(([code, country]) => ({
	value: country.name,
	label: country.name,
}));

interface CountryComboboxProps {
	value: string;
	onChange: (value: string) => void;
}

export function CountryCombobox({ value, onChange }: CountryComboboxProps) {
	const [open, setOpen] = React.useState(false);

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					role="combobox"
					aria-expanded={open}
					className="w-full justify-between">
					{value
						? countryList.find((country) => country.value === value)?.label
						: "Select country..."}
					<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-full p-0">
				<Command>
					<CommandInput placeholder="Search country..." />
					<CommandList>
						<CommandEmpty>No country found.</CommandEmpty>
						<CommandGroup>
							{countryList.map((country) => (
								<CommandItem
									key={country.value}
									value={country.value}
									onSelect={(currentValue) => {
										onChange(currentValue === value ? "" : currentValue);
										setOpen(false);
									}}>
									<Check
										className={cn(
											"mr-2 h-4 w-4",
											value === country.value ? "opacity-100" : "opacity-0"
										)}
									/>
									{country.label}
								</CommandItem>
							))}
						</CommandGroup>
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	);
}
