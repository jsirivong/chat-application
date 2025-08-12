import { LoaderIcon } from "lucide-react";

export default function PageLoader (){
    return (
        <div className="min-h-screen flex items-center justify-center" data-theme="light">
            <LoaderIcon className="animate-spin size-10 text-primary"/>
        </div>
    )
}