import React from "react";
import Image from "next/image";
import { Admin } from "@/types/admin";

const AdminHero = ({ admin }: { admin: Admin }) => {
	const firstName = admin?.fullname
		? admin.fullname
				.split(" ")
				.slice(0, length - 1)
				.join(" ")
		: "";
	const lastName = admin?.fullname
		? admin.fullname.split(" ").slice(-1).join(" ")
		: "";
	return (
		<div className="bg-black text-white">
			{/* Player Profile Hero Section */}
			<section className="relative min-h-[200px]">
				{/* Background Image */}
				<div className="absolute inset-0 z-0">
					<Image
						src="/images/background.png"
						alt="Table Tennis Action"
						fill
						className="object-cover opacity-50 object-top"
						style={{
							objectPosition: "0 20%",
						}}
						priority
					/>
				</div>
				{/* Profile Content */}
				<div className="relative z-10 max-w-6xl mx-auto px-4 py-10">
					<div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-8">
						<Image
							src={admin?.profilePicture || "/images/default_profile.png"}
							alt={`Player ${admin?.fullname}`}
							width={150}
							height={150}
							className="rounded-full border-4 border-red-500"
						/>
						<div className="text-center md:text-left">
							<h1 className="text-8xl font-bold">{firstName}</h1>
							<p className="text-4xl">{lastName}</p>
							<p className="text-red-600 text-2xl">Admin</p>
						</div>
					</div>
				</div>
			</section>
		</div>
	);
};

export default AdminHero;
