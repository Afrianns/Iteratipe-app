import { UserType } from "@/types/types";


export default function About({user}: {user: UserType}) {
  return (
    <div className="card-style-secondary max-w-200">
      <p>
        {user.description ? user.description : <span className="text-main-text/50 italic">Hi there, I'am passionate about designing thing...</span>}
      </p>
    </div>
  )
}