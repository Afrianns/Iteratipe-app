import { ArrowUpRight, CalendarDays, MoveRight, Timer } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import GridPattern from "./GridPattern";

export default function Timeline() {
    return (
        <section className="limit-breaker my-10">
            <div className="flex items-center flex-col justify-center my-10 w-full space-y-2">
                <h2 className="font-black text-purplish">TIMELINE</h2>
                <h2 className="text-3xl font-bold">CONNECT YOUR TIMELINE</h2>
                <p className="text-purple-dark/50 w-full text-center max-w-150">Arrange your design process from idea up until finished design. Help you organize, documented your process.</p>
            </div>

            <div className="grid grid-cols-1 grid-rows-6 md:grid-rows-2 md:grid-cols-3 gap-y-2 md:gap-3 md:mx-auto md:w-260">

                <div className="bg-purplish relative overflow-hidden">
                    <h2 className="p-10 text-2xl font-semibold text-light-purple absolute z-1">Organized Your Design.</h2>
                    <div className="flex absolute -bottom-5 max-md:left-30">
                        <span className="h-20 bg-[#A031FF] left-50 stack-style"></span>
                        <span className="h-25 bg-[#B158FF] left-35 stack-style"></span>
                        <span className="h-30 bg-[#CE96FF] left-25 stack-style"></span>
                        <span className="h-20 bg-[#B158FF] left-10 stack-style"></span>
                    </div>
                </div>

                <div className="bg-light-gray flex flex-col justify-between md:col-span-2 row-span-4 md:row-span-2 relative p-10 overflow-hidden md:h-120 w-full h-full z-2">
                    <GridPattern />
                    <div className="max-w-2/3 space-y-2 z-5 relative">
                        <h2 className="text-2xl font-semibold">Create Every Step from Start to Finished.</h2>
                        <p className="text-purplish text-xs">Show every step how your designing, process from your mind into the real art to showcase the world.</p>
                    </div>
                    <div className="card-style p-5 w-70 h-fit -left-10 md:left-40 bottom-25 absolute z-1">
                        <div className="flex items-center justify-between">
                            <h3 className="h-three-style">Initial Spark & Brief</h3>
                            <span className="bg-light-green py-1 px-3 rounded-full text-[9px]">Research</span>
                        </div>
                        <div className="flex gap-x-5 items-center text-purple-dark/50 text-[10px]">
                            <div className="flex items-center justify-between gap-2">
                                <CalendarDays className="w-3 h-3" />
                                <p>20 January 2025</p>
                            </div>
                            <div className="flex items-center justify-between gap-2">
                                <Timer className="w-3 h-3" />
                                <p>2 Weeks</p>
                            </div>
                        </div>
                        <p className="text-xs text-purple-dark/80">The client wanted a radical departure from traditional 'wellness' tropes. No lotus flowers, no soft pastel gradients.</p>
                        <hr className="border-bottom border-grayish/90"/>
                        <div className="flex items-center justify-between text-purple-dark/50 text-xs">
                            <p>2 Items</p>
                            <button className="py-1 px-3 bg-light-purple/50 hover:bg-light-purple cursor-pointer rounded-lg">
                                <MoveRight className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                    <span className="absolute right-35 top-70 border-dashed border-b-2 border-grayish w-30"></span>
                    <div className="card-style w-60 h-fit -right-20 bottom-15 absolute z-2">
                        <div className="h-30 w-full relative rounded-tl-xl rounded-tr-xl overflow-hidden">
                            <Image alt="brainstorming illustration board" src="/images/brainstorming.png" fill />
                        </div>
                        <div className="p-4 flex flex-col justify-between h-full space-y-3">
                            <div className="flex items-center justify-between">
                                <h3 className="h-three-style">Brainstorming Idea</h3>
                                <span className="bg-light-green py-1 px-3 rounded-full text-[9px]">Research</span>
                            </div>
                            <div className="flex gap-x-5 items-center text-purple-dark/50 text-[10px]">
                                <p>2 Febuary 2025</p>
                                <p>1 Weeks</p>
                            </div>
                            <p className="text-xs text-purple-dark/80">Gathered references, get everything written down on the board, We wanted the brand to feel vintage and slightly aggressive, like a 90s.</p>
                            <hr className="border-bottom border-grayish/90"/>
                            <div className="flex items-center justify-between text-purple-dark/50 text-xs">
                                <p>5 Items</p>
                                <MoveRight className="w-5 h-5" />
                            </div>
                        </div>
                    </div>
                    <Link href="/explore" className="w-10 h-10 border border-purplish hover:bg-purplish rounded-full cursor-pointer">
                        <ArrowUpRight className="p-2 w-10 h-10 text-purplish hover:text-light-purple" />
                    </Link>
                </div>

                <div className="bg-light-purple relative overflow-hidden">
                    <div className="flex absolute bottom-0 md:bottom-5 -right-10">
                        <Image alt="no circle in the middle" src="/assets/no-circle.svg" width={60} height={60} />
                        <Image alt="quarter circle in the middle" src="/assets/quarter-circle.svg" width={80} height={80} />
                        <Image alt="half circle in the middle" src="/assets/half-circle.svg" width={90} height={90} />
                        <Image alt="one third circle in the middle" src="/assets/one-third-circle.svg" width={125} height={125} />
                    </div>
                    <h2 className="p-10 text-2xl font-semibold text-purplish">Organized Your Design.</h2>
                </div>
            </div>
        </section>
    )
} 