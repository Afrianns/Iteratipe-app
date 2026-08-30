import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import Main from "./_components/Main";

export default function New() {
    return (
        <div className="container-wrapper-style max-md:mb-20">
            <Sidebar />
            <div className="col-span-5 w-full">
                <div className="container-style container-accent-style">
                    <div className="limit-breaker">
                        <Header />
                    </div>
                </div>
                <Main />
            </div>
        </div>
    )
}
