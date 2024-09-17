"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "./DataTableColumnHeader";
import { DataTableRowActions } from "./DataTableRowOptions";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export type Player = {
	id: number;
	username: string;
	fullname: string;
	gender: string;
	ranking: number;
	rating: number;
	wins: number;
	losses: number;
	win_rate: number;
};
export const columns: ColumnDef<Player>[] = [
	{
		accessorKey: "ranking",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Ranking" />
		),
		cell: ({ row }) => {
			return (
				<Button variant="link" asChild>
					<Link href={`#`} className="text-secondary">{row.getValue("ranking")}</Link>
				</Button>
			);
		},
	},
	{
		accessorKey: "username",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Username" />
		),
		cell: ({ row }) => {
			return (
				<Button variant="link" asChild>
					<Link href={`#`} className="text-secondary">{row.getValue("username")}</Link>
				</Button>
			);
		},
	},
	{
		accessorKey: "fullname",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Name" />
		),
		cell: ({ row }) => {
			return (
				<Button variant="link" asChild>
					<Link href={`#`} className="text-secondary">{row.getValue("fullname")}</Link>
				</Button>
			);
		},
	},
	{
		accessorKey: "gender",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Gender" />
		),
		cell: ({ row }) => {
			return (
				<Button variant="link" asChild>
					<Link href={`#`} className="text-secondary">{row.getValue("gender")}</Link>
				</Button>
			);
		},
	},
	{
		accessorKey: "rating",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Ratings" />
		),
		cell: ({ row }) => {
			return (
				<Button variant="link" asChild>
					<Link href={`#`} className="text-secondary">{row.getValue("rating")}</Link>
				</Button>
			);
		},
	},
	{
		accessorKey: "wins",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Wins" />
		),
		cell: ({ row }) => {
			return (
				<Button variant="link" asChild>
					<Link href={`#`} className="text-secondary">{row.getValue("wins")}</Link>
				</Button>
			);
		},
	},
	{
		accessorKey: "losses",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Losses" />
		),
		cell: ({ row }) => {
			return (
				<Button variant="link" asChild>
					<Link href={`#`} className="text-secondary">{row.getValue("losses")}</Link>
				</Button>
			);
		},
	},
	{
		accessorKey: "win_rate",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Win Rate" />
		),
		cell: ({ row }) => {
			return (
				<Button variant="link" asChild>
					<Link href={`#`} className="text-secondary">{row.getValue("win_rate")}</Link>
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
