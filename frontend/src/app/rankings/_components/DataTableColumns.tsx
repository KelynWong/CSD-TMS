"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "./DataTableColumnHeader";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PlayerResponse } from "@/api/users/api";



export const columns: ColumnDef<PlayerResponse>[] = [
	{
		accessorKey: "ranking",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Ranking" />
		),
		cell: ({ row }) => {
			return (
				<Button variant="link" asChild>
					<Link href={`#`}>{row.index + 1}</Link>
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
					<Link href={`#`}>{row.getValue("username")}</Link>
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
					<Link href={`#`}>{row.getValue("fullname")}</Link>
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
					<Link href={`#`}>{row.getValue("gender")}</Link>
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
					<Link href={`#`}>{row.getValue("rating")}</Link>
				</Button>
			);
		},
	},
];
