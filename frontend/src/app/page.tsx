import "./styles.css";
import React from "react";
// import { useNavBarContext } from "@/context/navBarContext";

export default function Home() {
    // Set navbar
	// const { setState } = useNavBarContext();
	// setState("home");

	return (
		<div>
			<div className="header px-16 py-16">
				<div className="match-overview w-100 flex flex-col items-end">
					<div className="match w-1/4 my-3 p-6 rounded-xl">
						<h2 className="text-2xl pb-2 text-center border-b border-gray-500">
							Ongoing Match
						</h2>
						<h3 className="text-xl py-2">Tournament 1</h3>
						<div className="flex justify-center">
							<div className="w-1/4 flex items-center justify-end gap-2 px-4 text-black font-bold">
								<img
									src="/images/default_profile.png"
									className="rounded-full w-12 h-12"
									alt="Player Profile"
								/>
							</div>
							<div className="flex items-center justify-center gap-2 px-2 font-bold">
								<h1 className="text-xl score rounded-full px-6 py-1">
									2 - 3
								</h1>
							</div>
							<div className="w-1/4 flex items-center justify-start gap-2 px-4 text-black font-bold">
								<img
									src="/images/default_profile.png"
									className="rounded-full w-12 h-12"
									alt="Player Profile"
								/>
							</div>
						</div>
					</div>
					<div className="match w-1/4 my-3 p-6 rounded-xl">
						<h2 className="text-2xl pb-2 text-center border-b border-gray-500">
							Next Match
						</h2>
						<h3 className="text-xl py-2">SMU BadminFest 2024</h3>
						<div className="flex justify-center">
							<div className="w-1/4 flex items-center justify-end gap-2 px-4 text-black font-bold">
								<img
									src="/images/default_profile.png"
									className="rounded-full w-12 h-12"
									alt="Player Profile"
								/>
							</div>
							<div className="flex items-center justify-center gap-2 px-2 font-bold">
								<h1 className="text-xl px-6 py-1">VS</h1>
							</div>
							<div className="w-1/4 flex items-center justify-start gap-2 px-4 text-black font-bold">
								<img
									src="/images/default_profile.png"
									className="rounded-full w-12 h-12"
									alt="Player Profile"
								/>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div className="latest-rank w-100 flex">
				<div className="w-1/5 title px-6 py-5 text-center">
					<h1 className="text-3xl">latest Ranking</h1>
				</div>
				<div className="w-4/5 players px-14 py-5 flex items-center">
					<div id="scroll-text">
						<div className="flex items-center">
							<h3 className="text-xl mr-12">
								🥇 rank 1 - Wang zhi yi
							</h3>
							<h3 className="text-xl mr-12">
								🎉 Jeng Hon Chia 21 - 10 Benson Wang
							</h3>
							<h3 className="text-xl mr-12">
								🎉 Jeng Hon Chia 21 - 10 Benson Wang
							</h3>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
