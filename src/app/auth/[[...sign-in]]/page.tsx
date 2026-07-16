import { SignIn } from "@clerk/nextjs";

export default function Signin() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-light-gray">
            <SignIn withSignUp={true} appearance={{
                elements: {
                    footer: "hidden",
                    cardBox: "card-style",
                    card: "shadow-none! border-none mb-0",
                    socialButtonsBlockButton: "border! shadow-none!"
                }
            }} />
        </div>
    )
}