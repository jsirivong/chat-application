import Navbar from "./navbar.tsx";
import Sidebar from "./sidebar.tsx";

interface IProps {
    showSidebar: boolean
    children: React.ReactNode;
}

export default function Layout({ showSidebar = false, children }: IProps){
    return (
        <div className="min-h-screen">
            <div className="flex">
                {showSidebar && <Sidebar/>}

                <div className="flex-1 flex flex-col">
                    <Navbar/>
                    <main className="flex overflow-y-auto">
                        {children}
                    </main>
                </div>
            </div>
        </div>
    )
}