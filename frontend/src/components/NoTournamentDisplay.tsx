// Component to display when no tournaments are available
const NoTournamentDisplay = () => (
    <div className="flex flex-col items-center justify-center">
        <img src="/images/no_ongoing.png" className="size-72" alt="No Ongoing Tournament" />
        <h1 className="text-2xl font-bold text-center mt-8">No Ongoing Tournaments...</h1>
    </div>
);

export default NoTournamentDisplay;