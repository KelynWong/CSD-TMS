// Component to display error messages
const ErrorDisplay = ({ message }: { message: string }) => (
    <div className="w-[80%] h-full mx-auto py-16">
        <div className="flex flex-col items-center justify-center h-full">
            <img src="/images/error.png" className="size-72" alt="Error" />
            <h1 className="text-2xl font-bold text-center mt-8 text-red-500">{message}</h1>
        </div>
    </div>
);

export default ErrorDisplay;