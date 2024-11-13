"use client";

import { Cross2Icon } from "@radix-ui/react-icons";
import { Table } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTableViewOptions } from "./DataTableViewOptions";
import { DataTableFacetedFilter } from "./DataTableFacetedFilter";

const resultOptions = [
	{
		value: "Win",
		label: "Win",
	},
	{
		value: "Loss",
		label: "Loss",
	},
];

interface DataTableToolbarProps<TData> {
	table: Table<TData>;
	tournamentNames: String[];
}

export function DataTableToolbar<TData>({
	table,
	tournamentNames,
}: DataTableToolbarProps<TData>) {
	const isFiltered = table.getState().columnFilters.length > 0;
    
	const tournamentOptions = tournamentNames.map((name) => ({
		value: name,
		label: name,
	}));

	return (
		<div className="flex items-center justify-between">
			<div className="flex flex-1 items-center space-x-2">
				<Input
					placeholder="Search Tournament..."
					value={
						(table.getColumn("tournament_name")?.getFilterValue() as string) ??
						""
					}
					onChange={(event) =>
						table
							.getColumn("tournament_name")
							?.setFilterValue(event.target.value)
					}
					className="h-8 w-[150px] lg:w-[250px]"
				/>
				<Input
					placeholder="Search Opponent..."
					value={
						(table.getColumn("opponent")?.getFilterValue() as string) ?? ""
					}
					onChange={(event) =>
						table.getColumn("opponent")?.setFilterValue(event.target.value)
					}
					className="h-8 w-[150px] lg:w-[250px]"
				/>
				{table.getColumn("tournament_name") && (
					<DataTableFacetedFilter
						column={table.getColumn("tournament_name")}
						title="Tournament"
						options={tournamentOptions}
					/>
				)}
				{table.getColumn("result") && (
					<DataTableFacetedFilter
						column={table.getColumn("result")}
						title="Result"
						options={resultOptions}
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
