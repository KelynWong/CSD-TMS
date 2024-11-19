import Link from "next/link";
import { CirclePlus } from "lucide-react";
import { Button } from "@/components/ui/button";

const TitleRow = ({ tab, role }: { tab: string; role: string | null }) => (
    <div className="flex items-center justify-between">
        <h1 className="text-3xl mr-5">{tab.charAt(0).toUpperCase() + tab.slice(1)} Tournaments</h1>
        {role === "ADMIN" && (
            <Link href="/tournaments/form/create" prefetch={true}>
                <Button className="text-base tracking-wider bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-3 rounded-lg">
                    <CirclePlus className="mr-2" size={18} />
                    Create New
                </Button>
            </Link>
        )}
    </div>
);

export default TitleRow;