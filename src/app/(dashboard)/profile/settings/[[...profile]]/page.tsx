import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { UserProfile } from "@clerk/nextjs";
import { dark, neobrutalism } from "@clerk/ui/themes";
import { headers } from "next/headers";
import Link from "next/link";
import ProfileNav from "./_components/ProfileNav";

export default async function User() {
    

    return (
        <div className="container-wrapper-style">
            <Sidebar />
            <div className="col-span-5 w-full">
                <div className="container-style container-accent-style">
                    <div className="limit-breaker">
                        <Header showSearch={false} />
                    </div>
                </div>
                <div className="container-style">
                    <div className="space-y-5 mb-5">
                        <h3 className="h-two-style">Settings</h3>
                        <ProfileNav />
                    </div>
                    <UserProfile appearance={{
                        variables: {
                            colorNeutral: "var(--color-purplish)"
                        },
                        elements: {
                            navbarMobileMenuRow: "hidden",
                            footerItem: "hidden",
                            navbar: "hidden",
                            rootBox: "w-full",
                            cardBox: "border-none w-full h-fit",
                            navbarButton: "hover:bg-purplish/10 hover:text-purplish"
                        }
                    }} />

                    <ul className="flex gap-x-5 items-center my-5">
                        <Link href="?additional=social" className="p-style">Social</Link>
                        <Link href="?additional=preferences" className="p-style">Preferences</Link>
                    </ul>
                </div>
            </div>
        </div>
    )
}