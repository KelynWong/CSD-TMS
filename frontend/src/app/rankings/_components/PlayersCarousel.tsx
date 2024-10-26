"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";
import { PlayerResponse } from "../../../api/users/api";
import Link from "next/link";

interface PlayersCarouselProps {
	players: PlayerResponse[];
}

export default function PlayersCarousel({
	players,
}: Readonly<PlayersCarouselProps>) {
	const plugin = React.useRef(
		Autoplay({ delay: 2000, stopOnInteraction: false })
	);

	return (
		<div className="relative w-full max-w-7xl mx-auto">
			<Carousel
				className="w-full max-w-7xl mx-auto"
				plugins={[plugin.current]}
				onMouseEnter={plugin.current.stop}
				onMouseLeave={plugin.current.reset}
				opts={{
					align: "start",
					loop: true,
				}}>
				<CarouselContent className="md:-ml-4 sm:-ml-2">
					{players.map((player, index) => (
						<CarouselItem
							key={player.id}
							className="pl-2 md:pl-4 basis-full md:basis-1/3 lg:basis-1/5">
							<div className="p-1">
								<Link href={`/players/${player.id}`}>
									<Card className="w-full max-w-[300px] sm:max-w-[350px] md:max-w-[400px] mx-auto py-3">
										<CardContent className="flex aspect-square items-center justify-center p-4 sm:p-6">
											<div className="w-full h-full flex flex-col items-center justify-center">
												<Image
													src={
														player.profilePicture ||
														"/images/default_profile.png"
													}
													alt={`Player ${index + 1}`}
													width={200}
													height={200}
													className="w-full h-full object-cover"
												/>
												<p className="text-2xl font-semibold text-center ">
													Rank {index + 1}
												</p>
												<p className="text-lg font-semibold text-center">
													{player.fullname}
												</p>
											</div>
										</CardContent>
									</Card>
								</Link>
							</div>
						</CarouselItem>
					))}
				</CarouselContent>
				<CarouselPrevious />
				<CarouselNext />
			</Carousel>
		</div>
	);
}
