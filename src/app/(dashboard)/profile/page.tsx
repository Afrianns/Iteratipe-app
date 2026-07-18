import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { UserAvatar, UserProfile } from "@clerk/nextjs";
import { auth, currentUser } from "@clerk/nextjs/server";
import { formatDistance, formatDistanceStrict, formatDistanceToNow } from "date-fns";
import Link from "next/link";

export default async function Profile() {
    const user = await currentUser();
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
                    <div className="limit-breaker">
                        {user?.createdAt &&
                            <p className="capitalized p-style mb-5">Designer since {formatDistanceStrict(new Date(user.createdAt), new Date(), { addSuffix: true })}</p>
                        }
                        <div className="card-style-secondary p-5">
                            <div className="flex gap-x-5 items-center justify-center">
                                <UserAvatar appearance={{
                                    elements: {
                                        avatarBox: "w-20 h-20"
                                    }
                                }} />
                                <div>
                                    <div>
                                        <h1 className="h-two-style">{user?.fullName}</h1>
                                        <p className="span-style">{user?.id}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-center gap-x-5">
                                <Link href="/profile/settings" className="button-style-secondary rounded-full">Edit Profile</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}