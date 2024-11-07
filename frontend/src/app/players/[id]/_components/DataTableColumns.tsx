"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "./DataTableColumnHeader";
import { DataTableRowActions } from "./DataTableRowOptions";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Match } from "@/types/match";

export const columns: ColumnDef<Match>[] = [
	{
		accessorKey: "tournament_name",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Tournament Name" />
		),
		cell: ({ row }) => {
			return (
				<Button variant="link" asChild>
					<Link
						href={`/tournaments/${row.original.tournament_id}`}
						prefetch={true}>
						{row.getValue("tournament_name")}
					</Link>
				</Button>
			);
		},
	},
	{
		accessorKey: "round",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Round" />
		),
		cell: ({ row }) => {
			return (
				<Button variant="link" asChild>
					<Link href={`#`}>{row.getValue("round")}</Link>
				</Button>
			);
		},
	},
	{
		accessorKey: "set_number",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Set" />
		),
		cell: ({ row }) => {
			return (
				<Button variant="link" asChild>
					<Link href={`#`}>{row.getValue("set_number")}</Link>
				</Button>
			);
		},
	},
	{
		accessorKey: "opponent",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Opponent" />
		),
		cell: ({ row }) => {
			return (
				<Button variant="link" asChild>
					<Link href={`/players/${row.original.opponent_id}`}>
						{row.getValue("opponent")}
					</Link>
				</Button>
			);
		},
	},
	{
		accessorKey: "score",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Final Score" />
		),
		cell: ({ row }) => {
			return (
				<Button variant="link" asChild>
					<Link href={`#`}>{row.getValue("score")}</Link>
				</Button>
			);
		},
	},
	{
		accessorKey: "result",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Result" />
		),
		cell: ({ row }) => {
			const result = row.getValue("result") as "Win" | "Loss";
			const color = result === "Win" ? "#22c55e" : "#ef4444";
			return (
				<Button variant="link" asChild>
					<Link href={`#`} style={{ color: color }}>
						{row.getValue("result")}
					</Link>
				</Button>
			);
		},
	},
	{
		id: "actions",
		cell: () => (
			<div className="w-full flex justify-end">
				<DataTableRowActions />
			</div>
		),
	},
];
