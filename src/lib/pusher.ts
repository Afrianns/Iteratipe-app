import Pusher from "pusher";
import PusherClient from 'pusher-js';

export const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID as string,
  key: process.env.NEXT_PUBLIC_PUSHER_KEY as string,
  secret: process.env.PUSHER_SECRET as string,
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER as string,
});


const pusherClient = new PusherClient(process.env.NEXT_PUBLIC_PUSHER_KEY as string, {
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER as string
});

export const channel = pusherClient.subscribe("notification-channel")