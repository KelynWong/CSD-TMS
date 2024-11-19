"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card"; // Importing Card and CardContent components from ui/card for player card display
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from "@/components/ui/carousel"; // Importing Carousel components for carousel functionality
import Autoplay from "embla-carousel-autoplay"; // Importing Autoplay plugin for carousel autoplay
import Image from "next/image"; // Importing Image component for player profile picture display
import { PlayerResponse } from "../../../api/users/api"; // Importing PlayerResponse from users api for player data type
import Link from "next/link"; // Importing Link component for linking to player details

// Defining the interface for PlayersCarouselProps
interface PlayersCarouselProps {
	players: PlayerResponse[]; // Array of PlayerResponse objects
}

// PlayersCarousel component definition
export default function PlayersCarousel({
	players,
}: Readonly<PlayersCarouselProps>) {
	const plugin = React.useRef(
		Autoplay({ delay: 2000, stopOnInteraction: false }) // Creating an autoplay plugin with a delay of 2000ms and stopping on interaction
	);

	return (
		<div className="relative w-full max-w-7xl mx-auto">
			{" "}
			{/* Container for the carousel */}
			<Carousel
				className="w-full max-w-7xl mx-auto" // Carousel container
				plugins={[plugin.current]} // Adding the autoplay plugin to the carousel
				onMouseEnter={plugin.current.stop} // Stopping autoplay on mouse enter
				onMouseLeave={plugin.current.reset} // Resetting autoplay on mouse leave
				opts={{
					align: "start", // Aligning the carousel to start
					loop: true, // Enabling carousel loop
				}}>
				{/* Carousel content container */}
				<CarouselContent className="md:-ml-4 sm:-ml-2">
					{" "}
					{/* Carousel item container */}
					{players.map((player, index) => (
						<CarouselItem
							key={player.id} // Using player id as key
							className="pl-2 md:pl-4 basis-full md:basis-1/3 lg:basis-1/5">
							{" "}
							{/* Padding for the carousel item */}
							<div className="p-1">
								{" "}
								{/* Link to player details page */}
								<Link href={`/players/${player.id}`} prefetch={true}>
									{" "}
									{/* Player card container */}
									<Card className="w-full max-w-[300px] sm:max-w-[350px] md:max-w-[400px] mx-auto py-5">
										{" "}
										{/* Card content container */}
										<CardContent className="flex aspect-square items-center justify-center p-4 sm:p-6">
											{" "}
											{/* Content container */}
											<div className="w-full h-full flex flex-col items-center justify-center">
												{" "}
												<Image
													src={
														player.profilePicture ||
														"/images/default_profile.png" // Using player profile picture or default if not available
													}
													alt={`Player ${index + 1}`} // Alt text for the image
													width={200} // Image width
													height={200} // Image height
													className="w-full h-full object-cover" // Image styling
												/>
												<p className="text-2xl font-semibold text-center ">
													Rank {index + 1} {/* Displaying player rank */}
												</p>
												<p className="text-lg font-semibold text-center">
													{player.fullname} {/* Displaying player full name */}
												</p>
											</div>
										</CardContent>
									</Card>
								</Link>
							</div>
						</CarouselItem>
					))}
				</CarouselContent>
				<CarouselPrevious /> {/* Carousel previous button */}
				<CarouselNext /> {/* Carousel next button */}
			</Carousel>
		</div>
	);
}
