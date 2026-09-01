import Header from "@/components/Header";
import { UserProfile } from "@clerk/nextjs";
import Link from "next/link";
import ProfileNav from "./_components/ProfileNav";
import Social from "./_components/social";
import social from "./_components/social";
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
                    <Link href="?additional=personal-info" className={`p-style ${(params.additional != "social") && "text-main!"}`}>Personal Information</Link>
                    <Link href="?additional=social" className={`p-style ${params.additional == "social" && "text-main!"}`}>Social</Link>
                </ul>
                {params.additional == "social" ? <Social /> : <PersonalInformation />}
            </div>
        </div>
    )
}