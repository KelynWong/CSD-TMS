import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"; // Importing dialog components for modal functionality
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"; // Importing table components for displaying data
import { Button } from "@/components/ui/button"; // Importing Button component
import { ScrollArea } from "@/components/ui/scroll-area"; // Importing ScrollArea for scrollable content

// PredictionDialog component
// Displays a dialog (modal) to show prediction results for 1000 simulations
const PredictionDialog = ({ results, onTrigger }: any) => (
    <Dialog>
        {/* Trigger button for the dialog */}
        <DialogTrigger asChild>
            <Button variant="outline" className="hover:bg-red-700 hover:text-white" onClick={onTrigger}>
                Predict 1000 Times
            </Button>
        </DialogTrigger>

        {/* Dialog content */}
        <DialogContent className="sm:max-w-[425px]">
            {/* Dialog header with title */}
            <DialogHeader>
                <DialogTitle>Prediction Results</DialogTitle>
            </DialogHeader>

            {/* Scrollable area for the results table */}
            <ScrollArea className="max-h-80 w-full">
                <Table>
                    {/* Table header defining the columns */}
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[100px]">Rank</TableHead>
                            <TableHead>Player</TableHead>
                            <TableHead>Winning Rate</TableHead>
                        </TableRow>
                    </TableHeader>

                    {/* Table body displaying prediction results */}
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

            {/* Footer with a close button */}
            <DialogFooter>
                <DialogClose asChild>
                    <Button type="button" variant="secondary">Close</Button>
                </DialogClose>
            </DialogFooter>
        </DialogContent>
    </Dialog>
);

export default PredictionDialog;