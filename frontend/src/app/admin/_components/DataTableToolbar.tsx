"use client";

import { Cross2Icon } from "@radix-ui/react-icons";
import { Table } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTableViewOptions } from "./DataTableViewOptions";
import { DataTableFacetedFilter } from "./DataTableFacetedFilter";

// need to get all tournaments from the database
const roleOptions = [
	{
		value: "Player",
		label: "Player",
	},
	{
		value: "Admin",
		label: "Admin",
	},
];

const genderOptions = [
	{
		value: "Male",
		label: "Male",
	},
	{
		value: "Female",
		label: "Female",
	},
];
interface DataTableToolbarProps<TData> {
	table: Table<TData>;
}

export function DataTableToolbar<TData>({
	table,
}: DataTableToolbarProps<TData>) {
	const countryMap = new Map<string, string>();
	table.options.data.forEach((row) => {
		countryMap.set(row.country, row.country);
	});
	const uniqueCountries = Array.from(countryMap.values()).map((country) => ({
		value: country,
		label: country,
	}));
	const isFiltered = table.getState().columnFilters.length > 0;

	return (
		<div className="flex items-center justify-between">
			<div className="flex flex-1 items-center space-x-2">
				<Input
					placeholder="Search username..."
					value={
						(table.getColumn("username")?.getFilterValue() as string) ?? ""
					}
					onChange={(event) =>
						table.getColumn("username")?.setFilterValue(event.target.value)
					}
					className="h-8 w-[150px] lg:w-[250px]"
				/>
				<Input
					placeholder="Search fullname..."
					value={
						(table.getColumn("fullname")?.getFilterValue() as string) ?? ""
					}
					onChange={(event) =>
						table.getColumn("fullname")?.setFilterValue(event.target.value)
					}
					className="h-8 w-[150px] lg:w-[250px]"
				/>
				{table.getColumn("role") && (
					<DataTableFacetedFilter
						column={table.getColumn("role")}
						title="Role"
						options={roleOptions}
					/>
				)}
				{table.getColumn("gender") && (
					<DataTableFacetedFilter
						column={table.getColumn("gender")}
						title="Gender"
						options={genderOptions}
					/>
				)}
				{table.getColumn("country") && (
					<DataTableFacetedFilter
						column={table.getColumn("country")}
						title="Country"
						options={uniqueCountries}
						singleSelect={true}
					/>
				)}
				{isFiltered && (
					<Button
						variant="ghost"
						onClick={() => table.resetColumnFilters()}
						className="h-8 px-2 lg:px-3">
						Reset
						<Cross2Icon className="ml-2 h-4 w-4" />
					</Button>
				)}
			</div>
			<DataTableViewOptions table={table} />
		</div>
	);
}
