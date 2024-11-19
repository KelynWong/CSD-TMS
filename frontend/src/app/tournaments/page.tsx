"use client";

import { Tabs, TabsContent} from "@/components/ui/tabs";
import "./styles.css";
import { useEffect, useState } from "react";
import { fetchTournaments } from "@/api/tournaments/api";
import { Tournament } from "@/types/tournament";
import Loading from "@/components/Loading";
import { useUserContext } from "@/context/userContext";
import { fetchUser } from "@/api/users/api";
import { useNavBarContext } from "@/context/navBarContext";
import ErrorDisplay from "@/components/ErrorDisplay";
import { Category } from "@/types/category";
import { Count } from "@/types/categoryCount";
import StatsSection from "./_components/StatsSection";
import TabList from "./_components/TabList";
import TournamentList from "./_components/TournamentList";
import TitleRow from "./_components/TitleRow";

export default function Tournaments() {
	// get user context for authentication and role
	const { user } = useUserContext();

	// set current navigation state
	const { setState } = useNavBarContext();
	setState("tournaments");

	// states to manage app
	const [role, setRole] = useState<string | null>(null); // user role (e.g., ADMIN)
	const [activeTab, setActiveTab] = useState("all"); // current active tab (all, completed, ongoing, upcoming)
	const [loading, setLoading] = useState(true); // loading indicator for fetching data
	const [error, setError] = useState<string | null>(null); // err msg if data fetch fails
	const [categorizedTournaments, setCategorizedTournaments] = useState<{
		all: Tournament[];
		completed: Tournament[];
		ongoing: Tournament[];
		upcoming: Tournament[];
	}>({
		all: [],
		completed: [],
		ongoing: [],
		upcoming: [],
	});

	// pagination states for each tab
	const [currentPage, setCurrentPage] = useState({
		all: 1,
		completed: 1,
		ongoing: 1,
		upcoming: 1,
	});

	// number of items displayed per page
	const itemsPerPage = 12;

	// offset to convert UTC to Singapore timezone
	const sgTimeZoneOffset = 8 * 60 * 60 * 1000;

	// set current view in the nav bar
    useEffect(() => {
        setState("tournaments");
    }, [setState]);

    // fetch user role
    useEffect(() => {
        if (user) {
            fetchUserRole(user.id);
        }
    }, [user]);

    // fetch all tournament data
    useEffect(() => {
        fetchTournamentsData();
    }, []);

	// fetch user's role based on ID
    const fetchUserRole = async (userId: string) => {
		setLoading(true);
        try {
            const data = await fetchUser(userId);
            setRole(data.role); // set user's role (e.g., PLAYER, ADMIN)
        } catch (err) {
            setError("Failed to fetch user data."); // set error message
        } finally {
            setLoading(false); // Hide loading indicator
        }
    };

	// fetch all tournament data from server, adjust timestamps, and categorize it by status.
    const fetchTournamentsData = async () => {
		setLoading(true);
        try {
            const data = await fetchTournaments();
            const adjustedData = adjustTimestamps(data); // convert timestamps to Singapore timezone
            categorizeTournaments(adjustedData); // categorize tournaments into statuses
        } catch (err) {
            setError("Failed to fetch tournaments."); // set error message
        } finally {
            setLoading(false); // Hide loading indicator
        }
    };

	/**
     * adjust all timestamps in the data to Singapore timezone
     * @param data Array of tournament objects
     */
    const adjustTimestamps = (data: any[]): Tournament[] =>
        data.reverse().map((tournament) => ({
            ...tournament,
            startDT: adjustToSGTime(tournament.startDT),
            endDT: adjustToSGTime(tournament.endDT),
            regStartDT: adjustToSGTime(tournament.regStartDT),
            regEndDT: adjustToSGTime(tournament.regEndDT),
        }));

    /**
     * Convert a UTC date string to Singapore timezone
     * @param date UTC date string
     */
    const adjustToSGTime = (date: string): string =>
        new Date(new Date(date).getTime() + sgTimeZoneOffset).toISOString();

    /**
     * Categorize tournaments into statuses: all, completed, ongoing, upcoming
     * @param data Array of tournaments
     */
    const categorizeTournaments = (data: Tournament[]) => {
        const categories: Category = {
            all: data,
            completed: data.filter((tournament) => tournament.status === "Completed"),
            ongoing: data.filter((tournament) => tournament.status === "Ongoing"),
            upcoming: data.filter((tournament) =>
                ["Scheduled", "Registration Start", "Registration Close", "Matchmake"].includes(tournament.status)
            ),
        };
        setCategorizedTournaments(categories); // update state with categorized data
    };

	/**
     * Handle tab changes (e.g., switch between all, completed, ongoing, upcoming)
     * @param tab The selected tab
     */
    const handleTabChange = (tab: string) => setActiveTab(tab);

    /**
     * Handle pagination changes for a specific tab
     * @param tab The tab for which pagination changed
     * @param page The new page number
     */
    const handlePageChange = (tab: string, page: number) =>
        setCurrentPage((prevState) => ({ ...prevState, [tab]: page }));

	/**
     * Paginate the data for a specific tab
     * @param data The data to paginate
     * @param page The current page number
     */
    const paginatedData = (data: Tournament[], currentPage: number) => {
        const start = (currentPage - 1) * itemsPerPage;
        return data.slice(start, start + itemsPerPage);
    };

	/**
	 * Counts the number of tournaments in each category.
	 * @param categorizedTournaments Object containing categorized tournaments.
	 * @returns An object with the counts for each category.
	 */
	const countTournaments = (categorizedTournaments: Category): Count => ({
		all: categorizedTournaments.all.length,
		upcoming: categorizedTournaments.upcoming.length,
		ongoing: categorizedTournaments.ongoing.length,
		completed: categorizedTournaments.completed.length,
	});

	// Display error message if something goes wrong
    if (error) {
        return <ErrorDisplay message={error} />;
    }

	// Show loading indicator while data is being fetched
    if (loading) return <Loading />;

	return (
		<div className="w-[80%] mx-auto py-16">
			{/* display statistics for tournaments */}
            <StatsSection tournamentCount={countTournaments(categorizedTournaments)} />

			 {/* tabbed interface for different tournament statuses */}
			<Tabs
				value={activeTab}
				onValueChange={handleTabChange}
				className="w-full">
				<div className="flex flex-wrap items-center justify-between">
					{/* display tournament title for the specific tab */}
					{(["all", "upcoming", "ongoing", "completed"] as const).map((tab) => (
						<TabsContent key={tab} value={tab} className="mr-8 py-4">
							<TitleRow tab={activeTab} role={role} />
						</TabsContent>
					))}

					{/* list of all tab options */}
					<TabList
						tabs={["all", "upcoming", "ongoing", "completed"]}
						activeTab={activeTab}
						tournamentCount={countTournaments(categorizedTournaments)}
					/>
				</div>

				{/* display list of tournaments for the specific tab */}
				{(["all", "upcoming", "ongoing", "completed"] as const).map((tab) => (
					<TabsContent key={tab} value={tab}>
						<TournamentList
                            tournaments={paginatedData(categorizedTournaments[tab], currentPage[tab])}
                            totalPages={Math.ceil(categorizedTournaments[tab].length / itemsPerPage)}
                            currentPage={currentPage[tab]}
                            onPageChange={(page) => handlePageChange(tab, page)}
                            role={role}
                        />
					</TabsContent>
				))}
			</Tabs>
		</div>
	);
}