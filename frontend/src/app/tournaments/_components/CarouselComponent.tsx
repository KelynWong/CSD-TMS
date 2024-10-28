import { Card, CardContent } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import React, { useState, useRef } from 'react';
import Link from "next/link";
import type { Player } from "@/types/tournamentDetails";
import TPlayer from './TPlayer';

const ITEMS_PER_PAGE = 16;

interface Tournament {
    players: Player[];
}

const CarouselComponent = ({ tournament }: { tournament: Tournament }) => {
    const [currentPage, setCurrentPage] = useState(0);
    const carouselRef = useRef<HTMLDivElement>(null);

    const totalPages = Math.ceil(tournament.players.length / ITEMS_PER_PAGE);

    const handleDotClick = (pageIndex: number) => {
        setCurrentPage(pageIndex);
    };

    const startIndex = currentPage * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const currentItems = tournament.players.slice(startIndex, endIndex);

    return (
        <>
            <Carousel ref={carouselRef} opts={{ align: "start" }} className="p-6 pt-0 pb-12 h-max">
                <CarouselContent className="m-0">
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {currentItems.map((player, index) => {
                            return (
                                <Link href={`/players/${player.id}`} key={index}>
                                    <CarouselItem className="m-0 p-0">
                                        <Card className="border-2 border-yellow-400 rounded-lg">
                                            <CardContent className="flex flex-col items-center justify-items-center py-4 px-3 text-center gap-1.5">
                                                <TPlayer player={player} />
                                            </CardContent>
                                        </Card>
                                    </CarouselItem>
                                </Link>
                            );
                        })}
                    </div>
                </CarouselContent>
            </Carousel>
            <div className="absolute bottom-0 left-0 right-0 flex justify-center my-4">
                {Array.from({ length: totalPages }).map((_, pageIndex) => (
                    <button
                        key={pageIndex}
                        onClick={() => handleDotClick(pageIndex)}
                        className={`mx-1 w-2 h-2 rounded-full ${currentPage === pageIndex ? 'bg-blue-300' : 'bg-gray-300'}`}
                    />
                ))}
            </div>
        </>
    );
};

export default CarouselComponent;