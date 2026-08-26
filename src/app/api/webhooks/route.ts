import syncUser from '@/actions/syncUser';
import { UserPreviewType } from '@/types/types';
import { verifyWebhook } from '@clerk/nextjs/webhooks'
import { NextRequest } from 'next/server'

export async function POST(req: NextRequest) {
  // try {
  //   const evt = await verifyWebhook(req)
    
  //   switch (evt.type) {
  //     case "user.created":
  //       const userData = evt.data
  //       const user: UserWebhookType = {
  //           id: userData.id,
  //           first_name: userData.first_name || "-",
  //           last_name: userData.last_name || "-",
  //           full_name: `${userData.first_name} ${userData.last_name}`,
  //           email: userData.primary_email_address_id || "-",
  //           image_url: userData.image_url || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
  //       }
  //       const result = await syncUser(user)

  //       if(result.status == 200){   
  //           return new Response(`${result.message}, ID: ${result.data?.clerk_user_id }`, { status: 200 })
  //       }
  //       break;
  //     default:
  //       break;
  //   }
  //   const { id } = evt.data

  //   return new Response(`Webhook received`, { status: 200 })
  // } catch (err) {
  //   console.error('Error verifying webhook:', err)
  //   return new Response('Error verifying webhook', { status: 400 })
  // }
}