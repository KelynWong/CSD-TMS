import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

// Dialog to display prediction results for 1000 simulations
const PredictionDialog = ({ results, onTrigger }: any) => (
    <Dialog>
        <DialogTrigger asChild>
            <Button variant="outline" className="hover:bg-red-700 hover:text-white" onClick={onTrigger}>
                Predict 1000 Times
            </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
                <DialogTitle>Prediction Results</DialogTitle>
            </DialogHeader>
            <ScrollArea className="max-h-80 w-full">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[100px]">Rank</TableHead>
                            <TableHead>Player</TableHead>
                            <TableHead>Winning Rate</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {results.map((result: any, index: number) => (
                            <TableRow key={index}>
                                <TableCell className="font-medium">{result.rank}</TableCell>
                                <TableCell>{result.playerName}</TableCell>
                                <TableCell>{result.winRate.toFixed(1)}%</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </ScrollArea>
            <DialogFooter>
                <DialogClose asChild>
                    <Button type="button" variant="secondary">Close</Button>
                </DialogClose>
            </DialogFooter>
        </DialogContent>
    </Dialog>
);

export default PredictionDialog;