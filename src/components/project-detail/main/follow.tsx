import { followUser, unfollowUser } from "@/services/follows.service"
import { DBSingleProjectByID, overviewUser } from "@/types/types"
import { useEffect, useState } from "react"
import { toast } from "sonner"

export default function Follow({project, setProject}: {project: DBSingleProjectByID, setProject: (project: DBSingleProjectByID) => void}) {

  const user = project.overviewInfo.user;
  const [isFollowing, setIsFollowing] = useState<boolean>(false)

  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    setIsFollowing(user.Followers.length >= 1)
    console.log(user)
  }, [user])

  const followThisUser = async () => {
    setLoading(true)
  
    try {
        const result = await followUser(user.id)
  
      if(result.status == 200 && result.data){
        toast.success(result.message)
        setProject({...project, overviewInfo: { ...project.overviewInfo, user: {...project.overviewInfo.user, Followers: [{id: result.data.id}]}}})
      } else{
        toast.warning(result.message)        
      }
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }
  
  const unfollowThisUser = async () => {
    setLoading(true)
  
    try {
        const result = await unfollowUser(user.id)
  
      if(result.status == 200 && result.data){
        toast.success(result.message)
        setProject({...project, overviewInfo: { ...project.overviewInfo, user: {...project.overviewInfo.user, Followers: []}}})
      } else{
        toast.warning(result.message)
        
      }
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {isFollowing ?
        <>
          {loading ?
              <button className='group button-style-secondary opacity-60 cursor-wait'>Unfollowing</button>
              :
              <button className='group button-style-secondary' onClick={unfollowThisUser}>Unfollow <span className='underline group-hover:no-underline text-sm'>{user.full_name.toLowerCase()}</span></button>
              
            }
        </>
      :
      <>
          {loading ?
            <button className='group button-style opacity-60 cursor-wait'>following</button>
          :
            <button className="group button-style" onClick={followThisUser}>Follow <span className='underline group-hover:no-underline text-sm'>{user.full_name.toLowerCase()}</span></button>
          }
        </>
      }
    </>
  )
}