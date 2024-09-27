"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "./DataTableColumnHeader";
import { DataTableRowActions } from "./DataTableRowOptions";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { User } from "@/types/user";

export const columns: ColumnDef<User>[] = [
	{
		accessorKey: "username",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Username" />
		),
		cell: ({ row }) => {
			return (
				<Button variant="link" asChild>
          <Link href={`#`}>
					{row.getValue("username")}
          </Link>
				</Button>
			);
		},
	},
	{
		accessorKey: "fullname",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="fullname" />
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
		accessorKey: "email",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Email" />
		),
		cell: ({ row }) => {
			return (
				<Button variant="link" asChild>
					<Link href={`#`}>{row.getValue("email")}</Link>
				</Button>
			);
		},
	},
	{
		accessorKey: "role",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Role" />
		),
		cell: ({ row }) => {
			return (
				<Button variant="link" asChild>
					<Link href={`#`}>{row.getValue("role")}</Link>
				</Button>
			);
		},
	},
	{
		accessorKey: "rating",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Rating" />
		),
		cell: ({ row }) => {
			let value = row.getValue("rating");
			if (row.getValue("rating") === 0) {
				value = "N/A";
			}
			return (
				<Button variant="link" asChild>
					<Link href={`#`}>{String(value)}</Link>
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
		accessorKey: "country",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Country" />
		),
		cell: ({ row }) => {
			return (
				<Button variant="link" asChild>
					<Link href={`#`}>{row.getValue("country")}</Link>
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
