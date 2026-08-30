import Header from "@/components/Header";
import { UserProfile } from "@clerk/nextjs";
import Link from "next/link";
import ProfileNav from "./_components/ProfileNav";
import Social from "./_components/social";
import Preferences from "./_components/preferences";
import PersonalInformation from "./_components/PersonalInformation";

export default async function User({ searchParams }: {searchParams: Promise<{ additional?: string }>}) {
    
    const params = await searchParams

    return (
        <div className="col-span-5 w-full">
            <div className="container-style container-accent-style">
                <Header />
            </div>
            <div className="container-style space-y-5">
                <h3 className="h-two-style">Settings</h3>
                <PersonalInformation />
                <div className="space-y-5 mb-5">
                    <ProfileNav />
                </div>
                <UserProfile appearance={{
                    variables: {
                        colorNeutral: "var(--color-main)"
                    },
                    elements: {
                        navbarMobileMenuRow: "hidden",
                        footerItem: "hidden",
                        navbar: "hidden",
                        rootBox: "w-full",
                        cardBox: "w-full h-fit card-style-secondary p-0!",
                        navbarButton: "hover:bg-main/10 hover:text-main"
                    }
                }} />

                <ul className="flex gap-x-5 items-center my-5">
                    <Link href="?additional=social" className={`p-style ${(params.additional != "preferences") && "text-main!"}`}>Social</Link>
                    <Link href="?additional=preferences" className={`p-style ${params.additional == "preferences" && "text-main!"}`}>Preferences</Link>
                </ul>
                {params.additional == "preferences" ? <Preferences /> : <Social />}
            </div>
        </div>
    )
}