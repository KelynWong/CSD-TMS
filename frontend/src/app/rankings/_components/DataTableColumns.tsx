"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "./DataTableColumnHeader";
import { DataTableRowActions } from "./DataTableRowOptions";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Player } from "@/types/player";


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
			<DataTableColumnHeader column={column} title="Full Name" />
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
		id: "actions",
		cell: () => (
			<div className="w-full flex justify-end">
				<DataTableRowActions />
			</div>
		),
	},
];
