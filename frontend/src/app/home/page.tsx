import Image from "next/image";
import { TypewriterEffect } from "@/components/ui/typewriter-effect";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Trophy, Users, Star, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function Home() {
	const words = [
		{
			text: "Welcome",
		},
		{
			text: "to",
		},
		{
			text: "RacketRush!",
            className: "text-white"
		},

	];
	return (
		<>
			<div style={{ position: "relative", height: "60vh", overflow: "hidden" }}>
				<Image
					src="/images/banner4.png"
					alt="Background"
					layout="fill"
					objectFit="cover"
					className="opacity-70 z-10"
					priority
				/>
				<div className="absolute h-full w-full bg-black"></div>
				<div className="absolute top-0 left-0 right-0 bottom-40 m-auto flex flex-col items-center justify-center z-20">
					<TypewriterEffect words={words} />
					<p>Test your skills and join exciting badminton tournaments!</p>
				</div>
			</div>
			<div className="p-5">
				<div className="container mx-auto px-4">
					<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
						<Card className="bg-card/50 backdrop-blur-sm">
							<CardContent className="p-6">
								<Calendar className="h-12 w-12 mb-4 text-primary" />
								<h3 className="text-xl font-semibold mb-2">
									Upcoming Tournaments
								</h3>
								<p className="text-muted-foreground mb-4">
									Browse and register for upcoming tournaments
								</p>
								<Link
									href="/tournaments"
									className="text-primary hover:underline inline-flex items-center">
									View Tournaments <ArrowRight className="ml-1 h-4 w-4" />
								</Link>
							</CardContent>
						</Card>

						<Card className="bg-card/50 backdrop-blur-sm">
							<CardContent className="p-6">
								<Trophy className="h-12 w-12 mb-4 text-primary" />
								<h3 className="text-xl font-semibold mb-2">Live Rankings</h3>
								<p className="text-muted-foreground mb-4">
									Track your position and compete to reach the top of the
									leaderboard
								</p>
								<Link
									href="/rankings"
									className="text-primary hover:underline inline-flex items-center">
									Check Rankings <ArrowRight className="ml-1 h-4 w-4" />
								</Link>
							</CardContent>
						</Card>

						<Card className="bg-card/50 backdrop-blur-sm">
							<CardContent className="p-6">
								<Users className="h-12 w-12 mb-4 text-primary" />
								<h3 className="text-xl font-semibold mb-2">Player Profiles</h3>
								<p className="text-muted-foreground mb-4">
									Connect with other players and view detailed statistics
								</p>
								<Link
									href="/players"
									className="text-primary hover:underline inline-flex items-center">
									Find Players <ArrowRight className="ml-1 h-4 w-4" />
								</Link>
							</CardContent>
						</Card>
					</div>
				</div>
			</div>
			<section className="py-16 bg-muted/50">
				<div className="container mx-auto px-4">
					<div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
						<div>
							<div className="text-4xl font-bold text-primary mb-2">150+</div>
							<div className="text-muted-foreground">Active Tournaments</div>
						</div>
						<div>
							<div className="text-4xl font-bold text-primary mb-2">2.5K+</div>
							<div className="text-muted-foreground">Registered Players</div>
						</div>
						<div>
							<div className="text-4xl font-bold text-primary mb-2">10K+</div>
							<div className="text-muted-foreground">Matches Played</div>
						</div>
						<div>
							<div className="text-4xl font-bold text-primary mb-2">95%</div>
							<div className="text-muted-foreground">Player Satisfaction</div>
						</div>
					</div>
				</div>
			</section>
		</>
	);
}
