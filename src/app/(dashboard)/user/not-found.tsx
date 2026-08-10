import Link from 'next/link'
 
export default function NotFound() {
  return (
    <div className='flex items-center justify-center w-full'>
      <div className='space-y-10'>
        <div>
          <h2 className='h-two-style text-4xl! uppercase font-main!'>User Not Found.</h2>
          <p className='p-style mt-2!'>Could not find related user.</p>
        </div>
        <Link href="/home" className='button-style-secondary rounded-md'>Home</Link>
      </div>
    </div>
  )
}