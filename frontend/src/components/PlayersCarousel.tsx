'use client'

import * as React from "react"
import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import Autoplay from "embla-carousel-autoplay"
import Image from "next/image"

export default function PlayersCarousel() {
  const plugin = React.useRef(
    Autoplay({ delay: 2000, stopOnInteraction: true })
  )

  return (
    <div className="relative w-full max-w-7xl mx-auto">
      <Carousel
        className="w-full max-w-5xl mx-auto"
        plugins={[plugin.current]}
        onMouseEnter={plugin.current.stop}
        onMouseLeave={plugin.current.reset}
        opts={{
          align: "start",
          loop: true,
        }}
      >
        <CarouselContent className="md:-ml-4 sm:-ml-2">
          {Array.from({ length: 10 }).map((_, index) => (
            <CarouselItem
              key={index}
              className="pl-2 md:pl-4 basis-full md:basis-1/3 lg:basis-1/5"
            >
              <div className="p-1">
                <Card className="w-full max-w-[200px] sm:max-w-[250px] md:max-w-[300px] mx-auto">
                  <CardContent className="flex aspect-square items-center justify-center p-4 sm:p-6">
                    <div className="w-full h-full flex flex-col items-center justify-center">
                    <Image
                      src="/images/default_profile.png"
                      alt={`Player ${index + 1}`}
                      width={200}
                      height={200}
                      className="w-full h-full object-cover"
                    />
                    <p className="text-2xl font-semibold text-center ">Rank {index + 1}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  )
}
