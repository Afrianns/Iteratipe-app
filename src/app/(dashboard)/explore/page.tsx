import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { createClerkSupabaseClient } from "@/lib/supabase";

import { cookies } from 'next/headers'

export default async function ExplorePage() {
    let supabase = await createClerkSupabaseClient();
    const { data, error } = await supabase.from('Designs').select();

    console.log(data, error)

    return (
        <div className="flex bg-light-gray min-h-screen">
            <Sidebar current="explore" />
            <div className="col-span-5 w-full">
                <div className="w-full h-fit bg-whitish py-5 px-10 border-b border-gray-200 shadow-xs">
                    <Header />
                    <div className="mt-10">
                        <h1 className="text-4xl font-bold mb-2">Explore Designs</h1>
                        <p className="text-gray-600">Here you can find various design and process from people around the world.</p>

                        <div className="flex gap-5 mt-10 bg-grayish/50 w-full rounded-lg relative">
                            <input type="text" name="search" className="w-full p-5 rounded-lg border outline-purplish border-grayish focus:ring-0 text-sm" placeholder="Search designs..." />
                            <button className="bg-purplish text-whitish right-2 top-2 bottom-2 py-2 px-6 rounded-sm absolute">Search</button>
                        </div>
                    </div>
                </div>
                <div className="w-full h-fit py-5 px-10 grid grid-cols-3 gap-5">
                    
                    {data?.map((design) => (
                        <div key={design.id} className="card-style p-5">
                            <h3 className="text-2xl font-bold">{design.Name}</h3>
                            <p className="text-gray-500">{design.Description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
} 
