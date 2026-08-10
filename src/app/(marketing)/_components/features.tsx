"use client"

import { CircleCheck, Clock4, Layers } from "lucide-react";
import Image from "next/image";
import GridPattern from "./GridPattern";

export default function Features() {
    return (
    <div className="relative">
        <div className="bg-red-500 w-full h-full">
            <GridPattern />
        </div>
        <section className="limit-breaker py-10">
            <div className="flex items-center flex-col justify-center my-10 w-full space-y-2">
                <h2 className="font-black text-main">FEATURES</h2>
                <h2 className="text-3xl text-center md:text-3xl font-bold">DESIGN AND SHARE BETTER WORKFLOWS</h2>
                <p className="text-main-text/50 w-full text-center max-w-150">Create and share design for people around the world. Discover how professional designer create design.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 max-w-80 md:max-w-220 mx-auto gap-y-5 md:gap-x-5">
                <div className="bg-light-gray relative overflow-hidden h-110 shadow">
                    <h2 className="p-10 text-2xl font-semibold absolute z-2">Documenting Your Workflow.</h2>
                    <hr className="absolute right-10 bottom-0 h-10 border-r-2 border-dashed border-grayish"/>
                    
                    <div className="bg-light-green rounded-md absolute p-2 w-40 h-15 z-1 bottom-45 -left-5">
                        <div className="space-y-1">
                            <span className="block w-full h-2 bg-green-300 rounded-sm"></span>
                            <span className="block w-full h-2 bg-green-300 rounded-sm"></span>
                            <span className="block w-3/5 h-2 bg-green-300 rounded-sm"></span>
                        </div>
                    </div>

                    <hr className="absolute left-15 top-0 h-50 border-r-2 border-dashed border-grayish"/>
                    <div className="bg-light-red rounded-md absolute p-2 w-40 h-15 z-1 bottom-5 -right-10">
                        <div className="space-y-1">
                            <span className="block w-full h-2 bg-grayish/50 rounded-sm"></span>
                            <span className="block w-full h-2 bg-grayish/50 rounded-sm"></span>
                            <span className="block w-full h-2 bg-grayish/50 rounded-sm"></span>
                            <span className="block w-3/5 h-2 bg-grayish/50 rounded-sm"></span>
                        </div>
                    </div>
                    <hr className="absolute right-10 top-0 h-30 border-r-2 border-dashed border-grayish"/>
                    <hr className="absolute right-10 top-30 w-20 border-t-2 border-dashed border-grayish"/>
                    <hr className="absolute right-30 top-30 h-30 border-r-2 border-dashed border-grayish"/>
                    <div className="card-style absolute w-50 h-fit p-2 bottom-10 right-10">
                        <span className="block w-full h-20 bg-grayish/50 rounded-sm"></span>
                        <span className="block w-30 h-3 bg-grayish/50 rounded-sm"></span>
                        <div className="space-y-1">
                            <span className="block w-full h-2 bg-grayish/50 rounded-sm"></span>
                            <span className="block w-full h-2 bg-grayish/50 rounded-sm"></span>
                            <span className="block w-3/5 h-2 bg-grayish/50 rounded-sm"></span>
                        </div>
                    </div>
                </div>
                <div className="w-full bg-light-gray relative overflow-hidden h-110 shadow">
                    <h2 className="p-10 text-2xl font-semibold">Organized More Efficent.</h2>
                    <div className="flex flex-col items-center justify-center w-full space-y-3 absolute -bottom-10">
                        <div className="card-style w-60 h-25 p-5 flex items-center justify-between">
                            <div>
                                <p className="text-sm text-main-text/40 font-bold">Total Projects.</p>
                                <h2 className="text-3xl font-semibold">23</h2>
                            </div>
                            <div className="p-2 bg-light-gray/50 rounded-full text-light-red">
                                <Layers strokeWidth={3} />
                            </div>
                        </div>
                        <div className="card-style w-60 h-25 p-5 flex items-center justify-between">
                            <div>
                                <p className="text-sm text-main-text/40 font-bold">Completed Projects.</p>
                                <h2 className="text-3xl font-semibold">14</h2>
                            </div>
                            <div className="p-2 bg-light-gray/50 rounded-full text-lime-yellow">
                                <CircleCheck strokeWidth={3} />
                            </div>
                        </div>
                        <div className="card-style w-60 h-25 p-5 flex items-center justify-between">
                            <div>
                                <p className="text-sm text-main-text/40 font-bold">Pending Projects.</p>
                                <h2 className="text-3xl font-semibold">9</h2>
                            </div>
                            <div className="p-2 bg-light-gray/50 rounded-full text-light-green">
                                <Clock4 strokeWidth={3} />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="h-110 bg-main/70 relative overflow-hidden shadow">
                    <h2 className="p-10 text-2xl font-semibold text-secondary">Discover Outstanding Design.</h2>
                    <div className="card-style z-1 w-70 h-fit p-3 absolute -bottom-10 -right-20">
                        <div className="relative w-full h-40 rounded-md overflow-hidden">
                            <Image alt="illustration of underwater life" src="/images/underwater-life-illustration.png" fill className="object-cover"/>

                            <span className="absolute bg-white text-main-text/50 py-1 px-3 bottom-2 left-2 rounded-sm text-xs">15 Steps</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="py-1 px-3 bg-light-green text-[10px]">Logo Design</span>
                            <span className="py-1 px-3 bg-lime-yellow text-[9px] rounded-full">In-progress</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <div>
                                <h3 className="h-three-style">De La Cruz</h3>
                                <p className="font-extralight text-xs text-main-text/70">by <span className="font-medium hover:underline cursor-pointer">Andreas Salisan</span></p>
                            </div>
                            <span>LIKE</span>
                        </div>

                        <div className="flex items-center justify-between">
                            <p>VIEWS</p>
                            <p>BOOKMARK</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </div>
    )
}