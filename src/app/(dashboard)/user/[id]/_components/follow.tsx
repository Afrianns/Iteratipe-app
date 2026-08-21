import { followUser, unfollowUser } from "@/services/follows.service"
import { toast } from "sonner"
import { UserProjectPreviewType } from "../page"
import { useState } from "react"

export default function Follow({user, setUser}:{user: UserProjectPreviewType, setUser: (user: UserProjectPreviewType) => void}) {

  const [loading, setLoading] = useState<boolean>(false)

  const followThisUser = async () => {
    setLoading(true)

    try {
        const result = await followUser(user.id)

      if(result?.status == 200 && result.data){
        console.log(result.data.id)
        setUser({...user, Followers: [{id: result.data.id}], _count: { ...user._count, Followers: user._count.Followers = user._count.Followers + 1 }})
      } else{
        toast.warning(result?.message)
        console.log(result)
        throw new Error(result?.message)
        
      }
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  console.log(user)
  
  const unfollowThisUser = async () => {
    setLoading(true)

    try {
        const result = await unfollowUser(user.id)
  
      if(result?.status == 200 && result.data){
        toast.success(result?.message)
        console.log(result.data)
        setUser({...user, Followers: [], _count: { ...user._count, Followers: user._count.Followers = user._count.Followers - 1 }})
      } else{
        toast.warning(result?.message)
        throw new Error(result?.message)
        
      }
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
    {user.Followers.length <= 0 ?
      <>
      {loading ?
        <div className="button-style rounded-full cursor-wait! opacity-60">Following</div>
      :
        <div className="button-style rounded-full" onClick={followThisUser}>Follow</div>
      }
      </>
    :
      <>
        {loading ? 
          <div className="button-style-secondary rounded-full cursor-wait! opacity-60">Unfollowing</div>
        :
          <div className="button-style-secondary rounded-full cursor-auto" onClick={unfollowThisUser}>Unfollow</div>
        }
      </>
    }
    </>
  )
}