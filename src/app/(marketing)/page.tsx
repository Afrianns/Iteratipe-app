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
import { useUser } from "@clerk/nextjs";


// Register once globally on the client side
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function LandingPage() {

    const [headerDropdown, setHeaderDropdown] = useState<boolean>();

    const { user, isSignedIn, isLoaded } = useUser();

    const pageRef = useRef<HTMLDivElement>(null);
    const startRef = useRef<HTMLDivElement>(null);
    const heroNavRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!pageRef.current) return;

        const context = gsap.context(() => {
            const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

            if (reduceMotion) {
                gsap.set("[data-reveal]", { autoAlpha: 1, clearProps: "all" });
                return;
            }

            const intro = gsap.timeline({ defaults: { ease: "power3.out" } });
            intro
                .fromTo(heroNavRef.current,
                    { autoAlpha: 0, y: -18 },
                    { autoAlpha: 1, y: 0, duration: 0.7 },
                )
                .from("[data-hero-content] > h1, [data-hero-content] > p", {
                    autoAlpha: 0,
                    y: 28,
                    duration: 0.7,
                    stagger: 0.12,
                }, "-=0.35")
                .fromTo("[data-hero-action]",
                    { autoAlpha: 0, scale: 0.92, y: 18 },
                    { autoAlpha: 1, scale: 1, y: 0, duration: 0.45 },
                    "-=0.25"
                );

            gsap.to(heroNavRef.current, {
                maxWidth: "60rem",
                backgroundColor: "rgba(255, 255, 255, 0.5)",
                backdropFilter: "blur(16px)",
                duration: 0.25,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: startRef.current,
                    start: "90px 40px",
                    toggleActions: "play none none reverse",
                },
            });

            gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((element) => {
                gsap.from(element, {
                    autoAlpha: 0,
                    y: 42,
                    duration: 0.8,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: element,
                        start: "top 82%",
                        once: true,
                    },
                });
            });

            gsap.utils.toArray<HTMLElement>("[data-float]").forEach((element, index) => {
                gsap.to(element, {
                    y: index % 2 === 0 ? -10 : 10,
                    duration: 2.8 + index * 0.35,
                    repeat: -1,
                    yoyo: true,
                    ease: "sine.inOut",
                    delay: index * 0.15,
                });
            });

            gsap.utils.toArray<HTMLElement>("[data-hover-lift]").forEach((element) => {
                const onEnter = () => gsap.to(element, { y: -6, duration: 0.25, ease: "power2.out" });
                const onLeave = () => gsap.to(element, { y: 0, duration: 0.35, ease: "power2.out" });
                element.addEventListener("mouseenter", onEnter);
                element.addEventListener("mouseleave", onLeave);
            });
        }, pageRef);

        return () => context.revert();
    }, []);

    const toggleHeader = () => {
        if(headerDropdown){
            setHeaderDropdown(false)
        } else{
            setHeaderDropdown(true);
        }
    }

    const AuthenticatedUserShowFn = () => {
        let comps: React.ReactElement;
        if(isLoaded && isSignedIn){
            comps = <Link className="flex items-center justify-end gap-x-2 py-2 px-3 hover:bg-light-gray h-full w-fit rounded-full" href="/profile">
                <span className="p-style">{user.fullName}</span>    
                <Image alt="current user avatar" src={user.imageUrl} width={30} height={30} className="rounded-full" />
            </Link>
        } else if(isLoaded && !isSignedIn) {
            comps = <Link href="/auth" className="max-md:hidden button-style rounded-full">Get Started</Link>
        } else{
            comps = <div className="w-30 h-full bg-grayish animate-pulse rounded-full"></div>
        }

        return comps;
    }

    const HeaderComp = () => {
        return (
            <>
                <Image alt="Iteratipe Logo" src="Logo.svg" width={130} height={130}/>
                <Menu aria-label="Open navigation menu" onClick={toggleHeader} className="md:hidden bg-secondary rounded-full p-1 mx-0 cursor-pointer transition-colors hover:bg-light-gray" />
                <ul className="hidden md:flex justify-between gap-x-6 md:text-sm items-center text-main-text/70">
                    <li className="cursor-pointer transition-colors hover:text-main"><Link href="/home">Home</Link></li>
                    <li className="cursor-pointer transition-colors hover:text-main"><Link href="/explore">Explore</Link></li>
                    <li className="cursor-pointer transition-colors hover:text-main"><Link href="/about">About</Link></li>
                </ul>
                {AuthenticatedUserShowFn()}
                {headerDropdown && 
                    <div className="gap-x-5 bg-white absolute p-5 top-10 right-0 card-style my-5 min-w-40 shadow-lg">
                        <ul className="md:flex space-y-3 gap-x-5 text-sm font-light items-center">
                            <li className="cursor-pointer hover:underline"><Link href="/home">Home</Link></li>
                            <li className="cursor-pointer hover:underline"><Link href="/explore">Explore</Link></li>
                            <li className="cursor-pointer hover:underline"><Link href="/about">About</Link></li>
                            {isSignedIn && <li className="cursor-pointer hover:underline"><Link href="/about">{user?.fullName}</Link></li>}
                        </ul>
                        {!isSignedIn && <Link href="/auth" className="button-style rounded-full">Get Started</Link>}
                    </div>
                }
            </>
        )
    }

    return (
        <div ref={pageRef}>
            <div ref={heroNavRef} data-hero-nav className="bg-white h-15 max-w-160 mx-5 md:mx-auto rounded-4xl py-3 px-5 flex items-center justify-between gap-x-5 space-x-10 shadow-sm sticky top-7 z-10">
                {HeaderComp()}
            </div>
            <section className="bg-light-blue -mt-15 pt-15 pb-16 md:pb-24 relative overflow-hidden z-2">
                <DotsPattern />
                <div ref={startRef} data-hero-content className="flex flex-col justify-center items-center text-center max-w-250 mx-6 md:mx-auto space-y-6 md:space-y-8 mt-0 mb-10 pt-15">
                    <h1 className="text-center font-black text-3xl leading-tight md:text-5xl md:leading-tight uppercase md:pb-5 max-w-220">Design not only the result but the process.</h1>
                    <p className="max-w-150 text-main leading-7">Find out how designer around the world designing from start to finished and get insight.</p>
                    <div data-hero-action className="flex flex-col sm:flex-row gap-3 sm:gap-x-5 w-full sm:w-auto">
                        <Link href='/auth' className="button-style rounded-md text-center transition-transform hover:-translate-y-1">Get Started</Link>
                        <Link href='/explore' className="button-style-secondary rounded-md text-center transition-transform hover:-translate-y-1">Explore Now</Link>
                    </div>
                </div>
            </section>

            <div data-reveal data-hover-lift><Timeline /></div>

            <div data-reveal><Features /></div>
            <section data-reveal className="px-10 bg-tertiary h-fit w-full relative overflow-hidden z-2">
                <div className="absolute -z-1 w-200 top-0 -bottom-10 -right-10">
                    <Image data-float alt="wavy line pattern" className="-rotate-5 opacity-70" src="/assets/wavy-line.svg" fill/>
                </div>
                <div className="limit-breaker py-15">
                    <div className="flex max-md:flex-col items-start md:items-end justify-between">
                        <div className="max-w-200 space-y-5">
                            <h1 className="text-3xl font-bold text-whitish">EVERY DESIGNING PROCESS YOU MAKE ARE DESIGN WORTH TO SHOW.</h1>
                            <p className="text-lg text-secondary/90 max-w-100">Discover how professional designer workflow. showcase your process of your own to the world.</p>
                        </div>
                        <Link href="/explore" className="w-10 h-10 border border-secondary hover:bg-secondary rounded-full cursor-pointer mt-5">
                            <ArrowUpRight className="p-2 w-10 h-10 text-secondary hover:text-main" />
                        </Link>
                    </div>
                </div>
            </section>
            <section data-reveal className="p-10 bg-light-blue md:h-100 relative z-1">
                <GridPattern />
                <div className="limit-breaker my-10 flex max-md:flex-col items-start justify-between">
                    <Image alt="Iteratipe App Logo" src="Logo.svg" width={150} height={150} />
                    
                    <div className="flex max-md:flex-col gap-y-10 md:gap-x-30 justify-between my-5">
                        <div>
                            <h3 className="h-three-style mb-5">Menu</h3>
                            <ul className="space-y-3">
                                <li className="cursor-pointer hover:underline"><Link href="/home">Home</Link></li>
                                <li className="cursor-pointer hover:underline"><Link href="/explore">Explore</Link></li>
                                <li className="cursor-pointer hover:underline"><Link href="/">About</Link></li>
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
                            <Image alt="facebook logo black" className="cursor-pointer p-1 rounded-full bg-light-gray hover:bg-secondary" src="/assets/facebook.svg" width={30} height={30}/>
                            <Image alt="instagram logo black" className="cursor-pointer p-1 rounded-full bg-light-gray hover:bg-secondary" src="/assets/instagram.svg" width={30} height={30}/>
                            <Image alt="x/twitter logo black" className="cursor-pointer p-1 rounded-full bg-light-gray hover:bg-secondary" src="/assets/x.svg" width={25} height={25}/>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}