import { Eye } from "lucide-react";
import { Themes } from "../constants.ts"
import { useThemeStore } from "../store/useThemeStore.ts"

export default function ThemeSelector(){
    const { theme, setTheme } = useThemeStore();

    // the "/" symbol in daisyui utility classes is the opacity or transparency of the color/background

    return (
        <div className="dropdown dropdown-end">
            <button tabIndex={0} className="btn btn-ghost btn-circle">
                <Eye className="size-5"/>
            </button>

            <div tabIndex={0} className="dropdown-content mt-2 p-1 shadow-2xl bg-base-200 backdrop-blur-lg rounded-2xl w-56 border border-base-content/10 max-h-80 overflow-y-auto">
                <div className="space-y-1">
                    {Themes.map((themeVal) => (
                        <button onClick={() => setTheme(themeVal.name)} key={themeVal.name} className={`w-full px-4 py-3 rounded-xl flex items-center gap-3 transition-colors ${theme === themeVal.name ? "bg-primary/10 text-primary" : "hover:bg-base-content/5"}`}>{themeVal.label}</button>
                    ))}
                </div>
            </div>
        </div>
    )
}