import { prisma } from "./db";
import { pusher } from "./pusher";

export default async function storeAndNotify(message: string, userId: number, projectOwner: string) {
  const ownerId = await prisma.users.findFirst({where: {username: projectOwner}, select: {id: true, clerk_user_id: true}})

  if(ownerId?.id){

    const newlyActivity = await prisma.activities.create({
      data: {
        messages: message,
        Object_user_id: ownerId.id,
        Subject_user_id: userId,
        seen: false
      },
      include: {
        Subject: {
          select: {
            image_url: true
          }
        }
      }
    })

    pusher.trigger("notification-channel", `notify-${ownerId.clerk_user_id}`, {         
      id: newlyActivity.id as number,
      user_id: newlyActivity.Subject_user_id as number,
      messages: newlyActivity.messages as string,
      created_at: newlyActivity.created_at as Date,
      user_image_url: newlyActivity.Subject.image_url as string
    });
  }
}