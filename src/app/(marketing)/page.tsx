"use client"
import gsap from "gsap";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Timeline from "@/app/(marketing)/_components/timeline";
import Features from "@/app/(marketing)/_components/features";
import { ArrowUpRight, Menu } from "lucide-react";
import DotsPattern from "@/app/(marketing)/_components/DotsPattern";
import GridPattern from "@/app/(marketing)/_components/GridPattern";
import { SignInButton } from "@clerk/nextjs";

// Register once globally on the client side
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function LandingPage() {

    const [headerDropdown, setHeaderDropdown] = useState<boolean>();

    const startRef = useRef<HTMLHeadingElement>(null);
    const headerRef = useRef<HTMLHeadingElement>(null);

    useEffect(() => {
        gsap.fromTo(headerRef.current, 
            {
                autoAlpha: 0,
            },
            { 
                autoAlpha: 1,
                yPercent: 100, 
                duration: .2,
                ease: "power1.inOut",
                scrollTrigger: {
                    trigger: startRef.current,
                    start: "90px 40px",
                    scrub: 1
                },
            }
        );
    })

    const toggleHeader = () => {
        if(headerDropdown){
            setHeaderDropdown(false)
        } else{
            setHeaderDropdown(true);
        }
    }

    const HeaderComp = () => {
        return (
            <>
                <Image alt="Iteratipe Logo" src="Logo.svg" width={130} height={130}/>
                <Menu onClick={toggleHeader} className="md:hidden bg-light-purple rounded-full p-1 mx-0 cursor-pointer" />
                <ul className="hidden md:flex justify-between gap-x-5 md:text-sm items-center">
                    <li className="cursor-pointer hover:underline"><Link href="/">Home</Link></li>
                    <li className="cursor-pointer hover:underline"><Link href="/explore">Explore</Link></li>
                    <li className="cursor-pointer hover:underline"><Link href="/about">About</Link></li>
                </ul>
                 <SignInButton>
                    <Link href="#" className="max-md:hidden button-style rounded-full">Get Started</Link>
                 </SignInButton>
                {headerDropdown && 
                    <div className="gap-x-5 bg-white absolute p-5 top-10 right-5 card-style my-5">
                        <ul className="md:flex space-y-3 gap-x-5 md:text-sm items-center">
                            <li className="cursor-pointer hover:underline"><Link href="/">Home</Link></li>
                            <li className="cursor-pointer hover:underline"><Link href="/explore">Explore</Link></li>
                            <li className="cursor-pointer hover:underline"><Link href="/about">About</Link></li>
                        </ul>
                        <Link href="#" className="button-style rounded-full">Get Started</Link>
                    </div>
                }
            </>
        )
    }

    return (
        <div>
            <div ref={headerRef} className="bg-white/50 backdrop-blur-lg w-full h-19 md:mx-auto py-5 fixed -top-20 px-5 flex items-center justify-between gap-x-5 space-x-10 shadow-sm z-10 invisible">
                <HeaderComp />
            </div>
            <section className="bg-light-blue py-10 relative overflow-hidden z-2">
                <DotsPattern />
                <div className=" bg-white h-15 max-w-160 mx-5 md:mx-auto rounded-full py-3 px-5 flex items-center justify-between gap-x-5 space-x-10 shadow-sm relative">
                    <HeaderComp />
                </div>
                <div ref={startRef} className="flex flex-col justify-center items-center text-center max-w-250 mx-10 md:mx-auto space-y-5 md:space-y-10 my-10">
                    <h1 className="text-center font-black text-4xl md:text-6xl font-raleway">DESIGNING IS NOT JUST THE  RESULT BUT ALSO THE PROCESS.</h1>
                    <p className="max-w-150 text-purplish">Appreciate the designing process from start to finished and get insight from other designer around the world.</p>
                    <div className="flex gap-x-5">
                        <Link href='' className="button-style rounded-md">Get Started</Link>
                        <Link href='' className="button-style-secondary rounded-md">Explore Now</Link>
                    </div>
                </div>
            </section>

            <Timeline />

            <Features />
            <section className="px-10 bg-purplish-blue h-fit w-full relative overflow-hidden z-2">
                <div className="absolute -z-1 w-200 top-0 -bottom-10 -right-10">
                    <Image alt="wavy line pattern" className="-rotate-5 opacity-70" src="/assets/wavy-line.svg" fill/>
                </div>
                <div className="limit-breaker py-15">
                    <div className="flex max-md:flex-col items-start md:items-end justify-between">
                        <div className="max-w-200 space-y-5">
                            <h1 className="text-3xl font-bold text-whitish">EVERY DESIGNING PROCESS YOU MAKE ARE DESIGN WORTH TO SHOW.</h1>
                            <p className="text-lg text-light-purple/90 max-w-100">Discover how professional designer workflow. showcase your process of your own to the world.</p>
                        </div>
                        <Link href="" className="w-10 h-10 border border-light-purple hover:bg-light-purple rounded-full cursor-pointer mt-5">
                            <ArrowUpRight className="p-2 w-10 h-10 text-light-purple hover:text-purplish" />
                        </Link>
                    </div>
                </div>
            </section>
            <section className="p-10 bg-light-blue md:h-100 relative z-1">
                <GridPattern />
                <div className="limit-breaker my-10 flex max-md:flex-col items-start justify-between">
                    <Image alt="Iteratipe App Logo" src="Logo.svg" width={150} height={150} />
                    
                    <div className="flex max-md:flex-col gap-y-10 md:gap-x-30 justify-between my-5">
                        <div>
                            <h3 className="h-three-style mb-5">Menu</h3>
                            <ul className="space-y-3">
                                <li className="cursor-pointer hover:underline">Home</li>
                                <li className="cursor-pointer hover:underline">Explore</li>
                                <li className="cursor-pointer hover:underline">About</li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="h-three-style mb-5">For Recruiter</h3>
                            <ul className="space-y-3">
                                <li className="cursor-pointer hover:underline">Hire Designer</li>
                                <li className="cursor-pointer hover:underline">Find Services</li>
                            </ul>
                        </div>
                        <div className="flex items-start gap-x-5">
                            <Image alt="facebook logo black" className="cursor-pointer p-1 rounded-full bg-light-gray hover:bg-light-purple" src="/assets/facebook.svg" width={30} height={30}/>
                            <Image alt="instagram logo black" className="cursor-pointer p-1 rounded-full bg-light-gray hover:bg-light-purple" src="/assets/instagram.svg" width={30} height={30}/>
                            <Image alt="x/twitter logo black" className="cursor-pointer p-1 rounded-full bg-light-gray hover:bg-light-purple" src="/assets/x.svg" width={25} height={25}/>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}