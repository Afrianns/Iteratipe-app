"use client"

import { UserType } from "@/types/types";
import Link from "next/link";

export default function About({user}: {user: UserType}) {

  return (
    <div className="card-style-secondary max-w-200">
      <h3 className="h-four-style">Information</h3>
      <div className="my-4">
        <h3 className="text-xl font-semibold">{user.full_name}</h3>
        <p>
          {user.description ? user.description : <span className="text-main-text/50 italic">Hi there, I'am passionate about designing thing...</span>}
        </p>
      </div>

      <h3 className="h-four-style">Social Links</h3>
      <div className="space-y-5">
        {user.instagram_link &&
          <Link href={user.instagram_link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-main/5 rounded-md">
            <div className="icon-style-secondary">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d="M0 0h24v24H0z" fill="none" />
                <path fill="currentColor" fillRule="evenodd" d="M7.465 1.066C8.638 1.012 9.012 1 12 1s3.362.013 4.534.066s1.972.24 2.672.511c.733.277 1.398.71 1.948 1.27c.56.549.992 1.213 1.268 1.947c.272.7.458 1.5.512 2.67C22.988 8.639 23 9.013 23 12s-.013 3.362-.066 4.535c-.053 1.17-.24 1.97-.512 2.67a5.4 5.4 0 0 1-1.268 1.949c-.55.56-1.215.992-1.948 1.268c-.7.272-1.5.458-2.67.512c-1.174.054-1.548.066-4.536.066s-3.362-.013-4.535-.066c-1.17-.053-1.97-.24-2.67-.512a5.4 5.4 0 0 1-1.949-1.268a5.4 5.4 0 0 1-1.269-1.948c-.271-.7-.457-1.5-.511-2.67C1.012 15.361 1 14.987 1 12s.013-3.362.066-4.534s.24-1.972.511-2.672a5.4 5.4 0 0 1 1.27-1.948a5.4 5.4 0 0 1 1.947-1.269c.7-.271 1.5-.457 2.67-.511m8.98 1.98c-1.16-.053-1.508-.064-4.445-.064s-3.285.011-4.445.064c-1.073.049-1.655.228-2.043.379c-.513.2-.88.437-1.265.822a3.4 3.4 0 0 0-.822 1.265c-.151.388-.33.97-.379 2.043c-.053 1.16-.064 1.508-.064 4.445s.011 3.285.064 4.445c.049 1.073.228 1.655.379 2.043c.176.477.457.91.822 1.265c.355.365.788.646 1.265.822c.388.151.97.33 2.043.379c1.16.053 1.507.064 4.445.064s3.285-.011 4.445-.064c1.073-.049 1.655-.228 2.043-.379c.513-.2.88-.437 1.265-.822c.365-.355.646-.788.822-1.265c.151-.388.33-.97.379-2.043c.053-1.16.064-1.508.064-4.445s-.011-3.285-.064-4.445c-.049-1.073-.228-1.655-.379-2.043c-.2-.513-.437-.88-.822-1.265a3.4 3.4 0 0 0-1.265-.822c-.388-.151-.97-.33-2.043-.379m-5.85 12.345a3.669 3.669 0 0 0 4-5.986a3.67 3.67 0 1 0-4 5.986M8.002 8.002a5.654 5.654 0 1 1 7.996 7.996a5.654 5.654 0 0 1-7.996-7.996m10.906-.814a1.337 1.337 0 1 0-1.89-1.89a1.337 1.337 0 0 0 1.89 1.89" clipRule="evenodd" />
              </svg>
            </div>
            <p className="text-sm text-main hover:underline">{user.instagram_link}</p>
          </Link>
        }
        {user.facebook_link &&
        <Link href={user.facebook_link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-main/5 rounded-md">
          <div className="icon-style-secondary">
            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
              <path d="M0 0h24v24H0z" fill="none" />
              <g fill="none">
                <g clipPath="url(#SVGXv8lpc2Y)">
                  <path fill="currentColor" fillRule="evenodd" d="M0 12.067C0 18.034 4.333 22.994 10 24v-8.667H7V12h3V9.333c0-3 1.933-4.666 4.667-4.666c.866 0 1.8.133 2.666.266V8H15.8c-1.467 0-1.8.733-1.8 1.667V12h3.2l-.533 3.333H14V24c5.667-1.006 10-5.966 10-11.933C24 5.43 18.6 0 12 0S0 5.43 0 12.067" clipRule="evenodd" />
                </g>
                <defs>
                  <clipPath id="SVGXv8lpc2Y">
                    <path fill="#fff" d="M0 0h24v24H0z" />
                  </clipPath>
                </defs>
              </g>
            </svg>
          </div>
          <p className="text-sm text-main hover:underline">{user.facebook_link}</p>
        </Link>
        }
      </div>
      {user.twitter_link &&
        <Link href={user.twitter_link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-main/5 rounded-md">
          <div className="icon-style-secondary">
            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
              <path d="M0 0h24v24H0z" fill="none" />
              <path fill="currentColor" d="M13.68 10.62L20.24 3h-1.55L13 9.62L8.45 3H3.19l6.88 10.01L3.19 21h1.55l6.01-6.99l4.8 6.99h5.24l-7.13-10.38Zm-2.13 2.47l-.7-1l-5.54-7.93H7.7l4.47 6.4l.7 1l5.82 8.32H16.3z" />
            </svg>
          </div>
          <p className="text-sm text-main hover:underline">{user.twitter_link}</p>
        </Link>
      }
    </div>
  )
}