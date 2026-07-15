import { Lock } from "lucide-react";
import Link from "next/link";

export default function UnauthorizedInfo() {
    return (
        <div className="max-w-360 mx-auto card-style-secondary flex flex-col justify-center items-center py-10!">
            <div className="p-5 rounded-full bg-grayish/40">
                <Lock className="w-10 font-bold stroke-3 text-grayish-dark opacity-20"/>
            </div>
            <div className="text-center space-y-5">
                <h1 className="h-two-style my-2! font-epilogue!">THIS SECTION IS LOCKED</h1>
                <p className="p-style">You need to register or login first to access it!</p>
                <Link href="/auth" className="button-style rounded-md">Sign in</Link>
            </div>
        </div>
    )
}